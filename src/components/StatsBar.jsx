import { TrendingDown, Users, Package, Star } from 'lucide-react'

const stats = [
  { icon: Users,       label: 'קונים פעילים',    value: '52,840', color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { icon: TrendingDown, label: 'ממוצע חיסכון',    value: '₪347',  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  { icon: Package,     label: 'עסקאות הושלמו',   value: '12,450', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { icon: Star,        label: 'דירוג ממוצע',     value: '4.9 ★', color: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-100' },
]

export default function StatsBar() {
  return (
    <div className="bg-white border-b border-gray-100 py-3" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 justify-center flex-wrap">
          {stats.map((stat, i) => (
            <div key={i} className={`flex items-center gap-2.5 shrink-0 px-3 py-2 rounded-xl border ${stat.border} ${stat.bg}`}>
              <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className={`font-black text-base leading-tight ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 leading-tight">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
