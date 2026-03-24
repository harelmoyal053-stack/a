import { useState } from 'react'
import { X, Shield, CreditCard, Users, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react'

export default function JoinModal({ deal, onConfirm, onClose }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !phone || !agreed) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ animation: 'fadeInUp 0.3s ease' }}>

        {/* Header */}
        <div className="bg-gradient-to-l from-green-700 to-emerald-500 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-right">
              <h2 className="text-xl font-black">הצטרף לקבוצת הקנייה</h2>
              <p className="text-green-100 text-sm mt-0.5">{deal.title}</p>
            </div>
          </div>

          {/* Deal Summary */}
          <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">
                המחיר הבא: <span className="font-black text-yellow-300">₪{deal.nextPrice}</span>
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">₪{deal.currentPrice}</div>
              <div className="text-xs text-green-200 line-through">₪{deal.originalPrice}</div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Trust Signals */}
            <div className="flex gap-2 mb-5">
              {[
                { icon: Shield, label: 'תשלום מאובטח', color: 'text-green-500' },
                { icon: CreditCard, label: 'ביטול חינם', color: 'text-blue-500' },
                { icon: Users, label: `${deal.currentBuyers} חברים`, color: 'text-purple-500' },
              ].map(({ icon: Icon, label, color }, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600 flex-1 justify-center bg-gray-50 rounded-xl py-2.5 border border-gray-100">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>לא יחויב עכשיו.</strong> החיוב יבוצע רק כשהקבוצה תגיע ל-{deal.targetBuyers} קונים. אחרת — ביטול אוטומטי ללא עלות.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">שם מלא</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">מספר טלפון</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05X-XXXXXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                  dir="ltr"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-green-600 rounded focus:ring-green-400 shrink-0 cursor-pointer"
                />
                <span className="text-xs text-gray-600 text-right leading-relaxed group-hover:text-gray-800 transition-colors">
                  אני מסכים/ה ל<span className="text-green-600 underline cursor-pointer">תנאי השימוש</span> ומדיניות הפרטיות של DropPrice
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!name || !phone || !agreed || loading}
              className="w-full mt-6 bg-gradient-to-l from-green-600 to-emerald-500 disabled:from-gray-300 disabled:to-gray-300 text-white py-3.5 rounded-xl font-black text-base transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-green-300 hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>מצטרף...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>אישור הצטרפות לקבוצה</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Success Step */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">הצטרפת בהצלחה! 🎉</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              נשלח לך SMS כשהמחיר ירד. רק{' '}
              <strong className="text-green-600">{deal.targetBuyers - deal.currentBuyers - 1}</strong> קונים נוספים נדרשים!
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2.5 pb-2.5 border-b border-green-100">
                <span className="font-black text-xl text-green-700">₪{deal.currentPrice}</span>
                <span className="text-sm font-semibold text-gray-500">המחיר שלך עכשיו</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black text-xl text-emerald-600">₪{deal.nextPrice}</span>
                <span className="text-sm font-semibold text-gray-500">המחיר הבא (בקרוב!)</span>
              </div>
            </div>
            <button
              onClick={() => onConfirm(deal)}
              className="w-full bg-gradient-to-l from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-black text-base shadow-lg shadow-green-200 active:scale-95 transition-transform"
            >
              מעולה, תודה! 🙌
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
