import { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useChat } from '../chat/ChatContext'
import { getLang, t } from '../i18n'

const CATEGORIES = ['bug', 'content', 'other']
const field = 'w-full bg-ink-900 border border-ink-600 rounded-xl px-3 outline-none focus:border-white/40'

function Field({ label, children }) {
  return (
    <label className="block mt-3">
      <span className="block text-[13px] text-muted mb-1.5">{label}</span>
      {children}
    </label>
  )
}

// Form for suggesting an event (kind 'event') or reporting a problem (kind
// 'report'). Entries go to the admin page's inbox.
export default function ContactSheet({ kind, onClose }) {
  const { service } = useChat()
  const [values, setValues] = useState({ category: 'bug' })
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))
  const isEvent = kind === 'event'
  const ready = (isEvent ? values.name : values.message)?.trim()

  const submit = async (e) => {
    e.preventDefault()
    if (!ready || busy || !service) return
    setBusy(true)
    setError('')
    const keys = isEvent ? ['name', 'date', 'place', 'link', 'message', 'contact'] : ['category', 'message', 'contact']
    const entry = { type: kind, page: window.location.href.slice(0, 300), lang: getLang() }
    for (const key of keys) {
      const value = values[key]?.trim()
      if (value) entry[key] = value
    }
    try {
      await service.submitInbox(entry)
      setSent(true)
    } catch (err) {
      console.warn('inbox submit failed', err)
      setError(t('contact.error'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-ink-800 w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border hairline p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-slide-up"
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">{t(isEvent ? 'contact.eventTitle' : 'contact.reportTitle')}</h2>
            {!sent && <p className="text-sm text-muted mt-1">{t(isEvent ? 'contact.eventIntro' : 'contact.reportIntro')}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label={t('common.close')}><X size={20} className="text-muted" /></button>
        </div>

        {sent ? (
          <div className="py-10 flex flex-col items-center text-center">
            <CheckCircle2 size={44} strokeWidth={1.5} className="text-online" />
            <p className="font-semibold text-lg mt-4">{t('contact.thanks')}</p>
            <p className="text-sm text-muted mt-1">{t('contact.thanksBody')}</p>
            <button type="button" onClick={onClose} className="mt-6 h-11 px-8 rounded-full bg-brand text-white font-medium">{t('common.close')}</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-2">
            {isEvent ? (
              <>
                <Field label={`${t('contact.name')} *`}>
                  <input autoFocus value={values.name ?? ''} onChange={set('name')} maxLength={120} className={`${field} h-11`} dir="auto" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t('contact.date')}>
                    <input value={values.date ?? ''} onChange={set('date')} maxLength={60} className={`${field} h-11`} dir="auto" />
                  </Field>
                  <Field label={t('contact.place')}>
                    <input value={values.place ?? ''} onChange={set('place')} maxLength={120} className={`${field} h-11`} dir="auto" />
                  </Field>
                </div>
                <Field label={t('contact.link')}>
                  <input type="url" value={values.link ?? ''} onChange={set('link')} maxLength={300} placeholder="https://" className={`${field} h-11`} dir="ltr" />
                </Field>
                <Field label={t('contact.details')}>
                  <textarea value={values.message ?? ''} onChange={set('message')} maxLength={2000} rows={3} className={`${field} py-2.5 resize-none`} dir="auto" />
                </Field>
              </>
            ) : (
              <>
                <span className="block text-[13px] text-muted mt-3 mb-1.5">{t('contact.kind')}</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValues((v) => ({ ...v, category: c }))}
                      aria-pressed={values.category === c}
                      className={`h-9 px-3.5 rounded-full text-[13px] border transition-colors ${values.category === c ? 'bg-brand text-white border-transparent' : 'border-ink-600 text-white/80 hover:border-white/40'}`}
                    >
                      {t(`contact.${c}`)}
                    </button>
                  ))}
                </div>
                <Field label={`${t('contact.message')} *`}>
                  <textarea autoFocus value={values.message ?? ''} onChange={set('message')} maxLength={2000} rows={4} className={`${field} py-2.5 resize-none`} dir="auto" />
                </Field>
              </>
            )}
            <Field label={t('contact.contact')}>
              <input value={values.contact ?? ''} onChange={set('contact')} maxLength={120} placeholder={t('contact.contactPlaceholder')} className={`${field} h-11`} dir="auto" />
            </Field>
            {error && <p className="text-sm text-rose-400 mt-3">{error}</p>}
            <button type="submit" disabled={!ready || busy || !service} className="w-full h-12 mt-5 rounded-full bg-brand text-white font-semibold disabled:opacity-40">
              {busy ? t('contact.sending') : t('contact.send')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
