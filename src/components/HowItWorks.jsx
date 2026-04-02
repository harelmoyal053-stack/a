import { motion } from 'framer-motion'
import { ClipboardCheck, Users, TrendingDown, Key } from 'lucide-react'

const STEPS = [
  {
    icon: ClipboardCheck,
    number: '01',
    title: 'נרשמים ובודקים התאמה',
    description:
      'ממלאים טופס קצר עם פרטי הצרכים והתקציב שלך. נציג מקצועי שלנו יצור קשר, יסביר את המודל ויאשר התאמה לאחת מהקבוצות הפעילות.',
    color: '#00ff88',
    glow: 'rgba(0,255,136,0.18)',
  },
  {
    icon: Users,
    number: '02',
    title: 'מצטרפים לכוח הקנייה',
    description:
      'לאחר אישור ההתאמה, מצטרפים רשמית לקבוצת הרחישה. כוח הקנייה הקולקטיבי של הקבוצה מאפשר ניהול מו"מ ישיר מול היזם מעמדת כוח.',
    color: '#00b4ff',
    glow: 'rgba(0,180,255,0.18)',
  },
  {
    icon: TrendingDown,
    number: '03',
    title: 'מו"מ קבוצתי — המחיר צונח',
    description:
      'ב"יום הסגירה" הקבוצה כולה רוכשת יחד. הנפח הגדול מחייב את היזם להציע הנחה משמעותית שאף קונה בודד לא יכול לקבל לבד.',
    color: '#f5c518',
    glow: 'rgba(245,197,24,0.18)',
  },
  {
    icon: Key,
    number: '04',
    title: 'חוסכים ומקבלים מפתחות',
    description:
      'החוזה נחתם, הסכום המוזל נעול בנאמנות עד מסירה. אתה מקבל דירה במחיר שחסך לך עשרות אחוזי הנחה — ומפתחות לדירה שלך.',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.18)',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 px-4" dir="rtl"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #040912 100%)' }}>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.35)', color: '#a855f7' }}>
            <span>איך זה עובד?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            4 צעדים <span style={{ color: '#a855f7', textShadow: '0 0 14px rgba(168,85,247,0.5)' }}>לחיסכון של עשרות אחוזים</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            קבוצת רחישה היא הדרך החכמה לרכוש נכס — פחות בירוקרטיה, יותר כוח קנייה, מחירים שאי אפשר להשיג לבד.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                className="relative rounded-2xl p-6 text-right group cursor-default"
                style={{
                  background: 'rgba(10,14,26,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  borderColor: `${step.color}50`,
                  boxShadow: `0 0 30px ${step.glow}`,
                  y: -4,
                }}
              >
                {/* Step number — decorative */}
                <span className="absolute top-4 left-4 text-4xl font-black leading-none select-none"
                  style={{ color: `${step.color}15`, fontFamily: 'monospace' }}>
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mr-auto"
                  style={{ background: `${step.color}14`, border: `1px solid ${step.color}35` }}>
                  <Icon className="w-7 h-7" style={{ color: step.color }} />
                </div>

                {/* Connector arrow (not last) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#050810', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span className="text-xs text-slate-600">←</span>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-black text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>

                {/* Bottom accent line */}
                <div className="mt-5 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)` }} />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(168,85,247,0.06))',
            border: '1px solid rgba(0,255,136,0.2)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white font-bold text-lg mb-4">
            מוכן להצטרף? מאות משפחות כבר חסכו בממוצע <span style={{ color: '#00ff88' }}>₪350,000</span> על דירתן.
          </p>
          <motion.button
            className="btn-neon px-8 py-3.5 rounded-2xl font-black text-base"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            אני רוצה לבדוק התאמה →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
