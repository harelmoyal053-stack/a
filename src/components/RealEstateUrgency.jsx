import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, TrendingDown, AlertTriangle, Star } from 'lucide-react'

const PROJECTS = [
  {
    id: 1,
    name: 'שדרות הכרמל – חיפה',
    type: '4 חדרים | קומה 8 | חניה כפולה',
    area: 'קריית החוף, חיפה',
    filled: 85,
    total: 40,
    joined: 34,
    saved: '18%',
    originalPrice: '₪2,100,000',
    groupPrice: '₪1,720,000',
    savings: '₪380,000',
    badge: 'הכי מבוקש 🔥',
    urgent: true,
  },
  {
    id: 2,
    name: 'מגדל ירוק – תל אביב',
    type: '3 חדרים | קומה 14 | מרפסת',
    area: 'לב העיר, תל אביב',
    filled: 62,
    total: 30,
    joined: 19,
    saved: '14%',
    originalPrice: '₪3,400,000',
    groupPrice: '₪2,924,000',
    savings: '₪476,000',
    badge: 'קצב מהיר ⚡',
    urgent: false,
  },
  {
    id: 3,
    name: 'גני ירושלים – ירושלים',
    type: '5 חדרים | קרקע | גינה פרטית',
    area: 'קטמון, ירושלים',
    filled: 40,
    total: 25,
    joined: 10,
    saved: '12%',
    originalPrice: '₪2,800,000',
    groupPrice: '₪2,464,000',
    savings: '₪336,000',
    badge: 'חדש 🆕',
    urgent: false,
  },
]

function ProjectTab({ project, active, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full text-right px-4 py-3 rounded-xl transition-all"
      style={active
        ? { background: '#155c34', color: '#fff' }
        : { background: '#f4fbf7', color: '#475569', border: '1px solid #e2e8f0' }
      }
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={active
            ? { background: 'rgba(34,168,85,0.2)', color: '#22a855' }
            : { background: '#d1fae5', color: '#155c34' }
          }>
          {project.badge}
        </span>
        <span className="font-bold text-sm">{project.name}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: active ? 'rgba(255,255,255,0.2)' : '#e2e8f0' }}>
        <div className="h-full rounded-full progress-gold transition-all duration-700" style={{ width: `${project.filled}%` }} />
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span style={{ color: active ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>
          {project.total - project.joined} מקומות פנויים
        </span>
        <span style={{ color: active ? '#22a855' : '#155c34', fontWeight: 700 }}>{project.filled}%</span>
      </div>
    </button>
  )
}

export default function RealEstateUrgency() {
  const [active, setActive] = useState(0)
  const [ticker, setTicker] = useState(0)
  const project = PROJECTS[active]
  const remaining = project.total - project.joined

  useEffect(() => {
    const t = setInterval(() => setTicker(n => n + 1), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-16 px-4" style={{ background: '#f4fbf7' }} dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="chip-gold mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            פרויקטים עם מקומות אחרונים
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3" style={{ color: '#0d3320' }}>
            קבוצות <span style={{ color: '#22a855' }}>פעילות עכשיו</span> — אל תפספס
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#64748b' }}>
            כשהקבוצה מתמלאת — המחיר נעול. הצטרף לפני שייגמר המקום שלך.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Tabs */}
          <div className="lg:col-span-2 space-y-3">
            {PROJECTS.map((p, i) => (
              <ProjectTab key={p.id} project={p} active={i === active} onClick={() => setActive(i)} />
            ))}
          </div>

          {/* Detail card */}
          <motion.div key={active} className="lg:col-span-3 card-clean overflow-hidden"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            {/* Card header */}
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #082b18, #155c34)', color: '#fff' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22a855' }} />
                <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>עדכון חי</span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#22a855' }}>{project.badge}</span>
            </div>

            <div className="p-6">
              <div className="mb-5 text-right">
                <h3 className="text-2xl font-black mb-1" style={{ color: '#0d3320' }}>{project.name}</h3>
                <div className="flex items-center justify-end gap-2 text-sm" style={{ color: '#64748b' }}>
                  <span>{project.type}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{project.area}</span>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl p-4 text-right" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>מחיר מקבלן</p>
                  <p className="text-lg font-black line-through" style={{ color: '#cbd5e1' }}>{project.originalPrice}</p>
                </div>
                <div className="rounded-xl p-4 text-right" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>מחיר קבוצתי</p>
                  <p className="text-xl font-black" style={{ color: '#15803d' }}>{project.groupPrice}</p>
                </div>
              </div>

              {/* Savings */}
              <div className="rounded-xl p-3 mb-5 flex items-center justify-between"
                style={{ background: 'rgba(34,168,85,0.08)', border: '1px solid rgba(34,168,85,0.25)' }}>
                <span className="font-black text-lg" style={{ color: '#1a7a40' }}>
                  חיסכון {project.savings} ({project.saved})
                </span>
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" style={{ color: '#22a855' }} />
                  <span className="text-sm font-semibold" style={{ color: '#1a7a40' }}>הנחה קבוצתית</span>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className={`font-bold ${project.urgent ? 'text-red-500' : ''}`}
                  style={project.urgent ? {} : { color: '#155c34' }}>
                  {project.urgent ? `⚠️ נותרו ${remaining} מקומות אחרונים!` : `נותרו ${remaining} מקומות פנויים`}
                </span>
                <span style={{ color: '#64748b' }}>{project.joined}/{project.total} הצטרפו</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden mb-1.5" style={{ background: '#e2e8f0' }}>
                <motion.div className="h-full rounded-full progress-gold"
                  initial={{ width: '0%' }} animate={{ width: `${project.filled}%` }}
                  transition={{ duration: 1.1, ease: 'easeOut' }} />
              </div>
              <div className="flex justify-between text-xs mb-5" style={{ color: '#94a3b8' }}>
                <span>0%</span>
                <span className="font-bold" style={{ color: '#22a855' }}>{project.filled}% הושלם</span>
                <span>100%</span>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 space-x-reverse">
                    {['👨‍💼','👩‍💼','👨‍👩‍👧','👩','👨'].slice(0, Math.min(5, project.joined)).map((e, i) => (
                      <span key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white"
                        style={{ background: '#d1fae5' }}>{e}</span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#64748b' }}>+{project.joined} משפחות</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: '#d1fae5', color: '#155c34' }}>
                  <Users className="w-3.5 h-3.5" />
                  {ticker % 2 === 0 ? `${project.joined} ממתינים לאישור` : `${project.joined + 1} עקבו אחרי פרויקט זה`}
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-end gap-1 mb-5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs mr-1" style={{ color: '#64748b' }}>4.9 (127 ביקורות)</span>
              </div>

              <motion.button
                className="btn-gold w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Users className="w-5 h-5" />
                שריין לי מקום בקבוצה
              </motion.button>
              <p className="text-center text-xs mt-2" style={{ color: '#94a3b8' }}>ללא התחייבות · ניתן לביטול בכל עת</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
