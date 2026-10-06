import { useEffect, useRef, useState } from 'react'
import { ArrowRight, LogOut, Send } from 'lucide-react'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { clockTime, dayLabel, membersLabel } from '../utils'
import GroupIcon from './GroupIcon'

export default function ChatScreen({ festival, group, onClose }) {
  const { service, user, myGroups, withUser, join, leave, send } = useChat()
  const { memberCount } = useGroupMeta(group.id)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const isMember = Boolean(myGroups[group.id])

  useEffect(() => (service ? service.onMessages(group.id, setMessages) : undefined), [service, group.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const run = async (action) => {
    setError('')
    try {
      await action()
    } catch {
      setError('הפעולה נכשלה. בדקו את החיבור ונסו שוב.')
    }
  }

  const submit = (e) => {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    setText('')
    run(() => send(group.id, body))
  }

  const leaveGroup = () => {
    if (window.confirm(`לצאת מהקבוצה "${group.title}"?`)) run(() => leave(group.id))
  }

  const [from, to] = festival.colors

  return (
    <div className="fixed inset-0 z-[55] bg-ink-900 flex flex-col animate-slide-up" role="dialog" aria-modal="true" aria-label={`צ'אט ${group.title}`}>
      <header className="flex items-center gap-3 px-3 h-16 bg-ink-800 border-b border-white/5 shrink-0">
        <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center" aria-label="חזרה">
          <ArrowRight size={22} />
        </button>
        <span className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-xl" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
          {festival.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate"><span dir="auto">{festival.name}</span> · {group.title}</p>
          <p className="text-xs text-white/50">{membersLabel(memberCount)}</p>
        </div>
        {isMember && (
          <button type="button" onClick={leaveGroup} className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-rose-400" aria-label="יציאה מהקבוצה" title="יציאה מהקבוצה">
            <LogOut size={20} />
          </button>
        )}
      </header>

      {service?.mode === 'local' && (
        <p className="bg-accent/15 text-accent text-xs text-center px-4 py-2 shrink-0">
          מצב תצוגה: הצ׳אט עוד לא מחובר לשרת, וההודעות נשמרות רק במכשיר הזה.
        </p>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-4 chat-wallpaper">
        <div className="max-w-2xl mx-auto flex flex-col gap-1.5">
          <div className="self-center text-center bg-ink-800/90 text-white/70 text-xs rounded-xl px-4 py-2 mb-3 max-w-xs">
            <GroupIcon name={group.icon} size={18} className="mx-auto mb-1 text-whatsapp" />
            {group.description}
          </div>
          {messages.map((m, i) => {
            const mine = m.uid === user?.uid
            const day = dayLabel(m.createdAt)
            const showDay = i === 0 || day !== dayLabel(messages[i - 1].createdAt)
            return (
              <div key={m.id} className="flex flex-col">
                {showDay && (
                  <span className="self-center bg-ink-800 text-white/60 text-xs rounded-lg px-3 py-1 my-2">{day}</span>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 shadow ${mine ? 'self-end bg-[#005c4b] rounded-bl-sm' : 'self-start bg-ink-700 rounded-br-sm'}`}>
                  {!mine && <p className="text-xs font-bold text-whatsapp mb-0.5">{m.name}</p>}
                  <p className="whitespace-pre-wrap break-words leading-snug" dir="auto">{m.text}</p>
                  <p className="text-[10px] text-white/50 text-left mt-0.5">{clockTime(m.createdAt)}</p>
                </div>
              </div>
            )
          })}
          {messages.length === 0 && (
            <p className="self-center text-white/40 text-sm mt-10">עוד אין הודעות. תגידו שלום 👋</p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {error && <p className="text-rose-400 text-sm text-center py-1 shrink-0">{error}</p>}

      <footer className="shrink-0 bg-ink-800 border-t border-white/5 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {isMember ? (
          <form onSubmit={submit} className="max-w-2xl mx-auto flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) submit(e)
              }}
              rows={1}
              maxLength={1000}
              placeholder="הודעה"
              className="flex-1 resize-none bg-ink-700 rounded-3xl px-4 py-2.5 outline-none max-h-32"
              aria-label="הודעה"
            />
            <button type="submit" disabled={!text.trim()} className="w-11 h-11 shrink-0 rounded-full bg-whatsapp text-black flex items-center justify-center disabled:opacity-40" aria-label="שליחה">
              <Send size={20} className="-scale-x-100" />
            </button>
          </form>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-2 py-1">
            <p className="text-xs text-white/50">רק חברי הקבוצה יכולים לכתוב</p>
            <button
              type="button"
              onClick={() => withUser(() => run(() => join(group.id)))}
              className="w-full bg-whatsapp text-black font-bold py-3 rounded-full"
            >
              הצטרפות לקבוצה
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}
