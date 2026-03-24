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

// ── TierRow with hover tooltip ────────────────────────────────────────────────
function TierRow({ tier, idx, totalTiers, currentBuyers, originalPrice }) {
  const [hovered, setHovered] = useState(false)
  const isActive = currentBuyers >= tier.buyers &&
    (idx === totalTiers - 1 || currentBuyers < tier.buyers + 1)
  // recalculate properly
  const isActiveReal = (() => {
    if (idx === totalTiers - 1) return currentBuyers >= tier.buyers
    return false // handled by caller
  })()
  const saving = originalPrice - tier.price
  const savingPct = Math.round((saving / originalPrice) * 100)

  return (
    <div className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className={`flex justify-between items-center px-3 py-2.5 text-sm border-b border-white/5 last:border-0 rounded-lg transition-colors ${
        isActive ? 'bg-neon-green/10' : 'hover:bg-white/5'
      }`}>
        <span className={`font-black text-base ${isActive ? 'text-neon-green' : 'text-slate-300'}`}>
          ₪{tier.price}
        </span>
        <span className="text-xs text-slate-500">{tier.buyers}+ קונים</span>
        {isActive && <span className="text-[10px] bg-neon-green/20 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded-full font-black">פעיל ✓</span>}
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-50 glass border border-neon-blue/30 rounded-xl p-3 mt-1 shadow-glass-lg"
            style={{ boxShadow: '0 0 20px rgba(0,180,255,0.2)' }}
          >
            <div className="space-y-1.5 text-right">
              <div className="flex justify-between text-xs">
                <span className="text-neon-green font-black">₪{tier.price}</span>
                <span className="text-slate-400">מחיר בשלב זה</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neon-blue font-bold">₪{saving} ({savingPct}%)</span>
                <span className="text-slate-400">חיסכון ממחיר מקורי</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-orange-400 font-bold">{tier.buyers}+ קונים</span>
                <span className="text-slate-400">נדרש להפעלה</span>
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

  // Celebrate when joined
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
          colors: ['#00ff88', '#00b4ff', '#7b2ff7', '#ffffff', '#ffcc00'],
          gravity: 0.9,
          scalar: 0.9,
        })
      }
    }
  }, [isJoined, celebrated])

  return (
    <motion.div
      ref={cardRef}
      className="card-neon rounded-2xl overflow-hidden flex flex-col cursor-pointer relative"
      style={{ background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(18px)' }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onCardClick}
    >
      {/* ── Image Area ─────────────────────────────────────────────────── */}
      <div className={`relative h-48 flex items-center justify-center overflow-hidden shrink-0`}
        style={{
          background: `linear-gradient(135deg, rgba(10,14,26,0.9), rgba(15,22,40,0.95))`,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        {/* Circuit bg */}
        <div className="absolute inset-0 circuit-bg opacity-40" />

        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines" />

        {/* Discount badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl border"
            style={{
              background: 'rgba(239,68,68,0.2)',
              borderColor: 'rgba(239,68,68,0.5)',
              color: '#ff6b6b',
              boxShadow: '0 0 12px rgba(239,68,68,0.3)',
            }}>
            <Tag className="w-3 h-3" />-{discountPct}%
          </div>
        </div>

        {/* Hot badge (top-left) */}
        {isAlmost && (
          <div className="absolute top-3 left-3 z-10 hot-badge">
            <div className="flex items-center gap-1 text-xs font-black px-2.5 py-1.5 rounded-xl border"
              style={{
                background: 'rgba(255,107,53,0.18)',
                borderColor: 'rgba(255,107,53,0.6)',
                color: '#ff8c57',
              }}>
              <span className="fire-icon">🔥</span> חם
            </div>
          </div>
        )}

        {/* Category (top-left when no hot) */}
        {!isAlmost && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg glass text-slate-300">
              {deal.category}
            </span>
          </div>
        )}

        {/* Status badge (bottom-right) */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className={`${deal.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
            {deal.badge}
          </span>
        </div>

        {/* Large emoji */}
        <motion.div
          className="relative z-10 text-8xl select-none drop-shadow-2xl"
          whileHover={{ scale: 1.12 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {deal.emoji}
        </motion.div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.9), transparent)' }} />

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
              <div className="glass-neon rounded-2xl px-5 py-3 text-neon-green font-black text-lg">
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
              <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(deal.rating) ? 'text-yellow-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-300">{deal.rating}</span>
          <span className="text-xs text-slate-600">({deal.reviews.toLocaleString()})</span>
        </div>

        {/* Title */}
        <h3 className="font-black text-white text-base leading-snug mb-0.5">{deal.title}</h3>
        <p className="text-xs text-slate-500 mb-3">{deal.subtitle}</p>

        {/* Price + Progress */}
        <div className="rounded-xl p-3 mb-3 border"
          style={{ background: 'rgba(0,255,136,0.04)', borderColor: 'rgba(0,255,136,0.15)' }}>
          {/* Price row */}
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-neon-green shrink-0" />
              <span className="text-xs text-slate-400">
                הבא: <span className="font-black text-neon-green">₪{deal.nextPrice}</span>
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-xs text-slate-600 line-through">₪{deal.originalPrice}</span>
                <motion.span
                  className="text-2xl font-black neon-green leading-none"
                  key={deal.currentPrice}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  ₪{deal.currentPrice}
                </motion.span>
              </div>
              <p className="text-xs text-neon-green/70 font-semibold text-right">
                חיסכון: ₪{deal.savings}
              </p>
            </div>
          </div>

          {/* Limited spots alert */}
          {spotsLeft && (
            <motion.div
              className="flex items-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-lg border"
              style={{ background: 'rgba(255,107,53,0.12)', borderColor: 'rgba(255,107,53,0.4)' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="text-xs font-black text-orange-400">
                נשארו מקומות אחרונים — רק {remaining} מקומות!
              </span>
            </motion.div>
          )}

          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className={`font-bold ${isAlmost ? 'text-neon-green' : 'text-orange-400'}`}>
                {isAlmost ? `רק ${remaining} קונים נוספים!` : `${remaining} קונים להוזלה`}
              </span>
              <span className="text-slate-500 font-medium">{deal.currentBuyers}/{deal.targetBuyers}</span>
            </div>

            <div className="relative h-3 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="absolute inset-y-0 right-0 rounded-full progress-neon transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
              {[33, 66].map(pct => (
                <div key={pct} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ right: `${pct}%` }} />
              ))}
            </div>

            <div className="flex justify-between items-center mt-1.5">
              <button
                className="text-neon-blue/80 hover:text-neon-blue text-xs flex items-center gap-0.5 font-medium transition-colors"
                onClick={e => { e.stopPropagation(); setShowTiers(!showTiers) }}
              >
                <span>שלבי מחיר</span>
                <motion.span animate={{ rotate: showTiers ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3 h-3" />
                </motion.span>
              </button>
              <span className={`text-xs font-bold ${progress >= 50 ? 'text-neon-green' : 'text-slate-500'}`}>
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
              <div className="rounded-xl overflow-hidden border"
                style={{ background: 'rgba(10,14,26,0.9)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="px-3 py-2 border-b border-white/5 flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-bold text-slate-400">מפת הוזלות — רחף לפרטים</span>
                  <TrendingDown className="w-3 h-3 text-neon-green" />
                </div>
                {deal.priceTiers.map((tier, i) => {
                  const isAct = deal.currentBuyers >= tier.buyers &&
                    (i === deal.priceTiers.length - 1 || deal.currentBuyers < deal.priceTiers[i + 1].buyers)
                  return (
                    <TierRow
                      key={i}
                      tier={tier}
                      idx={i}
                      totalTiers={deal.priceTiers.length}
                      currentBuyers={deal.currentBuyers}
                      originalPrice={deal.originalPrice}
                    />
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown Timer */}
        <div className={`rounded-xl px-3 py-2.5 mb-3 flex items-center justify-center gap-2 ${
          isUrgent ? 'border' : ''
        }`}
          style={isUrgent
            ? { background: 'rgba(255,60,60,0.1)', borderColor: 'rgba(255,60,60,0.3)', boxShadow: '0 0 20px rgba(255,60,60,0.2)' }
            : { background: 'rgba(5,8,16,0.8)', border: '1px solid rgba(0,255,136,0.12)' }
          }>
          <Clock className={`w-4 h-4 shrink-0 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-neon-green/60'}`} />
          <div className="flex items-center gap-1" dir="ltr">
            {[hh, mm, ss].map((seg, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className={`font-mono font-black text-lg px-1.5 py-0.5 rounded-lg ${
                  isUrgent
                    ? 'urgent-digit text-red-400 bg-red-500/10'
                    : 'text-neon-green bg-neon-green/8'
                }`}
                  style={isUrgent ? {} : { textShadow: '0 0 10px rgba(0,255,136,0.6)' }}>
                  {seg}
                </span>
                {i < 2 && <span className={`font-black text-lg leading-none mb-1 ${isUrgent ? 'text-red-500' : 'text-slate-600'}`}>:</span>}
              </span>
            ))}
          </div>
          <span className={`text-xs font-semibold ${isUrgent ? 'text-red-400' : 'text-slate-500'}`}>נותרו</span>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center" style={{ direction: 'ltr' }}>
            {['🧑','👩','👨','🙍'].map((em, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs -ml-1 first:ml-0 shadow"
                style={{ borderColor: '#050810', background: 'linear-gradient(135deg, #00cc6a, #009950)' }}>
                {em}
              </div>
            ))}
            {deal.currentBuyers > 4 && (
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold text-slate-300 -ml-1 shadow"
                style={{ borderColor: '#050810', background: '#1a2038' }}>
                +{deal.currentBuyers - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Users className="w-3.5 h-3.5 text-neon-green" />
            <span>{deal.currentBuyers} הצטרפו</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {isJoined ? (
            <div className="w-full glass-neon py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-neon-green" />
              <span className="text-neon-green">הצטרפת לחגיגה! ✓</span>
            </div>
          ) : (
            <motion.button
              onClick={e => { e.stopPropagation(); onJoin(deal) }}
              disabled={isJoining}
              className="w-full btn-neon disabled:opacity-60 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'rgba(2,4,8,0.3)', borderTopColor: '#020408' }} />
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
