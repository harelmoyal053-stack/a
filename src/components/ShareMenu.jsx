import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Share2, MessageCircle, Send } from 'lucide-react'
import { getInviteUrl, buildShareText } from '../utils/invite'

// ── WhatsApp icon ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── Telegram icon ─────────────────────────────────────────────────────────────
function TelegramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

export default function ShareMenu({ deal, onClose }) {
  const [inviteUrl, setInviteUrl] = useState('')
  const [copied,    setCopied]    = useState(false)
  const [canShare,  setCanShare]  = useState(false)

  useEffect(() => {
    setCanShare(!!navigator.share)
    getInviteUrl(deal.id).then(setInviteUrl)
  }, [deal.id])

  const shareText = inviteUrl ? buildShareText(deal, inviteUrl) : ''

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement('textarea')
      ta.value = inviteUrl; ta.style.position = 'fixed'
      document.body.appendChild(ta); ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    }
  }, [inviteUrl])

  const nativeShare = useCallback(async () => {
    try {
      await navigator.share({ title: `דיל מטורף על ${deal.title}!`, text: shareText, url: inviteUrl })
    } catch (_) {}
  }, [deal.title, shareText, inviteUrl])

  const whatsappUrl  = `https://wa.me/?text=${encodeURIComponent(shareText)}`
  const telegramUrl  = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(shareText)}`

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" dir="rtl">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(8,12,24,0.98)',
            border: '1px solid rgba(0,255,136,0.18)',
            boxShadow: '0 0 60px rgba(0,255,136,0.12), 0 -20px 60px rgba(0,0,0,0.8)',
          }}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0,     opacity: 1 }}
          exit={{    y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        >
          {/* Top neon line */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, transparent, #00ff88, #00b4ff, #7b2ff7, transparent)' }} />

          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1.5 rounded-full bg-white/20" />
          </div>

          <div className="p-5 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={onClose} className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
              <div className="text-right">
                <h2 className="text-xl font-black text-white">שתף וחסוך יחד 🚀</h2>
                <p className="text-sm text-slate-500 mt-0.5">כל חבר שמצטרף מוריד את המחיר לכולם</p>
              </div>
            </div>

            {/* Hebrew message preview */}
            <div className="rounded-2xl p-4 mb-4 text-right"
              style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.18)' }}>
              <p className="text-xs text-slate-500 mb-2 font-semibold">ההודעה שתשלח:</p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line"
                style={{ direction: 'rtl' }}>
                {shareText || 'טוען...'}
              </p>
            </div>

            {/* Invite URL + copy */}
            <div className="flex items-center gap-2 mb-5">
              <motion.button
                onClick={copyLink}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                style={copied
                  ? { background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.5)', color: '#00ff88' }
                  : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8' }
                }
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'הועתק!' : 'העתק'}
              </motion.button>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 overflow-hidden">
                <p className="text-xs text-slate-500 font-mono truncate" dir="ltr">
                  {inviteUrl || 'טוען...'}
                </p>
              </div>
            </div>

            {/* Share buttons */}
            <div className="space-y-3">
              {/* Native share (mobile) */}
              {canShare && (
                <motion.button
                  onClick={nativeShare}
                  className="w-full btn-neon py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-3"
                  whileTap={{ scale: 0.97 }}>
                  <Share2 className="w-5 h-5" />
                  שתף עכשיו
                </motion.button>
              )}

              {/* Direct app buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}>
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: 'rgba(0,136,204,0.12)', border: '1px solid rgba(0,136,204,0.3)', color: '#0088cc' }}>
                  <TelegramIcon className="w-5 h-5" />
                  Telegram
                </a>
              </div>
            </div>

            {/* Referral reward hint */}
            <div className="mt-4 flex items-center gap-2.5 rounded-xl p-3"
              style={{ background: 'rgba(123,47,247,0.1)', border: '1px solid rgba(123,47,247,0.25)' }}>
              <span className="text-xl">🌟</span>
              <p className="text-xs text-purple-300 leading-relaxed text-right">
                <strong className="text-purple-200">בונוס VIP!</strong>{' '}
                שלח לשלושה חברים שמצטרפים ותקבל תג VIP + 5% הנחה נוספת 🎁
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
