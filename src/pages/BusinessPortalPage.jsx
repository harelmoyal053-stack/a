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

const FIELD_CLS  = 'input-dark w-full px-4 py-3 rounded-xl text-sm'
const SELECT_CLS = 'input-dark w-full px-4 py-3 rounded-xl text-sm appearance-none'
const SECTION_CLS = 'glass border border-white/8 rounded-2xl p-5 space-y-4'

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
      style={{ background: 'rgba(5,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,136,0.12)' }}>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {!submitted ? (
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-neon-green font-semibold transition-colors text-sm">
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
        ) : <div className="w-16" />}
        <span className="font-black text-white">פורטל עסקים{!submitted ? ' — עסקה חדשה' : ''}</span>
        <div className="w-16" />
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen" style={{ background: '#050810' }} dir="rtl">
      {NAV}
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-6">
        <motion.div className="rounded-3xl p-10 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,180,255,0.08))', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 50px rgba(0,255,136,0.12)' }}
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="absolute inset-0 circuit-bg opacity-50" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(0,255,136,0.12)', border: '2px solid rgba(0,255,136,0.4)', boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}>
              <CheckCircle className="w-10 h-10 text-neon-green" />
            </div>
            <h2 className="text-3xl font-black mb-2">העסקה עלתה לאוויר! 🎉</h2>
            <p className="text-slate-400 text-base">"{form.productName}" פורסם בהצלחה</p>
          </div>
        </motion.div>

        <div className="glass border border-white/8 rounded-2xl p-6 text-right space-y-3">
          <h3 className="font-black text-white text-lg">מה קורה עכשיו?</h3>
          {[
            'העסקה שלך תוצג לאלפי קונים בפלטפורמה',
            'תקבל SMS + מייל לכל קונה שמצטרף לקבוצה',
            'כשמספר הקונים מגיע ליעד — עסקה מופעלת אוטומטית',
            'תשלום מועבר אליך תוך 3 ימי עסקים',
          ].map((text, n) => (
            <div key={n} className="flex items-start gap-3 justify-end">
              <p className="text-sm text-slate-400">{text}</p>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408' }}>
                {n + 1}
              </div>
            </div>
          ))}
        </div>

        <motion.button onClick={onBack}
          className="w-full btn-neon py-3.5 rounded-xl font-black text-base"
          whileTap={{ scale: 0.97 }}>
          חזרה לדף הבית
        </motion.button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-10" style={{ background: '#050810' }} dir="rtl">
      {NAV}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Intro */}
        <div className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,180,255,0.07))', border: '1px solid rgba(0,255,136,0.2)' }}>
          <div className="absolute inset-0 circuit-bg opacity-40" />
          <div className="relative z-10 flex items-center gap-3 justify-end mb-2">
            <h2 className="text-xl font-black text-white">פרסם עסקה קבוצתית</h2>
            <Store className="w-6 h-6 text-neon-green" />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed text-right relative z-10">
            הגדר את מבנה ההנחות שלך — DropPrice מביאה את הקהל, אתה מביא את המוצר.
          </p>
        </div>

        {/* Business info */}
        <div className={SECTION_CLS}>
          <h3 className="font-black text-white text-lg text-right flex items-center gap-2 justify-end">
            פרטי העסק <span className="text-xl">🏢</span>
          </h3>
          {[
            { key: 'businessName', label: 'שם העסק *',            placeholder: 'סופר כהן בע״מ' },
            { key: 'contactEmail', label: 'מייל ליצירת קשר *',   placeholder: 'contact@example.com', dir: 'ltr' },
            { key: 'contactPhone', label: 'טלפון *',              placeholder: '05X-XXXXXXX',          dir: 'ltr' },
          ].map(({ key, label, placeholder, dir }) => (
            <div key={key}>
              <label className="block text-sm font-bold text-slate-500 mb-1.5">{label}</label>
              <input value={form[key]} onChange={e => setField(key, e.target.value)}
                placeholder={placeholder} dir={dir} className={FIELD_CLS} />
            </div>
          ))}
        </div>

        {/* Product info */}
        <div className={SECTION_CLS}>
          <h3 className="font-black text-white text-lg text-right flex items-center gap-2 justify-end">
            פרטי המוצר <Tag className="w-5 h-5 text-neon-blue" />
          </h3>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">אמוג׳י לעסקה</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <motion.button key={e} type="button" onClick={() => setField('emoji', e)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all border-2"
                  style={form.emoji === e
                    ? { background: 'rgba(0,255,136,0.12)', borderColor: '#00ff88', boxShadow: '0 0 10px rgba(0,255,136,0.3)' }
                    : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.9 }}>
                  {e}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-1.5">שם המוצר *</label>
            <input value={form.productName} onChange={e => setField('productName', e.target.value)}
              placeholder='מארז שוקולד פרימיום 500 גר׳' className={FIELD_CLS} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-1.5">תיאור קצר</label>
            <textarea value={form.description} onChange={e => setField('description', e.target.value)}
              placeholder="תאר את המוצר: תכולה, גודל, יתרונות..."
              rows={3} className={FIELD_CLS + ' resize-none'} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1.5">קטגוריה *</label>
              <select value={form.category} onChange={e => setField('category', e.target.value)} className={SELECT_CLS}>
                <option value="">בחר...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1.5">משך העסקה</label>
              <select value={form.duration} onChange={e => setField('duration', e.target.value)} className={SELECT_CLS}>
                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-1.5">מחיר מקורי (ללא הנחה) *</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₪</span>
              <input value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value.replace(/\D/g, ''))}
                placeholder="299" type="text" dir="ltr"
                className={FIELD_CLS + ' pr-9'} style={{ textAlign: 'right' }} />
            </div>
          </div>
        </div>

        {/* Price tiers */}
        <div className="glass border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <motion.button type="button" onClick={addTier} disabled={tiers.length >= 5}
              className="flex items-center gap-1.5 text-sm text-neon-green hover:text-neon-green/80 font-bold disabled:opacity-30 transition-colors"
              whileTap={{ scale: 0.95 }}>
              <Plus className="w-4 h-4" />הוסף שלב
            </motion.button>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-lg">שלבי מחיר קבוצתי</h3>
              <TrendingDown className="w-5 h-5 text-neon-green" />
            </div>
          </div>

          <div className="rounded-xl p-3 mb-4 text-right"
            style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
            <p className="text-xs text-neon-green/80 leading-relaxed">
              <strong>טיפ:</strong> הגדר מחירים יורדים — ככל שיותר קונים, כך המחיר יורד לכולם.
            </p>
          </div>

          <div className="space-y-3">
            {tiers.map((tier, i) => {
              const savings = form.originalPrice && tier.price ? Number(form.originalPrice) - Number(tier.price) : null
              return (
                <div key={i} className="flex items-end gap-2">
                  <motion.button type="button" onClick={() => removeTier(i)} disabled={tiers.length <= 1}
                    className="p-2 text-slate-600 hover:text-red-400 disabled:opacity-20 transition-colors mb-1 shrink-0"
                    whileTap={{ scale: 0.9 }}>
                    <Minus className="w-4 h-4" />
                  </motion.button>

                  {savings !== null && (
                    <div className="shrink-0 mb-1">
                      <span className="text-xs font-black px-2 py-1 rounded-full"
                        style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.25)' }}>
                        -₪{savings}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">מחיר לקונה (₪)</label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₪</span>
                      <input value={tier.price} onChange={e => setTier(i, 'price', e.target.value.replace(/\D/g, ''))}
                        placeholder="199" dir="ltr"
                        className="input-dark w-full pr-7 pl-3 py-2.5 rounded-xl text-sm" style={{ textAlign: 'right' }} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">מינימום קונים</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">+</span>
                      <input value={tier.buyers} onChange={e => setTier(i, 'buyers', e.target.value.replace(/\D/g, ''))}
                        placeholder="10" dir="ltr"
                        className="input-dark w-full pr-3 pl-7 py-2.5 rounded-xl text-sm" style={{ textAlign: 'right' }} />
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mb-1"
                    style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', color: '#020408' }}>
                    {i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Preview */}
        {form.productName && form.originalPrice && (
          <motion.div className="glass border rounded-2xl p-5"
            style={{ borderColor: 'rgba(0,255,136,0.25)', boxShadow: '0 0 20px rgba(0,255,136,0.06)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-2 mb-3 justify-end">
              <h3 className="font-black text-white">תצוגה מקדימה</h3>
              <Zap className="w-5 h-5 text-neon-green" />
            </div>
            <div className="h-24 rounded-xl flex items-center justify-center text-5xl mb-3"
              style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.12)' }}>
              {form.emoji}
            </div>
            <p className="font-black text-white text-sm">{form.productName}</p>
            <p className="text-xs text-slate-500 mt-0.5">{form.description || 'תיאור המוצר...'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-black neon-green">₪{tiers[0]?.price || '—'}</span>
              <span className="text-sm text-slate-600 line-through">₪{form.originalPrice}</span>
              {form.category && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,180,255,0.1)', color: '#00b4ff', border: '1px solid rgba(0,180,255,0.25)' }}>
                  {form.category}
                </span>
              )}
            </div>
          </motion.div>
        )}

        <motion.button type="submit" disabled={!isValid}
          className="w-full btn-neon disabled:opacity-30 py-4 rounded-xl font-black text-base flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}>
          <Store className="w-5 h-5" />
          פרסם עסקה עכשיו
        </motion.button>
        <p className="text-center text-xs text-slate-700 pb-2">
          בלחיצה על "פרסם", אתה מסכים לתנאי השימוש של DropPrice לעסקים
        </p>
      </form>
    </div>
  )
}
