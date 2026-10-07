import { useState } from 'react'
import { X } from 'lucide-react'
import { t } from '../i18n'

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

// Sign-in prompt. With Firebase: Google. In preview mode: a name kept on this device.
export default function SignInSheet({ canUseGoogle, onGoogle, onPreviewName, onClose }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const trimmed = name.trim()

  const run = async (action) => {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch {
      setError(t('signin.error'))
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-ink-800 w-full sm:max-w-sm rounded-t-lg sm:rounded-lg border hairline p-6 animate-slide-up">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{t('signin.title')}</h2>
            <p className="text-sm text-muted mt-1">{t('signin.subtitle')}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t('common.close')}><X size={20} className="text-muted" /></button>
        </div>

        {canUseGoogle ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => run(onGoogle)}
            className="w-full h-12 mt-6 rounded-md bg-white text-black font-medium flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <GoogleMark /> {busy ? t('signin.connecting') : t('signin.google')}
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (trimmed) run(() => onPreviewName(trimmed))
            }}
            className="mt-5"
          >
            <p className="text-[12px] text-accent border border-accent/30 rounded-md px-3 py-2 mb-4 leading-relaxed">
              {t('signin.preview')}
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder={t('signin.namePlaceholder')}
              className="w-full h-12 bg-ink-900 border border-ink-600 rounded-md px-3 outline-none focus:border-white/40"
            />
            <button type="submit" disabled={!trimmed || busy} className="w-full h-12 mt-3 rounded-md bg-accent text-black font-medium disabled:opacity-40">
              {busy ? t('signin.wait') : t('signin.enter')}
            </button>
          </form>
        )}

        {error && <p className="text-rose-400 text-sm mt-3">{error}</p>}
        <p className="text-[11px] text-muted mt-5 leading-relaxed">
          {t('signin.privacy')}
        </p>
      </div>
    </div>
  )
}
