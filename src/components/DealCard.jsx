import { useState, useEffect, useRef } from 'react'
import { Clock, Users, ChevronDown, Star, TrendingDown, CheckCircle } from 'lucide-react'

export default function DealCard({ deal, timeLeft, isJoined, onJoin }) {
  const [progressWidth, setProgressWidth] = useState(0)
  const [showTiers, setShowTiers] = useState(false)
  const barRef = useRef(null)

  const progress = Math.round((deal.currentBuyers / deal.targetBuyers) * 100)
  const remaining = deal.targetBuyers - deal.currentBuyers
  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)
  const isUrgent = timeLeft && timeLeft.startsWith('00:')

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(Math.min(progress, 100)), 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1 group">
      {/* Image Placeholder */}
      <div className={`relative h-44 bg-gradient-to-br ${deal.bgColor} flex items-center justify-center overflow-hidden`}>
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
          -{discountPct}%
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
          {deal.category}
        </div>

        {/* Hot Badge */}
        <div className={`absolute bottom-3 right-3 ${deal.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md`}>
          {deal.badge}
        </div>

        {/* Emoji / Product Visual */}
        <div className="flex flex-col items-center">
          <span className="text-7xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
            {deal.emoji}
          </span>
        </div>

        {/* Shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
      </div>

      {/* Card Body */}
      <div className="p-4" dir="rtl">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-amber-400 text-xs">{'★'.repeat(Math.round(deal.rating))}</span>
          <span className="text-xs text-gray-500 font-medium">{deal.rating}</span>
          <span className="text-xs text-gray-400">({deal.reviews.toLocaleString()})</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-base leading-tight mb-0.5">{deal.title}</h3>
        <p className="text-xs text-gray-500 mb-3">{deal.subtitle}</p>

        {/* Price Section */}
        <div className="bg-gradient-to-l from-green-50 to-emerald-50 rounded-xl p-3 mb-3 border border-green-100">
          <div className="flex items-end justify-between mb-2">
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-green-600">₪{deal.currentPrice}</span>
                <span className="text-xs text-gray-400 line-through">₪{deal.originalPrice}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <TrendingDown className="w-3 h-3" />
                <span>חסכת ₪{deal.savings} | המחיר הבא: ₪{deal.nextPrice}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="font-semibold text-green-700">{remaining} נותרו להוזלה!</span>
              <span>{deal.currentBuyers}/{deal.targetBuyers} קונים</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              >
                {/* Shimmer on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
              </div>
              {/* Milestone markers */}
              {[25, 50, 75].map(pct => (
                <div
                  key={pct}
                  className="absolute top-0 bottom-0 w-px bg-white/60"
                  style={{ right: `${pct}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-0.5">
              <span className={`font-bold ${progress >= 50 ? 'text-green-600' : 'text-gray-400'}`}>{progress}%</span>
              <button
                className="text-green-600 hover:underline text-xs flex items-center gap-0.5"
                onClick={() => setShowTiers(!showTiers)}
              >
                <span>שלבי מחיר</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showTiers ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Price Tiers Dropdown */}
        {showTiers && (
          <div className="mb-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 animate-[fadeIn_0.2s_ease]">
            <div className="px-3 py-2 bg-gray-100 text-xs font-bold text-gray-600 border-b border-gray-200">
              שלבי הוזלה
            </div>
            {deal.priceTiers.map((tier, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-3 py-2 text-sm border-b border-gray-100 last:border-0 ${
                  deal.currentBuyers >= tier.buyers && (i === deal.priceTiers.length - 1 || deal.currentBuyers < deal.priceTiers[i + 1].buyers)
                    ? 'bg-green-50 font-bold text-green-700'
                    : deal.currentBuyers >= tier.buyers
                    ? 'text-gray-400 line-through'
                    : 'text-gray-600'
                }`}
              >
                <span className="font-black text-base">₪{tier.price}</span>
                <span className="text-xs">{tier.buyers}+ קונים</span>
                {deal.currentBuyers >= tier.buyers && (i === deal.priceTiers.length - 1 || deal.currentBuyers < deal.priceTiers[i + 1].buyers) && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">פעיל</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Countdown Timer */}
        <div className={`flex items-center gap-2 justify-center mb-3 ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
          <div className={`flex items-center gap-1.5 ${isUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'} rounded-xl px-3 py-2 w-full justify-center`}>
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
            <span className={`font-black text-lg tracking-wider font-mono ${isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
              {timeLeft}
            </span>
            <span className="text-xs text-gray-500">נותרו</span>
          </div>
        </div>

        {/* Participants Preview */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5 text-green-500" />
            <span>{deal.currentBuyers} כבר הצטרפו</span>
          </div>
          {/* Avatar stack */}
          <div className="flex -space-x-1 flex-row-reverse">
            {['🧑', '👩', '👨', '🙍'].slice(0, 4).map((emoji, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-green-300 to-emerald-400 border-2 border-white flex items-center justify-center text-xs">
                {emoji}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
              +{deal.currentBuyers - 4}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {isJoined ? (
          <div className="w-full bg-green-50 border-2 border-green-400 text-green-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>הצטרפת לקבוצה!</span>
          </div>
        ) : (
          <button
            onClick={() => onJoin(deal)}
            className="w-full bg-gradient-to-l from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-green-200 hover:shadow-green-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>הצטרף לקבוצה</span>
          </button>
        )}
      </div>
    </div>
  )
}
