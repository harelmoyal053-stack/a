import { useState, useEffect, useRef, useCallback } from 'react'
import { STATIC_DEALS } from '../data/staticDeals'
import { isFirebaseReady } from '../firebase'
import { subscribeToDeals } from '../services/dealsService'

// ── localStorage helpers (fallback when Firebase not configured) ───────────────
function loadCustomDeals() {
  try { return JSON.parse(localStorage.getItem('customProducts') || '[]') } catch { return [] }
}

function applyPersistedCounts(dealList) {
  try {
    const counts = JSON.parse(localStorage.getItem('dropprice_deal_counts') || '{}')
    if (!Object.keys(counts).length) return dealList
    return dealList.map(d => {
      const saved = counts[d.id]
      return (saved !== undefined && saved > d.currentBuyers) ? { ...d, currentBuyers: saved } : d
    })
  } catch { return dealList }
}

// ── Countdown helpers ──────────────────────────────────────────────────────────
function secondsUntil(isoString) {
  return Math.max(0, Math.floor((new Date(isoString) - Date.now()) / 1000))
}
function formatSeconds(total) {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

/**
 * useDeals()
 * ──────────
 * • When Firebase is configured → real-time Firestore listener + STATIC_DEALS
 * • Otherwise → localStorage customProducts + STATIC_DEALS (+ optional API)
 */
export function useDeals({ onPriceDrop } = {}) {
  const [deals,    setDeals]    = useState([])
  const [timers,   setTimers]   = useState({})
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [isStatic, setIsStatic] = useState(false)

  const onPriceDropRef = useRef(onPriceDrop)
  useEffect(() => { onPriceDropRef.current = onPriceDrop }, [onPriceDrop])

  const initTimers = useCallback((dealList) => {
    setTimers(prev => {
      const next = { ...prev }
      dealList.forEach(d => { if (!next[d.id]) next[d.id] = formatSeconds(secondsUntil(d.endTime)) })
      return next
    })
  }, [])

  // ── Merge fresh localStorage custom deals into state (fallback mode) ────────
  const refreshCustomDeals = useCallback(() => {
    if (isFirebaseReady) return          // no-op when Firestore is handling this
    setDeals(prev => {
      const custom   = loadCustomDeals()
      const nonCustom = prev.filter(d => !String(d.id).startsWith('custom-'))
      const merged   = [...custom, ...nonCustom]
      initTimers(custom)
      return merged
    })
  }, [initTimers])

  // ── Listen for localStorage changes from other tabs (fallback mode) ─────────
  useEffect(() => {
    if (isFirebaseReady) return
    const handler = (e) => { if (e.key === 'customProducts') refreshCustomDeals() }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [isFirebaseReady, refreshCustomDeals])

  // ── Main data source ────────────────────────────────────────────────────────
  useEffect(() => {
    let unsub = null

    // ── PATH A: Firebase configured — real-time Firestore ────────────────────
    if (isFirebaseReady) {
      setIsStatic(false)
      unsub = subscribeToDeals((firestoreDeals) => {
        const all = [...firestoreDeals, ...STATIC_DEALS]
        setDeals(all)
        initTimers(all)
        setLoading(false)
      })
      return () => unsub?.()
    }

    // ── PATH B: No Firebase — localStorage + optional API ────────────────────
    setIsStatic(true)

    const isGhPages = typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') ||
       window.location.hostname.includes('github.com'))

    if (isGhPages) {
      const all = applyPersistedCounts([...loadCustomDeals(), ...STATIC_DEALS])
      setDeals(all)
      initTimers(all)
      setLoading(false)
      return
    }

    let mounted = true
    fetch('/api/deals')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(({ deals: apiDeals }) => {
        if (!mounted) return
        const all = applyPersistedCounts([...loadCustomDeals(), ...apiDeals])
        setDeals(all); initTimers(all); setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        const all = applyPersistedCounts([...loadCustomDeals(), ...STATIC_DEALS])
        setDeals(all); initTimers(all); setLoading(false)
      })
    return () => { mounted = false }
  }, [initTimers])

  // ── SSE stream (only in non-Firebase, non-static mode) ─────────────────────
  useEffect(() => {
    if (isStatic || isFirebaseReady) return
    let es
    try {
      es = new EventSource('/api/deals/events/stream')
      es.addEventListener('deal:updated', (e) => {
        const updated = JSON.parse(e.data)
        setDeals(prev => prev.map(d => d.id === updated.id ? updated : d))
        setTimers(prev => ({ ...prev, [updated.id]: formatSeconds(secondsUntil(updated.endTime)) }))
      })
      es.addEventListener('price:dropped', (e) => { onPriceDropRef.current?.(JSON.parse(e.data)) })
      es.addEventListener('group:joined',  (e) => {
        const { productId, newCount } = JSON.parse(e.data)
        setDeals(prev => prev.map(d => d.id === productId ? { ...d, currentBuyers: newCount } : d))
      })
      es.onerror = () => {}
    } catch (_) {}
    return () => es?.close()
  }, [isStatic])

  // ── Countdown tick ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!deals.length) return
    const iv = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev }
        deals.forEach(d => {
          if (next[d.id]) {
            const [h, m, s] = next[d.id].split(':').map(Number)
            next[d.id] = formatSeconds(Math.max(0, h * 3600 + m * 60 + s - 1))
          }
        })
        return next
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [deals])

  // ── updateDeal — also persists localStorage-backed deals ───────────────────
  const updateDeal = useCallback((updatedDeal) => {
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d))
    // Firestore handles its own persistence via the real-time listener.
    // Only persist locally for localStorage-backed custom deals.
    if (!isFirebaseReady && String(updatedDeal.id).startsWith('custom-')) {
      try {
        const all     = JSON.parse(localStorage.getItem('customProducts') || '[]')
        const updated = all.map(p => p.id === updatedDeal.id ? updatedDeal : p)
        localStorage.setItem('customProducts', JSON.stringify(updated))
      } catch (_) {}
    }
  }, [])

  return { deals, timers, loading, error, isStatic, updateDeal, refreshCustomDeals }
}
