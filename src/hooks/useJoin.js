import { useState, useCallback } from 'react'
import { ensureUser } from '../utils/user'
import { getPendingRef, clearPendingRef } from '../utils/invite'

/**
 * useJoin({ onSuccess, onPriceDrop })
 * ────────────────────────────────────
 * Manages the full join flow:
 *   1. Ensure the guest user exists in the backend.
 *   2. POST /api/join with optimistic UI update.
 *   3. On success: call onSuccess(deal, result).
 *   4. On price drop: call onPriceDrop(payload).
 *   5. On error: surface a Hebrew error message.
 */
export function useJoin({ onSuccess, onPriceDrop } = {}) {
  const [joining,  setJoining]  = useState(null)  // productId currently being joined
  const [error,    setError]    = useState(null)

  const join = useCallback(async (deal) => {
    setError(null)
    setJoining(deal.id)

    try {
      // 1. Get or create guest user
      const user = await ensureUser()

      // 2. Include referral if arriving via invite link
      const referredBy = getPendingRef()

      // 3. Call the API
      const res = await fetch('/api/join', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: user.id, productId: deal.id, referredBy }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'שגיאה בהצטרפות לקבוצה')
        return { ok: false, error: data.error }
      }

      // Clear referral after successful join (one-time use)
      clearPendingRef()

      // 4. Notify parent with updated deal
      onSuccess?.(data.deal, data)

      // 4. Notify if price dropped
      if (data.priceDropped) {
        onPriceDrop?.({
          productId:    data.deal.id,
          productTitle: data.deal.title,
          oldPrice:     data.oldPrice,
          newPrice:     data.newPrice,
          newCount:     data.newCount,
          message:      data.message,
        })
      }

      return { ok: true, ...data }
    } catch (e) {
      const msg = 'בעיית רשת — בדוק את החיבור שלך'
      setError(msg)
      return { ok: false, error: msg }
    } finally {
      setJoining(null)
    }
  }, [onSuccess, onPriceDrop])

  return { join, joining, error, clearError: () => setError(null) }
}
