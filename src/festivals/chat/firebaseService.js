import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import {
  collection, deleteField, doc, getDoc, getFirestore, increment, limitToLast, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore'
import { buildMessage, preview, replyRef } from './messages'

const MESSAGE_LIMIT = 150

const millis = (ts) => ts?.toMillis?.() ?? Date.now()

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
    onUser(cb) {
      notifyUser = cb
      return onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
          current = null
          return cb(null)
        }
        if (current?.uid === fbUser.uid) return cb(current)
        const snap = await getDoc(doc(db, 'users', fbUser.uid))
        // signIn() may have finished while we were reading; it already reported the user.
        if (current?.uid === fbUser.uid) return undefined
        current = snap.exists() ? { uid: fbUser.uid, name: snap.data().name } : null
        cb(current)
      })
    },
    async signIn(name) {
      const { user } = await signInAnonymously(auth)
      await setDoc(doc(db, 'users', user.uid), { name })
      current = { uid: user.uid, name }
      notifyUser(current)
    },
    onMyGroups(cb) {
      if (!current) return () => {}
      return onSnapshot(collection(db, 'users', current.uid, 'groups'), (snap) =>
        cb(Object.fromEntries(snap.docs.map((d) => [d.id, millis(d.data().joinedAt)]))),
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
    async join(id) {
      const batch = writeBatch(db)
      batch.set(memberRef(id, current.uid), { name: current.name, joinedAt: serverTimestamp() })
      batch.set(myGroupRef(current.uid, id), { joinedAt: serverTimestamp() })
      batch.set(groupRef(id), { memberCount: increment(1) }, { merge: true })
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
