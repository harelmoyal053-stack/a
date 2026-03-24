import { useState, useEffect, useCallback, useRef } from 'react'
import { ensureUser } from '../utils/user'

/**
 * useActivity(productId)
 * ──────────────────────
 * Fetches activity feed for a deal and subscribes to SSE for real-time updates.
 * Also exposes postMessage() for the group chat.
 */
export function useActivity(productId) {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const seenIds = useRef(new Set())

  // ── Add a message only if not already seen (dedup SSE + fetch) ───────────
  const addMsg = useCallback((msg) => {
    if (seenIds.current.has(msg.id)) return
    seenIds.current.add(msg.id)
    setMessages(prev => [...prev, msg])
  }, [])

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return
    setLoading(true)
    fetch(`/api/activity/${productId}`)
      .then(r => r.json())
      .then(({ messages: msgs }) => {
        msgs.forEach(m => seenIds.current.add(m.id))
        setMessages(msgs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  // ── SSE for real-time new messages ────────────────────────────────────────
  useEffect(() => {
    if (!productId) return
    const es = new EventSource('/api/deals/events/stream')
    es.addEventListener('activity:new', (e) => {
      const msg = JSON.parse(e.data)
      if (msg.productId === productId) addMsg(msg)
    })
    return () => es.close()
  }, [productId, addMsg])

  // ── Post a chat message ───────────────────────────────────────────────────
  const postMessage = useCallback(async (content) => {
    const user = await ensureUser()
    const res  = await fetch(`/api/activity/${productId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ userId: user.id, userName: user.name, content }),
    })
    const data = await res.json()
    if (data.message) addMsg(data.message)
    return data
  }, [productId, addMsg])

  return { messages, loading, postMessage }
}
