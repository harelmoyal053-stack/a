import { TrendingDown, Users, Package, Star } from 'lucide-react'

const stats = [
  { icon: Users, label: 'קונים פעילים', value: '52,840', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: TrendingDown, label: 'ממוצע חיסכון', value: '₪347', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Package, label: 'עסקאות הושלמו', value: '12,450', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Star, label: 'דירוג ממוצע', value: '4.9 ⭐', color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function StatsBar() {
  return (
    <div className="bg-white border-b border-gray-100 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-1 justify-center flex-wrap">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5 shrink-0">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className={`font-black text-base leading-tight ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 leading-tight">{stat.label}</div>
              </div>
              {i < stats.length - 1 && <div className="w-px h-8 bg-gray-100 mr-2 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
