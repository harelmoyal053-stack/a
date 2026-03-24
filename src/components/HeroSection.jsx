import { TrendingDown, Users, Shield, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-l from-green-700 via-green-600 to-emerald-600 text-white py-10 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5"></div>
        <div className="absolute top-5 left-1/3 w-32 h-32 rounded-full bg-white/5"></div>
        {/* Floating icons */}
        <div className="absolute top-4 left-10 text-4xl opacity-20 animate-bounce">💰</div>
        <div className="absolute bottom-4 right-20 text-3xl opacity-20" style={{animation: 'bounce 2s infinite 0.5s'}}>🛒</div>
        <div className="absolute top-10 left-1/2 text-2xl opacity-15" style={{animation: 'bounce 2s infinite 1s'}}>⭐</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span>קנייה קבוצתית חכמה - כמה שיותר, כך זול יותר!</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">
          הצטרף לקבוצה,{' '}
          <span className="text-yellow-300">חסוך כסף</span>
        </h1>
        <p className="text-green-100 text-lg md:text-xl max-w-xl mx-auto mb-8">
          כשיותר אנשים מצטרפים — המחיר יורד לכולם. DropPrice מחברת קונים יחד לעסקאות שאי אפשר לסרב להן.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            <TrendingDown className="w-4 h-4 text-yellow-300" />
            <span>מחירים יורדים בזמן אמת</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            <Users className="w-4 h-4 text-yellow-300" />
            <span>קהילה של 50,000+ קונים</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            <Shield className="w-4 h-4 text-yellow-300" />
            <span>אחריות מלאה על כל עסקה</span>
          </div>
        </div>
      </div>
    </div>
  )
}
