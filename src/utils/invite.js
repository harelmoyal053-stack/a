import { getCachedUser, ensureUser } from './user'

// ── Build a unique invite URL for a deal ─────────────────────────────────────
// Format: <origin>/a/?deal=<dealId>&ref=<userId>
export function buildInviteUrl(dealId, userId) {
  const base = `${window.location.origin}/a/`
  return `${base}?deal=${dealId}&ref=${userId}`
}

// ── Get or create a userId suitable for building an invite link ───────────────
export async function getInviteUrl(dealId) {
  const user = await ensureUser()
  return buildInviteUrl(dealId, user.id)
}

// ── Read the pending referral from localStorage ───────────────────────────────
export function getPendingRef() {
  try { return localStorage.getItem('dropprice_ref') || null } catch { return null }
}

// ── Store ref= param when arriving via an invite link ─────────────────────────
export function capturePendingRef() {
  try {
    const params = new URLSearchParams(window.location.search)
    const ref    = params.get('ref')
    if (ref) localStorage.setItem('dropprice_ref', ref)
    return {
      ref:    params.get('ref')    || null,
      dealId: params.get('deal')   || null,
    }
  } catch { return { ref: null, dealId: null } }
}

// ── Clear after a successful join ─────────────────────────────────────────────
export function clearPendingRef() {
  try { localStorage.removeItem('dropprice_ref') } catch {}
}

// ── Build the pre-written Hebrew share text ───────────────────────────────────
export function buildShareText(deal, inviteUrl) {
  const toNextTier = Math.max(0, deal.targetBuyers - deal.currentBuyers)
  return (
    `חברים, מצאתי דיל מטורף על ${deal.title}! ` +
    `אם עוד ${toNextTier} אנשים מצטרפים, המחיר יורד ל-₪${deal.nextPrice}. ` +
    `בואו נעזור אחד לשני לחסוך! 💰\n\n` +
    `👉 ${inviteUrl}`
  )
}
