import { useState, useEffect, useRef, useCallback } from 'react'

// ── Countdown helper ──────────────────────────────────────────────────────────
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
 * 1. Fetches all active deals from GET /api/deals on mount.
 * 2. Opens an SSE stream at GET /api/deals/events/stream to receive:
 *    - 'deal:updated'  → replace the updated deal in state
 *    - 'price:dropped' → trigger a toast + confetti (via onPriceDrop callback)
 *    - 'group:joined'  → lightweight participant count update
 * 3. Runs a 1-second interval to tick down countdown timers.
 */
export function useDeals({ onPriceDrop } = {}) {
  const [deals,   setDeals]   = useState([])
  const [timers,  setTimers]  = useState({})  // { dealId: "HH:MM:SS" }
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const onPriceDropRef = useRef(onPriceDrop)
  useEffect(() => { onPriceDropRef.current = onPriceDrop }, [onPriceDrop])

  // ── Initialise timers from deals ─────────────────────────────────────────
  const initTimers = useCallback((dealList) => {
    const t = {}
    dealList.forEach((d) => {
      t[d.id] = formatSeconds(secondsUntil(d.endTime))
    })
    setTimers(t)
  }, [])

  // ── Fetch deals ───────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    fetch('/api/deals')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(({ deals }) => {
        if (!mounted) return
        setDeals(deals)
        initTimers(deals)
        setLoading(false)
      })
      .catch((e) => {
        if (!mounted) return
        console.error('[useDeals] שגיאה בטעינת עסקאות:', e)
        setError('לא ניתן לטעון עסקאות — בדוק שהשרת פועל')
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

  // ── SSE subscription ──────────────────────────────────────────────────────
  useEffect(() => {
    const es = new EventSource('/api/deals/events/stream')

    es.addEventListener('deal:updated', (e) => {
      const updated = JSON.parse(e.data)
      setDeals((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
      // Re-sync timer for this deal
      setTimers((prev) => ({
        ...prev,
        [updated.id]: formatSeconds(secondsUntil(updated.endTime)),
      }))
    })

    es.addEventListener('price:dropped', (e) => {
      const payload = JSON.parse(e.data)
      onPriceDropRef.current?.(payload)
    })

    es.addEventListener('group:joined', (e) => {
      const { productId, newCount } = JSON.parse(e.data)
      setDeals((prev) =>
        prev.map((d) =>
          d.id === productId ? { ...d, currentBuyers: newCount } : d,
        ),
      )
    })

    es.onerror = () => {
      // SSE will auto-reconnect; nothing to do
    }

    return () => es.close()
  }, [])

  /**
   * Optimistically update a deal in local state (used by useJoin for instant UI).
   */
  const updateDeal = useCallback((updatedDeal) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)),
    )
  }, [])

  return { deals, timers, loading, error, updateDeal }
}
