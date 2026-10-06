import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FIREBASE_CONFIG } from './firebaseConfig'
import { createLocalService } from './localService'
import NameModal from './NameModal'

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
  const [askingName, setAskingName] = useState(false)
  const pending = useRef(null)

  useEffect(() => {
    let unsub = () => {}
    createService().then((s) => {
      setService(s)
      unsub = s.onUser(setUser)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!service || !user) return undefined
    return service.onMyGroups(setMyGroups)
  }, [service, user])

  // Runs `action` once the visitor has a chat name, asking for one first if needed.
  const withUser = useCallback((action) => {
    if (user) return action()
    pending.current = action
    setAskingName(true)
  }, [user])

  const submitName = async (name) => {
    await service.signIn(name)
    setAskingName(false)
    const action = pending.current
    pending.current = null
    action?.()
  }

  const value = {
    service,
    user,
    myGroups: user ? myGroups : {},
    withUser,
    join: (id) => service.join(id),
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
      {askingName && <NameModal onSubmit={submitName} onClose={() => setAskingName(false)} />}
    </ChatContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  return useContext(ChatContext)
}

// Live { memberCount, lastMessage, pinned } for a group.
// eslint-disable-next-line react-refresh/only-export-components
export function useGroupMeta(id) {
  const { service } = useChat()
  const [meta, setMeta] = useState({ memberCount: 0, lastMessage: null, pinned: null })
  useEffect(() => (service && id ? service.onGroup(id, setMeta) : undefined), [service, id])
  return meta
}
