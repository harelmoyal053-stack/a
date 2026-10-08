import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import {
  GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut,
} from 'firebase/auth'
import {
  addDoc, collection, collectionGroup, deleteDoc, deleteField, doc, getCountFromServer, getDoc, getDocs, getFirestore, increment, limit,
  limitToLast, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where, writeBatch,
} from 'firebase/firestore'
import { t } from '../i18n'
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
  // Visitor stats in Firebase → Analytics. Skipped where the browser can't run it.
  if (config.measurementId) analyticsSupported().then((ok) => ok && getAnalytics(app)).catch(() => {})
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
          // Profiles made before sign-up dates were recorded get one now.
          if (!snap.data().createdAt) setDoc(ref, { createdAt: serverTimestamp() }, { merge: true }).catch(() => {})
        } else {
          // First sign-in: start the profile from the Google account.
          const fresh = { name: (fbUser.displayName || t('user.defaultName')).slice(0, 30), bio: '', instagram: '', photo: fbUser.photoURL ?? null }
          try {
            await setDoc(ref, { ...fresh, createdAt: serverTimestamp() })
          } catch {
            // Rules published before sign-up dates existed reject `createdAt`;
            // sign the user up anyway rather than locking them out.
            await setDoc(ref, fresh)
          }
          current = profileOf(fbUser.uid, fresh)
        }
        // The email stays on this device (it is never written to Firestore).
        current = { ...current, email: fbUser.email ?? null }
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
    // Site-wide numbers for the admin page. A figure that can't be counted is null.
    async getAdminStats() {
      const weekAgo = Timestamp.fromMillis(Date.now() - 7 * 86400000)
      const count = async (q) => {
        try {
          return (await getCountFromServer(q)).data().count
        } catch (err) {
          console.warn('admin count failed', err)
          return null
        }
      }
      const users = collection(db, 'users')
      const groups = collection(db, 'groups')
      const [userCount, newUsers, groupCount, activeGroups, messages] = await Promise.all([
        count(users),
        count(query(users, where('createdAt', '>=', weekAgo))),
        count(query(groups, where('memberCount', '>', 0))),
        count(query(groups, where('lastMessage.createdAt', '>=', weekAgo))),
        count(collectionGroup(db, 'messages')),
      ])
      let recentUsers = []
      try {
        const snap = await getDocs(query(users, orderBy('createdAt', 'desc'), limit(8)))
        recentUsers = snap.docs.map((d) => ({ ...profileOf(d.id, d.data()), createdAt: millis(d.data().createdAt) }))
      } catch (err) {
        console.warn('recent users failed', err)
      }
      return { users: userCount, newUsers, groups: groupCount, activeGroups, messages, recentUsers }
    },
    // Event suggestions and problem reports from the site menu, read on the admin page.
    async submitInbox(entry) {
      await addDoc(collection(db, 'inbox'), {
        ...entry,
        ...(current ? { uid: current.uid, userName: current.name } : {}),
        createdAt: serverTimestamp(),
      })
    },
    onInbox(cb, onError) {
      const q = query(collection(db, 'inbox'), orderBy('createdAt', 'desc'), limit(200))
      return onSnapshot(
        q,
        (snap) => cb(snap.docs.map((d) => ({ ...d.data(), id: d.id, createdAt: millis(d.data().createdAt) }))),
        onError,
      )
    },
    setInboxDone: (id, done) => updateDoc(doc(db, 'inbox', id), { done }),
    deleteInbox: (id) => deleteDoc(doc(db, 'inbox', id)),
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
