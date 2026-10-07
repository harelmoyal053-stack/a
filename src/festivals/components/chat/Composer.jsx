import { useEffect, useRef, useState } from 'react'
import { BarChart3, Camera, Image as ImageIcon, MapPin, Paperclip, Pencil, Reply, Send, Smile, X } from 'lucide-react'
import { t } from '../../i18n'
import { MAX_TEXT, preview } from '../../chat/messages'
import EmojiPicker from './EmojiPicker'

const ATTACHMENTS = [
  { id: 'gallery', icon: ImageIcon },
  { id: 'camera', icon: Camera },
  { id: 'poll', icon: BarChart3 },
  { id: 'location', icon: MapPin },
]

export default function Composer({ replyTo, editing, onCancel, onSend, onPickImage, onPoll, onLocation }) {
  // ChatScreen remounts the composer (via key) when editing starts, so this seeds the text.
  const [text, setText] = useState(editing?.text ?? '')
  const [panel, setPanel] = useState(null) // 'emoji' | 'attach' | null
  const inputRef = useRef(null)
  const galleryRef = useRef(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    if (editing || replyTo) inputRef.current?.focus()
  }, [editing, replyTo])

  const submit = (e) => {
    e?.preventDefault()
    const body = text.trim()
    if (!body) return
    onSend(body)
    setText('')
    setPanel(null)
  }

  const pickFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) onPickImage(file)
  }

  const attach = (id) => {
    setPanel(null)
    if (id === 'gallery') galleryRef.current.click()
    if (id === 'camera') cameraRef.current.click()
    if (id === 'poll') onPoll()
    if (id === 'location') onLocation()
  }

  const context = editing ?? replyTo

  return (
    <div className="max-w-2xl mx-auto">
      {context && (
        <div className="flex items-center gap-2 bg-ink-800 rounded-md px-3 py-2 mb-2 border-s-2 border-accent">
          {editing ? <Pencil size={16} className="text-whatsapp shrink-0" /> : <Reply size={16} className="text-whatsapp shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-whatsapp">{editing ? t('composer.editing') : t('composer.replyTo', { name: replyTo.name })}</p>
            <p className="text-xs text-white/60 truncate" dir="auto">{preview(context)}</p>
          </div>
          <button type="button" onClick={() => { onCancel(); setText('') }} aria-label={t('common.cancel')}><X size={18} className="text-white/60" /></button>
        </div>
      )}

      {panel === 'emoji' && <EmojiPicker className="mb-2" onPick={(emoji) => setText((t) => t + emoji)} />}
      {panel === 'attach' && (
        <div className="grid grid-cols-4 gap-2 border hairline rounded-lg p-4 mb-2 text-muted">
          {ATTACHMENTS.map((a) => {
            const Icon = a.icon
            return (
              <button key={a.id} type="button" onClick={() => attach(a.id)} className="flex flex-col items-center gap-1.5 text-xs">
                <span className="w-11 h-11 rounded-md border border-ink-600 flex items-center justify-center"><Icon size={19} strokeWidth={1.75} /></span>
                {t(`composer.${a.id}`)}
              </button>
            )
          })}
        </div>
      )}

      <form onSubmit={submit} className="flex items-end gap-2">
        <div className="flex-1 flex items-end bg-ink-800 border border-ink-600 rounded-lg focus-within:border-white/30">
          <button type="button" onClick={() => setPanel(panel === 'emoji' ? null : 'emoji')} className="w-11 h-11 shrink-0 flex items-center justify-center text-white/60" aria-label={t('composer.emojis')} aria-pressed={panel === 'emoji'}>
            <Smile size={22} />
          </button>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) submit(e)
            }}
            rows={1}
            maxLength={MAX_TEXT}
            placeholder={t('composer.placeholder')}
            className="flex-1 resize-none bg-transparent py-2.5 outline-none max-h-32"
            aria-label={t('composer.placeholder')}
          />
          {!editing && (
            <button type="button" onClick={() => setPanel(panel === 'attach' ? null : 'attach')} className="w-11 h-11 shrink-0 flex items-center justify-center text-white/60" aria-label={t('composer.attach')} aria-pressed={panel === 'attach'}>
              <Paperclip size={20} />
            </button>
          )}
        </div>
        <button type="submit" disabled={!text.trim()} className="w-11 h-11 shrink-0 rounded-lg bg-accent text-black flex items-center justify-center disabled:opacity-30" aria-label={t('common.send')}>
          <Send size={20} className="rtl:-scale-x-100" />
        </button>
      </form>

      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={pickFile} />
    </div>
  )
}
