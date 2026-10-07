import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const MAX_OPTIONS = 10

export default function PollComposer({ onSend, onClose }) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [multiple, setMultiple] = useState(false)
  const filled = options.map((o) => o.trim()).filter(Boolean)
  const valid = question.trim() && filled.length >= 2

  const setOption = (i, value) => setOptions((prev) => prev.map((o, j) => (j === i ? value : o)))

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    onSend({
      question: question.trim().slice(0, 200),
      options: filled.map((text, i) => ({ id: `o${i}`, text: text.slice(0, 100) })),
      multiple,
    })
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-end sm:items-center justify-center" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="bg-ink-800 w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-lg p-5 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">סקר חדש</h2>
          <button type="button" onClick={onClose} aria-label="סגירה"><X size={22} className="text-white/60" /></button>
        </div>
        <label className="text-sm text-white/60">שאלה</label>
        <input
          autoFocus
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={200}
          placeholder="למשל: מתי נפגשים בכניסה?"
          className="w-full bg-ink-900 border border-white/15 rounded-lg px-4 py-3 mt-1 mb-4 outline-none focus:border-whatsapp"
        />
        <label className="text-sm text-white/60">אפשרויות</label>
        <div className="flex flex-col gap-2 mt-1">
          {options.map((option, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={option}
                onChange={(e) => setOption(i, e.target.value)}
                maxLength={100}
                placeholder={`אפשרות ${i + 1}`}
                className="flex-1 bg-ink-900 border border-white/15 rounded-lg px-4 py-2.5 outline-none focus:border-whatsapp"
              />
              {options.length > 2 && (
                <button type="button" onClick={() => setOptions((prev) => prev.filter((_, j) => j !== i))} aria-label="הסרת אפשרות" className="text-white/50">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < MAX_OPTIONS && (
          <button type="button" onClick={() => setOptions((prev) => [...prev, ''])} className="flex items-center gap-1 text-whatsapp text-sm mt-3">
            <Plus size={16} /> הוספת אפשרות
          </button>
        )}
        <label className="flex items-center justify-between mt-5 py-3 border-t border-white/10 cursor-pointer">
          <span>לאפשר כמה תשובות</span>
          <input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} className="w-5 h-5 accent-whatsapp" />
        </label>
        <button type="submit" disabled={!valid} className="w-full mt-2 bg-whatsapp text-black font-semibold py-3 rounded-lg disabled:opacity-40">
          שליחת הסקר
        </button>
      </form>
    </div>
  )
}
