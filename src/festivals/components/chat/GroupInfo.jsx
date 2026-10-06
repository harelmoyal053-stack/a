import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Image as ImageIcon, LogOut, Users } from 'lucide-react'
import { useChat } from '../../chat/ChatContext'
import { membersLabel } from '../../utils'

export default function GroupInfo({ festival, group, messages, memberCount, isMember, onOpenImage, onJumpTo, onLeave, onClose }) {
  const { service, user } = useChat()
  const [members, setMembers] = useState([])
  useEffect(() => (service ? service.onMembers(group.id, setMembers) : undefined), [service, group.id])

  const live = messages.filter((m) => !m.deleted)
  const images = live.filter((m) => m.type === 'image').reverse()
  const polls = live.filter((m) => m.type === 'poll').reverse()
  const [from, to] = festival.colors

  return (
    <div className="fixed inset-0 z-[65] bg-ink-900 overflow-y-auto animate-slide-up">
      <header className="sticky top-0 bg-ink-900/95 backdrop-blur flex items-center gap-3 px-3 h-14 border-b border-white/5">
        <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center" aria-label="חזרה"><ArrowRight size={22} /></button>
        <p className="font-bold">פרטי הקבוצה</p>
      </header>
      <div className="max-w-2xl mx-auto p-5">
        <div className="flex flex-col items-center text-center">
          <span className="w-24 h-24 rounded-full flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
            {festival.emoji}
          </span>
          <h2 className="font-black text-2xl mt-3"><span dir="auto">{festival.name}</span> · {group.title}</h2>
          <p className="text-white/50 text-sm mt-1">{group.description}</p>
          <p className="text-white/50 text-sm">{membersLabel(memberCount)}</p>
        </div>

        <section className="mt-8">
          <h3 className="flex items-center gap-2 font-bold mb-3"><ImageIcon size={18} /> תמונות <span className="text-white/40 text-sm">{images.length}</span></h3>
          {images.length ? (
            <div className="grid grid-cols-3 gap-1">
              {images.map((m) => (
                <button key={m.id} type="button" onClick={() => onOpenImage(m)} className="aspect-square overflow-hidden rounded-lg">
                  <img src={m.image} alt={m.caption || 'תמונה'} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : <p className="text-sm text-white/40">עוד לא שותפו תמונות.</p>}
        </section>

        {polls.length > 0 && (
          <section className="mt-8">
            <h3 className="flex items-center gap-2 font-bold mb-3"><BarChart3 size={18} /> סקרים <span className="text-white/40 text-sm">{polls.length}</span></h3>
            <ul className="flex flex-col gap-2">
              {polls.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => onJumpTo(m.id)} className="w-full text-right bg-ink-800 rounded-xl px-4 py-3">
                    <p className="font-bold" dir="auto">{m.poll.question}</p>
                    <p className="text-xs text-white/50">{Object.keys(m.votes ?? {}).length} הצבעות · {m.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h3 className="flex items-center gap-2 font-bold mb-3"><Users size={18} /> חברים <span className="text-white/40 text-sm">{members.length}</span></h3>
          <ul className="bg-ink-800 rounded-2xl overflow-hidden">
            {members.map((member) => (
              <li key={member.uid} className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold">{member.name.slice(0, 1)}</span>
                <span className="flex-1">{member.name}</span>
                {member.uid === user?.uid && <span className="text-xs text-white/40">את/ה</span>}
              </li>
            ))}
            {members.length === 0 && <li className="px-4 py-3 text-sm text-white/40">עוד אין חברים.</li>}
          </ul>
        </section>

        {isMember && (
          <button type="button" onClick={onLeave} className="w-full mt-8 flex items-center justify-center gap-2 text-rose-400 bg-ink-800 rounded-2xl py-3.5">
            <LogOut size={18} /> יציאה מהקבוצה
          </button>
        )}
      </div>
    </div>
  )
}
