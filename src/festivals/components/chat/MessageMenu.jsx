import { useState } from 'react'
import { Copy, Pencil, Pin, PinOff, Plus, Reply, Trash2 } from 'lucide-react'
import { REACTIONS, preview } from '../../chat/messages'
import EmojiPicker from './EmojiPicker'

// Long-press / right-click sheet: quick reactions plus message actions.
export default function MessageMenu({ message, mine, myReaction, canInteract, isPinned, onReact, onAction, onClose }) {
  const [moreEmoji, setMoreEmoji] = useState(false)
  const actions = [
    canInteract && { id: 'reply', label: 'השב', icon: Reply },
    message.type !== 'poll' && { id: 'copy', label: 'העתקה', icon: Copy },
    canInteract && { id: 'pin', label: isPinned ? 'ביטול נעיצה' : 'נעיצה', icon: isPinned ? PinOff : Pin },
    mine && message.type === 'text' && { id: 'edit', label: 'עריכה', icon: Pencil },
    mine && { id: 'delete', label: 'מחיקה', icon: Trash2, danger: true },
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="w-full sm:max-w-sm p-3 flex flex-col gap-2 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="bg-ink-700 rounded-lg px-4 py-3 text-sm text-white/80 line-clamp-3" dir="auto">
          <span className="font-medium text-accent">{message.name}: </span>{preview(message)}
        </div>

        {canInteract && (
          moreEmoji ? (
            <EmojiPicker onPick={(emoji) => onReact(emoji === myReaction ? null : emoji)} />
          ) : (
            <div className="bg-ink-800 rounded-lg p-1.5 flex justify-between shadow-xl border border-ink-600">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact(emoji === myReaction ? null : emoji)}
                  className={`w-11 h-11 rounded-full text-2xl hover:scale-125 transition-transform ${myReaction === emoji ? 'bg-white/15' : ''}`}
                  aria-label={`תגובה ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              <button type="button" onClick={() => setMoreEmoji(true)} className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center" aria-label="עוד אימוג׳ים">
                <Plus size={20} />
              </button>
            </div>
          )
        )}

        <ul className="bg-ink-800 rounded-lg overflow-hidden border border-white/10">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <li key={action.id}>
                <button
                  type="button"
                  onClick={() => onAction(action.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 border-b border-white/5 ${action.danger ? 'text-rose-400' : ''}`}
                >
                  {action.label}
                  <Icon size={20} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
