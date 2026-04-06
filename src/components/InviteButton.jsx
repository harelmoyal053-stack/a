import { useState } from 'react'
import { UserPlus, X, Copy, CheckCircle } from 'lucide-react'

export default function InviteButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('הצטרפו איתי ל-DropPrice וחסכו ביחד! 🚀 dropprice.app')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3" dir="rtl">
      {/* Popup card */}
      {open && (
        <div className="glass border border-neon-green/30 rounded-2xl p-4 w-60 shadow-glass-lg animate-entry"
          style={{ boxShadow: '0 0 30px rgba(0,255,136,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="text-right">
              <p className="text-sm font-black text-white">הזמן חברים</p>
              <p className="text-xs text-slate-400">כל חבר מוריד את המחיר!</p>
            </div>
          </div>
          <button onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              copied
                ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green'
                : 'btn-neon'
            }`}>
            {copied
              ? <><CheckCircle className="w-4 h-4" />הועתק! 🎉</>
              : <><Copy className="w-4 h-4" />העתק קישור הזמנה</>}
          </button>
          <p className="text-center text-[10px] text-slate-500 mt-2">
            כל הזמנה מורידה את המחיר לכולם 🔥
          </p>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="float-bounce w-14 h-14 rounded-2xl btn-neon flex items-center justify-center shadow-neon-green-lg relative"
        title="הזמן חברים"
      >
        <UserPlus className="w-6 h-6 text-dark-900" />
        {/* Notification dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-dark-900 flex items-center justify-center text-[8px] font-black text-white">
          !
        </span>
      </button>
    </div>
  )
}
