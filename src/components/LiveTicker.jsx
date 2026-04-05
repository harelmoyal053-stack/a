import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'

const MESSAGES = [
  "🏠 משפחת כהן מתל אביב הצטרפה לפרויקט שדרות הכרמל — נותרו 3 מקומות!",
  "⚡ קבוצת ירושלים השלימה 80% — עוד 5 משפחות ומחיר הסגירה נעול!",
  "🎉 פרויקט גני הצפון נסגר! 35 משפחות חסכו ₪280,000 בממוצע.",
  "👥 12 משפחות הצטרפו השבוע לפרויקט המרכז — ההנחה עלתה ל-16%",
  "💰 עסקת שבוע: פרויקט הים בנתניה — חיסכון של 19% לחברי הקבוצה",
  "🚀 רחל מחיפה חסכה ₪320,000 על דירת 4 חדרים — ברוכה הבאה לקבוצה!",
  "📋 פרויקט חדש נפתח: מגדל ירוק תל אביב — ניתן להצטרף עכשיו",
  "🏆 DropPrice: מעל 2,400 משפחות ישראליות קנו בחכמה ב-2025",
]

export default function LiveTicker() {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 6000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="relative overflow-hidden" style={{ height: 36, background: '#0f2d5e', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0f2d5e, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0f2d5e, transparent)' }} />

      <div className="absolute right-3 top-0 bottom-0 z-20 flex items-center gap-1.5 pl-3"
        style={{ borderLeft: '1px solid rgba(201,168,76,0.25)' }}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
        <Activity className="w-3 h-3" style={{ color: '#c9a84c' }} />
        <span className="text-[10px] font-black tracking-wider uppercase" style={{ color: '#c9a84c' }}>LIVE</span>
      </div>

      <div className="absolute inset-0 flex items-center pr-28 overflow-hidden">
        <span
          key={msgIdx}
          className="text-xs font-semibold whitespace-nowrap"
          style={{ animation: 'ticker 18s linear forwards', color: 'rgba(241,245,249,0.8)' }}
        >
          {MESSAGES[msgIdx]}
        </span>
      </div>
    </div>
  )
}
