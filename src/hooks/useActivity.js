import { useState, useEffect, useCallback, useRef } from 'react'
import { ensureUser, getCachedUser } from '../utils/user'

// ── Mock activity data for demo/static mode ───────────────────────────────────
const MOCK_NAMES  = ['דני כ.', 'מיכל ל.', 'שרה מ.', 'יוסי ב.', 'נועה ג.', 'ברק ש.', 'תמר א.', 'גל כ.', 'אור ד.', 'לים ט.']
const MOCK_CHATS  = [
  'יאללה חברים, שתפו את הדיל 🔥',
  'מחיר כזה לא ראיתי בשום מקום אחר!',
  'שיתפתי בקבוצת הוואצאפ, בדרך עוד אנשים 💪',
  'כמעט הגענו ליעד! עוד קצת',
  'קניתי פעם אחרת מהספק הזה — ממליץ בחום!',
  'מישהו יודע מתי המשלוח?',
]

function makeMockActivity(productId) {
  const msgs = []
  for (let i = 0; i < 7; i++) {
    const isJoin = i % 3 === 0
    const name   = MOCK_NAMES[i % MOCK_NAMES.length]
    msgs.push({
      id:        `mock-${productId}-${i}`,
      type:      isJoin ? 'join' : 'chat',
      userName:  isJoin ? 'System' : name,
      content:   isJoin ? `${MOCK_NAMES[(i + 1) % MOCK_NAMES.length]} הצטרף לקבוצה! 👋` : MOCK_CHATS[i % MOCK_CHATS.length],
      createdAt: new Date(Date.now() - (7 - i) * 4.5 * 60_000).toISOString(),
      productId,
    })
  }
  return msgs
}

/**
 * useActivity(productId)
 * ──────────────────────
 * Fetches activity feed + SSE for real-time updates.
 * Falls back to mock data + simulated live joins when API is unavailable.
 */
export function useActivity(productId) {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [isStatic, setIsStatic] = useState(false)
  const seenIds = useRef(new Set())

  const addMsg = useCallback((msg) => {
    if (seenIds.current.has(msg.id)) return
    seenIds.current.add(msg.id)
    setMessages(prev => [...prev, msg])
  }, [])

  // ── Initial fetch / fallback ──────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return

    const isGhPages = typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') ||
       window.location.hostname.includes('github.com'))

    if (isGhPages) {
      const mocks = makeMockActivity(productId)
      mocks.forEach(m => seenIds.current.add(m.id))
      setMessages(mocks)
      setIsStatic(true)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/activity/${productId}`)
      .then(r => r.json())
      .then(({ messages: msgs }) => {
        msgs.forEach(m => seenIds.current.add(m.id))
        setMessages(msgs)
        setLoading(false)
      })
      .catch(() => {
        // API unavailable — use mock data
        const mocks = makeMockActivity(productId)
        mocks.forEach(m => seenIds.current.add(m.id))
        setMessages(mocks)
        setIsStatic(true)
        setLoading(false)
      })
  }, [productId])

  // ── SSE subscription (live) ───────────────────────────────────────────────
  useEffect(() => {
    if (!productId || isStatic) return
    let es
    try {
      es = new EventSource('/api/deals/events/stream')
      es.addEventListener('activity:new', (e) => {
        const msg = JSON.parse(e.data)
        if (msg.productId === productId) addMsg(msg)
      })
    } catch (_) {}
    return () => es?.close()
  }, [productId, isStatic, addMsg])

  // ── Simulated live joins in demo/static mode ──────────────────────────────
  useEffect(() => {
    if (!productId || !isStatic) return

    const joinNames = [...MOCK_NAMES]
    let idx = 0
    const iv = setInterval(() => {
      const name = joinNames[idx % joinNames.length]
      idx++
      const msg = {
        id:        `live-${productId}-${Date.now()}`,
        type:      'join',
        userName:  'System',
        content:   `${name} הצטרף לקבוצה! 🎉`,
        createdAt: new Date().toISOString(),
        productId,
      }
      addMsg(msg)
    }, Math.floor(Math.random() * 8000) + 7000) // 7–15 s

    return () => clearInterval(iv)
  }, [productId, isStatic, addMsg])

  // ── Post a chat message ───────────────────────────────────────────────────
  const postMessage = useCallback(async (content) => {
    // Optimistically add to UI immediately
    const user = getCachedUser()
    const localMsg = {
      id:        `local-${Date.now()}`,
      type:      'chat',
      userName:  user?.name || 'אתה',
      content,
      createdAt: new Date().toISOString(),
      productId,
    }
    addMsg(localMsg)

    if (isStatic) return { message: localMsg }

    try {
      const u   = await ensureUser()
      const res = await fetch(`/api/activity/${productId}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: u.id, userName: u.name, content }),
      })
      const data = await res.json()
      if (data.message) addMsg(data.message)
      return data
    } catch {
      return { message: localMsg }
    }
  }, [productId, isStatic, addMsg])

  return { messages, loading, postMessage }
}
