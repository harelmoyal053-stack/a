import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Users, Zap, Gift, Link } from 'lucide-react'
import { useActivity } from '../hooks/useActivity'

// ── Relative time helper ──────────────────────────────────────────────────────
function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60)  return 'עכשיו'
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דקות`
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שעות`
  return `לפני ${Math.floor(diff / 86400)} ימים`
}

// ── Single message bubble ─────────────────────────────────────────────────────
function MessageBubble({ msg, isNew }) {
  const isSystem = msg.type !== 'chat'

  if (isSystem) {
    const icons = { join: Users, milestone: Zap, referral: Link }
    const colors = { join: '#00b4ff', milestone: '#00ff88', referral: '#7b2ff7' }
    const bgColors = { join: 'rgba(0,180,255,0.07)', milestone: 'rgba(0,255,136,0.07)', referral: 'rgba(123,47,247,0.07)' }
    const borderColors = { join: 'rgba(0,180,255,0.2)', milestone: 'rgba(0,255,136,0.25)', referral: 'rgba(123,47,247,0.25)' }
    const Icon = icons[msg.type] || Zap

    return (
      <motion.div
        className="flex items-center justify-center gap-2 py-2"
        initial={isNew ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: bgColors[msg.type] || bgColors.join, border: `1px solid ${borderColors[msg.type] || borderColors.join}` }}>
          <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: colors[msg.type] || colors.join }} />
          <p className="text-xs font-semibold text-center" style={{ color: colors[msg.type] || colors.join, direction: 'rtl' }}>
            {msg.content}
          </p>
        </div>
      </motion.div>
    )
  }

  // Chat bubble
  return (
    <motion.div
      className="flex items-end gap-2 justify-end"
      initial={isNew ? { opacity: 0, x: 20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-right max-w-[85%]">
        <div className="flex items-baseline gap-2 mb-0.5 justify-end">
          <span className="text-xs text-slate-600">{relativeTime(msg.createdAt)}</span>
          <span className="text-xs font-bold text-slate-400">{msg.userName}</span>
        </div>
        <div className="inline-block px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-right"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-sm text-slate-200 leading-relaxed" style={{ direction: 'rtl' }}>
            {msg.content}
          </p>
        </div>
      </div>
      {/* Avatar circle */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mb-0.5"
        style={{
          background: `hsl(${msg.userName.charCodeAt(0) * 37 % 360}, 60%, 25%)`,
          border: `1px solid hsl(${msg.userName.charCodeAt(0) * 37 % 360}, 60%, 40%)`,
          color: `hsl(${msg.userName.charCodeAt(0) * 37 % 360}, 90%, 75%)`,
        }}>
        {msg.userName.charAt(0)}
      </div>
    </motion.div>
  )
}

// ── Activity Feed component ───────────────────────────────────────────────────
export default function ActivityFeed({ productId }) {
  const { messages, loading, postMessage } = useActivity(productId)
  const [input,       setInput]    = useState('')
  const [sending,     setSending]  = useState(false)
  const [newMsgIds,   setNewMsgIds] = useState(new Set())
  const bottomRef = useRef(null)
  const prevLen   = useRef(0)

  // Auto-scroll and mark new messages
  useEffect(() => {
    if (messages.length > prevLen.current) {
      const fresh = messages.slice(prevLen.current).map(m => m.id)
      setNewMsgIds(prev => new Set([...prev, ...fresh]))
      setTimeout(() => setNewMsgIds(new Set()), 2000)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevLen.current = messages.length
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    await postMessage(text).catch(() => {})
    setSending(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(8,12,24,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,255,136,0.04)' }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-500 font-semibold">{messages.length} הודעות</span>
        </span>
        <div className="flex items-center gap-2">
          <h3 className="font-black text-white text-base">צ'אט קבוצתי</h3>
          <MessageCircle className="w-4.5 h-4.5 text-neon-green" />
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 py-3 space-y-2.5 overflow-y-auto" style={{ maxHeight: 280, minHeight: 160 }}>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-5 h-5 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <MessageCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-600">היה הראשון לכתוב בצ'אט!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} isNew={newMsgIds.has(msg.id)} />
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 flex items-end gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <motion.button
          onClick={send}
          disabled={!input.trim() || sending}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
          style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408' }}
          whileTap={{ scale: 0.92 }}
        >
          {sending
            ? <div className="w-4 h-4 border-2 border-dark-900/40 border-t-dark-900 rounded-full animate-spin" />
            : <Send className="w-4 h-4 rotate-180" />
          }
        </motion.button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="כתוב הודעה לקבוצה..."
          maxLength={280}
          dir="rtl"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-neon-green/40 focus:bg-white/8 transition-all"
          style={{ fontFamily: 'inherit' }}
        />
      </div>
    </div>
  )
}
