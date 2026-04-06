import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CreditCard, MapPin, CheckCircle, Share2,
  Users, Shield, Lock, Copy, Smartphone, Zap
} from 'lucide-react'
import confetti from 'canvas-confetti'

const STEPS = ['פרטי משלוח', 'תשלום', 'אישור']

export default function CheckoutPage({ deal, onSuccess, onBack }) {
  const [step, setStep]     = useState(1)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const [shipping, setShipping] = useState({ name: '', phone: '', city: '', address: '', zip: '' })
  const [payment,  setPayment]  = useState({ card: '', expiry: '', cvv: '', holder: '' })

  const shippingValid = shipping.name && shipping.phone && shipping.city && shipping.address
  const paymentValid  = payment.card.length >= 19 && payment.expiry.length === 5 && payment.cvv.length >= 3 && payment.holder

  const formatCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d }

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(3)
      onSuccess && onSuccess(deal, { shipping, payment })
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ['#00ff88', '#00b4ff', '#7b2ff7', '#ffcc00'] })
    }, 2000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`הצטרפו איתי לקבוצת הקנייה של "${deal.title}" ב-DropPrice! 🛒`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)
  const CARD = 'glass border border-white/8 rounded-2xl p-5 shadow-glass'

  return (
    <div className="min-h-screen" style={{ background: '#050810' }} dir="rtl">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,136,0.12)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {step < 3 ? (
            <button onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-neon-green font-semibold transition-colors text-sm">
              <ArrowRight className="w-5 h-5" />חזרה
            </button>
          ) : <div className="w-16" />}
          <span className="font-black text-white text-sm">
            {step === 3 ? '🎉 הזמנה אושרה!' : 'השלמת רכישה'}
          </span>
          <div className="w-16" />
        </div>

        {step < 3 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-0" dir="ltr">
              {STEPS.map((label, i) => {
                const n = i + 1; const done = n < step; const active = n === step
                return (
                  <div key={i} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
                        style={
                          done   ? { background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408' } :
                          active ? { background: '#00ff88', color: '#020408', boxShadow: '0 0 12px rgba(0,255,136,0.5)' } :
                                   { background: 'rgba(255,255,255,0.08)', color: '#4a5568' }
                        }>
                        {done ? '✓' : n}
                      </div>
                      <span className={`text-xs mt-1 font-semibold ${active ? 'text-neon-green' : done ? 'text-slate-400' : 'text-slate-600'}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="h-0.5 flex-1 mx-1 mb-5 rounded-full transition-all"
                        style={{ background: done ? 'rgba(0,255,136,0.5)' : 'rgba(255,255,255,0.08)' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Deal summary */}
        {step < 3 && (
          <div className="glass border border-white/8 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
              {deal.emoji}
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="font-black text-white text-sm leading-tight">{deal.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{deal.subtitle}</p>
            </div>
            <div className="text-left shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-slate-600 line-through">₪{deal.originalPrice}</span>
                <span className="text-xl font-black neon-green">₪{deal.currentPrice}</span>
              </div>
              <span className="text-xs font-bold text-red-400">-{discountPct}%</span>
            </div>
          </div>
        )}

        {/* ── STEP 1 ──────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1"
              className={CARD + ' space-y-4'}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-neon-blue" />
                <h2 className="font-black text-white text-lg">פרטי משלוח</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">שם מלא *</label>
                  <input value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
                    placeholder="ישראל ישראלי" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">מספר טלפון *</label>
                  <input value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                    placeholder="05X-XXXXXXX" dir="ltr" className="input-dark w-full px-4 py-3 rounded-xl text-sm" style={{ textAlign: 'right' }} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">עיר *</label>
                  <input value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                    placeholder="תל אביב" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">מיקוד</label>
                  <input value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))}
                    placeholder="XXXXXX" dir="ltr" className="input-dark w-full px-4 py-3 rounded-xl text-sm" style={{ textAlign: 'right' }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">כתובת מלאה *</label>
                  <input value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                    placeholder="רחוב הרצל 10, דירה 5" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                </div>
              </div>
              <motion.button onClick={() => setStep(2)} disabled={!shippingValid}
                className="w-full mt-2 btn-neon disabled:opacity-30 py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}>
                <Zap className="w-5 h-5" />המשך לתשלום ←
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 2 ────────────────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="step2" className="space-y-4"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Card visual */}
              <div className="rounded-2xl p-5 text-white relative overflow-hidden shadow-glass-lg"
                style={{ background: 'linear-gradient(135deg, #0a0e1a, #1a2038)', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 30px rgba(0,255,136,0.08)' }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.08), transparent 70%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.08), transparent 70%)' }} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-2xl font-bold" style={{ color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>VISA</div>
                    <CreditCard className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="font-mono text-lg tracking-widest mb-4 text-slate-300" dir="ltr">
                    {payment.card || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-600 mb-0.5">תוקף</p>
                      <p className="font-mono text-sm" dir="ltr">{payment.expiry || 'MM/YY'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-600 mb-0.5">שם</p>
                      <p className="text-sm font-semibold">{payment.holder || 'שם בעל הכרטיס'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment form */}
              <div className={CARD + ' space-y-4'}>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 text-neon-green" />
                  <h2 className="font-black text-white text-lg">פרטי כרטיס אשראי</h2>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">מספר כרטיס</label>
                  <input value={payment.card} onChange={e => setPayment(p => ({ ...p, card: formatCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456" dir="ltr" maxLength={19}
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm font-mono tracking-widest" style={{ textAlign: 'right' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1.5">תוקף (MM/YY)</label>
                    <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY" dir="ltr" maxLength={5}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm font-mono text-center" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1.5">CVV</label>
                    <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      placeholder="•••" dir="ltr" maxLength={4}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm font-mono text-center" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1.5">שם בעל הכרטיס</label>
                  <input value={payment.holder} onChange={e => setPayment(p => ({ ...p, holder: e.target.value }))}
                    placeholder="ישראל ישראלי" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                </div>

                {/* Notice */}
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.2)' }}>
                  <p className="text-xs text-amber-300 leading-relaxed text-right">
                    <strong>לא יחויב עכשיו.</strong> הכרטיס יחויב ב-₪{deal.currentPrice} רק כשהקבוצה תגיע ליעד.
                  </p>
                </div>

                {/* Order summary */}
                <div className="rounded-xl p-4 space-y-2 text-sm" style={{ background: 'rgba(5,8,16,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { label: 'מחיר קבוצתי', value: `₪${deal.currentPrice}`, green: true },
                    { label: 'משלוח',        value: 'חינם',                  green: true },
                  ].map(({ label, value, green }, i) => (
                    <div key={i} className="flex justify-between">
                      <span className={green ? 'text-neon-green font-bold' : 'text-slate-300'}>{value}</span>
                      <span className="text-slate-500">{label}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-black text-base pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-white">₪{deal.currentPrice}</span>
                    <span className="text-white">סה״כ</span>
                  </div>
                </div>

                <motion.button onClick={handlePay} disabled={!paymentValid || loading}
                  className="w-full btn-neon disabled:opacity-30 py-4 rounded-xl font-black text-base flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}>
                  {loading ? (
                    <><div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(2,4,8,0.3)', borderTopColor: '#020408' }} />מעבד תשלום...</>
                  ) : (
                    <><Shield className="w-5 h-5" />אישור הצטרפות · ₪{deal.currentPrice}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 ────────────────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="step3" className="space-y-5"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              {/* Success hero */}
              <div className="rounded-3xl p-8 text-white text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,180,255,0.1))', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 50px rgba(0,255,136,0.15)' }}>
                <div className="absolute inset-0 circuit-bg opacity-30" />
                <div className="absolute inset-0 scanlines" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(0,255,136,0.12)', border: '2px solid rgba(0,255,136,0.4)', boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}>
                    <CheckCircle className="w-10 h-10 text-neon-green" />
                  </div>
                  <h2 className="text-3xl font-black mb-2 text-white">הצטרפת בהצלחה! 🎉</h2>
                  <p className="text-slate-400 text-base mb-1">ברוכים הבאים לקבוצת הקנייה</p>
                  <p className="font-bold text-lg neon-green">{deal.title}</p>
                </div>
              </div>

              {/* Order details */}
              <div className={CARD}>
                <h3 className="font-black text-white text-base mb-4">סיכום הזמנה</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'מחיר ששולם',        value: `₪${deal.currentPrice}`, green: true },
                    { label: 'חיסכון',             value: `₪${deal.savings}`,      green: true },
                    { label: 'משלוח לכתובת',       value: shipping.address || '—' },
                    { label: 'מספר הזמנה',         value: `DP-${Math.random().toString(36).slice(2,8).toUpperCase()}` },
                    { label: 'SMS עדכון יישלח ל', value: shipping.phone || '—' },
                  ].map(({ label, value, green }, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5" style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span className={green ? 'font-bold text-neon-green' : 'text-slate-300'}>{value}</span>
                      <span className="text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress update */}
              <div className={CARD}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-500">{deal.currentBuyers + 1}/{deal.targetBuyers} קונים</span>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white">מצב הקבוצה</h3>
                    <Users className="w-5 h-5 text-neon-green" />
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full progress-neon"
                    style={{ width: `${Math.min(((deal.currentBuyers + 1) / deal.targetBuyers) * 100, 100)}%` }} />
                </div>
                <p className="text-sm text-amber-400 font-bold text-right">
                  עוד {deal.targetBuyers - deal.currentBuyers - 1} קונים להוזלה ל-₪{deal.nextPrice}
                </p>
              </div>

              {/* Share */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.2)' }}>
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <h3 className="font-black text-white text-lg">הזמן חברים, חסוך יותר!</h3>
                  <Share2 className="w-5 h-5 text-neon-blue" />
                </div>
                <p className="text-sm text-slate-500 mb-4 text-right">
                  כל חבר שמצטרף מוריד את המחיר לכולם. שתף עכשיו!
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button onClick={handleShare}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      copied ? 'text-dark-900 btn-neon' : 'glass border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/5'
                    }`}
                    whileTap={{ scale: 0.96 }}>
                    {copied ? <><CheckCircle className="w-4 h-4" />הועתק!</> : <><Copy className="w-4 h-4" />העתק לינק</>}
                  </motion.button>
                  <motion.button className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                    style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}
                    whileTap={{ scale: 0.96 }}>
                    <Smartphone className="w-4 h-4" />שלח ב-WhatsApp
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
