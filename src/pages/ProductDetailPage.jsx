import { useState } from 'react'
import {
  ArrowRight, Users, Clock, TrendingDown, Shield, Truck,
  RotateCcw, ChevronLeft, ChevronRight, Tag, Zap, CheckCircle
} from 'lucide-react'

const RECENT_JOINERS = [
  { name: 'מיכל כ.', time: 'לפני 2 דקות', emoji: '👩' },
  { name: 'דניאל ל.', time: 'לפני 5 דקות', emoji: '🧑' },
  { name: 'שרה מ.', time: 'לפני 12 דקות', emoji: '👩' },
  { name: 'אביב ר.', time: 'לפני 18 דקות', emoji: '👨' },
  { name: 'נועה ג.', time: 'לפני 25 דקות', emoji: '👩' },
  { name: 'יוסי ב.', time: 'לפני 31 דקות', emoji: '🧔' },
]

const getSlides = (deal) => [
  { bgColor: deal.bgColor, emoji: deal.emoji, label: 'תמונה ראשית' },
  { bgColor: deal.bgColor, emoji: deal.emoji, label: 'זווית נוספת', scale: 'scale-75' },
  { bgColor: 'from-slate-50 to-slate-100', emoji: '📦', label: 'אריזה' },
]

export default function ProductDetailPage({ deal, timeLeft, isJoined, onJoin, onBack }) {
  const [slide, setSlide] = useState(0)
  const [showAllJoiners, setShowAllJoiners] = useState(false)

  const slides = getSlides(deal)
  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)
  const progress = Math.round((deal.currentBuyers / deal.targetBuyers) * 100)
  const remaining = deal.targetBuyers - deal.currentBuyers
  const isUrgent = timeLeft && timeLeft.startsWith('00:')
  const [hh, mm, ss] = (timeLeft || '00:00:00').split(':')

  const prevSlide = () => setSlide(i => (i - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlide(i => (i + 1) % slides.length)

  const joiners = showAllJoiners ? RECENT_JOINERS : RECENT_JOINERS.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 pb-28" dir="rtl">
      {/* Top nav bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 font-semibold transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm">חזרה</span>
          </button>
          <p className="text-sm font-bold text-gray-700 truncate max-w-[200px] sm:max-w-xs">{deal.title}</p>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Image Slider ── */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${slides[slide].bgColor} mb-6 shadow-lg`} style={{ height: 320 }}>
          <div className="absolute inset-0 opacity-15"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {/* Badges */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Tag className="w-4 h-4" />-{discountPct}%
            </div>
          </div>
          <div className="absolute top-4 left-4 z-10">
            <span className={`${deal.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}>{deal.badge}</span>
          </div>

          {/* Slide content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className={`text-[100px] leading-none drop-shadow-xl select-none transition-transform duration-300 ${slides[slide].scale || ''}`}>
                {slides[slide].emoji}
              </span>
            </div>
            <span className="mt-4 text-xs font-semibold text-gray-600/70 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full">
              {slides[slide].label}
            </span>
          </div>

          {/* Navigation arrows */}
          <button onClick={prevSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={nextSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className={`rounded-full transition-all duration-200 ${i === slide ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'}`} />
            ))}
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-1">{deal.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{deal.subtitle}</p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= Math.round(deal.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="font-bold text-sm text-gray-700">{deal.rating}</span>
                <span className="text-sm text-gray-400">({deal.reviews.toLocaleString()} ביקורות)</span>
              </div>
            </div>

            {/* Price tiers breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <h3 className="font-black text-gray-900 text-lg">שלבי הוזלת מחיר</h3>
              </div>

              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute right-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0" />

                <div className="space-y-4 relative z-10">
                  {deal.priceTiers.map((tier, i) => {
                    const isActive = deal.currentBuyers >= tier.buyers &&
                      (i === deal.priceTiers.length - 1 || deal.currentBuyers < deal.priceTiers[i + 1].buyers)
                    const isPast = !isActive && deal.currentBuyers >= tier.buyers
                    const isNext = !isActive && !isPast && i > 0 &&
                      deal.currentBuyers < tier.buyers &&
                      deal.currentBuyers >= deal.priceTiers[i - 1].buyers
                    const buyersNeeded = tier.buyers - deal.currentBuyers
                    const priceDrop = i > 0 ? deal.priceTiers[i - 1].price - tier.price : 0

                    return (
                      <div key={i} className={`flex gap-4 p-4 rounded-xl border-2 transition-all ${
                        isActive ? 'border-green-400 bg-green-50' :
                        isNext  ? 'border-orange-300 bg-orange-50' :
                        isPast  ? 'border-gray-200 bg-gray-50 opacity-55' :
                                  'border-gray-200 bg-white'
                      }`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${
                          isActive ? 'bg-green-500 text-white' :
                          isNext  ? 'bg-orange-400 text-white' :
                          isPast  ? 'bg-gray-300 text-white' :
                                    'bg-gray-100 text-gray-400'
                        }`}>
                          {isPast ? '✓' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className={`font-black text-2xl leading-none ${
                              isActive ? 'text-green-700' : isPast ? 'text-gray-400 line-through' : 'text-gray-800'
                            }`}>₪{tier.price}</span>
                            <div className="flex items-center gap-2">
                              {priceDrop > 0 && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                                  -₪{priceDrop}
                                </span>
                              )}
                              {isActive && <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">פעיל ✓</span>}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {tier.buyers === 0 ? 'מחיר רגיל (ללא קבוצה)' : `${tier.buyers}+ קונים בקבוצה`}
                          </p>
                          {isNext && (
                            <p className="text-sm font-bold text-orange-600 mt-1.5 flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5" />
                              עוד {buyersNeeded} קונים להוזלה של ₪{priceDrop}!
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent joiners */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <button className="text-sm text-green-600 font-semibold hover:underline"
                  onClick={() => setShowAllJoiners(v => !v)}>
                  {showAllJoiners ? 'הצג פחות' : 'הצג הכל'}
                </button>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-900 text-lg">הצטרפו לאחרונה</h3>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <div className="space-y-3">
                {joiners.map((j, i) => (
                  <div key={i} className="flex items-center gap-3 justify-end">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">{j.name}</p>
                      <p className="text-xs text-gray-400">{j.time} · הצטרף/ה לקבוצה</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-300 to-emerald-500 flex items-center justify-center text-lg border-2 border-white shadow">
                      {j.emoji}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  <span className="font-black text-green-600">{deal.currentBuyers}</span> אנשים הצטרפו לקבוצה זו עד כה
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: 'תשלום מאובטח', sub: 'הצפנת SSL' },
                { icon: Truck, label: 'משלוח חינם', sub: 'לכל הארץ' },
                { icon: RotateCcw, label: 'ביטול חינם', sub: 'עד סגירת עסקה' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                  <Icon className="w-5 h-5 text-green-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: sticky price card (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-20 bg-white rounded-2xl p-5 shadow-md border border-gray-100 space-y-4">
              {/* Price */}
              <div className="text-right">
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-base text-gray-400 line-through">₪{deal.originalPrice}</span>
                  <span className="text-4xl font-black text-green-600">₪{deal.currentPrice}</span>
                </div>
                <p className="text-sm text-emerald-600 font-bold mt-0.5">חסכון: ₪{deal.savings} ({discountPct}% הנחה)</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{progress}% הושלם</span>
                  <span>{deal.currentBuyers}/{deal.targetBuyers} קונים</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-l from-green-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-orange-600 font-semibold mt-1.5">עוד {remaining} קונים להוזלה הבאה</p>
              </div>

              {/* Timer */}
              <div className={`rounded-xl px-3 py-2.5 flex items-center justify-center gap-2 ${isUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-900'}`}>
                <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-green-400'}`} />
                <div className="flex items-center gap-1" dir="ltr">
                  {[hh, mm, ss].map((seg, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className={`font-mono font-black text-lg px-1.5 py-0.5 rounded-md ${isUrgent ? 'text-red-600 bg-red-100' : 'text-green-400 bg-gray-800'}`}>{seg}</span>
                      {i < 2 && <span className={`font-black text-lg leading-none mb-1 ${isUrgent ? 'text-red-400' : 'text-gray-500'}`}>:</span>}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-semibold ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}>נותרו</span>
              </div>

              {/* CTA */}
              {isJoined ? (
                <div className="w-full bg-green-50 border-2 border-green-400 text-green-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  הצטרפת לקבוצה!
                </div>
              ) : (
                <button onClick={() => onJoin(deal)}
                  className="w-full bg-gradient-to-l from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3.5 rounded-xl font-black text-base shadow-lg shadow-green-200 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  הצטרף לקבוצה עכשיו
                </button>
              )}

              <p className="text-center text-xs text-gray-400">לא יחויב עכשיו · ביטול חינם</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar (mobile) ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 px-4 py-3 lg:hidden shadow-2xl">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <div className="flex-1 text-right leading-tight">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-xs text-gray-400 line-through">₪{deal.originalPrice}</span>
              <span className="text-2xl font-black text-green-600">₪{deal.currentPrice}</span>
            </div>
            <p className="text-xs text-orange-600 font-semibold">עוד {remaining} קונים להוזלה</p>
          </div>
          {isJoined ? (
            <div className="flex-1 bg-green-50 border-2 border-green-400 text-green-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />הצטרפת ✓
            </div>
          ) : (
            <button onClick={() => onJoin(deal)}
              className="flex-1 bg-gradient-to-l from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-black text-sm shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              הצטרף לקבוצה עכשיו
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
