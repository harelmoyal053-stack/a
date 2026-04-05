import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Store, Plus, Minus, CheckCircle, TrendingDown, Zap, Tag } from 'lucide-react'

const CATEGORIES = ['מזון', 'תינוקות', 'תחבורה', 'ספורט', 'אלקטרוניקה', 'בית וגן', 'בריאות', 'אחר']
const DURATIONS  = [
  { value: '24',  label: '24 שעות'   },
  { value: '48',  label: '48 שעות'   },
  { value: '72',  label: '72 שעות'   },
  { value: '168', label: 'שבוע שלם'  },
]
const EMOJI_OPTIONS = ['🛍️','📦','🍕','👶','⛽','🍎','🏋️','☕','🎧','❄️','💊','🌿','🔧','🎁']
const EMPTY_TIER    = { buyers: '', price: '' }

const SECTION_CLS = 'card-clean rounded-2xl p-5 space-y-4'

export default function BusinessPortalPage({ onBack, onSubmit }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    businessName: '', contactEmail: '', contactPhone: '',
    productName: '', description: '', category: '',
    originalPrice: '', duration: '48', emoji: '🛍️',
  })
  const [tiers, setTiers] = useState([
    { buyers: '10', price: '' },
    { buyers: '25', price: '' },
    { buyers: '50', price: '' },
  ])

  const setField   = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const addTier    = () => tiers.length < 5 && setTiers(t => [...t, { ...EMPTY_TIER }])
  const removeTier = (i) => tiers.length > 1 && setTiers(t => t.filter((_, idx) => idx !== i))
  const setTier    = (i, key, val) => setTiers(t => t.map((tier, idx) => idx === i ? { ...tier, [key]: val } : tier))

  const isValid = form.businessName && form.productName && form.originalPrice && form.category &&
    tiers.every(t => t.buyers && t.price)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    onSubmit && onSubmit({ ...form, tiers })
  }

  const NAV = (
    <div className="sticky top-0 z-40"
      style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {!submitted ? (
          <button onClick={onBack}
            className="flex items-center gap-1.5 font-semibold transition-colors text-sm"
            style={{ color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a7a40'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
        ) : <div className="w-16" />}
        <span className="font-black" style={{ color: '#0d3320' }}>פורטל עסקים{!submitted ? ' — עסקה חדשה' : ''}</span>
        <div className="w-16" />
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen" style={{ background: '#f4fbf7' }} dir="rtl">
      {NAV}
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-6">
        <motion.div className="rounded-3xl p-10 relative overflow-hidden"
          style={{ background: '#fff', border: '1.5px solid #bbf7d0', boxShadow: '0 8px 30px rgba(21,92,52,0.1)' }}
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#22a855' }} />
          </div>
          <h2 className="text-3xl font-black mb-2" style={{ color: '#0d3320' }}>העסקה עלתה לאוויר! 🎉</h2>
          <p className="text-base" style={{ color: '#64748b' }}>"{form.productName}" פורסם בהצלחה</p>
        </motion.div>

        <div className="card-clean rounded-2xl p-6 text-right space-y-3">
          <h3 className="font-black text-lg" style={{ color: '#0d3320' }}>מה קורה עכשיו?</h3>
          {[
            'העסקה שלך תוצג לאלפי קונים בפלטפורמה',
            'תקבל SMS + מייל לכל קונה שמצטרף לקבוצה',
            'כשמספר הקונים מגיע ליעד — עסקה מופעלת אוטומטית',
            'תשלום מועבר אליך תוך 3 ימי עסקים',
          ].map((text, n) => (
            <div key={n} className="flex items-start gap-3 justify-end">
              <p className="text-sm" style={{ color: '#64748b' }}>{text}</p>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #22a855, #1a7a40)', color: '#fff' }}>
                {n + 1}
              </div>
            </div>
          ))}
        </div>

        <motion.button onClick={onBack}
          className="w-full btn-gold py-3.5 rounded-xl font-black text-base"
          whileTap={{ scale: 0.97 }}>
          חזרה לדף הבית
        </motion.button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-10" style={{ background: '#f4fbf7' }} dir="rtl">
      {NAV}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Intro */}
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f0fdf4, #d1fae5)', border: '1.5px solid #bbf7d0' }}>
          <div className="flex items-center gap-3 justify-end mb-2">
            <h2 className="text-xl font-black" style={{ color: '#0d3320' }}>פרסם עסקה קבוצתית</h2>
            <Store className="w-6 h-6" style={{ color: '#22a855' }} />
          </div>
          <p className="text-sm leading-relaxed text-right" style={{ color: '#475569' }}>
            הגדר את מבנה ההנחות שלך — DropPrice מביאה את הקהל, אתה מביא את המוצר.
          </p>
        </div>

        {/* Business info */}
        <div className={SECTION_CLS}>
          <h3 className="font-black text-lg text-right flex items-center gap-2 justify-end" style={{ color: '#0d3320' }}>
            פרטי העסק <span className="text-xl">🏢</span>
          </h3>
          {[
            { key: 'businessName', label: 'שם העסק *',           placeholder: 'סופר כהן בע״מ' },
            { key: 'contactEmail', label: 'מייל ליצירת קשר *',   placeholder: 'contact@example.com', dir: 'ltr' },
            { key: 'contactPhone', label: 'טלפון *',              placeholder: '05X-XXXXXXX',         dir: 'ltr' },
          ].map(({ key, label, placeholder, dir }) => (
            <div key={key}>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>{label}</label>
              <input value={form[key]} onChange={e => setField(key, e.target.value)}
                placeholder={placeholder} dir={dir} className="input-clean w-full px-4 py-3 rounded-xl text-sm" />
            </div>
          ))}
        </div>

        {/* Product info */}
        <div className={SECTION_CLS}>
          <h3 className="font-black text-lg text-right flex items-center gap-2 justify-end" style={{ color: '#0d3320' }}>
            פרטי המוצר <Tag className="w-5 h-5" style={{ color: '#22a855' }} />
          </h3>

          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: '#475569' }}>אמוג׳י לעסקה</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <motion.button key={e} type="button" onClick={() => setField('emoji', e)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2"
                  style={form.emoji === e
                    ? { background: '#f0fdf4', borderColor: '#22a855' }
                    : { background: '#f8fafc', borderColor: '#e2e8f0' }}
                  whileTap={{ scale: 0.9 }}>
                  {e}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>שם המוצר *</label>
            <input value={form.productName} onChange={e => setField('productName', e.target.value)}
              placeholder='מארז שוקולד פרימיום 500 גר׳' className="input-clean w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>תיאור קצר</label>
            <textarea value={form.description} onChange={e => setField('description', e.target.value)}
              placeholder="תאר את המוצר: תכולה, גודל, יתרונות..."
              rows={3} className="input-clean w-full px-4 py-3 rounded-xl text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>קטגוריה *</label>
              <select value={form.category} onChange={e => setField('category', e.target.value)}
                className="input-clean w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer">
                <option value="">בחר...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>משך העסקה</label>
              <select value={form.duration} onChange={e => setField('duration', e.target.value)}
                className="input-clean w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer">
                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: '#475569' }}>מחיר מקורי (ללא הנחה) *</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: '#94a3b8' }}>₪</span>
              <input value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value.replace(/\D/g, ''))}
                placeholder="299" type="text" dir="ltr"
                className="input-clean w-full pr-9 px-4 py-3 rounded-xl text-sm" style={{ textAlign: 'right' }} />
            </div>
          </div>
        </div>

        {/* Price tiers */}
        <div className="card-clean rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <motion.button type="button" onClick={addTier} disabled={tiers.length >= 5}
              className="flex items-center gap-1.5 text-sm font-bold disabled:opacity-30 transition-colors"
              style={{ color: '#22a855' }}
              whileTap={{ scale: 0.95 }}>
              <Plus className="w-4 h-4" />הוסף שלב
            </motion.button>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg" style={{ color: '#0d3320' }}>שלבי מחיר קבוצתי</h3>
              <TrendingDown className="w-5 h-5" style={{ color: '#22a855' }} />
            </div>
          </div>

          <div className="rounded-xl p-3 mb-4 text-right"
            style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
            <p className="text-xs leading-relaxed" style={{ color: '#1a7a40' }}>
              <strong>טיפ:</strong> הגדר מחירים יורדים — ככל שיותר קונים, כך המחיר יורד לכולם.
            </p>
          </div>

          <div className="space-y-3">
            {tiers.map((tier, i) => {
              const savings = form.originalPrice && tier.price ? Number(form.originalPrice) - Number(tier.price) : null
              return (
                <div key={i} className="flex items-end gap-2">
                  <motion.button type="button" onClick={() => removeTier(i)} disabled={tiers.length <= 1}
                    className="p-2 disabled:opacity-20 transition-colors mb-1 shrink-0 text-slate-400 hover:text-red-400"
                    whileTap={{ scale: 0.9 }}>
                    <Minus className="w-4 h-4" />
                  </motion.button>

                  {savings !== null && (
                    <div className="shrink-0 mb-1">
                      <span className="text-xs font-black px-2 py-1 rounded-full"
                        style={{ background: '#f0fdf4', color: '#1a7a40', border: '1px solid #bbf7d0' }}>
                        -₪{savings}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block text-xs font-bold mb-1" style={{ color: '#94a3b8' }}>מחיר לקונה (₪)</label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: '#94a3b8' }}>₪</span>
                      <input value={tier.price} onChange={e => setTier(i, 'price', e.target.value.replace(/\D/g, ''))}
                        placeholder="199" dir="ltr"
                        className="input-clean w-full pr-7 pl-3 py-2.5 rounded-xl text-sm" style={{ textAlign: 'right' }} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold mb-1" style={{ color: '#94a3b8' }}>מינימום קונים</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: '#94a3b8' }}>+</span>
                      <input value={tier.buyers} onChange={e => setTier(i, 'buyers', e.target.value.replace(/\D/g, ''))}
                        placeholder="10" dir="ltr"
                        className="input-clean w-full pr-3 pl-7 py-2.5 rounded-xl text-sm" style={{ textAlign: 'right' }} />
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mb-1"
                    style={{ background: 'linear-gradient(135deg, #22a855, #1a7a40)', color: '#fff' }}>
                    {i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Preview */}
        {form.productName && form.originalPrice && (
          <motion.div className="card-clean rounded-2xl p-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 mb-3 justify-end">
              <h3 className="font-black" style={{ color: '#0d3320' }}>תצוגה מקדימה</h3>
              <Zap className="w-5 h-5" style={{ color: '#22a855' }} />
            </div>
            <div className="h-24 rounded-xl flex items-center justify-center text-5xl mb-3"
              style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
              {form.emoji}
            </div>
            <p className="font-black text-sm" style={{ color: '#0d3320' }}>{form.productName}</p>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{form.description || 'תיאור המוצר...'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-black" style={{ color: '#1a7a40' }}>₪{tiers[0]?.price || '—'}</span>
              <span className="text-sm line-through" style={{ color: '#cbd5e1' }}>₪{form.originalPrice}</span>
              {form.category && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#f0fdf4', color: '#1a7a40', border: '1px solid #bbf7d0' }}>
                  {form.category}
                </span>
              )}
            </div>
          </motion.div>
        )}

        <motion.button type="submit" disabled={!isValid}
          className="w-full btn-gold disabled:opacity-30 py-4 rounded-xl font-black text-base flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}>
          <Store className="w-5 h-5" />
          פרסם עסקה עכשיו
        </motion.button>
        <p className="text-center text-xs pb-2" style={{ color: '#cbd5e1' }}>
          בלחיצה על "פרסם", אתה מסכים לתנאי השימוש של DropPrice לעסקים
        </p>
      </form>
    </div>
  )
}
