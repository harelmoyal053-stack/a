import { motion } from 'framer-motion'
import { ArrowRight, Users, Package, TrendingDown, Clock, CheckCircle, Truck, AlertCircle, Star, Zap } from 'lucide-react'

const MOCK_GROUPS = [
  { id: 'm1', title: 'מזגן אינוורטר 1.5 כ״ס', subtitle: 'מותג Samsung | א-קלאס', emoji: '❄️',
    currentPrice: 1290, originalPrice: 2100, currentBuyers: 48, targetBuyers: 50,
    joinedAt: '22 במרץ 2026', status: 'active' },
  { id: 'm2', title: 'אוזניות Sony WH-1000XM5', subtitle: 'ביטול רעשים פעיל', emoji: '🎧',
    currentPrice: 899, originalPrice: 1499, currentBuyers: 30, targetBuyers: 30,
    joinedAt: '18 במרץ 2026', status: 'shipped', tracking: 'IL1234567890' },
  { id: 'm3', title: 'סל אורגני 5 ק״ג', subtitle: 'ירקות ופירות | ישיר מהחקלאי', emoji: '🥦',
    currentPrice: 55, originalPrice: 90, currentBuyers: 12, targetBuyers: 20,
    joinedAt: '20 במרץ 2026', status: 'expired' },
]

const STATUS = {
  active:  { label: 'ממתין לקונים',   icon: Clock,       color: '#ffa500', bg: 'rgba(255,165,0,0.1)',   border: 'rgba(255,165,0,0.3)' },
  shipped: { label: 'בדרך אליך! 🚚',  icon: Truck,       color: '#00b4ff', bg: 'rgba(0,180,255,0.1)',   border: 'rgba(0,180,255,0.3)' },
  success: { label: 'עסקה הושלמה! ✓', icon: CheckCircle, color: '#00ff88', bg: 'rgba(0,255,136,0.1)',   border: 'rgba(0,255,136,0.3)' },
  expired: { label: 'פג תוקף (בוטל)', icon: AlertCircle, color: '#4a5568', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
}

export default function DashboardPage({ myGroups, onBack }) {
  const allGroups    = [...myGroups, ...MOCK_GROUPS]
  const totalSaved   = allGroups.reduce((a, g) => a + (g.originalPrice - g.currentPrice), 0)
  const activeCount  = allGroups.filter(g => g.status === 'active').length
  const successCount = allGroups.filter(g => g.status === 'shipped' || g.status === 'success').length

  const CARD = { background: 'rgba(10,14,26,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }

  return (
    <div className="min-h-screen pb-10" style={{ background: '#050810' }} dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,136,0.12)' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-neon-green font-semibold transition-colors text-sm">
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
          <span className="font-black text-white">הקבוצות שלי</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* User hero */}
        <div className="rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,180,255,0.08))', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 40px rgba(0,255,136,0.08)' }}>
          <div className="absolute inset-0 circuit-bg opacity-50" />
          <div className="absolute inset-0 scanlines" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow"
              style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}>
              👤
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end mb-0.5">
                <h2 className="text-2xl font-black text-white">אריאל כהן</h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(255,204,0,0.15)', color: '#ffcc00', border: '1px solid rgba(255,204,0,0.3)' }}>
                  <Star className="w-3 h-3 fill-current" />פרו-גיימר
                </span>
              </div>
              <p className="text-slate-400 text-sm">arikahen@email.com</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Zap className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-xs font-semibold text-neon-green">חסכת ₪{totalSaved.toLocaleString()} עד היום!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users,        label: 'קבוצות פעילות',  value: activeCount,                        color: '#ffa500' },
            { icon: TrendingDown, label: 'חיסכון כולל',    value: `₪${totalSaved.toLocaleString()}`, color: '#00ff88' },
            { icon: Package,      label: 'הושלמו',          value: successCount,                       color: '#00b4ff' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div key={i}
              className="rounded-2xl p-4 text-center"
              style={{ ...CARD, border: `1px solid ${color}22`, boxShadow: `0 0 12px ${color}15` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-tight">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Groups list */}
        <div>
          <h3 className="font-black text-white text-lg mb-3">כל הקבוצות שלי</h3>

          {allGroups.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={CARD}>
              <p className="text-5xl mb-3">🛒</p>
              <p className="font-bold text-slate-400">עדיין לא הצטרפת לאף קבוצה</p>
              <p className="text-sm text-slate-600 mt-1">חזור לדף הבית ומצא עסקאות שמתאימות לך</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allGroups.map((group, i) => {
                const cfg = STATUS[group.status] || STATUS.active
                const StatusIcon = cfg.icon
                const progress    = Math.round((group.currentBuyers / group.targetBuyers) * 100)
                const discountPct = Math.round(((group.originalPrice - group.currentPrice) / group.originalPrice) * 100)

                return (
                  <motion.div key={group.id || i}
                    className="rounded-2xl overflow-hidden"
                    style={CARD}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    whileHover={{ borderColor: `${cfg.color}33`, boxShadow: `0 0 20px ${cfg.color}12` }}>
                    <div className="p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                        style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
                        {group.emoji}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </div>
                          <p className="font-black text-white text-sm leading-tight truncate">{group.title}</p>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{group.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black neon-green">₪{group.currentPrice}</span>
                            <span className="text-xs text-slate-600 line-through">₪{group.originalPrice}</span>
                            <span className="text-xs font-bold text-red-400">-{discountPct}%</span>
                          </div>
                          <span className="text-xs text-slate-600">הצטרפת {group.joinedAt}</span>
                        </div>
                      </div>
                    </div>

                    {group.status === 'active' && (
                      <div className="px-4 pb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold text-amber-400">עוד {group.targetBuyers - group.currentBuyers} קונים להוזלה</span>
                          <span className="text-slate-500">{group.currentBuyers}/{group.targetBuyers} ({progress}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full progress-neon transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {group.status === 'shipped' && group.tracking && (
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)' }}>
                          <span className="text-xs font-mono text-neon-blue font-bold" dir="ltr">{group.tracking}</span>
                          <div className="flex items-center gap-1.5 text-xs text-neon-blue font-semibold">
                            <Truck className="w-3.5 h-3.5" />מספר מעקב
                          </div>
                        </div>
                      </div>
                    )}

                    {group.status === 'expired' && (
                      <div className="px-4 pb-4">
                        <div className="px-3 py-2 rounded-xl text-xs text-slate-500 text-right"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          הקבוצה לא הגיעה ליעד — לא בוצע חיוב. 💸
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
