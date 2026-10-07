import { useEffect, useState } from 'react'
import { useChat } from './ChatContext'

// SHA-256 of the admin's Google account email, so the address itself isn't
// published in this public repo. Add another hash to give someone access.
const ADMIN_EMAIL_SHA256 = ['d2a29bd3c9611fbe9dafa5dc41e575c0edc5bba3a6881305bb12ae90ade6fef5']

async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text.trim().toLowerCase()))
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Whether the signed-in user may open the admin page. This only decides what
// the UI shows; everything the page reads is public under firestore.rules.
// In preview mode the only account is the device owner's, so it counts.
export function useIsAdmin() {
  const { service, user } = useChat()
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    let cancelled = false
    if (!user) return undefined
    if (service?.mode === 'local') {
      Promise.resolve().then(() => !cancelled && setIsAdmin(true))
    } else if (user.email) {
      sha256(user.email).then((hash) => !cancelled && setIsAdmin(ADMIN_EMAIL_SHA256.includes(hash)))
    }
    return () => {
      cancelled = true
    }
  }, [service, user])
  return Boolean(user) && isAdmin
}
