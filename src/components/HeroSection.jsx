import { motion } from 'framer-motion'
import { TrendingDown, Users, Shield, Zap, Flame } from 'lucide-react'

const PILLS = [
  { icon: TrendingDown, label: 'מחירים יורדים בזמן אמת', color: 'text-neon-green' },
  { icon: Users,        label: 'קהילה של 52,000+ קונים',  color: 'text-neon-blue' },
  { icon: Shield,       label: 'אחריות מלאה על כל עסקה', color: 'text-neon-green' },
]

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden py-14 px-4" dir="rtl"
      style={{ background: 'linear-gradient(160deg, #020b18 0%, #050810 40%, #030a14 100%)' }}>

      {/* Circuit grid */}
      <div className="absolute inset-0 circuit-bg opacity-60" />

      {/* Glow orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,47,247,0.05) 0%, transparent 70%)' }} />

      {/* Floating decorative emojis */}
      <span className="absolute top-6 left-10 text-4xl opacity-20 animate-float select-none" style={{ animationDelay: '0s' }}>💰</span>
      <span className="absolute bottom-8 right-16 text-3xl opacity-15 animate-float select-none" style={{ animationDelay: '0.8s' }}>🛒</span>
      <span className="absolute top-10 left-1/3 text-2xl opacity-10 animate-float select-none" style={{ animationDelay: '1.4s' }}>⚡</span>
      <span className="absolute bottom-12 left-1/4 text-xl opacity-10 animate-float select-none" style={{ animationDelay: '0.4s' }}>🏷️</span>

      <div className="max-w-7xl mx-auto relative z-10 text-center">

        {/* Pill tag */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-sm font-semibold"
          style={{
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.3)',
            color: '#00ff88',
            boxShadow: '0 0 20px rgba(0,255,136,0.1)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="fire-icon text-base">🔥</span>
          <span>טירוף המחירים — כמה שיותר קונים, כך זול יותר!</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-white">הצטרף לקבוצה,</span>{' '}
          <br className="sm:hidden" />
          <span className="gradient-text">חסוך בטירוף</span>
        </motion.h1>

        <motion.p
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          כשיותר אנשים מצטרפים — המחיר יורד לכולם.{' '}
          <span className="font-black" style={{ color: '#00ff88' }}>DropPrice</span> מחברת קונים לעסקאות שאי אפשר לסרב להן.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {PILLS.map(({ icon: Icon, label, color }, i) => (
            <div key={i}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-default"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-slate-300">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="btn-neon flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-base"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Flame className="w-5 h-5" />
            <span>גלה עסקאות עכשיו</span>
          </motion.button>
          <p className="text-slate-500 text-sm">
            הצטרפו כבר <strong className="text-white">52,840</strong> קונים מרוצים
          </p>
        </motion.div>
      </div>
    </div>
  )
}
