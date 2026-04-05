import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, User, ArrowLeft, Loader2, CheckCircle, Store } from 'lucide-react'
import { cacheUser } from '../utils/user'

const BACKDROP = { position: 'fixed', inset: 0, zIndex: 9999 }

export default function LoginModal({ onClose, onLogin }) {
  const [step,     setStep]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [userType, setUserType] = useState('buyer') // 'buyer' | 'business'
  const [form,     setForm]     = useState({ name: '', phone: '', email: '', businessName: '' })
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name  = 'נדרש שם מלא'
    if (!/^05\d{8}$/.test(form.phone))   e.phone = 'מספר פלאפון לא תקין (05XXXXXXXX)'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'כתובת אימייל לא תקינה'
    if (userType === 'business' && !form.businessName.trim()) e.businessName = 'נדרש שם עסק'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const userData = {
      name:         form.name,
      phone:        form.phone,
      email:        form.email || '',
      userType,
      businessName: userType === 'business' ? form.businessName : '',
    }

    // Try real API, fall back to local
    let savedUser = null
    try {
      const res = await fetch('/api/users', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...userData, email: userData.email || `${Date.now()}@dropprice.guest` }),
      })
      const data = await res.json()
      if (res.ok && data.user) savedUser = { ...data.user, ...userData }
    } catch { /* offline */ }

    if (!savedUser) {
      savedUser = { id: `local_${Date.now()}`, ...userData }
    }

    cacheUser(savedUser)
    onLogin?.(savedUser)
    setLoading(false)
    setStep(2)
  }

  const setF = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors(er => { const n = { ...er }; delete n[key]; return n })
  }

  const inputClass = (key) => `input-clean w-full pr-10 pl-4 py-3 rounded-xl text-sm`
  const inputStyle = (key) => errors[key] ? { border: '1px solid rgba(239,68,68,0.6)' } : {}

  return (
    <div style={BACKDROP} className="flex items-end sm:items-center justify-center p-4 sm:p-0" dir="rtl">
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 24px 60px rgba(21,92,52,0.12)' }}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      >
        {/* Green top strip */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #22a855, #1a7a40)' }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #f1f5f9' }}>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: '#f4fbf7', color: '#94a3b8' }}
            onMouseEnter={e => e.currentTarget.style.color = '#155c34'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
            <X className="w-4 h-4" />
          </button>
          <div className="text-right">
            <h2 className="text-lg font-black" style={{ color: '#0d3320' }}>
              {step === 1 ? 'כניסה / הרשמה' : 'ברוך הבא! 🎉'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
              {step === 1 ? 'הצטרף לקהילת החוסכים של DropPrice' : 'החשבון שלך מוכן'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="form" onSubmit={handleSubmit}
              className="px-6 py-5 space-y-4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* User type toggle */}
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: '#e2e8f0' }}>
                {[
                  { value: 'buyer',    label: 'לקוח',  icon: User  },
                  { value: 'business', label: 'עסק',   icon: Store },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setUserType(value); setErrors({}) }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all"
                    style={userType === value
                      ? { background: 'linear-gradient(135deg, #22a855, #1a7a40)', color: '#fff' }
                      : { background: '#f8fafc', color: '#94a3b8' }
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-right" style={{ color: '#475569' }}>שם מלא *</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94a3b8' }} />
                  <input type="text" placeholder="ישראל ישראלי" value={form.name} onChange={setF('name')}
                    dir="rtl" className={inputClass('name')} style={inputStyle('name')} />
                </div>
                {errors.name && <p className="text-xs text-red-500 text-right">{errors.name}</p>}
              </div>

              {/* Business name (conditional) */}
              <AnimatePresence>
                {userType === 'business' && (
                  <motion.div className="space-y-1.5"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <label className="block text-sm font-semibold text-right" style={{ color: '#475569' }}>שם העסק *</label>
                    <div className="relative">
                      <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94a3b8' }} />
                      <input type="text" placeholder='סופר כהן בע"מ' value={form.businessName} onChange={setF('businessName')}
                        dir="rtl" className={inputClass('businessName')} style={inputStyle('businessName')} />
                    </div>
                    {errors.businessName && <p className="text-xs text-red-500 text-right">{errors.businessName}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-right" style={{ color: '#475569' }}>פלאפון *</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94a3b8' }} />
                  <input type="tel" placeholder="0501234567" value={form.phone} onChange={setF('phone')}
                    dir="rtl" className={inputClass('phone')} style={inputStyle('phone')} />
                </div>
                {errors.phone && <p className="text-xs text-red-500 text-right">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-right" style={{ color: '#475569' }}>אימייל (אופציונלי)</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94a3b8' }} />
                  <input type="email" placeholder="user@example.com" value={form.email} onChange={setF('email')}
                    dir="rtl" className={inputClass('email')} style={inputStyle('email')} />
                </div>
                {errors.email && <p className="text-xs text-red-500 text-right">{errors.email}</p>}
              </div>

              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3.5 rounded-2xl font-black text-base disabled:opacity-60 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> מאמת...</>
                    : <><ArrowLeft className="w-5 h-5" /> כניסה לחשבון</>
                  }
                </motion.button>
              </div>

              <p className="text-center text-xs pb-1" style={{ color: '#cbd5e1' }}>
                בלחיצה על כניסה אתה מסכים ל
                <button type="button" className="mx-1 hover:underline" style={{ color: '#22a855' }}>תנאי השימוש</button>
                שלנו
              </p>
            </motion.form>
          ) : (
            <motion.div key="success"
              className="px-6 py-8 flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>

              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#22a855' }} />
              </div>

              <div>
                <h3 className="text-xl font-black mb-1" style={{ color: '#0d3320' }}>שלום, {form.name}! 👋</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  {userType === 'business'
                    ? <>החשבון של <strong>{form.businessName}</strong> נוצר בהצלחה.<br />עכשיו תוכל לפרסם עסקאות קבוצתיות.</>
                    : <>החשבון שלך נוצר בהצלחה.<br />עכשיו תוכל להצטרף לעסקאות ולחסוך כסף.</>
                  }
                </p>
              </div>

              <div className="w-full p-4 rounded-2xl text-right space-y-2"
                style={{ background: '#f4fbf7', border: '1px solid #e2e8f0' }}>
                <p className="text-xs font-semibold" style={{ color: '#94a3b8' }}>מה הלאה?</p>
                {(userType === 'business'
                  ? ['פרסם את העסקה הראשונה שלך 🛍️', 'קבל התראות בזמן אמת על הצטרפות קונים 📲', 'נהל את העסקאות שלך בדשבורד 📊']
                  : ['הצטרף לעסקה הראשונה שלך 🛒', 'שתף חברים וקבל 5% הנחה נוספת 🎁', 'עקוב אחרי הדילים שלך בדשבורד 📊']
                ).map((t, i) => (
                  <div key={i} className="flex items-center gap-2 justify-end">
                    <p className="text-sm" style={{ color: '#475569' }}>{t}</p>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: 'rgba(34,168,85,0.1)', color: '#1a7a40' }}>{i + 1}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={onClose}
                className="btn-gold w-full py-3.5 rounded-2xl font-black text-base"
                whileTap={{ scale: 0.98 }}
              >
                מעולה, יאללה! 🚀
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
