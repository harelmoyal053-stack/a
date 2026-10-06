// Preview chat backend used until Firebase is configured. Everything lives in
// this browser's localStorage, so other people can't see these messages.
const KEY = 'festichat:local-chat'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

export function createLocalService() {
  let state = { user: null, myGroups: {}, groups: {}, ...load() }
  const listeners = new Set()

  const emit = () => listeners.forEach((fn) => fn())
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // Storage unavailable – keep working in memory.
    }
    emit()
  }
  const subscribe = (fn) => {
    listeners.add(fn)
    fn()
    return () => listeners.delete(fn)
  }
  const group = (id) => (state.groups[id] ??= { memberCount: 0, lastMessage: null, messages: [] })

  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = { user: null, myGroups: {}, groups: {}, ...load() }
      emit()
    }
  })

  return {
    mode: 'local',
    onUser: (cb) => subscribe(() => cb(state.user)),
    async signIn(name) {
      state.user = { uid: `local-${crypto.randomUUID()}`, name }
      save()
    },
    onMyGroups: (cb) => subscribe(() => cb({ ...state.myGroups })),
    onGroup: (id, cb) => subscribe(() => {
      const g = state.groups[id]
      cb({ memberCount: g?.memberCount ?? 0, lastMessage: g?.lastMessage ?? null })
    }),
    onMessages: (id, cb) => subscribe(() => cb([...(state.groups[id]?.messages ?? [])])),
    async join(id) {
      if (state.myGroups[id]) return
      state.myGroups[id] = Date.now()
      group(id).memberCount += 1
      save()
    },
    async leave(id) {
      if (!state.myGroups[id]) return
      delete state.myGroups[id]
      group(id).memberCount = Math.max(0, group(id).memberCount - 1)
      save()
    },
    async send(id, text) {
      const message = { id: crypto.randomUUID(), uid: state.user.uid, name: state.user.name, text, createdAt: Date.now() }
      group(id).messages.push(message)
      group(id).lastMessage = { text, name: message.name, createdAt: message.createdAt }
      save()
    },
  }
}
