import { BarChart3, Check } from 'lucide-react'

export default function PollCard({ poll, votes, myUid, canVote, onVote }) {
  const mine = votes?.[myUid] ?? []
  const voters = Object.values(votes ?? {})
  const counts = Object.fromEntries(poll.options.map((o) => [o.id, voters.filter((v) => v.includes(o.id)).length]))
  const max = Math.max(1, ...Object.values(counts))

  const toggle = (optionId) => {
    if (!canVote) return
    if (poll.multiple) {
      onVote(mine.includes(optionId) ? mine.filter((id) => id !== optionId) : [...mine, optionId])
    } else {
      onVote(mine.includes(optionId) ? [] : [optionId])
    }
  }

  return (
    <div className="min-w-[14rem]">
      <p className="font-bold flex items-start gap-1.5 mb-1" dir="auto"><BarChart3 size={18} className="shrink-0 mt-0.5 text-whatsapp" />{poll.question}</p>
      <p className="text-[11px] text-white/50 mb-2">{poll.multiple ? 'אפשר לבחור כמה תשובות' : 'בחרו תשובה אחת'}</p>
      <ul className="flex flex-col gap-2">
        {poll.options.map((option) => {
          const selected = mine.includes(option.id)
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => toggle(option.id)}
                disabled={!canVote}
                className="w-full text-right disabled:cursor-default"
                aria-pressed={selected}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selected ? 'bg-whatsapp border-whatsapp' : 'border-white/40'}`}>
                    {selected && <Check size={12} className="text-black" strokeWidth={3} />}
                  </span>
                  <span className="flex-1 text-sm" dir="auto">{option.text}</span>
                  <span className="text-xs text-white/60">{counts[option.id]}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 mt-1 mr-7 overflow-hidden">
                  <div className="h-full bg-whatsapp transition-all duration-500" style={{ width: `${(counts[option.id] / max) * 100}%` }} />
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="text-[11px] text-white/50 mt-2">{voters.length === 1 ? 'הצבעה אחת' : `${voters.length} הצבעות`}</p>
    </div>
  )
}
