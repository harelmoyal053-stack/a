import { useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { clockTime } from '../../utils'
import { t } from '../../i18n'

export default function ImageViewer({ message, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] bg-black/95 flex flex-col" onClick={onClose}>
      <div className="flex justify-between items-center p-4" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="font-semibold">{message.name}</p>
          <p className="text-xs text-white/50">{clockTime(message.createdAt)}</p>
        </div>
        <div className="flex gap-4">
          <a href={message.image} download={`festichat-${message.id}.jpg`} aria-label={t('common.download')}><Download size={24} /></a>
          <button type="button" onClick={onClose} aria-label={t('common.close')}><X size={26} /></button>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <img src={message.image} alt={message.caption || t('common.image')} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
      </div>
      {message.caption && <p className="text-center p-4 pb-8" dir="auto">{message.caption}</p>}
    </div>
  )
}
