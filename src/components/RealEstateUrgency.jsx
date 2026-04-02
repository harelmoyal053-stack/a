import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, TrendingDown, Clock, AlertTriangle, Star } from 'lucide-react'

const PROJECTS = [
  {
    id: 1,
    name: 'פרויקט "שדרות הכרמל" – חיפה',
    type: '4 חדרים | קומה 8 | חניה כפולה',
    area: 'קריית החוף, חיפה',
    filled: 85,
    total: 40,
    joined: 34,
    saved: '18%',
    originalPrice: '₪2,100,000',
    groupPrice: '₪1,720,000',
    savings: '₪380,000',
    badge: '🔥 הכי מבוקש',
    badgeColor: '#ff6b35',
  },
  {
    id: 2,
    name: 'פרויקט "מגדל ירוק" – תל אביב',
    type: '3 חדרים | קומה 14 | מרפסת',
    area: 'לב העיר, תל אביב',
    filled: 62,
    total: 30,
    joined: 19,
    saved: '14%',
    originalPrice: '₪3,400,000',
    groupPrice: '₪2,924,000',
    savings: '₪476,000',
    badge: '⚡ קצב הצטרפות מהיר',
    badgeColor: '#00b4ff',
  },
  {
    id: 3,
    name: 'פרויקט "גני ירושלים" – ירושלים',
    type: '5 חדרים | קרקע | גינה פרטית',
    area: 'קטמון, ירושלים',
    filled: 40,
    total: 25,
    joined: 10,
    saved: '12%',
    originalPrice: '₪2,800,000',
    groupPrice: '₪2,464,000',
    savings: '₪336,000',
    badge: '🆕 חדש',
    badgeColor: '#a855f7',
  },
]

function ProjectCard({ project, active, onClick }) {
  const remaining = project.total - project.joined
  const isUrgent  = remaining <= 5

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-right rounded-2xl p-4 transition-all"
      style={
        active
          ? { background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.45)', boxShadow: '0 0 20px rgba(0,255,136,0.15)' }
          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }
      }
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-black px-2 py-1 rounded-full" style={{ background: `${project.badgeColor}20`, color: project.badgeColor, border: `1px solid ${project.badgeColor}40` }}>
          {project.badge}
        </span>
        <p className="font-black text-white text-sm leading-snug">{project.name}</p>
      </div>
      <div className="flex items-center gap-1 justify-end mb-2">
        <span className="text-xs text-slate-500">{project.area}</span>
        <MapPin className="w-3 h-3 text-slate-500" />
      </div>
      {/* Mini progress */}
      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full progress-neon transition-all duration-700" style={{ width: `${project.filled}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={`font-bold ${isUrgent ? 'text-red-400' : 'text-slate-500'}`}>
          {isUrgent ? `⚠️ נותרו ${remaining} מקומות!` : `נותרו ${remaining} מקומות`}
        </span>
        <span className="font-bold" style={{ color: '#00ff88' }}>{project.filled}% מלא</span>
      </div>
    </motion.button>
  )
}

export default function RealEstateUrgency() {
  const [active, setActive]   = useState(0)
  const [ticker, setTicker]   = useState(0)
  const project               = PROJECTS[active]
  const remaining             = project.total - project.joined
  const isUrgent              = remaining <= 5

  // Simulate live join counter
  useEffect(() => {
    const t = setInterval(() => setTicker(n => n + 1), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-16 px-4" style={{ background: 'linear-gradient(160deg, #020b18 0%, #050810 60%, #060a18 100%)' }} dir="rtl">
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
          style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.35)', color: '#f5c518' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>פרויקטים עם מקומות אחרונים</span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-black text-white mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          קבוצות <span style={{ color: '#f5c518', textShadow: '0 0 14px rgba(245,197,24,0.5)' }}>פעילות עכשיו</span> — אל תפספס
        </motion.h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          כשהקבוצה מתמלאת — המחיר נעול. הצטרף לפני שייגמר המקום שלך.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Project list (sidebar) */}
        <div className="lg:col-span-2 space-y-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} active={i === active} onClick={() => setActive(i)} />
          ))}
        </div>

        {/* Featured project detail */}
        <motion.div
          key={active}
          className="lg:col-span-3 rounded-3xl overflow-hidden"
          style={{ background: 'rgba(10,14,26,0.85)', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 40px rgba(0,255,136,0.07)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header band */}
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.07), rgba(0,180,255,0.05))', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-semibold">עדכון חי</span>
            </div>
            <span className="text-xs font-black px-2 py-1 rounded-full"
              style={{ background: `${project.badgeColor}20`, color: project.badgeColor, border: `1px solid ${project.badgeColor}35` }}>
              {project.badge}
            </span>
          </div>

          <div className="p-6">
            {/* Title */}
            <div className="mb-5 text-right">
              <h3 className="text-2xl font-black text-white mb-1">{project.name}</h3>
              <div className="flex items-center justify-end gap-2 text-slate-400 text-sm">
                <span>{project.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{project.area}</span>
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Price comparison */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl p-4 text-right" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p className="text-xs text-slate-500 mb-1">מחיר מקבלן</p>
                <p className="text-lg font-black text-slate-400 line-through">{project.originalPrice}</p>
              </div>
              <div className="rounded-2xl p-4 text-right" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)' }}>
                <p className="text-xs text-slate-400 mb-1">מחיר קבוצתי</p>
                <p className="text-xl font-black" style={{ color: '#00ff88', textShadow: '0 0 12px rgba(0,255,136,0.5)' }}>{project.groupPrice}</p>
              </div>
            </div>

            {/* Savings highlight */}
            <div className="rounded-xl p-3 mb-6 flex items-center justify-between"
              style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.25)' }}>
              <span className="font-black text-lg" style={{ color: '#f5c518' }}>חוסך {project.savings} ({project.saved})</span>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">חיסכון בקבוצה</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className={`font-black ${isUrgent ? 'text-red-400 animate-pulse' : 'text-neon-green'}`}>
                {isUrgent ? `⚠️ נותרו ${remaining} מקומות אחרונים!` : `נותרו ${remaining} מקומות פנויים`}
              </span>
              <span className="text-slate-400">{project.joined}/{project.total} הצטרפו</span>
            </div>
            <div className="h-4 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full progress-neon"
                initial={{ width: '0%' }}
                animate={{ width: `${project.filled}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
              <span>0%</span>
              <span className="font-bold" style={{ color: '#00ff88' }}>{project.filled}% מהקבוצה כבר מלאה!</span>
              <span>100%</span>
            </div>

            {/* Live social proof */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 space-x-reverse">
                  {['👨‍💼','👩‍💼','👨‍👩‍👧','👩','👨'].slice(0, Math.min(5, project.joined)).map((e, i) => (
                    <span key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2 border-slate-900"
                      style={{ background: 'rgba(0,255,136,0.1)' }}>
                      {e}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-semibold">+{project.joined} חברי קבוצה</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}>
                <Users className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-xs font-black text-neon-green">
                  {ticker % 2 === 0 ? `${project.joined} מחכים לאישור` : `${project.joined + 1} עקבו אחרי פרויקט זה`}
                </span>
              </div>
            </div>

            {/* Star ratings */}
            <div className="flex items-center justify-end gap-1 mb-5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-slate-400 mr-1">4.9 (127 ביקורות)</span>
            </div>

            {/* CTA */}
            <motion.button
              className="w-full btn-neon py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Users className="w-5 h-5" />
              שריין לי מקום בקבוצה
            </motion.button>
            <p className="text-center text-xs text-slate-600 mt-2">ללא התחייבות · ניתן לביטול בכל עת</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
