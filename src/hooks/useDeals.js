import { useState, useEffect, useRef, useCallback } from 'react'
import { STATIC_DEALS } from '../data/staticDeals'

// ── Load user-published deals from localStorage ───────────────────────────────
function loadCustomDeals() {
  try {
    return JSON.parse(localStorage.getItem('customProducts') || '[]')
  } catch { return [] }
}

// ── Countdown helpers ─────────────────────────────────────────────────────────
function secondsUntil(isoString) {
  return Math.max(0, Math.floor((new Date(isoString) - Date.now()) / 1000))
}

function formatSeconds(total) {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

/**
 * useDeals()
 * ──────────
 * 1. Fetches deals from GET /api/deals. Falls back to STATIC_DEALS when the API
 *    is unavailable (e.g. GitHub Pages deployment).
 * 2. Opens an SSE stream for real-time updates (skipped if API unavailable).
 * 3. Ticks countdown timers every second.
 */
export function useDeals({ onPriceDrop } = {}) {
  const [deals,      setDeals]      = useState([])
  const [timers,     setTimers]     = useState({})
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [isStatic,   setIsStatic]   = useState(false)

  const onPriceDropRef = useRef(onPriceDrop)
  useEffect(() => { onPriceDropRef.current = onPriceDrop }, [onPriceDrop])

  // ── Initialise timers from deals ─────────────────────────────────────────
  const initTimers = useCallback((dealList) => {
    const t = {}
    dealList.forEach((d) => { t[d.id] = formatSeconds(secondsUntil(d.endTime)) })
    setTimers(t)
  }, [])

  // ── Fetch deals (fall back to static on error) ────────────────────────────
  useEffect(() => {
    let mounted = true

    // Abort early if clearly on GitHub Pages with no backend
    const isGhPages = typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') ||
       window.location.hostname.includes('github.com'))

    if (isGhPages) {
      const all = [...loadCustomDeals(), ...STATIC_DEALS]
      setDeals(all)
      initTimers(all)
      setIsStatic(true)
      setLoading(false)
      return
    }

    fetch('/api/deals')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(({ deals }) => {
        if (!mounted) return
        const all = [...loadCustomDeals(), ...deals]
        setDeals(all)
        initTimers(all)
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        const all = [...loadCustomDeals(), ...STATIC_DEALS]
        setDeals(all)
        initTimers(all)
        setIsStatic(true)
        setLoading(false)
      })

    return () => { mounted = false }
  }, [initTimers])

  // ── Countdown tick ────────────────────────────────────────────────────────
  useEffect(() => {
    if (deals.length === 0) return
    const iv = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev }
        deals.forEach((d) => {
          if (next[d.id]) {
            const [h, m, s] = next[d.id].split(':').map(Number)
            const total = Math.max(0, h * 3600 + m * 60 + s - 1)
            next[d.id] = formatSeconds(total)
          }
        })
        return next
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [deals])

  // ── SSE subscription (skip in static/demo mode) ───────────────────────────
  useEffect(() => {
    if (isStatic) return

    let es
    try {
      es = new EventSource('/api/deals/events/stream')

      es.addEventListener('deal:updated', (e) => {
        const updated = JSON.parse(e.data)
        setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
        setTimers((prev) => ({
          ...prev,
          [updated.id]: formatSeconds(secondsUntil(updated.endTime)),
        }))
      })

      es.addEventListener('price:dropped', (e) => {
        onPriceDropRef.current?.(JSON.parse(e.data))
      })

      es.addEventListener('group:joined', (e) => {
        const { productId, newCount } = JSON.parse(e.data)
        setDeals((prev) =>
          prev.map((d) => d.id === productId ? { ...d, currentBuyers: newCount } : d)
        )
      })

      es.onerror = () => { /* SSE auto-reconnects */ }
    } catch (_) {}

    return () => es?.close()
  }, [isStatic])

  const updateDeal = useCallback((updatedDeal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)))
    // Persist custom product changes to localStorage so business dashboard stays in sync
    if (String(updatedDeal.id).startsWith('custom-')) {
      try {
        const all = JSON.parse(localStorage.getItem('customProducts') || '[]')
        const updated = all.map(p => p.id === updatedDeal.id ? updatedDeal : p)
        localStorage.setItem('customProducts', JSON.stringify(updated))
      } catch (_) {}
    }
  }, [])

  return { deals, timers, loading, error, isStatic, updateDeal }
}
