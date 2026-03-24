import { TrendingDown, Users, Package, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const STATS = [
  { icon: Users,        label: 'קונים פעילים',   value: '52,840', color: '#00b4ff',  glow: 'rgba(0,180,255,0.2)'  },
  { icon: TrendingDown, label: 'ממוצע חיסכון',   value: '₪347',  color: '#00ff88',  glow: 'rgba(0,255,136,0.2)'  },
  { icon: Package,      label: 'עסקאות הושלמו', value: '12,450', color: '#7b2ff7',  glow: 'rgba(123,47,247,0.2)' },
  { icon: Star,         label: 'דירוג ממוצע',   value: '4.9 ★', color: '#ffcc00',  glow: 'rgba(255,204,0,0.2)'  },
]

export default function StatsBar() {
  return (
    <div className="border-b py-3"
      style={{
        background: 'rgba(5,8,16,0.9)',
        borderColor: 'rgba(0,255,136,0.08)',
      }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 justify-center flex-wrap">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2.5 shrink-0 px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${stat.color}22`,
                boxShadow: `0 0 12px ${stat.glow}`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="text-right">
                <div className="font-black text-base leading-tight" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 leading-tight">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
