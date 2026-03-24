import { useState } from 'react'
import {
  ArrowRight, CreditCard, MapPin, CheckCircle, Share2,
  Users, Shield, Lock, Copy, Smartphone
} from 'lucide-react'

const STEPS = ['פרטי משלוח', 'תשלום', 'אישור']

export default function CheckoutPage({ deal, onSuccess, onBack }) {
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const [shipping, setShipping] = useState({ name: '', phone: '', city: '', address: '', zip: '' })
  const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '', holder: '' })

  const shippingValid = shipping.name && shipping.phone && shipping.city && shipping.address
  const paymentValid = payment.card.length >= 19 && payment.expiry.length === 5 && payment.cvv.length >= 3 && payment.holder

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(3)
      onSuccess && onSuccess(deal, { shipping, payment })
    }, 2000)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(`הצטרפו איתי לקבוצת הקנייה של "${deal.title}" ב-DropPrice! כשיותר אנשים מצטרפים, המחיר יורד לכולם 🛒 ${url}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const discountPct = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {step < 3 ? (
            <button onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 font-semibold transition-colors text-sm">
              <ArrowRight className="w-5 h-5" />חזרה
            </button>
          ) : <div className="w-16" />}
          <span className="font-black text-gray-800 text-sm">
            {step === 3 ? '🎉 הזמנה אושרה!' : 'השלמת רכישה'}
          </span>
          <div className="w-16" />
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-0" dir="ltr">
              {STEPS.map((label, i) => {
                const n = i + 1
                const done = n < step
                const active = n === step
                return (
                  <div key={i} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center flex-1 ${i < STEPS.length - 1 ? '' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        done ? 'bg-green-500 text-white' : active ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {done ? '✓' : n}
                      </div>
                      <span className={`text-xs mt-1 font-semibold ${active ? 'text-green-700' : done ? 'text-green-500' : 'text-gray-400'}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-5 rounded-full transition-all ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Deal summary card — always visible on steps 1 & 2 */}
        {step < 3 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${deal.bgColor} flex items-center justify-center text-3xl shrink-0`}>
              {deal.emoji}
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="font-black text-gray-800 text-sm leading-tight">{deal.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{deal.subtitle}</p>
            </div>
            <div className="text-left shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-400 line-through">₪{deal.originalPrice}</span>
                <span className="text-xl font-black text-green-600">₪{deal.currentPrice}</span>
              </div>
              <span className="text-xs font-bold text-red-500">-{discountPct}%</span>
            </div>
          </div>
        )}

        {/* ── STEP 1: Shipping ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <h2 className="font-black text-gray-800 text-lg">פרטי משלוח</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-600 mb-1.5">שם מלא *</label>
                <input value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-600 mb-1.5">מספר טלפון *</label>
                <input value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                  placeholder="05X-XXXXXXX" dir="ltr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all text-right" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">עיר *</label>
                <input value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                  placeholder="תל אביב"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">מיקוד</label>
                <input value={shipping.zip} onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))}
                  placeholder="XXXXXX" dir="ltr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all text-right" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-600 mb-1.5">כתובת מלאה *</label>
                <input value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                  placeholder="רחוב הרצל 10, דירה 5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all" />
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!shippingValid}
              className="w-full mt-2 bg-gradient-to-l from-green-600 to-emerald-500 disabled:from-gray-300 disabled:to-gray-300 text-white py-3.5 rounded-xl font-black text-base shadow-lg shadow-green-200 disabled:shadow-none active:scale-95 transition-all">
              המשך לתשלום ←
            </button>
          </div>
        )}

        {/* ── STEP 2: Payment ── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Credit card visual */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-green-500/10 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-2xl font-bold text-green-400 opacity-80">VISA</div>
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-mono text-lg tracking-widest mb-4 text-gray-200" dir="ltr">
                  {payment.card || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">תוקף</p>
                    <p className="font-mono text-sm" dir="ltr">{payment.expiry || 'MM/YY'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">שם</p>
                    <p className="text-sm font-semibold">{payment.holder || 'שם בעל הכרטיס'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment form */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-5 h-5 text-green-600" />
                <h2 className="font-black text-gray-800 text-lg">פרטי כרטיס אשראי</h2>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">מספר כרטיס</label>
                <input value={payment.card}
                  onChange={e => setPayment(p => ({ ...p, card: formatCard(e.target.value) }))}
                  placeholder="1234 5678 9012 3456" dir="ltr" maxLength={19}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all text-right tracking-widest" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">תוקף (MM/YY)</label>
                  <input value={payment.expiry}
                    onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY" dir="ltr" maxLength={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all text-center" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1.5">CVV</label>
                  <input value={payment.cvv}
                    onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="•••" dir="ltr" maxLength={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all text-center" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">שם בעל הכרטיס</label>
                <input value={payment.holder} onChange={e => setPayment(p => ({ ...p, holder: e.target.value }))}
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all" />
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-right">
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>לא יחויב עכשיו.</strong> הכרטיס יחויב ב-₪{deal.currentPrice} רק כשהקבוצה תגיע ליעד. אחרת — ביטול אוטומטי.
                </p>
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600 font-bold">₪{deal.currentPrice}</span>
                  <span className="text-gray-600">מחיר קבוצתי</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-bold">חינם</span>
                  <span className="text-gray-600">משלוח</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-base">
                  <span className="text-gray-900">₪{deal.currentPrice}</span>
                  <span className="text-gray-900">סה״כ</span>
                </div>
              </div>

              <button onClick={handlePay} disabled={!paymentValid || loading}
                className="w-full bg-gradient-to-l from-green-600 to-emerald-500 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-xl font-black text-base shadow-lg shadow-green-200 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    מעבד תשלום...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    אישור הצטרפות · ₪{deal.currentPrice}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Confetti / success hero */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">הצטרפת בהצלחה! 🎉</h2>
                <p className="text-green-100 text-base mb-1">ברוכים הבאים לקבוצת הקנייה</p>
                <p className="text-white font-bold text-lg">{deal.title}</p>
              </div>
            </div>

            {/* Order details */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-800 text-base mb-4 text-right">סיכום הזמנה</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'מחיר ששולם', value: `₪${deal.currentPrice}`, green: true },
                  { label: 'חיסכון', value: `₪${deal.savings}`, green: true },
                  { label: 'משלוח לכתובת', value: shipping.address },
                  { label: 'מספר הזמנה', value: `DP-${Math.random().toString(36).slice(2, 8).toUpperCase()}` },
                  { label: 'SMS עדכון יישלח ל', value: shipping.phone },
                ].map(({ label, value, green }, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                    <span className={`font-bold ${green ? 'text-green-600' : 'text-gray-700'}`}>{value}</span>
                    <span className="text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress update */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-600">{deal.currentBuyers + 1}/{deal.targetBuyers} קונים</span>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-gray-800">מצב הקבוצה</h3>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-l from-green-500 to-emerald-400"
                  style={{ width: `${Math.min(((deal.currentBuyers + 1) / deal.targetBuyers) * 100, 100)}%` }} />
              </div>
              <p className="text-sm text-orange-600 font-bold text-right">
                עוד {deal.targetBuyers - deal.currentBuyers - 1} קונים להוזלה הבאה ל-₪{deal.nextPrice}
              </p>
            </div>

            {/* Share card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm text-right">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <h3 className="font-black text-gray-800 text-lg">הזמן חברים, חסוך יותר!</h3>
                <Share2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                כל חבר שמצטרף מוריד את המחיר לכולם. שתף עכשיו!
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleShare}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-blue-200 text-blue-700 hover:border-blue-400'
                  }`}>
                  {copied ? <><CheckCircle className="w-4 h-4" />הועתק!</> : <><Copy className="w-4 h-4" />העתק לינק</>}
                </button>
                <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-95">
                  <Smartphone className="w-4 h-4" />
                  שלח ב-WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
