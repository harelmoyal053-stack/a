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
  const [step,     setStep]     = useState(1)
  const [name,     setName]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [agreed,   setAgreed]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !phone || !agreed) return
    setLoading(true)
    setApiError(null)

    try {
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
        colors: ['#22a855', '#4ade80', '#155c34', '#ffffff', '#d1fae5'] })
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
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 24px 60px rgba(21,92,52,0.14)' }}
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        >
          {/* Green top strip */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #22a855, #1a7a40)' }} />

          {/* Header */}
          <div className="px-6 py-5" style={{ background: '#f4fbf7', borderBottom: '1px solid #e2e8f0' }}>
            <div className="flex items-start justify-between mb-3">
              <button onClick={onClose}
                className="p-1.5 rounded-xl transition-all"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}>
                <X className="w-5 h-5" />
              </button>
              <div className="text-right">
                <h2 className="text-xl font-black" style={{ color: '#0d3320' }}>הצטרף לחגיגת הקנייה</h2>
                <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{deal.title}</p>
              </div>
            </div>

            {/* Deal summary */}
            <div className="rounded-2xl p-3 flex items-center justify-between"
              style={{ background: '#fff', border: '1.5px solid #bbf7d0' }}>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4" style={{ color: '#22a855' }} />
                <span className="text-sm font-medium" style={{ color: '#64748b' }}>
                  הבא: <span className="font-black" style={{ color: '#1a7a40' }}>₪{deal.nextPrice}</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black" style={{ color: '#1a7a40' }}>₪{deal.currentPrice}</div>
                <div className="text-xs line-through" style={{ color: '#cbd5e1' }}>₪{deal.originalPrice}</div>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Trust row */}
              <div className="flex gap-2 mb-5">
                {[
                  { icon: Shield,     label: 'תשלום מאובטח', color: '#1a7a40', bg: '#f0fdf4', border: '#bbf7d0' },
                  { icon: CreditCard, label: 'ביטול חינם',   color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
                  { icon: Users,      label: `${deal.currentBuyers} חברים`, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
                ].map(({ icon: Icon, label, color, bg, border }, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs flex-1 justify-center py-2.5 rounded-xl"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span className="font-medium" style={{ color }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* API error */}
              {apiError && (
                <div className="flex items-start gap-2.5 rounded-xl p-3 mb-4"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-500 leading-relaxed font-semibold">{apiError}</p>
                </div>
              )}

              {/* Notice */}
              <div className="flex items-start gap-2.5 rounded-xl p-3 mb-5"
                style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <p className="text-xs text-orange-700 leading-relaxed">
                  <strong>לא יחויב עכשיו.</strong> החיוב יבוצע רק כשהקבוצה תגיע ל-{deal.targetBuyers} קונים.
                </p>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>שם מלא</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="ישראל ישראלי"
                    className="input-clean w-full px-4 py-3 rounded-xl text-sm" required dir="rtl" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>מספר טלפון</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="05X-XXXXXXX"
                    className="input-clean w-full px-4 py-3 rounded-xl text-sm" required dir="ltr"
                    style={{ textAlign: 'right' }} />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded shrink-0 cursor-pointer" style={{ accentColor: '#22a855' }} />
                  <span className="text-xs text-right leading-relaxed" style={{ color: '#94a3b8' }}>
                    אני מסכים/ה ל<span className="underline cursor-pointer" style={{ color: '#22a855' }}>תנאי השימוש</span> של DropPrice
                  </span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={!name || !phone || !agreed || loading}
                className="w-full mt-6 btn-gold disabled:opacity-40 py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#22a855' }} />
              </div>
              <h3 className="text-2xl font-black mb-2" style={{ color: '#0d3320' }}>הצטרפת לחגיגה! 🎉</h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#64748b' }}>
                נשלח לך SMS כשהמחיר ירד.{' '}
                <strong style={{ color: '#1a7a40' }}>{deal.targetBuyers - deal.currentBuyers - 1}</strong> קונים נוספים נדרשים!
              </p>
              <motion.button
                onClick={onClose}
                className="w-full btn-gold py-3.5 rounded-xl font-black text-base"
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
