import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, Mail, MapPin, Wallet, CheckCircle, ArrowLeft, Shield } from 'lucide-react'

const BUDGETS = [
  'עד ₪1,000,000',
  '₪1,000,000 – ₪1,500,000',
  '₪1,500,000 – ₪2,000,000',
  '₪2,000,000 – ₪3,000,000',
  'מעל ₪3,000,000',
  'טרם החלטתי',
]

const AREAS = [
  'תל אביב והמרכז',
  'ירושלים והסביבה',
  'חיפה והצפון',
  'באר שבע והדרום',
  'נתניה ושרון',
  'ראשון לציון וגוש דן',
  'פתח תקווה ועמק האלון',
  'אחר / פתוח לאפשרויות',
]

export default function LeadForm() {
  const [form, setForm]       = useState({ name: '', phone: '', email: '', budget: '', area: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())                                               e.name   = 'שם מלא הוא שדה חובה'
    if (!/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, '')))           e.phone  = 'מספר טלפון לא תקין'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))                 e.email  = 'כתובת אימייל לא תקינה'
    if (!form.budget)                                                    e.budget = 'יש לבחור תקציב'
    if (!form.area)                                                      e.area   = 'יש לבחור אזור'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true) }, 1400)
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => { const n = { ...er }; delete n[field]; return n })
  }

  return (
    <section id="lead-form" className="py-16 px-4" dir="rtl"
      style={{ background: '#f4fbf7', borderTop: '1px solid #e2e8f0' }}>
      <div className="max-w-2xl mx-auto">

        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="chip-gold mb-4">
            <Shield className="w-3.5 h-3.5" />
            בדיקת התאמה חינמית ומחייבת
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3" style={{ color: '#0d3320' }}>
            בדוק אם אתה <span style={{ color: '#22a855' }}>מתאים לקבוצה</span>
          </h2>
          <p className="text-lg" style={{ color: '#64748b' }}>
            השאר פרטים ונבדוק עבורך את ההתאמה הטובה ביותר —{' '}
            <strong style={{ color: '#0d3320' }}>ללא עלות ובלי התחייבות</strong>.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success"
              className="rounded-3xl p-10 text-center"
              style={{ background: '#fff', border: '2px solid rgba(34,168,85,0.4)' }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(34,168,85,0.1)', border: '2px solid rgba(34,168,85,0.4)' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#22a855' }} />
              </motion.div>
              <h3 className="text-2xl font-black mb-2" style={{ color: '#0d3320' }}>קיבלנו! נחזור אליך בהקדם 🎉</h3>
              <p className="mb-6" style={{ color: '#64748b' }}>
                נציג שלנו יצור איתך קשר תוך <strong style={{ color: '#155c34' }}>24 שעות</strong>.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'ממוצע חיסכון', value: '18%' },
                  { label: 'לקוחות מרוצים', value: '2,400+' },
                  { label: 'פרויקטים פעילים', value: '12' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3" style={{ background: '#f4fbf7', border: '1px solid #e2e8f0' }}>
                    <p className="text-xl font-black" style={{ color: '#155c34' }}>{value}</p>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit}
              className="rounded-3xl overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              <div className="px-6 py-4 flex items-center justify-between"
                style={{ background: '#f4fbf7', borderBottom: '1px solid #e2e8f0' }}>
                <p className="text-xs" style={{ color: '#94a3b8' }}>ממוצע זמן מילוי: <strong style={{ color: '#475569' }}>90 שניות</strong></p>
                <p className="text-sm font-bold" style={{ color: '#0d3320' }}>הצטרפות לקבוצת רחישה</p>
              </div>

              <div className="p-6 space-y-5">
                <Field icon={User} label="שם מלא" error={errors.name} required>
                  <input type="text" placeholder="ישראל ישראלי" value={form.name} onChange={set('name')}
                    className="input-clean w-full rounded-xl px-4 py-3 text-right" />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field icon={Phone} label="טלפון נייד" error={errors.phone} required>
                    <input type="tel" placeholder="050-0000000" value={form.phone} onChange={set('phone')}
                      className="input-clean w-full rounded-xl px-4 py-3 text-right" dir="ltr" />
                  </Field>
                  <Field icon={Mail} label="אימייל" error={errors.email} required>
                    <input type="email" placeholder="name@example.com" value={form.email} onChange={set('email')}
                      className="input-clean w-full rounded-xl px-4 py-3 text-right" dir="ltr" />
                  </Field>
                </div>

                <Field icon={Wallet} label="תקציב משוער" error={errors.budget} required>
                  <select value={form.budget} onChange={set('budget')}
                    className="input-clean w-full rounded-xl px-4 py-3 text-right appearance-none cursor-pointer">
                    <option value="" disabled>בחר תקציב...</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>

                <Field icon={MapPin} label="אזור מועדף" error={errors.area} required>
                  <select value={form.area} onChange={set('area')}
                    className="input-clean w-full rounded-xl px-4 py-3 text-right appearance-none cursor-pointer">
                    <option value="" disabled>בחר אזור...</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </Field>

                <motion.button type="submit" disabled={loading}
                  className="btn-gold w-full py-4 rounded-2xl text-lg flex items-center justify-center gap-3 mt-2 disabled:opacity-70"
                  whileHover={loading ? {} : { scale: 1.02 }} whileTap={loading ? {} : { scale: 0.97 }}>
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>בודק התאמה...</span></>
                  ) : (
                    <><span>בדיקת התאמה לקבוצה</span><ArrowLeft className="w-5 h-5" /></>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-5 pt-1">
                  {['🔒 אבטחה מלאה', '✓ ללא עלות', '📞 תוך 24 שעות'].map(t => (
                    <span key={t} className="text-xs font-medium" style={{ color: '#94a3b8' }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Field({ icon: Icon, label, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-end gap-1.5">
        {required && <span className="text-red-400 text-xs">*</span>}
        <span className="text-sm font-semibold" style={{ color: '#475569' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color: '#94a3b8' }} />
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p className="text-xs text-red-500 text-right"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
