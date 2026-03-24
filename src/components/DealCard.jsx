import { useState, useEffect } from 'react'
import { Clock, Users, ChevronDown, TrendingDown, CheckCircle, Tag, Flame } from 'lucide-react'

export default function DealCard({ deal, timeLeft, isJoined, onJoin }) {
  const [progressWidth, setProgressWidth] = useState(0)
  const [showTiers, setShowTiers] = useState(false)

  const progress = Math.round((deal.currentBuyers / deal.targetBuyers) * 100)
  const remaining = deal.targetBuyers - deal.currentBuyers
  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)
  const isUrgent = timeLeft && timeLeft.startsWith('00:')
  const isAlmostThere = progress >= 70

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(Math.min(progress, 100)), 120)
    return () => clearTimeout(timer)
  }, [progress])

  // Parse countdown digits for segmented display
  const [hh, mm, ss] = (timeLeft || '00:00:00').split(':')

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1.5 group flex flex-col">

      {/* Product Image Area */}
      <div className={`relative h-52 bg-gradient-to-br ${deal.bgColor} flex items-center justify-center overflow-hidden shrink-0`}>
        {/* Subtle dot-grid pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '18px 18px'
          }}
        />

        {/* Soft light orb behind emoji */}
        <div className="absolute w-36 h-36 rounded-full bg-white/30 blur-2xl" />

        {/* Discount Badge — top right (RTL) */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>-{discountPct}%</span>
          </div>
        </div>

        {/* Hot indicator for nearly-there deals */}
        {isAlmostThere && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-orange-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>כמעט הגענו!</span>
            </div>
          </div>
        )}

        {/* Category Badge — top left (when no hot badge) */}
        {!isAlmostThere && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/85 backdrop-blur-sm text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
              {deal.category}
            </span>
          </div>
        )}

        {/* Status / named Badge — bottom right */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className={`${deal.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
            {deal.badge}
          </span>
        </div>

        {/* Large Emoji / Product Visual */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-8xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none leading-none">
            {deal.emoji}
          </span>
          <span className="mt-2 text-xs font-bold text-gray-600/70 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            {deal.subtitle}
          </span>
        </div>

        {/* Shine sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1" dir="rtl">

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(deal.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-gray-700">{deal.rating}</span>
          <span className="text-xs text-gray-400">({deal.reviews.toLocaleString()} ביקורות)</span>
        </div>

        {/* Title */}
        <h3 className="font-black text-gray-900 text-base leading-snug mb-3">{deal.title}</h3>

        {/* Price + Progress Block */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 mb-3 border border-green-100">
          {/* Price Row */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-green-600 shrink-0" />
              <span className="text-xs text-green-700 font-semibold">
                הבא: <span className="font-black text-green-800">₪{deal.nextPrice}</span>
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-xs text-gray-400 line-through">₪{deal.originalPrice}</span>
                <span className="text-2xl font-black text-green-600 leading-none">₪{deal.currentPrice}</span>
              </div>
              <p className="text-xs text-emerald-600 font-bold text-right">
                חיסכון: ₪{deal.savings}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className={`font-bold ${isAlmostThere ? 'text-green-700' : 'text-orange-600'}`}>
                {isAlmostThere ? `רק ${remaining} קונים נוספים!` : `${remaining} קונים להוזלה`}
              </span>
              <span className="text-gray-500 font-medium">{deal.currentBuyers}/{deal.targetBuyers}</span>
            </div>

            <div className="relative h-3.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute inset-y-0 right-0 rounded-full transition-all duration-1000 ease-out ${
                  isAlmostThere
                    ? 'bg-gradient-to-l from-green-500 to-emerald-400'
                    : 'bg-gradient-to-l from-green-400 to-teal-400'
                }`}
                style={{ width: `${progressWidth}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'shimmer 2s infinite' }} />
              </div>
              {[33, 66].map(pct => (
                <div key={pct} className="absolute top-0 bottom-0 w-px bg-white/50" style={{ right: `${pct}%` }} />
              ))}
            </div>

            <div className="flex justify-between items-center mt-1">
              <button
                className="text-green-600 hover:text-green-800 text-xs flex items-center gap-0.5 font-medium hover:underline"
                onClick={() => setShowTiers(!showTiers)}
              >
                <span>שלבי מחיר</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showTiers ? 'rotate-180' : ''}`} />
              </button>
              <span className={`text-xs font-bold ${progress >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                {progress}% הושלם
              </span>
            </div>
          </div>
        </div>

        {/* Price Tiers Dropdown */}
        {showTiers && (
          <div className="mb-3 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="px-3 py-2 bg-gray-50 text-xs font-bold text-gray-600 border-b border-gray-100 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-green-600" />
              <span>מפת הוזלות</span>
            </div>
            {deal.priceTiers.map((tier, i) => {
              const isActive = deal.currentBuyers >= tier.buyers &&
                (i === deal.priceTiers.length - 1 || deal.currentBuyers < deal.priceTiers[i + 1].buyers)
              const isPast = !isActive && deal.currentBuyers > tier.buyers
              return (
                <div
                  key={i}
                  className={`flex justify-between items-center px-3 py-2.5 text-sm border-b border-gray-100 last:border-0 ${
                    isActive ? 'bg-green-50' : isPast ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className={`font-black text-base ${isActive ? 'text-green-700' : isPast ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    ₪{tier.price}
                  </span>
                  <span className={`text-xs ${isPast ? 'text-gray-400' : 'text-gray-500'}`}>{tier.buyers}+ קונים</span>
                  {isActive && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">פעיל ✓</span>}
                  {isPast && <span className="text-xs bg-gray-300 text-gray-500 px-2 py-0.5 rounded-full">הושג</span>}
                  {!isActive && !isPast && <span className="text-xs text-gray-400">בקרוב</span>}
                </div>
              )
            })}
          </div>
        )}

        {/* Countdown Timer — segmented digital style */}
        <div className={`rounded-xl px-3 py-2 mb-3 flex items-center justify-center gap-2 ${
          isUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-900 border border-gray-800'
        }`}>
          <Clock className={`w-3.5 h-3.5 shrink-0 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-green-400'}`} />
          <div className="flex items-center gap-1" dir="ltr">
            {[hh, mm, ss].map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className={`font-mono font-black text-lg tracking-wider px-1.5 py-0.5 rounded-md ${
                  isUrgent ? 'text-red-600 bg-red-100' : 'text-green-400 bg-gray-800'
                }`}>
                  {seg}
                </span>
                {i < 2 && <span className={`font-black text-lg leading-none mb-1 ${isUrgent ? 'text-red-400' : 'text-gray-500'}`}>:</span>}
              </span>
            ))}
          </div>
          <span className={`text-xs font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>נותרו</span>
        </div>

        {/* Participants Row */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center" style={{ direction: 'ltr' }}>
            {['🧑','👩','👨','🙍'].map((emoji, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-green-300 to-emerald-500 border-2 border-white flex items-center justify-center text-xs -ml-1 first:ml-0 shadow-sm"
              >
                {emoji}
              </div>
            ))}
            {deal.currentBuyers > 4 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 -ml-1 shadow-sm">
                +{deal.currentBuyers - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
            <Users className="w-3.5 h-3.5 text-green-500" />
            <span>{deal.currentBuyers} כבר הצטרפו</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          {isJoined ? (
            <div className="w-full bg-green-50 border-2 border-green-400 text-green-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>הצטרפת לקבוצה!</span>
            </div>
          ) : (
            <button
              onClick={() => onJoin(deal)}
              className="w-full bg-gradient-to-l from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 active:scale-95 text-white py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-green-300 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>הצטרף לקבוצה</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
