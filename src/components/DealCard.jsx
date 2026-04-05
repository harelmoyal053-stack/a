import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, ChevronDown, TrendingDown, CheckCircle, Tag, Flame, Zap, AlertTriangle } from 'lucide-react'
import confetti from 'canvas-confetti'

// ── Sound helper ──────────────────────────────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    if (type === 'join') {
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.12)
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.24)
    } else {
      osc.frequency.setValueAtTime(523, ctx.currentTime)
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.15)
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.3)
    }
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.55)
  } catch (_) {}
}

// ── TierRow ───────────────────────────────────────────────────────────────────
function TierRow({ tier, idx, totalTiers, currentBuyers, originalPrice }) {
  const [hovered, setHovered] = useState(false)
  const isActive = currentBuyers >= tier.buyers &&
    (idx === totalTiers - 1 || currentBuyers < (tier.buyers + 1))
  const saving = originalPrice - tier.price
  const savingPct = Math.round((saving / originalPrice) * 100)

  return (
    <div className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className={`flex justify-between items-center px-3 py-2.5 text-sm border-b last:border-0 rounded-lg transition-colors ${
        isActive ? 'bg-green-50' : 'hover:bg-slate-50'
      }`} style={{ borderColor: '#f1f5f9' }}>
        <span className={`font-black text-base`} style={{ color: isActive ? '#1a7a40' : '#475569' }}>
          ₪{tier.price}
        </span>
        <span className="text-xs" style={{ color: '#94a3b8' }}>{tier.buyers}+ קונים</span>
        {isActive && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(26,122,64,0.1)', border: '1px solid rgba(26,122,64,0.3)', color: '#1a7a40' }}>
            פעיל ✓
          </span>
        )}
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 rounded-xl p-3 mt-1"
            style={{ background: '#fff', border: '1px solid #d1fae5', boxShadow: '0 8px 24px rgba(21,92,52,0.15)' }}
          >
            <div className="space-y-1.5 text-right">
              <div className="flex justify-between text-xs">
                <span className="font-black" style={{ color: '#1a7a40' }}>₪{tier.price}</span>
                <span style={{ color: '#94a3b8' }}>מחיר בשלב זה</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold" style={{ color: '#22a855' }}>₪{saving} ({savingPct}%)</span>
                <span style={{ color: '#94a3b8' }}>חיסכון ממחיר מקורי</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-orange-500">{tier.buyers}+ קונים</span>
                <span style={{ color: '#94a3b8' }}>נדרש להפעלה</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main DealCard ─────────────────────────────────────────────────────────────
export default function DealCard({ deal, timeLeft, isJoined, isJoining, onJoin, onCardClick }) {
  const [progressWidth, setProgressWidth] = useState(0)
  const [showTiers, setShowTiers]         = useState(false)
  const [celebrated, setCelebrated]       = useState(false)
  const cardRef = useRef(null)

  const progress    = Math.round((deal.currentBuyers / deal.targetBuyers) * 100)
  const remaining   = deal.targetBuyers - deal.currentBuyers
  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)
  const isUrgent    = timeLeft && timeLeft.startsWith('00:')
  const isAlmost    = progress >= 70
  const spotsLeft   = remaining <= 5 && remaining > 0

  const [hh, mm, ss] = (timeLeft || '00:00:00').split(':')

  useEffect(() => {
    const t = setTimeout(() => setProgressWidth(Math.min(progress, 100)), 120)
    return () => clearTimeout(t)
  }, [progress])

  useEffect(() => {
    if (isJoined && !celebrated) {
      setCelebrated(true)
      playSound('join')
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x, y },
          colors: ['#22a855', '#4ade80', '#155c34', '#ffffff', '#d1fae5'],
          gravity: 0.9,
          scalar: 0.9,
        })
      }
    }
  }, [isJoined, celebrated])

  return (
    <motion.div
      ref={cardRef}
      className="card-clean rounded-2xl overflow-hidden flex flex-col cursor-pointer relative"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onCardClick}
    >
      {/* ── Image Area ─────────────────────────────────────────────────── */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden shrink-0"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
          borderBottom: '1px solid #e2e8f0',
        }}>

        {/* Discount badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <Tag className="w-3 h-3" />-{discountPct}%
          </div>
        </div>

        {/* Hot badge */}
        {isAlmost && (
          <div className="absolute top-3 left-3 z-10 hot-badge">
            <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.4)', color: '#ea580c' }}>
              <span className="fire-icon">🔥</span> חם
            </div>
          </div>
        )}

        {/* Category */}
        {!isAlmost && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#64748b' }}>
              {deal.category}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className={`${deal.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
            {deal.badge}
          </span>
        </div>

        {/* Product image or emoji */}
        {deal.image ? (
          <motion.img
            src={deal.image}
            alt={deal.title}
            className="relative z-10 w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
        ) : (
          <motion.div
            className="relative z-10 text-8xl select-none drop-shadow-sm"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {deal.emoji}
          </motion.div>
        )}

        {/* Join success flash */}
        <AnimatePresence>
          {isJoined && celebrated && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl px-5 py-3 font-black text-lg"
                style={{ background: 'rgba(240,253,244,0.95)', border: '1px solid #bbf7d0', color: '#15803d' }}>
                🎉 הצטרפת לחגיגה!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Card Body ───────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1" dir="rtl">

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(deal.rating) ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold" style={{ color: '#475569' }}>{deal.rating}</span>
          <span className="text-xs" style={{ color: '#94a3b8' }}>({deal.reviews.toLocaleString()})</span>
        </div>

        {/* Title */}
        <h3 className="font-black text-base leading-snug mb-0.5" style={{ color: '#0d3320' }}>{deal.title}</h3>
        <p className="text-xs mb-3" style={{ color: '#94a3b8' }}>{deal.subtitle}</p>

        {/* Price + Progress */}
        <div className="rounded-xl p-3 mb-3"
          style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
          {/* Price row */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 shrink-0" style={{ color: '#22a855' }} />
              <span className="text-xs" style={{ color: '#64748b' }}>
                הבא: <span className="font-black" style={{ color: '#1a7a40' }}>₪{deal.nextPrice}</span>
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-xs line-through" style={{ color: '#cbd5e1' }}>₪{deal.originalPrice}</span>
                <motion.span
                  className="text-2xl font-black leading-none"
                  style={{ color: '#1a7a40' }}
                  key={deal.currentPrice}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  ₪{deal.currentPrice}
                </motion.span>
              </div>
              <p className="text-xs font-semibold text-right" style={{ color: '#22a855' }}>
                חיסכון: ₪{deal.savings}
              </p>
            </div>
          </div>

          {/* Limited spots alert */}
          {spotsLeft && (
            <motion.div
              className="flex items-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.3)' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="text-xs font-black text-orange-500">
                נשארו מקומות אחרונים — רק {remaining} מקומות!
              </span>
            </motion.div>
          )}

          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold" style={{ color: isAlmost ? '#1a7a40' : '#ea580c' }}>
                {isAlmost ? `רק ${remaining} קונים נוספים!` : `${remaining} קונים להוזלה`}
              </span>
              <span className="font-medium" style={{ color: '#94a3b8' }}>{deal.currentBuyers}/{deal.targetBuyers}</span>
            </div>

            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
              <div
                className="absolute inset-y-0 right-0 rounded-full progress-gold transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
              {[33, 66].map(pct => (
                <div key={pct} className="absolute top-0 bottom-0 w-px bg-white/60" style={{ right: `${pct}%` }} />
              ))}
            </div>

            <div className="flex justify-between items-center mt-1.5">
              <button
                className="text-xs flex items-center gap-0.5 font-medium transition-colors"
                style={{ color: '#22a855' }}
                onClick={e => { e.stopPropagation(); setShowTiers(!showTiers) }}
              >
                <span>שלבי מחיר</span>
                <motion.span animate={{ rotate: showTiers ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3 h-3" />
                </motion.span>
              </button>
              <span className="text-xs font-bold" style={{ color: progress >= 50 ? '#1a7a40' : '#94a3b8' }}>
                {progress}% הושלם
              </span>
            </div>
          </div>
        </div>

        {/* Price tiers dropdown */}
        <AnimatePresence>
          {showTiers && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-3"
            >
              <div className="rounded-xl overflow-hidden"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="px-3 py-2 flex items-center gap-1.5 justify-end"
                  style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>מפת הוזלות — רחף לפרטים</span>
                  <TrendingDown className="w-3 h-3" style={{ color: '#22a855' }} />
                </div>
                {deal.priceTiers.map((tier, i) => (
                  <TierRow
                    key={i}
                    tier={tier}
                    idx={i}
                    totalTiers={deal.priceTiers.length}
                    currentBuyers={deal.currentBuyers}
                    originalPrice={deal.originalPrice}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown Timer */}
        <div className="rounded-xl px-3 py-2.5 mb-3 flex items-center justify-center gap-2"
          style={isUrgent
            ? { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }
            : { background: '#f8fafc', border: '1px solid #e2e8f0' }
          }>
          <Clock className={`w-4 h-4 shrink-0 ${isUrgent ? 'text-red-400 animate-pulse' : ''}`}
            style={isUrgent ? {} : { color: '#22a855' }} />
          <div className="flex items-center gap-1" dir="ltr">
            {[hh, mm, ss].map((seg, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className="font-mono font-black text-lg px-1.5 py-0.5 rounded-lg"
                  style={isUrgent
                    ? { color: '#ef4444', background: 'rgba(239,68,68,0.08)' }
                    : { color: '#155c34', background: '#f0fdf4' }
                  }>
                  {seg}
                </span>
                {i < 2 && (
                  <span className="font-black text-lg leading-none mb-1"
                    style={{ color: isUrgent ? '#ef4444' : '#94a3b8' }}>:</span>
                )}
              </span>
            ))}
          </div>
          <span className="text-xs font-semibold" style={{ color: isUrgent ? '#ef4444' : '#94a3b8' }}>נותרו</span>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center" style={{ direction: 'ltr' }}>
            {['🧑','👩','👨','🙍'].map((em, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs -ml-1 first:ml-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #22a855, #1a7a40)' }}>
                {em}
              </div>
            ))}
            {deal.currentBuyers > 4 && (
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold -ml-1 shadow-sm"
                style={{ background: '#e2e8f0', color: '#64748b' }}>
                +{deal.currentBuyers - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: '#64748b' }}>
            <Users className="w-3.5 h-3.5" style={{ color: '#22a855' }} />
            <span>{deal.currentBuyers} הצטרפו</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {isJoined ? (
            <div className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d' }}>
              <CheckCircle className="w-5 h-5" />
              <span>הצטרפת לחגיגה! ✓</span>
            </div>
          ) : (
            <motion.button
              onClick={e => { e.stopPropagation(); onJoin(deal) }}
              disabled={isJoining}
              className="w-full btn-gold disabled:opacity-60 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  <span>מצטרף...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>הצטרף לחגיגה</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
