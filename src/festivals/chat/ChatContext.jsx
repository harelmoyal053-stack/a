import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FIREBASE_CONFIG } from './firebaseConfig'
import { createLocalService } from './localService'
import SignInSheet from './SignInSheet'
import { eventSnapshot } from '../data/groups'

const ChatContext = createContext(null)

async function createService() {
  if (!FIREBASE_CONFIG) return createLocalService()
  const { createFirebaseService } = await import('./firebaseService')
  return createFirebaseService(FIREBASE_CONFIG)
}

export function ChatProvider({ children }) {
  const [service, setService] = useState(null)
  const [user, setUser] = useState(null)
  const [myGroups, setMyGroups] = useState({})
  const [userKnown, setUserKnown] = useState(false)
  const [groupsLoaded, setGroupsLoaded] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const pending = useRef(null)
  const waitingForUser = useRef(false)

  useEffect(() => {
    let unsub = () => {}
    createService().then((s) => {
      setService(s)
      unsub = s.onUser((u) => {
        setUser(u)
        setUserKnown(true)
        // Resume the action that asked for sign-in once the account arrives.
        if (u && waitingForUser.current) {
          waitingForUser.current = false
          setSigningIn(false)
          const action = pending.current
          pending.current = null
          setTimeout(() => action?.(), 0)
        }
      })
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!service || !user) return undefined
    return service.onMyGroups((groups) => {
      setMyGroups(groups)
      setGroupsLoaded(true)
    })
  }, [service, user])

  // Runs `action` once the visitor is signed in, asking them to sign in first if needed.
  const withUser = useCallback((action) => {
    if (user) return action?.()
    pending.current = action
    waitingForUser.current = true
    setSigningIn(true)
  }, [user])

  const value = {
    service,
    user,
    myGroups: user ? myGroups : {},
    // True once we know which groups the visitor is in (or that they have none).
    groupsReady: userKnown && (!user || groupsLoaded),
    withUser,
    signOut: () => service.signOut(),
    updateProfile: (fields) => service.updateProfile(fields),
    join: (group, festival) => service.join(group.id, eventSnapshot(festival)),
    leave: (id) => service.leave(id),
    send: (id, payload) => service.send(id, payload),
    react: (id, messageId, emoji) => service.react(id, messageId, emoji),
    vote: (id, messageId, optionIds) => service.vote(id, messageId, optionIds),
    edit: (id, messageId, text) => service.edit(id, messageId, text),
    remove: (id, messageId) => service.remove(id, messageId),
    pin: (id, message) => service.pin(id, message),
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
      {signingIn && service && (
        <SignInSheet
          canUseGoogle={service.canUseGoogle}
          onGoogle={() => service.signInWithGoogle()}
          onPreviewName={(name) => service.signIn(name)}
          onClose={() => {
            pending.current = null
            waitingForUser.current = false
            setSigningIn(false)
          }}
        />
      )}
    </ChatContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  return useContext(ChatContext)
}

// A user's public profile, or null while loading or if unknown.
// eslint-disable-next-line react-refresh/only-export-components
export function useProfile(uid) {
  const { service } = useChat()
  const [profile, setProfile] = useState(null)
  useEffect(() => (service && uid ? service.onProfile(uid, setProfile) : undefined), [service, uid])
  return profile
}

// Live { memberCount, lastMessage, pinned } for a group.
// eslint-disable-next-line react-refresh/only-export-components
export function useGroupMeta(id) {
  const { service } = useChat()
  const [meta, setMeta] = useState({ memberCount: 0, lastMessage: null, pinned: null })
  useEffect(() => (service && id ? service.onGroup(id, setMeta) : undefined), [service, id])
  return meta
}
