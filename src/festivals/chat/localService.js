import { buildMessage, preview, replyRef } from './messages'

// Preview chat backend used until Firebase is configured. Everything lives in
// this browser's localStorage, so other people can't see these messages.
const KEY = 'festichat:local-chat'
const EMPTY = { user: null, myGroups: {}, groups: {} }

function load() {
  try {
    const state = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY)) }
    // Older saves stored only the join time.
    for (const [id, value] of Object.entries(state.myGroups)) {
      if (typeof value === 'number') state.myGroups[id] = { joinedAt: value, event: null }
    }
    return state
  } catch {
    return { ...EMPTY }
  }
}

export function createLocalService() {
  let state = load()
  const listeners = new Set()

  const emit = () => listeners.forEach((fn) => fn())
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      throw new Error('storage-full')
    } finally {
      emit()
    }
  }
  const subscribe = (fn) => {
    listeners.add(fn)
    fn()
    return () => listeners.delete(fn)
  }
  const group = (id) => (state.groups[id] ??= { memberCount: 0, lastMessage: null, pinned: null, members: {}, messages: [] })
  const findMessage = (id, messageId) => group(id).messages.find((m) => m.id === messageId)

  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load()
      emit()
    }
  })

  return {
    mode: 'local',
    canUseGoogle: false,
    onUser: (cb) => subscribe(() => cb(state.user)),
    // Preview sign-in: a name only, kept on this device.
    async signIn(name) {
      state.user = { uid: `local-${crypto.randomUUID()}`, name, bio: '', instagram: '', photo: null }
      save()
    },
    async signOut() {
      state.user = null
      save()
    },
    async updateProfile(fields) {
      state.user = { ...state.user, ...fields }
      save()
    },
    // Only the visitor's own profile exists in preview mode.
    onProfile: (uid, cb) => subscribe(() => cb(state.user?.uid === uid ? state.user : null)),
    onMyGroups: (cb) => subscribe(() => cb({ ...state.myGroups })),
    onGroup: (id, cb) => subscribe(() => {
      const g = state.groups[id]
      cb({ memberCount: g?.memberCount ?? 0, lastMessage: g?.lastMessage ?? null, pinned: g?.pinned ?? null })
    }),
    onTopGroups: (count, cb) => subscribe(() =>
      cb(Object.entries(state.groups)
        .map(([id, g]) => ({ id, memberCount: g.memberCount }))
        .filter((g) => g.memberCount > 0)
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, count)),
    ),
    onMembers: (id, cb) => subscribe(() =>
      cb(Object.entries(state.groups[id]?.members ?? {}).map(([uid, m]) => ({ uid, ...m }))),
    ),
    onMessages: (id, cb) => subscribe(() => cb(structuredClone(state.groups[id]?.messages ?? []))),
    async join(id, event) {
      if (state.myGroups[id]) return
      state.myGroups[id] = { joinedAt: Date.now(), event }
      group(id).memberCount += 1
      group(id).members[state.user.uid] = { name: state.user.name, joinedAt: Date.now() }
      save()
    },
    async leave(id) {
      if (!state.myGroups[id]) return
      delete state.myGroups[id]
      delete group(id).members[state.user.uid]
      group(id).memberCount = Math.max(0, group(id).memberCount - 1)
      save()
    },
    async send(id, payload) {
      const message = { ...buildMessage(state.user, payload), id: crypto.randomUUID(), createdAt: Date.now() }
      group(id).messages.push(message)
      group(id).lastMessage = { text: preview(message), name: message.name, createdAt: message.createdAt }
      save()
    },
    async react(id, messageId, emoji) {
      const m = findMessage(id, messageId)
      if (emoji) m.reactions[state.user.uid] = emoji
      else delete m.reactions[state.user.uid]
      save()
    },
    async vote(id, messageId, optionIds) {
      const m = findMessage(id, messageId)
      if (optionIds.length) m.votes[state.user.uid] = optionIds
      else delete m.votes[state.user.uid]
      save()
    },
    async edit(id, messageId, text) {
      const m = findMessage(id, messageId)
      m.text = text
      m.edited = true
      save()
    },
    async remove(id, messageId) {
      const m = findMessage(id, messageId)
      Object.assign(m, { deleted: true, text: '', image: null, caption: '', poll: null, location: null })
      if (group(id).pinned?.id === messageId) group(id).pinned = null
      save()
    },
    async pin(id, message) {
      group(id).pinned = message ? replyRef(message) : null
      save()
    },
  }
}
