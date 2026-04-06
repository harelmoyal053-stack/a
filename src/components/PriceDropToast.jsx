import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingDown, X } from 'lucide-react'
import confetti from 'canvas-confetti'

/**
 * PriceDropToast
 * ──────────────
 * Pops up in the top-centre whenever a 'price:dropped' SSE event fires.
 * Fires canvas-confetti, plays a success chord, then auto-dismisses after 5 s.
 *
 * Props:
 *   toast: null | { productTitle, oldPrice, newPrice, newCount, message }
 *   onClose: () => void
 */
export default function PriceDropToast({ toast, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) return
    setVisible(true)

    // Confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.15 },
      colors: ['#00ff88', '#00b4ff', '#7b2ff7', '#ffcc00', '#ffffff'],
    })

    // Success sound
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      ;[
        [523, 0], [659, 0.12], [784, 0.24], [1047, 0.36],
      ].forEach(([freq, t]) => osc.frequency.setValueAtTime(freq, ctx.currentTime + t))
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.7)
    } catch (_) {}

    const timer = setTimeout(() => { setVisible(false); setTimeout(onClose, 400) }, 5000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  return (
    <AnimatePresence>
      {visible && toast && (
        <motion.div
          className="fixed top-14 left-1/2 z-[100] w-full max-w-sm pointer-events-auto"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0,   scale: 1   }}
          exit={{    opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 350 }}
        >
          <div className="mx-4 rounded-2xl overflow-hidden shadow-glass-lg"
            style={{
              background: 'rgba(5,8,16,0.97)',
              border: '1px solid rgba(0,255,136,0.45)',
              boxShadow: '0 0 40px rgba(0,255,136,0.25), 0 20px 60px rgba(0,0,0,0.6)',
            }}>
            {/* Neon top bar */}
            <div className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg, #00ff88, #00b4ff, #7b2ff7)' }} />

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => { setVisible(false); setTimeout(onClose, 400) }}
                  className="text-slate-600 hover:text-white transition-colors mt-0.5 shrink-0">
                  <X className="w-4 h-4" />
                </button>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end mb-1.5">
                    <h3 className="font-black text-white text-base leading-tight">
                      🎉 המחיר ירד!
                    </h3>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.3)' }}>
                      <TrendingDown className="w-4 h-4 text-neon-green" />
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-2 leading-snug"
                    dir="rtl">
                    {toast.productTitle}
                  </p>

                  {/* Old → new price */}
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-black text-2xl neon-green">
                      ₪{toast.newPrice}
                    </span>
                    <span className="text-slate-600 text-sm line-through">
                      ₪{toast.oldPrice}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#ff6b6b', border: '1px solid rgba(239,68,68,0.3)' }}>
                      -{Math.round(((toast.oldPrice - toast.newPrice) / toast.oldPrice) * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1.5 text-right">
                    {toast.newCount} קונים הצטרפו לחגיגה 🔥
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <motion.div
              className="h-0.5"
              style={{ background: 'linear-gradient(90deg, #00ff88, #00b4ff)', transformOrigin: 'right' }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
