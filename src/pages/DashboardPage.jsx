import { motion } from 'framer-motion'
import { ArrowRight, Users, Package, TrendingDown, Clock, CheckCircle, Truck, AlertCircle, Star, Zap } from 'lucide-react'
import { getCachedUser } from '../utils/user'

const STATUS = {
  active:  { label: 'ממתין לקונים',   icon: Clock,       color: '#ea580c', bg: '#fff7ed',   border: '#fed7aa' },
  shipped: { label: 'בדרך אליך! 🚚',  icon: Truck,       color: '#0284c7', bg: '#f0f9ff',   border: '#bae6fd' },
  success: { label: 'עסקה הושלמה! ✓', icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4',   border: '#bbf7d0' },
  expired: { label: 'פג תוקף (בוטל)', icon: AlertCircle, color: '#94a3b8', bg: '#f8fafc',   border: '#e2e8f0' },
}

export default function DashboardPage({ myGroups, onBack }) {
  const user         = getCachedUser()
  const allGroups    = myGroups
  const totalSaved   = allGroups.reduce((a, g) => a + (g.originalPrice - g.currentPrice), 0)
  const activeCount  = allGroups.filter(g => g.status === 'active').length
  const successCount = allGroups.filter(g => g.status === 'shipped' || g.status === 'success').length

  return (
    <div className="min-h-screen pb-10" style={{ background: '#f4fbf7' }} dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack}
            className="flex items-center gap-1.5 font-semibold transition-colors text-sm"
            style={{ color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a7a40'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
          <span className="font-black" style={{ color: '#0d3320' }}>הקבוצות שלי</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* User hero */}
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #155c34 0%, #1e7a40 100%)', boxShadow: '0 8px 30px rgba(21,92,52,0.2)' }}>
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,168,85,0.2), transparent 70%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              👤
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end mb-0.5">
                <h2 className="text-2xl font-black text-white">{user?.name || 'אורח'}</h2>
                {allGroups.length >= 3 && (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fde68a', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Star className="w-3 h-3 fill-current" />חוסך מנוסה
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{user?.email || ''}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Zap className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>חסכת ₪{totalSaved.toLocaleString()} עד היום!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users,        label: 'קבוצות פעילות', value: activeCount,                        color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
            { icon: TrendingDown, label: 'חיסכון כולל',   value: `₪${totalSaved.toLocaleString()}`, color: '#1a7a40', bg: '#f0fdf4', border: '#bbf7d0' },
            { icon: Package,      label: 'הושלמו',         value: successCount,                       color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
          ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
            <motion.div key={i}
              className="card-clean rounded-2xl p-4 text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: '#94a3b8' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Groups list */}
        <div>
          <h3 className="font-black text-lg mb-3" style={{ color: '#0d3320' }}>כל הקבוצות שלי</h3>

          {allGroups.length === 0 ? (
            <div className="card-clean rounded-2xl p-12 text-center">
              <p className="text-5xl mb-3">🛒</p>
              <p className="font-bold" style={{ color: '#64748b' }}>עדיין לא הצטרפת לאף קבוצה</p>
              <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>חזור לדף הבית ומצא עסקאות שמתאימות לך</p>
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
                    className="card-clean rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden"
                        style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
                        {group.image
                          ? <img src={group.image} alt={group.title} className="w-full h-full object-cover" />
                          : group.emoji}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </div>
                          <p className="font-black text-sm leading-tight truncate" style={{ color: '#0d3320' }}>{group.title}</p>
                        </div>
                        <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>{group.subtitle}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black" style={{ color: '#1a7a40' }}>₪{group.currentPrice}</span>
                            <span className="text-xs line-through" style={{ color: '#cbd5e1' }}>₪{group.originalPrice}</span>
                            <span className="text-xs font-bold text-red-500">-{discountPct}%</span>
                          </div>
                          <span className="text-xs" style={{ color: '#94a3b8' }}>הצטרפת {group.joinedAt}</span>
                        </div>
                      </div>
                    </div>

                    {group.status === 'active' && (
                      <div className="px-4 pb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold text-orange-500">עוד {group.targetBuyers - group.currentBuyers} קונים להוזלה</span>
                          <span style={{ color: '#94a3b8' }}>{group.currentBuyers}/{group.targetBuyers} ({progress}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                          <div className="h-full rounded-full progress-gold transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {group.status === 'shipped' && group.tracking && (
                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                          <span className="text-xs font-mono font-bold" style={{ color: '#0284c7' }} dir="ltr">{group.tracking}</span>
                          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#0284c7' }}>
                            <Truck className="w-3.5 h-3.5" />מספר מעקב
                          </div>
                        </div>
                      </div>
                    )}

                    {group.status === 'expired' && (
                      <div className="px-4 pb-4">
                        <div className="px-3 py-2 rounded-xl text-xs text-right"
                          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
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
