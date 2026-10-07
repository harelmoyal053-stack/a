import { useState } from 'react'
import { X } from 'lucide-react'

export default function NameModal({ onSubmit, onClose }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const trimmed = name.trim()

  const submit = async (e) => {
    e.preventDefault()
    if (!trimmed) return
    setBusy(true)
    setError('')
    try {
      await onSubmit(trimmed)
    } catch {
      setError('משהו השתבש. נסו שוב.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-ink-800 w-full sm:max-w-sm rounded-t-3xl sm:rounded-lg p-6 animate-slide-up border border-white/10"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-semibold text-2xl">איך לקרוא לך?</h2>
          <button type="button" onClick={onClose} aria-label="סגירה"><X size={22} className="text-white/60" /></button>
        </div>
        <p className="text-sm text-white/60 mb-4">השם יופיע ליד ההודעות שלך בקבוצות.</p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="השם שלך"
          className="w-full bg-ink-900 border border-white/15 rounded-lg px-4 py-3 outline-none focus:border-whatsapp"
        />
        {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={!trimmed || busy}
          className="w-full mt-4 bg-whatsapp text-black font-semibold py-3 rounded-lg disabled:opacity-40"
        >
          {busy ? 'רגע…' : 'המשך'}
        </button>
      </form>
    </div>
  )
}
