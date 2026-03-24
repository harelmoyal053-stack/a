import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, CreditCard, Users, TrendingDown, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'
    osc.frequency.setValueAtTime(523, ctx.currentTime)
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.15)
    osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.55)
  } catch (_) {}
}

export default function JoinModal({ deal, onConfirm, onClose }) {
  const [step, setStep]       = useState(1)
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [agreed, setAgreed]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !phone || !agreed) return
    setLoading(true)
    setApiError(null)

    try {
      // Pass the collected details to the parent's join handler
      // (onConfirm calls useJoin.join which POSTs to /api/join)
      const result = await onConfirm(deal, { name, phone })

      if (result?.ok === false) {
        setApiError(result.error ?? 'שגיאה בהצטרפות')
        setLoading(false)
        return
      }

      setLoading(false)
      setStep(2)
      playSuccess()
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 },
        colors: ['#00ff88', '#00b4ff', '#7b2ff7', '#ffffff'] })
    } catch {
      setApiError('בעיית רשת — נסה שנית')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-glass-lg"
          style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 50px rgba(0,255,136,0.1)' }}
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        >
          {/* Glow border top */}
          <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #00ff88, #00b4ff, transparent)' }} />

          {/* Header */}
          <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,180,255,0.05))' }}>
            <div className="flex items-start justify-between mb-3">
              <button onClick={onClose} className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="text-right">
                <h2 className="text-xl font-black text-white">הצטרף לחגיגת הקנייה</h2>
                <p className="text-slate-400 text-sm mt-0.5">{deal.title}</p>
              </div>
            </div>

            {/* Deal summary */}
            <div className="rounded-2xl p-3 flex items-center justify-between"
              style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)' }}>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-medium text-slate-300">
                  הבא: <span className="font-black text-neon-green">₪{deal.nextPrice}</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-neon-green">₪{deal.currentPrice}</div>
                <div className="text-xs text-slate-500 line-through">₪{deal.originalPrice}</div>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Trust row */}
              <div className="flex gap-2 mb-5">
                {[
                  { icon: Shield,     label: 'תשלום מאובטח', color: '#00ff88' },
                  { icon: CreditCard, label: 'ביטול חינם',   color: '#00b4ff' },
                  { icon: Users,      label: `${deal.currentBuyers} חברים`, color: '#7b2ff7' },
                ].map(({ icon: Icon, label, color }, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs flex-1 justify-center py-2.5 rounded-xl"
                    style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span className="font-medium text-slate-300">{label}</span>
                  </div>
                ))}
              </div>

              {/* API error */}
              {apiError && (
                <div className="flex items-start gap-2.5 rounded-xl p-3 mb-4"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-300 leading-relaxed font-semibold">{apiError}</p>
                </div>
              )}

              {/* Notice */}
              <div className="flex items-start gap-2.5 rounded-xl p-3 mb-5"
                style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)' }}>
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-300 leading-relaxed">
                  <strong>לא יחויב עכשיו.</strong> החיוב יבוצע רק כשהקבוצה תגיע ל-{deal.targetBuyers} קונים.
                </p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">שם מלא</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="ישראל ישראלי"
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm" required dir="rtl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1.5">מספר טלפון</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="05X-XXXXXXX"
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm" required dir="ltr"
                    style={{ textAlign: 'right' }} />
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded shrink-0 cursor-pointer accent-neon-green" />
                  <span className="text-xs text-slate-500 text-right leading-relaxed">
                    אני מסכים/ה ל<span className="text-neon-green/80 underline cursor-pointer">תנאי השימוש</span> של DropPrice
                  </span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={!name || !phone || !agreed || loading}
                className="w-full mt-6 btn-neon disabled:opacity-40 py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(2,4,8,0.3)', borderTopColor: '#020408' }} />
                    <span>מצטרף לחגיגה...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>אישור הצטרפות לקבוצה</span>
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            /* Success */
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(0,255,136,0.12)', border: '2px solid rgba(0,255,136,0.4)', boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}>
                <CheckCircle className="w-10 h-10 text-neon-green" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">הצטרפת לחגיגה! 🎉</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                נשלח לך SMS כשהמחיר ירד.{' '}
                <strong className="text-neon-green">{deal.targetBuyers - deal.currentBuyers - 1}</strong> קונים נוספים נדרשים!
              </p>
              <motion.button
                onClick={() => onConfirm(deal)}
                className="w-full btn-neon py-3.5 rounded-xl font-black text-base"
                whileTap={{ scale: 0.97 }}
              >
                מעולה, תודה! 🙌
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
