import { TrendingDown, Users, Shield, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-l from-green-800 via-green-600 to-emerald-500 text-white py-12 px-4 overflow-hidden" dir="rtl">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-green-300/10 blur-2xl" />
        <span className="absolute top-5 left-10 text-4xl opacity-20 animate-bounce select-none">💰</span>
        <span className="absolute bottom-6 right-16 text-3xl opacity-20 select-none" style={{ animation: 'bounce 2.2s infinite 0.6s' }}>🛒</span>
        <span className="absolute top-8 left-1/3 text-2xl opacity-15 select-none" style={{ animation: 'bounce 2s infinite 1.1s' }}>⭐</span>
        <span className="absolute bottom-10 left-1/4 text-xl opacity-10 select-none" style={{ animation: 'bounce 2.5s infinite 0.3s' }}>🏷️</span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-5 text-sm font-semibold">
          <Zap className="w-4 h-4 text-yellow-300 shrink-0" />
          <span>קנייה קבוצתית חכמה — כמה שיותר, כך זול יותר!</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
          הצטרף לקבוצה,{' '}
          <span className="text-yellow-300 drop-shadow-sm">חסוך כסף</span>
        </h1>
        <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          כשיותר אנשים מצטרפים — המחיר יורד לכולם.{' '}
          <span className="font-bold text-white">DropPrice</span> מחברת קונים יחד לעסקאות שאי אפשר לסרב להן.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/25 transition-colors">
            <TrendingDown className="w-4 h-4 text-yellow-300" />
            <span>מחירים יורדים בזמן אמת</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/25 transition-colors">
            <Users className="w-4 h-4 text-yellow-300" />
            <span>קהילה של 52,000+ קונים</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/25 transition-colors">
            <Shield className="w-4 h-4 text-yellow-300" />
            <span>אחריות מלאה על כל עסקה</span>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 active:bg-green-100 font-black px-7 py-3 rounded-2xl shadow-xl transition-all duration-200 text-base"
          >
            <span>גלה עסקאות עכשיו</span>
            <span className="text-base">↓</span>
          </button>
          <p className="text-green-100 text-sm">
            הצטרפו כבר <strong className="text-white">52,840</strong> קונים מרוצים
          </p>
        </div>
      </div>
    </div>
  )
}
