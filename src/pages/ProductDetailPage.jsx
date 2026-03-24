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
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(8,12,24,0.8)', border: '1px solid rgba(0,255,136,0.15)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,255,136,0.04)' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-semibold">כמה תחסוך?</span>
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-black text-white text-base">מחשבון חיסכון</h3>
          <Calculator className="w-4 h-4 text-neon-green" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quantity selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="w-4 h-4 text-slate-300" />
            </motion.button>
            <span className="w-10 text-center text-2xl font-black text-white">{qty}</span>
            <motion.button
              onClick={() => setQty(q => Math.min(maxQty, q + 1))}
              disabled={qty >= maxQty}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4 text-slate-300" />
            </motion.button>
          </div>
          <span className="text-sm text-slate-400 font-semibold">כמות יחידות</span>
        </div>

        {/* Tier table */}
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
                  isCurrentTier
                    ? { background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }
                    : isNextTier
                      ? { background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.2)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                }
                animate={{ scale: isCurrentTier ? 1.01 : 1 }}
              >
                <div className="flex items-center gap-2">
                  {isCurrentTier && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,255,136,0.2)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}>
                      פעיל ✓
                    </span>
                  )}
                  {isNextTier && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,165,0,0.2)', color: '#ffa500', border: '1px solid rgba(255,165,0,0.3)' }}>
                      הבא
                    </span>
                  )}
                  <span className={`text-sm font-bold ${isCurrentTier ? 'text-neon-green' : 'text-amber-400'}`}>
                    חיסכון ₪{saved.toLocaleString()} ({pct}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className={`font-black text-lg leading-none ${isCurrentTier ? 'text-neon-green' : 'text-slate-300'}`}>
                    ₪{total.toLocaleString()}
                  </span>
                  <p className="text-xs text-slate-600">{tier.buyers === 0 ? 'ללא קבוצה' : `${tier.buyers}+ קונים`}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary row */}
        <div className="rounded-xl p-3 text-right"
          style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
          <div className="flex items-baseline justify-between">
            <span className="text-neon-green font-black text-lg">₪{totalNow.toLocaleString()}</span>
            <span className="text-sm font-semibold text-white">מחיר עכשיו ({qty} יחידות)</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-slate-500 text-sm line-through">₪{totalOriginal.toLocaleString()}</span>
            <span className="text-xs text-slate-400">מחיר מקורי</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2"
            style={{ borderTop: '1px solid rgba(0,255,136,0.15)' }}>
            <span className="font-black text-neon-green">חוסך ₪{savedNow.toLocaleString()} 💰</span>
            <span className="text-xs text-slate-400">החיסכון שלך היום</span>
          </div>
          {totalNext && (
            <p className="text-xs text-amber-400 font-semibold mt-1.5">
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

  const CARD = 'glass border border-white/8 rounded-2xl p-5 shadow-glass'

  return (
    <div className="min-h-screen pb-28" style={{ background: '#050810' }} dir="rtl">
      {/* ── Nav bar ───────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,136,0.12)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Share button in nav */}
            <motion.button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88' }}
              whileTap={{ scale: 0.95 }}>
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">שתף</span>
            </motion.button>
          </div>
          <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">{deal.title}</p>
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-neon-green font-semibold transition-colors text-sm">
            <ArrowRight className="w-5 h-5" /><span>חזרה</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Slider ───────────────────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden mb-6 circuit-bg"
          style={{ height: 300, background: 'linear-gradient(135deg, #0a0e1a, #0f1628)', border: '1px solid rgba(0,255,136,0.12)' }}>
          <div className="absolute inset-0 scanlines" />

          <AnimatePresence mode="wait">
            <motion.div key={slide}
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.35 }}>
              <span className={`text-9xl drop-shadow-2xl ${slides[slide].scale ?? ''}`}
                style={{ filter: 'drop-shadow(0 0 40px rgba(0,255,136,0.3))' }}>
                {slides[slide].emoji}
              </span>
              <span className="text-xs text-slate-600 mt-4 font-medium tracking-wider uppercase">
                {slides[slide].label}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Discount pill */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(8px)', color: '#fff' }}>
            -{discountPct}% הנחה
          </div>

          {/* Nav arrows */}
          <button onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 glass hover:bg-neon-green/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
          <button onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 glass hover:bg-neon-green/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === slide ? 24 : 10, height: 10,
                  background: i === slide ? '#00ff88' : 'rgba(255,255,255,0.25)',
                  boxShadow: i === slide ? '0 0 8px rgba(0,255,136,0.6)' : 'none',
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
                  <h2 className="text-2xl font-black text-white mb-1">{deal.title}</h2>
                  <p className="text-slate-500 text-sm">{deal.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= Math.round(deal.rating) ? 'text-yellow-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="font-bold text-sm text-slate-300">{deal.rating}</span>
                <span className="text-sm text-slate-600">({deal.reviews.toLocaleString()} ביקורות)</span>
              </div>
            </div>

            {/* ── INVITE BANNER ───────────────────────────────────────────── */}
            <motion.button
              onClick={() => setShareOpen(true)}
              className="w-full rounded-2xl p-4 text-right transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(123,47,247,0.08))',
                border: '1px solid rgba(0,255,136,0.25)',
                boxShadow: '0 0 20px rgba(0,255,136,0.06)',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408', fontSize: 22 }}>
                  🔗
                </div>
                <div className="flex-1">
                  <p className="font-black text-white text-base">הזמן חברים & הורד את המחיר</p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    כל חבר שמצטרף מוריד את המחיר לכולם •{' '}
                    <span className="text-purple-400 font-bold">VIP לאחר 3 הפניות 🌟</span>
                  </p>
                </div>
                <Share2 className="w-5 h-5 text-neon-green shrink-0" />
              </div>
            </motion.button>

            {/* Price tiers */}
            <div className={CARD}>
              <div className="flex items-center gap-2 mb-5">
                <TrendingDown className="w-5 h-5 text-neon-green" />
                <h3 className="font-black text-white text-lg">שלבי הוזלת מחיר</h3>
              </div>
              <div className="relative">
                <div className="absolute right-5 top-5 bottom-5 w-0.5 z-0" style={{ background: 'rgba(0,255,136,0.15)' }} />
                <div className="space-y-3 relative z-10">
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
                          isActive ? { background: 'rgba(0,255,136,0.08)', borderColor: 'rgba(0,255,136,0.4)', boxShadow: '0 0 20px rgba(0,255,136,0.1)' } :
                          isNext   ? { background: 'rgba(255,165,0,0.06)', borderColor: 'rgba(255,165,0,0.3)' } :
                                     { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }
                        }>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                          style={
                            isActive ? { background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408' } :
                            isNext   ? { background: 'rgba(255,165,0,0.2)', color: '#ffa500', border: '1px solid rgba(255,165,0,0.4)' } :
                            isPast   ? { background: 'rgba(255,255,255,0.08)', color: '#00ff88' } :
                                       { background: 'rgba(255,255,255,0.05)', color: '#4a5568' }
                          }>
                          {isPast ? '✓' : i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className={`font-black text-2xl leading-none ${isActive ? 'neon-green' : isPast ? 'text-slate-600' : 'text-white'}`}>
                              ₪{tier.price}
                            </span>
                            <div className="flex items-center gap-2">
                              {priceDrop > 0 && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}>
                                  -₪{priceDrop}
                                </span>
                              )}
                              {isActive && (
                                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                                  style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408' }}>
                                  פעיל ✓
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {tier.buyers === 0 ? 'מחיר רגיל (ללא קבוצה)' : `${tier.buyers}+ קונים בקבוצה`}
                          </p>
                          {isNext && (
                            <p className="text-sm font-bold text-amber-400 mt-1.5 flex items-center gap-1">
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
            </div>

            {/* ── SAVINGS CALCULATOR ──────────────────────────────────────── */}
            <SavingsCalculator deal={deal} />

            {/* ── ACTIVITY FEED / GROUP CHAT ──────────────────────────────── */}
            <ActivityFeed productId={deal.id} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield,    label: 'תשלום מאובטח', sub: 'הצפנת SSL',       color: '#00ff88' },
                { icon: Truck,     label: 'משלוח חינם',   sub: 'לכל הארץ',         color: '#00b4ff' },
                { icon: RotateCcw, label: 'ביטול חינם',   sub: 'עד סגירת עסקה',   color: '#7b2ff7' },
              ].map(({ icon: Icon, label, sub, color }, i) => (
                <div key={i} className="glass rounded-xl p-3 text-center"
                  style={{ border: `1px solid ${color}20` }}>
                  <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
                  <p className="text-xs font-bold text-slate-300">{label}</p>
                  <p className="text-xs text-slate-600">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: sticky price card */}
          <div className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="glass border rounded-2xl p-5 shadow-glass"
                style={{ borderColor: 'rgba(0,255,136,0.2)', boxShadow: '0 0 30px rgba(0,255,136,0.08)' }}>
                <div className="text-right mb-4">
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-base text-slate-600 line-through">₪{deal.originalPrice}</span>
                    <span className="text-4xl font-black neon-green">₪{deal.currentPrice}</span>
                  </div>
                  <p className="text-sm font-bold mt-0.5" style={{ color: '#00ff88' }}>
                    חיסכון: ₪{deal.savings} ({discountPct}% הנחה)
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-bold text-neon-green/80">{progress}% הושלם</span>
                    <span>{deal.currentBuyers}/{deal.targetBuyers} קונים</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full progress-neon transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-amber-400 font-semibold mt-1.5">עוד {remaining} קונים להוזלה הבאה</p>
                </div>

                {/* Timer */}
                <div className={`rounded-xl px-3 py-2.5 flex items-center justify-center gap-2 mb-4 ${isUrgent ? 'border' : ''}`}
                  style={isUrgent
                    ? { background: 'rgba(255,60,60,0.1)', borderColor: 'rgba(255,60,60,0.3)' }
                    : { background: 'rgba(5,8,16,0.8)', border: '1px solid rgba(0,255,136,0.12)' }}>
                  <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-neon-green/60'}`} />
                  <div className="flex items-center gap-1" dir="ltr">
                    {[hh, mm, ss].map((seg, i) => (
                      <span key={i} className="flex items-center gap-0.5">
                        <span className={`font-mono font-black text-lg px-1.5 py-0.5 rounded-lg ${
                          isUrgent ? 'urgent-digit text-red-400 bg-red-500/10' : 'text-neon-green'
                        }`} style={isUrgent ? {} : { textShadow: '0 0 10px rgba(0,255,136,0.6)' }}>
                          {seg}
                        </span>
                        {i < 2 && <span className={`font-black text-lg leading-none mb-1 ${isUrgent ? 'text-red-500' : 'text-slate-700'}`}>:</span>}
                      </span>
                    ))}
                  </div>
                  <span className={`text-xs font-semibold ${isUrgent ? 'text-red-400' : 'text-slate-500'}`}>נותרו</span>
                </div>

                {isJoined ? (
                  <div className="w-full glass-neon py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <span className="text-neon-green">הצטרפת לחגיגה! ✓</span>
                  </div>
                ) : (
                  <motion.button onClick={() => onJoin(deal)}
                    className="w-full btn-neon py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.97 }}>
                    <Users className="w-5 h-5" />
                    הצטרף לקבוצה עכשיו
                  </motion.button>
                )}
                <p className="text-center text-xs text-slate-600 mt-3">לא יחויב עכשיו · ביטול חינם</p>
              </div>

              {/* Share card in sidebar */}
              <motion.button onClick={() => setShareOpen(true)}
                className="w-full rounded-2xl p-4 text-right"
                style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)' }}
                whileTap={{ scale: 0.97 }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📣</span>
                  <div className="flex-1">
                    <p className="font-black text-sm text-white">הזמן חברים & הורד מחיר</p>
                    <p className="text-xs text-slate-500 mt-0.5">שלח לינק ייחודי לחברים</p>
                  </div>
                  <Share2 className="w-4 h-4 text-neon-green shrink-0" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky mobile bar ─────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 py-3 lg:hidden"
        style={{ background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(0,255,136,0.15)' }}>
        <div className="flex items-center gap-2 max-w-5xl mx-auto">
          {/* Share button */}
          <motion.button
            onClick={() => setShareOpen(true)}
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}
            whileTap={{ scale: 0.92 }}>
            <Share2 className="w-5 h-5 text-neon-green" />
          </motion.button>

          <div className="flex-1 text-right leading-tight">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-xs text-slate-600 line-through">₪{deal.originalPrice}</span>
              <span className="text-2xl font-black neon-green">₪{deal.currentPrice}</span>
            </div>
            <p className="text-xs text-amber-400 font-semibold">עוד {remaining} קונים להוזלה</p>
          </div>

          {isJoined ? (
            <div className="flex-1 glass-neon py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-neon-green" /><span className="text-neon-green">הצטרפת ✓</span>
            </div>
          ) : (
            <motion.button onClick={() => onJoin(deal)}
              className="flex-1 btn-neon py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2"
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
