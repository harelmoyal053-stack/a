import { motion } from 'framer-motion'
import { ClipboardCheck, Users, TrendingDown, Key } from 'lucide-react'

const STEPS = [
  {
    icon: ClipboardCheck,
    number: '01',
    title: 'נרשמים ובודקים התאמה',
    description: 'ממלאים טופס קצר עם פרטי הצרכים והתקציב שלך. נציג מקצועי שלנו יצור קשר ויאשר התאמה לאחת מהקבוצות הפעילות.',
    accent: '#0f2d5e',
    bg: 'rgba(15,45,94,0.06)',
  },
  {
    icon: Users,
    number: '02',
    title: 'מצטרפים לכוח הקנייה',
    description: 'לאחר אישור ההתאמה, מצטרפים רשמית לקבוצת הרחישה. כוח הקנייה הקולקטיבי מאפשר מו"מ ישיר מול היזם מעמדת כוח.',
    accent: '#c9a84c',
    bg: 'rgba(201,168,76,0.07)',
  },
  {
    icon: TrendingDown,
    number: '03',
    title: 'מו"מ קבוצתי — המחיר יורד',
    description: 'ביום הסגירה הקבוצה כולה רוכשת יחד. הנפח הגדול מחייב את היזם להציע הנחה שאף קונה בודד לא יכול לקבל.',
    accent: '#1a4080',
    bg: 'rgba(26,64,128,0.06)',
  },
  {
    icon: Key,
    number: '04',
    title: 'חוסכים ומקבלים מפתחות',
    description: 'החוזה נחתם, הסכום המוזל מוגן בנאמנות. אתה מקבל דירה במחיר שחסך לך עשרות אחוזי הנחה — ומפתחות לדירה שלך.',
    accent: '#c9a84c',
    bg: 'rgba(201,168,76,0.07)',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 px-4" style={{ background: '#fff' }} dir="rtl">
      <div className="max-w-6xl mx-auto">

        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="chip-navy mb-4">איך זה עובד?</span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3" style={{ color: '#0f1f3d' }}>
            4 צעדים לחיסכון של <span style={{ color: '#c9a84c' }}>עשרות אחוזים</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#64748b' }}>
            קבוצת רחישה היא הדרך החכמה לרכוש נכס — פחות בירוקרטיה, יותר כוח קנייה, מחירים שאי אפשר להשיג לבד.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div key={i} className="card-clean p-6 text-right relative"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="absolute top-4 left-5 text-5xl font-black select-none"
                  style={{ color: step.accent, opacity: 0.08, fontFamily: 'monospace' }}>
                  {step.number}
                </span>

                <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 w-12 h-12"
                  style={{ background: step.bg, border: `1px solid ${step.accent}20` }}>
                  <Icon className="w-6 h-6" style={{ color: step.accent }} />
                </div>

                <h3 className="text-base font-black mb-2" style={{ color: '#0f1f3d' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{step.description}</p>

                <div className="mt-5 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${step.accent}40, transparent)` }} />
              </motion.div>
            )
          })}
        </div>

        <motion.div className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #071629, #0f2d5e)', color: '#fff' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-bold text-lg mb-4">
            מוכן להצטרף? מאות משפחות כבר חסכו בממוצע{' '}
            <span style={{ color: '#c9a84c' }}>₪350,000</span> על דירתן.
          </p>
          <motion.button
            className="btn-gold px-8 py-3.5 rounded-2xl font-black text-base"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            בדיקת התאמה חינמית ←
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
