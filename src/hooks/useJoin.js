import { useState, useCallback } from 'react'
import { ensureUser, cacheUser } from '../utils/user'
import { getPendingRef, clearPendingRef } from '../utils/invite'

/**
 * useJoin({ onSuccess, onPriceDrop })
 * ────────────────────────────────────
 * Manages the full join flow. Falls back to a mock join in demo/static mode
 * (when the backend API is unavailable — e.g. GitHub Pages).
 */
export function useJoin({ onSuccess, onPriceDrop } = {}) {
  const [joining, setJoining] = useState(null)
  const [error,   setError]   = useState(null)

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
        // Real API error (e.g. already joined) — surface it
        setError(data.error ?? 'שגיאה בהצטרפות לקבוצה')
        return { ok: false, error: data.error }
      }

      clearPendingRef()
      onSuccess?.(data.deal, data)
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

    } catch {
      // API is unavailable (GitHub Pages / no backend) — simulate a successful join
      await new Promise(r => setTimeout(r, 900)) // realistic loading feel

      // Try to ensure a local user (will use localStorage if /api/users also fails)
      let user = null
      try { user = await ensureUser() } catch { /* ignored */ }

      // If ensureUser failed (no backend), create a local guest identity
      if (!user?.id) {
        const adj   = ['מהיר', 'חכם', 'אמיץ', 'שמח', 'נבון']
        const nouns = ['פנדה', 'דרקון', 'ברדלס', 'עיט', 'נמר']
        const name  = `${adj[Math.floor(Math.random() * adj.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
        user = { id: `local_${Date.now()}`, name, email: '' }
        try { cacheUser(user) } catch {}
      }

      const mockDeal = {
        ...deal,
        currentBuyers: deal.currentBuyers + 1,
      }
      onSuccess?.(mockDeal, { ok: true, deal: mockDeal })
      return { ok: true, deal: mockDeal }
    } finally {
      setJoining(null)
    }
  }, [onSuccess, onPriceDrop])

  return { join, joining, error, clearError: () => setError(null) }
}
