import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

const MESSAGES = [
  "🔥 מיכל מתל אביב הצטרפה לעסקת הפיצה — המחיר ירד ל-₪35!",
  "⚡ נשארו רק 3 מקומות לשלב ההנחה על חיתולי פמפרס!",
  "🎉 עסקה הושלמה! 50 קונים השיגו קפה פרימיום ב-₪49 — טירוף!",
  "👥 12 אנשים הצטרפו בשעה האחרונה לעסקת הדלק",
  "💥 נשאר מקום אחד בלבד לשלב ₪52 על ארגז הפירות!",
  "🚀 אביב מחיפה חסך ₪131 על כדור כוח — הצטרפו לחגיגה!",
  "⚠️ עוד 8 דקות בלבד לעסקת הפיצה — הצטרף לפני שיהיה מאוחר!",
  "💚 המחיר ירד! דלק עכשיו ב-₪125 לאחר שהקבוצה הגיעה ל-50 קונים!",
  "🏆 DropPrice שברה שיא! 5,000 עסקאות הושלמו הלילה!",
]

export default function LiveTicker() {
  const [msgIdx, setMsgIdx] = useState(0)

  // Every 6 s, pick the next message (they'll loop via CSS animation restart trick)
  useEffect(() => {
    const iv = setInterval(() => {
      setMsgIdx(i => (i + 1) % MESSAGES.length)
    }, 6000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="relative bg-dark-900 border-b border-neon-green/20 overflow-hidden"
      style={{ height: 34 }}>
      {/* Left neon fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #050810, transparent)' }} />
      {/* Right neon fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #050810, transparent)' }} />

      {/* Live indicator (right-anchored, RTL) */}
      <div className="absolute right-3 top-0 bottom-0 z-20 flex items-center gap-1.5 pl-3"
        style={{ borderLeft: '1px solid rgba(0,255,136,0.2)' }}>
        <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <Activity className="w-3 h-3 text-neon-green" />
        <span className="text-[10px] font-black text-neon-green tracking-wider uppercase">LIVE</span>
      </div>

      {/* Scrolling message */}
      <div className="absolute inset-0 flex items-center pr-28 overflow-hidden">
        <span
          key={msgIdx}
          className="text-xs font-semibold text-slate-300 whitespace-nowrap"
          style={{ animation: 'ticker 18s linear forwards' }}
        >
          {MESSAGES[msgIdx]}
        </span>
      </div>
    </div>
  )
}
