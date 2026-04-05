import { motion } from 'framer-motion'
import { TrendingDown, Users, Shield, ArrowLeft, Home } from 'lucide-react'

const PILLS = [
  { icon: TrendingDown, label: 'מחירים יורדים בכוח קבוצתי' },
  { icon: Users,        label: 'קהילה של 52,000+ קונים'  },
  { icon: Shield,       label: 'כספים מוגנים בנאמנות'    },
]

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden" dir="rtl"
      style={{ background: 'linear-gradient(135deg, #082b18 0%, #155c34 55%, #1e7a40 100%)' }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,168,85,0.12), transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,168,85,0.08), transparent 70%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="herogrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#22a855" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#herogrid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          <motion.div
            className="inline-flex items-center gap-2 mb-6 rounded-full px-4 py-1.5 text-sm font-bold"
            style={{ background: 'rgba(34,168,85,0.12)', border: '1px solid rgba(34,168,85,0.38)', color: '#4ade80' }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          >
            <Home className="w-3.5 h-3.5" />
            <span>פלטפורמה מובילה לקבוצות רחישה בישראל</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-black mb-5 leading-tight tracking-tight text-white"
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            קנה דירה בכוח <span style={{ color: '#22a855' }}>הקבוצה</span>
            <br />
            <span style={{ opacity: 0.9 }}>חסוך עשרות אחוזים</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-10 leading-relaxed mx-auto"
            style={{ color: 'rgba(241,245,249,0.72)', maxWidth: '36rem' }}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            כשקבוצת קונים מגיעה ליזם ביחד — המחיר נופל.{' '}
            <strong className="text-white font-bold">DropPrice</strong> מאחדת רוכשים ומנהלת את כל התהליך מא׳ עד ת׳.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
          >
            {PILLS.map(({ icon: Icon, label }, i) => (
              <div key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(241,245,249,0.82)' }}>
                <Icon className="w-4 h-4" style={{ color: '#22a855' }} />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
          >
            <motion.button
              className="btn-gold flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>בדיקת התאמה חינמית</span>
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-base font-bold text-white transition-all"
              style={{ border: '2px solid rgba(255,255,255,0.22)' }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })}
            >
              גלה עסקאות פעילות
            </motion.button>
          </motion.div>

          <motion.p
            className="mt-8 text-sm"
            style={{ color: 'rgba(241,245,249,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          >
            הצטרפו כבר <strong className="text-white font-bold">52,840</strong> רוכשים מרוצים
            {' · '}ממוצע חיסכון <strong style={{ color: '#22a855' }}>₪347,000</strong> לדירה
          </motion.p>
        </div>
      </div>
    </div>
  )
}
