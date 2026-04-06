import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Users, Clock, TrendingDown, Shield, Truck,
  RotateCcw, ChevronLeft, ChevronRight, Tag, Zap, CheckCircle, Share2,
  Calculator, Minus, Plus
} from 'lucide-react'

import ShareMenu    from '../components/ShareMenu'
import ActivityFeed from '../components/ActivityFeed'
import VipBadge     from '../components/VipBadge'
import { getCachedUser } from '../utils/user'

const getSlides = (deal) => [
  { emoji: deal.emoji, label: 'תמונה ראשית' },
  { emoji: deal.emoji, label: 'זווית נוספת', scale: 'scale-75' },
  { emoji: '📦', label: 'אריזה' },
]

// ── Savings Calculator ────────────────────────────────────────────────────────
function SavingsCalculator({ deal }) {
  const [qty, setQty] = useState(1)

  const tiers = deal.priceTiers || []
  const currentTier = [...tiers].reverse().find(t => deal.currentBuyers >= t.buyers) || tiers[0]
  const nextTier    = tiers.find(t => t.buyers > deal.currentBuyers)
  const maxQty      = 10

  const totalNow      = (currentTier?.price ?? deal.currentPrice) * qty
  const totalNext     = nextTier ? nextTier.price * qty : null
  const totalOriginal = deal.originalPrice * qty
  const savedNow      = totalOriginal - totalNow

  return (
    <div className="card-clean rounded-2xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #f1f5f9', background: '#f4fbf7' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: '#94a3b8' }}>כמה תחסוך?</span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22a855' }} />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-black text-base" style={{ color: '#0d3320' }}>מחשבון חיסכון</h3>
          <Calculator className="w-4 h-4" style={{ color: '#22a855' }} />
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all disabled:opacity-30"
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
              whileTap={{ scale: 0.9 }}>
              <Minus className="w-4 h-4" style={{ color: '#475569' }} />
            </motion.button>
            <span className="w-10 text-center text-2xl font-black" style={{ color: '#0d3320' }}>{qty}</span>
            <motion.button
              onClick={() => setQty(q => Math.min(maxQty, q + 1))}
              disabled={qty >= maxQty}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all disabled:opacity-30"
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
              whileTap={{ scale: 0.9 }}>
              <Plus className="w-4 h-4" style={{ color: '#475569' }} />
            </motion.button>
          </div>
          <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>כמות יחידות</span>
        </div>

        <div className="space-y-2">
          {tiers.map((tier, i) => {
            const isCurrentTier = deal.currentBuyers >= tier.buyers &&
              (i === tiers.length - 1 || deal.currentBuyers < tiers[i + 1].buyers)
            const isNextTier = nextTier && tier.buyers === nextTier.buyers
            const total = tier.price * qty
            const saved = (deal.originalPrice - tier.price) * qty
            const pct   = Math.round(((deal.originalPrice - tier.price) / deal.originalPrice) * 100)

            return (
              <motion.div key={i}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={
                  isCurrentTier ? { background: '#f0fdf4', border: '1px solid #bbf7d0' } :
                  isNextTier    ? { background: '#fff7ed', border: '1px solid #fed7aa' } :
                                  { background: '#f8fafc', border: '1px solid #f1f5f9' }
                }
                animate={{ scale: isCurrentTier ? 1.01 : 1 }}>
                <div className="flex items-center gap-2">
                  {isCurrentTier && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: '#f0fdf4', color: '#1a7a40', border: '1px solid #bbf7d0' }}>פעיל ✓</span>
                  )}
                  {isNextTier && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>הבא</span>
                  )}
                  <span className="text-sm font-bold"
                    style={{ color: isCurrentTier ? '#1a7a40' : '#ea580c' }}>
                    חיסכון ₪{saved.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-lg leading-none"
                    style={{ color: isCurrentTier ? '#1a7a40' : '#0d3320' }}>
                    ₪{total.toLocaleString()}
                  </span>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>{tier.buyers === 0 ? 'ללא קבוצה' : `${tier.buyers}+ קונים`}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="rounded-xl p-3 text-right" style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
          <div className="flex items-baseline justify-between">
            <span className="font-black text-lg" style={{ color: '#1a7a40' }}>₪{totalNow.toLocaleString()}</span>
            <span className="text-sm font-semibold" style={{ color: '#0d3320' }}>מחיר עכשיו ({qty} יחידות)</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-sm line-through" style={{ color: '#cbd5e1' }}>₪{totalOriginal.toLocaleString()}</span>
            <span className="text-xs" style={{ color: '#94a3b8' }}>מחיר מקורי</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid #d1fae5' }}>
            <span className="font-black" style={{ color: '#1a7a40' }}>חוסך ₪{savedNow.toLocaleString()} 💰</span>
            <span className="text-xs" style={{ color: '#94a3b8' }}>החיסכון שלך היום</span>
          </div>
          {totalNext && (
            <p className="text-xs font-semibold mt-1.5 text-orange-500">
              עם {nextTier.buyers} קונים: ₪{totalNext.toLocaleString()} (חוסך עוד ₪{(totalNow - totalNext).toLocaleString()})
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage({ deal, timeLeft, isJoined, onJoin, onBack }) {
  const [slide,           setSlide]           = useState(0)
  const [showAllJoiners,  setShowAllJoiners]  = useState(false)
  const [shareOpen,       setShareOpen]       = useState(false)
  const [currentUser,     setCurrentUser]     = useState(null)

  // Load cached user for VIP display
  useEffect(() => { setCurrentUser(getCachedUser()) }, [])

  const slides      = getSlides(deal)
  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)
  const progress    = Math.round((deal.currentBuyers / deal.targetBuyers) * 100)
  const remaining   = deal.targetBuyers - deal.currentBuyers
  const isUrgent    = timeLeft && timeLeft.startsWith('00:')
  const [hh, mm, ss] = (timeLeft || '00:00:00').split(':')

  const prevSlide = () => setSlide(i => (i - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlide(i => (i + 1) % slides.length)

  const CARD = 'card-clean rounded-2xl p-5'

  return (
    <div className="min-h-screen pb-28" style={{ background: '#f4fbf7' }} dir="rtl">
      {/* ── Nav bar ───────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#1a7a40' }}
              whileTap={{ scale: 0.95 }}>
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">שתף</span>
            </motion.button>
          </div>
          <p className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs" style={{ color: '#0d3320' }}>{deal.title}</p>
          <button onClick={onBack}
            className="flex items-center gap-1.5 font-semibold transition-colors text-sm"
            style={{ color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a7a40'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <ArrowRight className="w-5 h-5" /><span>חזרה</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Slider ───────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden mb-6"
          style={{ height: 300, background: 'linear-gradient(135deg, #f0fdf4, #d1fae5)', border: '1px solid #bbf7d0' }}>

          <AnimatePresence mode="wait">
            <motion.div key={slide}
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.35 }}>
              {deal.image ? (
                <img src={deal.image} alt={deal.title} className="max-h-56 max-w-full object-contain" />
              ) : (
                <span className={`text-9xl drop-shadow-sm ${slides[slide].scale ?? ''}`}>
                  {slides[slide].emoji}
                </span>
              )}
              <span className="text-xs mt-4 font-medium tracking-wider uppercase" style={{ color: '#94a3b8' }}>
                {slides[slide].label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Discount pill */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}>
            -{discountPct}% הנחה
          </div>

          {/* Nav arrows */}
          <button onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #e2e8f0' }}>
            <ChevronRight className="w-5 h-5" style={{ color: '#475569' }} />
          </button>
          <button onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors"
            style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #e2e8f0' }}>
            <ChevronLeft className="w-5 h-5" style={{ color: '#475569' }} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === slide ? 24 : 10, height: 10,
                  background: i === slide ? '#22a855' : 'rgba(0,0,0,0.15)',
                }} />
            ))}
          </div>
        </div>

        {/* ── Content grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title + VIP */}
            <div className={CARD}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  {currentUser?.isVip && (
                    <VipBadge
                      referralCount={currentUser.referralCount}
                      isVip={currentUser.isVip}
                      size="sm"
                    />
                  )}
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-black mb-1" style={{ color: '#0d3320' }}>{deal.title}</h2>
                  <p className="text-sm" style={{ color: '#64748b' }}>{deal.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= Math.round(deal.rating) ? 'text-yellow-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="font-bold text-sm" style={{ color: '#475569' }}>{deal.rating}</span>
                <span className="text-sm" style={{ color: '#94a3b8' }}>({deal.reviews.toLocaleString()} ביקורות)</span>
              </div>
            </div>

            {/* ── INVITE BANNER ───────────────────────────────────────────── */}
            <motion.button
              onClick={() => setShareOpen(true)}
              className="w-full card-clean rounded-2xl p-4 text-right transition-all"
              style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1.5px solid #bbf7d0' }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
                  style={{ background: 'linear-gradient(135deg, #22a855, #1a7a40)' }}>
                  🔗
                </div>
                <div className="flex-1">
                  <p className="font-black text-base" style={{ color: '#0d3320' }}>הזמן חברים & הורד את המחיר</p>
                  <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                    כל חבר שמצטרף מוריד את המחיר לכולם •{' '}
                    <span className="font-bold" style={{ color: '#7c3aed' }}>VIP לאחר 3 הפניות 🌟</span>
                  </p>
                </div>
                <Share2 className="w-5 h-5 shrink-0" style={{ color: '#22a855' }} />
              </div>
            </motion.button>

            {/* Price tiers */}
            <div className={CARD}>
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown className="w-5 h-5" style={{ color: '#22a855' }} />
                <h3 className="font-black text-lg" style={{ color: '#0d3320' }}>שלבי הוזלת מחיר</h3>
              </div>
              <div className="space-y-3">
                {deal.priceTiers.map((tier, i) => {
                  const isActive = deal.currentBuyers >= tier.buyers &&
                    (i === deal.priceTiers.length - 1 || deal.currentBuyers < deal.priceTiers[i + 1].buyers)
                  const isPast = !isActive && deal.currentBuyers >= tier.buyers
                  const isNext = !isActive && !isPast && i > 0 &&
                    deal.currentBuyers < tier.buyers && deal.currentBuyers >= deal.priceTiers[i - 1].buyers
                  const priceDrop = i > 0 ? deal.priceTiers[i - 1].price - tier.price : 0
                  return (
                    <div key={i} className={`flex gap-4 p-4 rounded-xl border-2 transition-all ${isPast ? 'opacity-50' : ''}`}
                      style={
                        isActive ? { background: '#f0fdf4', borderColor: '#22a855' } :
                        isNext   ? { background: '#fff7ed', borderColor: '#fed7aa' } :
                                   { background: '#f8fafc', borderColor: '#e2e8f0' }
                      }>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                        style={
                          isActive ? { background: 'linear-gradient(135deg, #22a855, #1a7a40)', color: '#fff' } :
                          isNext   ? { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' } :
                          isPast   ? { background: '#f0fdf4', color: '#22a855', border: '1px solid #bbf7d0' } :
                                     { background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }
                        }>
                        {isPast ? '✓' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-black text-2xl leading-none"
                            style={{ color: isActive ? '#1a7a40' : isPast ? '#94a3b8' : '#0d3320' }}>
                            ₪{tier.price}
                          </span>
                          <div className="flex items-center gap-2">
                            {priceDrop > 0 && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ background: '#f0fdf4', color: '#1a7a40', border: '1px solid #bbf7d0' }}>
                                -₪{priceDrop}
                              </span>
                            )}
                            {isActive && (
                              <span className="text-xs font-black px-2.5 py-1 rounded-full"
                                style={{ background: 'linear-gradient(135deg, #22a855, #1a7a40)', color: '#fff' }}>
                                פעיל ✓
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
                          {tier.buyers === 0 ? 'מחיר רגיל (ללא קבוצה)' : `${tier.buyers}+ קונים בקבוצה`}
                        </p>
                        {isNext && (
                          <p className="text-sm font-bold mt-1.5 flex items-center gap-1 text-orange-500">
                            <Zap className="w-3.5 h-3.5" />
                            עוד {tier.buyers - deal.currentBuyers} קונים להוזלה של ₪{priceDrop}!
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── SAVINGS CALCULATOR ──────────────────────────────────────── */}
            <SavingsCalculator deal={deal} />

            {/* ── ACTIVITY FEED / GROUP CHAT ──────────────────────────────── */}
            <ActivityFeed productId={deal.id} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield,    label: 'תשלום מאובטח', sub: 'הצפנת SSL',     color: '#1a7a40', bg: '#f0fdf4', border: '#bbf7d0' },
                { icon: Truck,     label: 'משלוח חינם',   sub: 'לכל הארץ',       color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
                { icon: RotateCcw, label: 'ביטול חינם',   sub: 'עד סגירת עסקה', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
              ].map(({ icon: Icon, label, sub, color, bg, border }, i) => (
                <div key={i} className="card-clean rounded-xl p-3 text-center"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
                  <p className="text-xs font-bold" style={{ color }}>{label}</p>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: sticky price card */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="card-clean rounded-2xl p-5">
                <div className="text-right mb-4">
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-base line-through" style={{ color: '#cbd5e1' }}>₪{deal.originalPrice}</span>
                    <span className="text-4xl font-black" style={{ color: '#1a7a40' }}>₪{deal.currentPrice}</span>
                  </div>
                  <p className="text-sm font-bold mt-0.5" style={{ color: '#22a855' }}>
                    חיסכון: ₪{deal.savings} ({discountPct}% הנחה)
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: '#94a3b8' }}>
                    <span className="font-bold" style={{ color: '#1a7a40' }}>{progress}% הושלם</span>
                    <span>{deal.currentBuyers}/{deal.targetBuyers} קונים</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                    <div className="h-full rounded-full progress-gold transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs font-semibold mt-1.5 text-orange-500">עוד {remaining} קונים להוזלה הבאה</p>
                </div>

                {/* Timer */}
                <div className="rounded-xl px-3 py-2.5 flex items-center justify-center gap-2 mb-4"
                  style={isUrgent
                    ? { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }
                    : { background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400 animate-pulse' : ''}`}
                    style={isUrgent ? {} : { color: '#22a855' }} />
                  <div className="flex items-center gap-1" dir="ltr">
                    {[hh, mm, ss].map((seg, i) => (
                      <span key={i} className="flex items-center gap-0.5">
                        <span className="font-mono font-black text-lg px-1.5 py-0.5 rounded-lg"
                          style={isUrgent
                            ? { color: '#ef4444', background: 'rgba(239,68,68,0.08)' }
                            : { color: '#155c34', background: '#f0fdf4' }}>
                          {seg}
                        </span>
                        {i < 2 && <span className="font-black text-lg leading-none mb-1"
                          style={{ color: isUrgent ? '#ef4444' : '#94a3b8' }}>:</span>}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: isUrgent ? '#ef4444' : '#94a3b8' }}>נותרו</span>
                </div>

                {isJoined ? (
                  <div className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d' }}>
                    <CheckCircle className="w-5 h-5" />
                    <span>הצטרפת לחגיגה! ✓</span>
                  </div>
                ) : (
                  <motion.button onClick={() => onJoin(deal)}
                    className="w-full btn-gold py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.97 }}>
                    <Users className="w-5 h-5" />
                    הצטרף לקבוצה עכשיו
                  </motion.button>
                )}
                <p className="text-center text-xs mt-3" style={{ color: '#94a3b8' }}>לא יחויב עכשיו · ביטול חינם</p>
              </div>

              {/* Share card in sidebar */}
              <motion.button onClick={() => setShareOpen(true)}
                className="w-full card-clean rounded-2xl p-4 text-right"
                style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}
                whileTap={{ scale: 0.97 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📣</span>
                  <div className="flex-1">
                    <p className="font-black text-sm" style={{ color: '#0d3320' }}>הזמן חברים & הורד מחיר</p>
                    <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>שלח לינק ייחודי לחברים</p>
                  </div>
                  <Share2 className="w-4 h-4 shrink-0" style={{ color: '#22a855' }} />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky mobile bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 py-3 lg:hidden"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2 max-w-5xl mx-auto">
          <motion.button
            onClick={() => setShareOpen(true)}
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            whileTap={{ scale: 0.92 }}>
            <Share2 className="w-5 h-5" style={{ color: '#22a855' }} />
          </motion.button>

          <div className="flex-1 text-right leading-tight">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-xs line-through" style={{ color: '#cbd5e1' }}>₪{deal.originalPrice}</span>
              <span className="text-2xl font-black" style={{ color: '#1a7a40' }}>₪{deal.currentPrice}</span>
            </div>
            <p className="text-xs font-semibold text-orange-500">עוד {remaining} קונים להוזלה</p>
          </div>

          {isJoined ? (
            <div className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d' }}>
              <CheckCircle className="w-4 h-4" /><span>הצטרפת ✓</span>
            </div>
          ) : (
            <motion.button onClick={() => onJoin(deal)}
              className="flex-1 btn-gold py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}>
              <Users className="w-4 h-4" />הצטרף עכשיו
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Share Menu ───────────────────────────────────────────────────── */}
      {shareOpen && <ShareMenu deal={deal} onClose={() => setShareOpen(false)} />}
    </div>
  )
}
