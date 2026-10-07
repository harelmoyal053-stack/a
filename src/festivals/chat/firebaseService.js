import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut,
} from 'firebase/auth'
import {
  collection, deleteField, doc, getDoc, getFirestore, increment, limit, limitToLast, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, Timestamp, updateDoc, writeBatch,
} from 'firebase/firestore'
import { buildMessage, preview, replyRef } from './messages'

const MESSAGE_LIMIT = 150

const millis = (ts) => ts?.toMillis?.() ?? Date.now()

export const profileOf = (uid, data) => ({
  uid,
  name: data.name,
  bio: data.bio ?? '',
  instagram: data.instagram ?? '',
  photo: data.photo ?? null,
})

export function createFirebaseService(config) {
  const app = initializeApp(config)
  const auth = getAuth(app)
  const db = getFirestore(app)
  let current = null
  let notifyUser = () => {}

  const groupRef = (id) => doc(db, 'groups', id)
  const memberRef = (id, uid) => doc(db, 'groups', id, 'members', uid)
  const myGroupRef = (uid, id) => doc(db, 'users', uid, 'groups', id)
  const messageRef = (id, messageId) => doc(db, 'groups', id, 'messages', messageId)

  return {
    mode: 'live',
    canUseGoogle: true,
    onUser(cb) {
      notifyUser = cb
      return onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
          current = null
          return cb(null)
        }
        if (current?.uid === fbUser.uid) return cb(current)
        const ref = doc(db, 'users', fbUser.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          current = profileOf(fbUser.uid, snap.data())
        } else {
          // First sign-in: start the profile from the Google account.
          const fresh = { name: (fbUser.displayName || 'משתמש').slice(0, 30), bio: '', instagram: '', photo: fbUser.photoURL ?? null }
          await setDoc(ref, fresh)
          current = profileOf(fbUser.uid, fresh)
        }
        cb(current)
      })
    },
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      try {
        await signInWithPopup(auth, provider)
      } catch (err) {
        // Some in-app browsers block popups; a full-page redirect still works.
        if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment') {
          await signInWithRedirect(auth, provider)
          return
        }
        throw err
      }
    },
    signOut: () => signOut(auth),
    async updateProfile(fields) {
      await setDoc(doc(db, 'users', current.uid), fields, { merge: true })
      current = { ...current, ...fields }
      notifyUser(current)
    },
    onProfile(uid, cb) {
      return onSnapshot(doc(db, 'users', uid), (snap) => cb(snap.exists() ? profileOf(uid, snap.data()) : null))
    },
    onMyGroups(cb) {
      if (!current) return () => {}
      return onSnapshot(collection(db, 'users', current.uid, 'groups'), (snap) =>
        cb(Object.fromEntries(snap.docs.map((d) => [d.id, { joinedAt: millis(d.data().joinedAt), event: d.data().event ?? null }]))),
      )
    },
    onGroup(id, cb) {
      return onSnapshot(groupRef(id), (snap) => {
        const data = snap.data() ?? {}
        cb({
          memberCount: data.memberCount ?? 0,
          lastMessage: data.lastMessage ? { ...data.lastMessage, createdAt: millis(data.lastMessage.createdAt) } : null,
          pinned: data.pinned ?? null,
        })
      })
    },
    // The groups with the most members, for the home screen.
    onTopGroups(count, cb) {
      const q = query(collection(db, 'groups'), orderBy('memberCount', 'desc'), limit(count))
      return onSnapshot(q, (snap) =>
        cb(snap.docs.map((d) => ({ id: d.id, memberCount: d.data().memberCount ?? 0 })).filter((g) => g.memberCount > 0)),
      )
    },
    onMembers(id, cb) {
      return onSnapshot(collection(db, 'groups', id, 'members'), (snap) =>
        cb(snap.docs.map((d) => ({ uid: d.id, name: d.data().name, joinedAt: millis(d.data().joinedAt) }))),
      )
    },
    onMessages(id, cb) {
      const q = query(collection(db, 'groups', id, 'messages'), orderBy('createdAt'), limitToLast(MESSAGE_LIMIT))
      return onSnapshot(q, (snap) =>
        cb(snap.docs.map((d) => ({ ...d.data(), id: d.id, createdAt: millis(d.data().createdAt) }))),
      )
    },
    async join(id, event) {
      const batch = writeBatch(db)
      batch.set(memberRef(id, current.uid), { name: current.name, joinedAt: serverTimestamp() })
      batch.set(myGroupRef(current.uid, id), { joinedAt: serverTimestamp(), event })
      // The rules refuse new members after `endsAt` (a day of slack for time zones).
      const endsAt = new Date(`${event.endDate ?? event.startDate}T23:59:59Z`)
      endsAt.setUTCDate(endsAt.getUTCDate() + 1)
      batch.set(groupRef(id), { memberCount: increment(1), endsAt: Timestamp.fromDate(endsAt) }, { merge: true })
      await batch.commit()
    },
    async leave(id) {
      const batch = writeBatch(db)
      batch.delete(memberRef(id, current.uid))
      batch.delete(myGroupRef(current.uid, id))
      batch.set(groupRef(id), { memberCount: increment(-1) }, { merge: true })
      await batch.commit()
    },
    async send(id, payload) {
      const batch = writeBatch(db)
      const createdAt = serverTimestamp()
      const message = buildMessage(current, payload)
      batch.set(doc(collection(db, 'groups', id, 'messages')), { ...message, createdAt })
      batch.set(groupRef(id), { lastMessage: { text: preview(message), name: current.name, createdAt } }, { merge: true })
      await batch.commit()
    },
    react(id, messageId, emoji) {
      return updateDoc(messageRef(id, messageId), { [`reactions.${current.uid}`]: emoji ?? deleteField() })
    },
    vote(id, messageId, optionIds) {
      return updateDoc(messageRef(id, messageId), { [`votes.${current.uid}`]: optionIds.length ? optionIds : deleteField() })
    },
    edit(id, messageId, text) {
      return updateDoc(messageRef(id, messageId), { text, edited: true })
    },
    remove(id, messageId) {
      return updateDoc(messageRef(id, messageId), {
        deleted: true, text: deleteField(), image: deleteField(), caption: deleteField(), poll: deleteField(), location: deleteField(),
      })
    },
    pin(id, message) {
      return setDoc(groupRef(id), { pinned: message ? replyRef(message) : null }, { merge: true })
    },
  }
}
