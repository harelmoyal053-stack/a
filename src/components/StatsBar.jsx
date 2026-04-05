import { TrendingDown, Users, Package, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const STATS = [
  { icon: Users,        label: 'קונים פעילים',   value: '52,840', color: '#155c34' },
  { icon: TrendingDown, label: 'ממוצע חיסכון',   value: '₪347K', color: '#22a855' },
  { icon: Package,      label: 'עסקאות הושלמו', value: '12,450', color: '#155c34' },
  { icon: Star,         label: 'דירוג ממוצע',   value: '4.9 ★', color: '#22a855' },
]

export default function StatsBar() {
  return (
    <div className="border-b py-4" style={{ background: '#fff', borderColor: '#e2e8f0' }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-1 justify-center flex-wrap">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 shrink-0 px-5 py-2.5 rounded-xl"
              style={{ background: '#f4fbf7', border: '1px solid #e2e8f0' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: stat.color === '#22a855' ? 'rgba(34,168,85,0.1)' : 'rgba(21,92,52,0.08)' }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="text-right">
                <div className="font-black text-base leading-tight" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs leading-tight" style={{ color: '#94a3b8' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
