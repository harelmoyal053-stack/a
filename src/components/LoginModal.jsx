import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Mail, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

const BACKDROP = { position: 'fixed', inset: 0, zIndex: 9999 }

export default function LoginModal({ onClose }) {
  const [step,     setStep]     = useState(1) // 1=form, 2=success
  const [loading,  setLoading]  = useState(false)
  const [form,     setForm]     = useState({ name: '', phone: '', email: '' })
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name  = 'נדרש שם מלא'
    if (!/^05\d{8}$/.test(form.phone))   e.phone = 'מספר פלאפון לא תקין (05XXXXXXXX)'
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'כתובת אימייל לא תקינה'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep(2)
  }

  const field = (key, label, placeholder, icon, type = 'text') => {
    const Icon = icon
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-300 text-right">{label}</label>
        <div className="relative">
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={type}
            placeholder={placeholder}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            dir="rtl"
            className="w-full pr-10 pl-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: errors[key] ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.1)',
            }}
            onFocus={ev => { ev.target.style.borderColor = 'rgba(0,255,136,0.5)'; ev.target.style.background = 'rgba(255,255,255,0.07)' }}
            onBlur={ev  => { ev.target.style.borderColor = errors[key] ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.1)'; ev.target.style.background = 'rgba(255,255,255,0.05)' }}
          />
        </div>
        {errors[key] && <p className="text-xs text-red-400 text-right">{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div style={BACKDROP} className="flex items-end sm:items-center justify-center p-4 sm:p-0" dir="rtl">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'rgba(10,14,26,0.97)', border: '1px solid rgba(0,255,136,0.2)', boxShadow: '0 0 60px rgba(0,255,136,0.08)' }}
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      >
        {/* Glow strip */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #00ff88, #00b4ff, #7b2ff7)' }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X className="w-4 h-4" />
          </button>
          <div className="text-right">
            <h2 className="text-lg font-black text-white">
              {step === 1 ? 'כניסה / הרשמה' : 'ברוך הבא! 🎉'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 1 ? 'הצטרף לקהילת החוסכים של DropPrice' : 'החשבון שלך מוכן'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form key="form" onSubmit={handleSubmit}
              className="px-6 py-5 space-y-4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {field('name',  'שם מלא *',     'ישראל ישראלי',       User)}
              {field('phone', 'פלאפון *',      '0501234567',         Phone, 'tel')}
              {field('email', 'אימייל (אופציונלי)', 'user@example.com', Mail, 'email')}

              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-black text-base text-dark-900 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', boxShadow: '0 0 20px rgba(0,255,136,0.35)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> מאמת...</>
                    : <><ArrowLeft className="w-5 h-5" /> כניסה לחשבון</>
                  }
                </motion.button>
              </div>

              <p className="text-center text-xs text-slate-600 pb-1">
                בלחיצה על כניסה אתה מסכים ל
                <button type="button" className="text-neon-green mx-1 hover:underline">תנאי השימוש</button>
                שלנו
              </p>
            </motion.form>
          ) : (
            <motion.div key="success"
              className="px-6 py-8 flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>

              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,180,255,0.1))', border: '1px solid rgba(0,255,136,0.3)' }}>
                <CheckCircle className="w-10 h-10 text-neon-green" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white mb-1">שלום, {form.name}! 👋</h3>
                <p className="text-sm text-slate-400">החשבון שלך נוצר בהצלחה.<br />עכשיו תוכל להצטרף לעסקאות ולחסוך כסף.</p>
              </div>

              <div className="w-full p-4 rounded-2xl text-right space-y-2"
                style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)' }}>
                <p className="text-xs text-slate-500 font-semibold">מה הלאה?</p>
                {['הצטרף לעסקה הראשונה שלך 🛒', 'שתף חברים וקבל 5% הנחה נוספת 🎁', 'עקוב אחרי הדילים שלך בדשבורד 📊'].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 justify-end">
                    <p className="text-sm text-slate-300">{t}</p>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88' }}>{i + 1}</span>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-black text-base text-dark-900"
                style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', boxShadow: '0 0 20px rgba(0,255,136,0.3)' }}
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
