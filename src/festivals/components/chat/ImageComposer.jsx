import { useState } from 'react'
import { Send, X } from 'lucide-react'

// Full-screen preview of a picked photo with an optional caption.
export default function ImageComposer({ image, onSend, onClose }) {
  const [caption, setCaption] = useState('')
  const submit = (e) => {
    e.preventDefault()
    onSend(caption.trim())
  }
  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="flex justify-between p-4">
        <button type="button" onClick={onClose} aria-label="ביטול"><X size={26} /></button>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        <img src={image} alt="תצוגה מקדימה" className="max-h-full max-w-full object-contain rounded-lg" />
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <input
          autoFocus
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={1000}
          placeholder="הוספת כיתוב…"
          className="flex-1 h-12 bg-ink-800 border border-ink-600 rounded-lg px-4 outline-none"
        />
        <button type="submit" className="w-12 h-12 rounded-lg bg-accent text-black flex items-center justify-center" aria-label="שליחה">
          <Send size={20} className="-scale-x-100" />
        </button>
      </form>
    </div>
  )
}
