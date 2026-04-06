import { useState, useCallback } from 'react'
import { ensureUser, cacheUser } from '../utils/user'
import { getPendingRef, clearPendingRef } from '../utils/invite'
import { joinFirestoreDeal } from '../services/dealsService'

// ── Helpers for localStorage-backed custom products ───────────────────────────
function loadCustomProducts() {
  try { return JSON.parse(localStorage.getItem('customProducts') || '[]') } catch { return [] }
}

function saveCustomProducts(list) {
  try { localStorage.setItem('customProducts', JSON.stringify(list)) } catch (_) {}
}

function recalculateDeal(deal) {
  const newCount = deal.currentBuyers
  const tiers = [...(deal.priceTiers || [])].sort((a, b) => a.buyers - b.buyers)

  let currentTier = tiers[0]
  for (const t of tiers) {
    if (newCount >= t.buyers) currentTier = t
  }
  const nextTier = tiers.find(t => t.buyers > newCount) || null

  return {
    ...deal,
    currentPrice: currentTier?.price ?? deal.currentPrice,
    nextPrice:    nextTier?.price   ?? currentTier?.price ?? deal.currentPrice,
    savings:      deal.originalPrice - (currentTier?.price ?? deal.currentPrice),
  }
}

function joinCustomProductLocally(deal) {
  const all     = loadCustomProducts()
  const updated = all.map(p => {
    if (p.id !== deal.id) return p
    return recalculateDeal({ ...p, currentBuyers: (p.currentBuyers || 0) + 1 })
  })
  saveCustomProducts(updated)
  return updated.find(p => p.id === deal.id) || recalculateDeal({ ...deal, currentBuyers: deal.currentBuyers + 1 })
}

/**
 * useJoin({ onSuccess, onPriceDrop })
 */
export function useJoin({ onSuccess, onPriceDrop } = {}) {
  const [joining, setJoining] = useState(null)
  const [error,   setError]   = useState(null)

  const join = useCallback(async (deal) => {
    setError(null)
    setJoining(deal.id)

    try {
      // Firestore-backed deals — atomic transaction on the server
      if (deal.source === 'firestore') {
        const updatedDeal = await joinFirestoreDeal(deal.id)
        const dropped = updatedDeal.currentPrice < deal.currentPrice
        onSuccess?.(updatedDeal, { ok: true, deal: updatedDeal })
        if (dropped) {
          onPriceDrop?.({
            productId:    updatedDeal.id,
            productTitle: updatedDeal.title,
            oldPrice:     deal.currentPrice,
            newPrice:     updatedDeal.currentPrice,
            newCount:     updatedDeal.currentBuyers,
            message:      `המחיר ירד ל-₪${updatedDeal.currentPrice}!`,
          })
        }
        return { ok: true, deal: updatedDeal }
      }

      // Custom (localStorage) products — handle entirely locally
      if (String(deal.id).startsWith('custom-')) {
        await new Promise(r => setTimeout(r, 700))
        const updatedDeal = joinCustomProductLocally(deal)
        const prevPrice   = deal.currentPrice
        const dropped     = updatedDeal.currentPrice < prevPrice
        onSuccess?.(updatedDeal, { ok: true, deal: updatedDeal })
        if (dropped) {
          onPriceDrop?.({
            productId:    updatedDeal.id,
            productTitle: updatedDeal.title,
            oldPrice:     prevPrice,
            newPrice:     updatedDeal.currentPrice,
            newCount:     updatedDeal.currentBuyers,
            message:      `המחיר ירד ל-₪${updatedDeal.currentPrice}!`,
          })
        }
        return { ok: true, deal: updatedDeal }
      }

      // Regular API products
      const user       = await ensureUser()
      const referredBy = getPendingRef()

      const res  = await fetch('/api/join', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: user.id, productId: deal.id, referredBy }),
      })
      const data = await res.json()

      if (!res.ok) {
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
      // API unavailable — simulate join and persist count to localStorage
      await new Promise(r => setTimeout(r, 900))

      let user = null
      try { user = await ensureUser() } catch { /* ignored */ }
      if (!user?.id) {
        const adj   = ['מהיר', 'חכם', 'אמיץ', 'שמח', 'נבון']
        const nouns = ['פנדה', 'דרקון', 'ברדלס', 'עיט', 'נמר']
        const name  = `${adj[Math.floor(Math.random() * adj.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
        user = { id: `local_${Date.now()}`, name, email: '' }
        try { cacheUser(user) } catch {}
      }

      // Persist static deal join counts so they survive navigation
      const newCount = deal.currentBuyers + 1
      try {
        const counts = JSON.parse(localStorage.getItem('dropprice_deal_counts') || '{}')
        counts[deal.id] = newCount
        localStorage.setItem('dropprice_deal_counts', JSON.stringify(counts))
      } catch (_) {}

      const mockDeal = { ...deal, currentBuyers: newCount }
      onSuccess?.(mockDeal, { ok: true, deal: mockDeal })
      return { ok: true, deal: mockDeal }
    } finally {
      setJoining(null)
    }
  }, [onSuccess, onPriceDrop])

  return { join, joining, error, clearError: () => setError(null) }
}
