// ── Guest user identity ────────────────────────────────────────────────────────
// Creates a persistent guest account on first visit, stored in localStorage.
// The backend uses this userId for group membership.

const STORAGE_KEY = 'dropprice_user'

/** Returns the cached user or null */
export function getCachedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Persists user to localStorage */
export function cacheUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

/** Creates a guest display name from a random adjective + noun combo */
function randomGuestName() {
  const adj   = ['מהיר', 'חכם', 'אמיץ', 'ירוק', 'כחול', 'שמח', 'נבון', 'זריז']
  const nouns = ['פנדה', 'דרקון', 'ברדלס', 'עיט', 'נמר', 'דולפין', 'קוף', 'זאב']
  const a = adj[Math.floor(Math.random() * adj.length)]
  const n = nouns[Math.floor(Math.random() * nouns.length)]
  return `${a} ${n}`
}

/**
 * Ensures a user exists in both localStorage and the backend.
 * Returns the user object including the server-assigned id.
 */
export async function ensureUser() {
  const cached = getCachedUser()
  if (cached?.id) return cached

  const name  = randomGuestName()
  const email = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}@dropprice.guest`

  const res  = await fetch('/api/users', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name, email }),
  })

  if (!res.ok) throw new Error('לא ניתן ליצור משתמש אורח')
  const data = await res.json()
  cacheUser(data.user)
  return data.user
}
