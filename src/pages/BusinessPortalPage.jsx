import { useState } from 'react'
import { ArrowRight, Store, Plus, Minus, CheckCircle, TrendingDown, Zap, Tag } from 'lucide-react'

const CATEGORIES = ['מזון', 'תינוקות', 'תחבורה', 'ספורט', 'אלקטרוניקה', 'בית וגן', 'בריאות', 'אחר']
const DURATIONS = [
  { value: '24', label: '24 שעות' },
  { value: '48', label: '48 שעות' },
  { value: '72', label: '72 שעות' },
  { value: '168', label: 'שבוע שלם' },
]

const EMPTY_TIER = { buyers: '', price: '' }

export default function BusinessPortalPage({ onBack, onSubmit }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    productName: '',
    description: '',
    category: '',
    originalPrice: '',
    duration: '48',
    emoji: '🛍️',
  })
  const [tiers, setTiers] = useState([
    { buyers: '10', price: '' },
    { buyers: '25', price: '' },
    { buyers: '50', price: '' },
  ])

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addTier = () => tiers.length < 5 && setTiers(t => [...t, { ...EMPTY_TIER }])
  const removeTier = (i) => tiers.length > 1 && setTiers(t => t.filter((_, idx) => idx !== i))
  const setTier = (i, key, val) => setTiers(t => t.map((tier, idx) => idx === i ? { ...tier, [key]: val } : tier))

  const isValid = form.businessName && form.productName && form.originalPrice && form.category &&
    tiers.every(t => t.buyers && t.price)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    onSubmit && onSubmit({ ...form, tiers })
  }

  const EMOJI_OPTIONS = ['🛍️','📦','🍕','👶','⛽','🍎','🏋️','☕','🎧','❄️','💊','🌿','🔧','🎁']

  if (submitted) return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="w-16" />
          <span className="font-black text-gray-800">פורטל עסקים</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black mb-2">העסקה הועלתה בהצלחה! 🎉</h2>
            <p className="text-green-100 text-base">"{form.productName}" עלה לאוויר</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-right space-y-3">
          <h3 className="font-black text-gray-800 text-lg">מה קורה עכשיו?</h3>
          {[
            { n: '1', text: 'העסקה שלך תוצג לאלפי קונים בפלטפורמה' },
            { n: '2', text: `תקבל SMS + מייל לכל קונה שמצטרף לקבוצה` },
            { n: '3', text: 'כשמספר הקונים מגיע ליעד — עסקה מופעלת אוטומטית' },
            { n: '4', text: 'תשלום מועבר אליך תוך 3 ימי עסקים' },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3 justify-end">
              <p className="text-sm text-gray-600">{text}</p>
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{n}</div>
            </div>
          ))}
        </div>

        <button onClick={onBack}
          className="w-full bg-gradient-to-l from-green-600 to-emerald-500 text-white py-3.5 rounded-xl font-black text-base shadow-lg shadow-green-200 active:scale-95 transition-all">
          חזרה לדף הבית
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-10" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-green-700 font-semibold transition-colors text-sm">
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
          <span className="font-black text-gray-800">פורטל עסקים — פרסום עסקה חדשה</span>
          <div className="w-16" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Intro banner */}
        <div className="bg-gradient-to-l from-green-700 to-emerald-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 justify-end mb-2">
            <h2 className="text-xl font-black">פרסם עסקה קבוצתית</h2>
            <Store className="w-6 h-6" />
          </div>
          <p className="text-green-100 text-sm leading-relaxed text-right">
            הגדר את מבנה ההנחות שלך — ככל שיותר לקוחות מצטרפים, המחיר יורד. DropPrice מביאה את הקהל, אתה מביא את המוצר.
          </p>
        </div>

        {/* Section: Business info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-black text-gray-800 text-lg text-right flex items-center gap-2 justify-end">
            פרטי העסק <span className="text-xl">🏢</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'businessName', label: 'שם העסק *', placeholder: 'סופר כהן בע״מ' },
              { key: 'contactEmail', label: 'מייל ליצירת קשר *', placeholder: 'contact@example.com', dir: 'ltr' },
              { key: 'contactPhone', label: 'טלפון *', placeholder: '05X-XXXXXXX', dir: 'ltr' },
            ].map(({ key, label, placeholder, dir }) => (
              <div key={key}>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">{label}</label>
                <input value={form[key]} onChange={e => setField(key, e.target.value)}
                  placeholder={placeholder} dir={dir}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Product info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-black text-gray-800 text-lg text-right flex items-center gap-2 justify-end">
            פרטי המוצר <Tag className="w-5 h-5 text-green-600" />
          </h3>

          {/* Emoji picker */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">אמוג׳י לעסקה</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setField('emoji', e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2 ${
                    form.emoji === e ? 'border-green-500 bg-green-50 scale-110' : 'border-gray-200 bg-white hover:border-green-300'
                  }`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">שם המוצר *</label>
            <input value={form.productName} onChange={e => setField('productName', e.target.value)}
              placeholder='מארז שוקולד פרימיום 500 גר׳'
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">תיאור קצר</label>
            <textarea value={form.description} onChange={e => setField('description', e.target.value)}
              placeholder="תאר את המוצר: תכולה, גודל, יתרונות..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">קטגוריה *</label>
              <select value={form.category} onChange={e => setField('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all appearance-none">
                <option value="">בחר...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">משך העסקה</label>
              <select value={form.duration} onChange={e => setField('duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all appearance-none">
                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">מחיר מקורי (ללא הנחה) *</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₪</span>
              <input value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value.replace(/\D/g, ''))}
                placeholder="299" type="text" dir="ltr"
                className="w-full pr-9 pl-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white transition-all text-right" />
            </div>
          </div>
        </div>

        {/* Section: Price tiers */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={addTier} disabled={tiers.length >= 5}
              className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <Plus className="w-4 h-4" />הוסף שלב
            </button>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-gray-800 text-lg">שלבי מחיר קבוצתי</h3>
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4 text-right">
            <p className="text-xs text-green-700 leading-relaxed">
              <strong>טיפ:</strong> הגדר מחירים יורדים לכל שלב. ככל שיותר קונים מצטרפים — המחיר יורד לכולם.
            </p>
          </div>

          <div className="space-y-3">
            {tiers.map((tier, i) => {
              const savings = form.originalPrice && tier.price
                ? Number(form.originalPrice) - Number(tier.price) : null
              return (
                <div key={i} className="flex items-end gap-2">
                  <button type="button" onClick={() => removeTier(i)} disabled={tiers.length <= 1}
                    className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-20 transition-colors mb-1 shrink-0">
                    <Minus className="w-4 h-4" />
                  </button>

                  {savings !== null && (
                    <div className="shrink-0 mb-1">
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">
                        -₪{savings}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">מחיר לקונה (₪)</label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">₪</span>
                      <input value={tier.price} onChange={e => setTier(i, 'price', e.target.value.replace(/\D/g, ''))}
                        placeholder="199" dir="ltr"
                        className="w-full pr-7 pl-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-right" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">מינימום קונים</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">+</span>
                      <input value={tier.buyers} onChange={e => setTier(i, 'buyers', e.target.value.replace(/\D/g, ''))}
                        placeholder="10" dir="ltr"
                        className="w-full pr-3 pl-7 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-right" />
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-black shrink-0 mb-1">
                    {i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Preview card */}
        {form.productName && form.originalPrice && (
          <div className="bg-white rounded-2xl p-5 border border-green-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 justify-end">
              <h3 className="font-black text-gray-800">תצוגה מקדימה</h3>
              <Zap className="w-5 h-5 text-green-500" />
            </div>
            <div className={`h-24 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl mb-3 shadow-inner`}>
              {form.emoji}
            </div>
            <p className="font-black text-gray-800 text-sm">{form.productName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{form.description || 'תיאור המוצר...'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-black text-green-600">
                ₪{tiers[0]?.price || '—'}
              </span>
              <span className="text-sm text-gray-400 line-through">₪{form.originalPrice}</span>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{form.category}</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={!isValid}
          className="w-full bg-gradient-to-l from-green-600 to-emerald-500 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-xl font-black text-base shadow-lg shadow-green-200 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2">
          <Store className="w-5 h-5" />
          פרסם עסקה עכשיו
        </button>
        <p className="text-center text-xs text-gray-400 pb-2">
          בלחיצה על "פרסם", אתה מסכים לתנאי השימוש של DropPrice לעסקים
        </p>
      </form>
    </div>
  )
}
