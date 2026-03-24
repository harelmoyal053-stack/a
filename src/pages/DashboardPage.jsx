import { ArrowRight, Users, Package, TrendingDown, Clock, CheckCircle, Truck, AlertCircle, Star } from 'lucide-react'

const MOCK_GROUPS = [
  {
    id: 'm1', title: 'מזגן אינוורטר 1.5 כ״ס', subtitle: 'מותג Samsung | א-קלאס', emoji: '❄️',
    bgColor: 'from-sky-50 to-sky-100', currentPrice: 1290, originalPrice: 2100,
    currentBuyers: 48, targetBuyers: 50, joinedAt: '22 במרץ 2026',
    status: 'active', timeLeft: '01:20:00',
  },
  {
    id: 'm2', title: 'אוזניות Sony WH-1000XM5', subtitle: 'ביטול רעשים פעיל', emoji: '🎧',
    bgColor: 'from-zinc-50 to-zinc-100', currentPrice: 899, originalPrice: 1499,
    currentBuyers: 30, targetBuyers: 30, joinedAt: '18 במרץ 2026',
    status: 'shipped', tracking: 'IL1234567890',
  },
  {
    id: 'm3', title: 'סל אורגני 5 ק״ג', subtitle: 'ירקות ופירות | ישיר מהחקלאי', emoji: '🥦',
    bgColor: 'from-green-50 to-green-100', currentPrice: 55, originalPrice: 90,
    currentBuyers: 12, targetBuyers: 20, joinedAt: '20 במרץ 2026',
    status: 'expired',
  },
]

const STATUS_CONFIG = {
  active:  { label: 'ממתין לקונים',      color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: Clock,        dot: 'bg-amber-400' },
  shipped: { label: 'בדרך אליך!',        color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: Truck,        dot: 'bg-blue-500 animate-pulse' },
  success: { label: 'עסקה הושלמה!',      color: 'bg-green-100 text-green-700 border-green-200',    icon: CheckCircle,  dot: 'bg-green-500' },
  expired: { label: 'פג תוקף (בוטל)',    color: 'bg-gray-100 text-gray-500 border-gray-200',       icon: AlertCircle,  dot: 'bg-gray-400' },
}

export default function DashboardPage({ myGroups, onBack }) {
  const allGroups = [...myGroups, ...MOCK_GROUPS]

  const totalSaved = allGroups.reduce((acc, g) => acc + (g.originalPrice - g.currentPrice), 0)
  const activeCount = allGroups.filter(g => g.status === 'active').length
  const successCount = allGroups.filter(g => g.status === 'shipped' || g.status === 'success').length

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 font-semibold transition-colors text-sm">
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
          <span className="font-black text-gray-800">הקבוצות שלי</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* User hero */}
        <div className="bg-gradient-to-l from-green-700 to-emerald-500 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner">👤</div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2 justify-end mb-0.5">
                <h2 className="text-2xl font-black">אריאל כהן</h2>
                <span className="bg-yellow-400/30 text-yellow-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-400/40 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />חבר פרימיום
                </span>
              </div>
              <p className="text-green-200 text-sm">arikahen@email.com</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: 'קבוצות פעילות', value: activeCount, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
            { icon: TrendingDown, label: 'חסכון כולל', value: `₪${totalSaved.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
            { icon: Package, label: 'עסקאות הושלמו', value: successCount, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          ].map(({ icon: Icon, label, value, color, bg }, i) => (
            <div key={i} className={`${bg} border rounded-2xl p-4 text-center`}>
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Groups list */}
        <div>
          <h3 className="font-black text-gray-800 text-lg mb-3 text-right">כל הקבוצות שלי</h3>

          {allGroups.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-5xl mb-3">🛒</p>
              <p className="font-bold text-gray-600">עדיין לא הצטרפת לאף קבוצה</p>
              <p className="text-sm text-gray-400 mt-1">חזור לדף הבית ומצא עסקאות שמתאימות לך</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allGroups.map((group, i) => {
                const cfg = STATUS_CONFIG[group.status] || STATUS_CONFIG.active
                const StatusIcon = cfg.icon
                const progress = Math.round((group.currentBuyers / group.targetBuyers) * 100)
                const discountPct = Math.round(((group.originalPrice - group.currentPrice) / group.originalPrice) * 100)

                return (
                  <div key={group.id || i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 flex gap-4">
                      {/* Product thumb */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${group.bgColor} flex items-center justify-center text-3xl shrink-0 shadow-sm`}>
                        {group.emoji}
                      </div>

                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          {/* Status badge */}
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </div>
                          <p className="font-black text-gray-800 text-sm leading-tight truncate">{group.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{group.subtitle}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-green-600">₪{group.currentPrice}</span>
                            <span className="text-xs text-gray-400 line-through">₪{group.originalPrice}</span>
                            <span className="text-xs font-bold text-red-500">-{discountPct}%</span>
                          </div>
                          <span className="text-xs text-gray-400">הצטרפת {group.joinedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar for active deals */}
                    {group.status === 'active' && (
                      <div className="px-4 pb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                          <span className="font-semibold text-orange-600">
                            עוד {group.targetBuyers - group.currentBuyers} קונים להוזלה
                          </span>
                          <span>{group.currentBuyers}/{group.targetBuyers} קונים ({progress}%)</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-l from-green-500 to-emerald-400 transition-all duration-700"
                            style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Shipped tracking */}
                    {group.status === 'shipped' && group.tracking && (
                      <div className="px-4 pb-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center justify-between">
                          <span className="text-xs font-mono text-blue-600 font-bold" dir="ltr">{group.tracking}</span>
                          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                            <Truck className="w-3.5 h-3.5" />
                            מספר מעקב
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expired notice */}
                    {group.status === 'expired' && (
                      <div className="px-4 pb-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 text-right">
                          הקבוצה לא הגיעה ליעד — לא בוצע חיוב. 💸
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
