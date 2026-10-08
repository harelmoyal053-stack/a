import { CalendarPlus, Check, ExternalLink, Flag, RotateCcw, Trash2 } from 'lucide-react'
import { useChat } from '../chat/ChatContext'
import { useInbox } from '../chat/admin'
import { locale, t } from '../i18n'

function when(ms) {
  return new Date(ms).toLocaleString(locale(), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function Entry({ entry }) {
  const { service } = useChat()
  const isEvent = entry.type === 'event'
  const Icon = isEvent ? CalendarPlus : Flag
  const remove = () => window.confirm(t('admin.confirmDelete')) && service.deleteInbox(entry.id)
  return (
    <li className={`rounded-2xl border border-white/[0.06] bg-ink-800 p-4 ${entry.done ? 'opacity-55' : ''}`}>
      <div className="flex items-center gap-2 text-[12px]">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-white ${isEvent ? 'bg-violet-600' : 'bg-rose-600'}`}>
          <Icon size={13} />
          {isEvent ? t('admin.typeEvent') : `${t('admin.typeReport')} · ${t(`contact.${entry.category ?? 'other'}`)}`}
        </span>
        <span className="text-muted font-num ms-auto">{when(entry.createdAt)}</span>
      </div>
      {isEvent && (
        <p className="text-[16px] font-semibold mt-3" dir="auto">{entry.name}</p>
      )}
      {isEvent && (entry.date || entry.place) && (
        <p className="text-[13px] text-muted mt-0.5" dir="auto">{[entry.date, entry.place].filter(Boolean).join(' · ')}</p>
      )}
      {entry.message && <p className="text-[14px] text-white/85 mt-2 whitespace-pre-wrap leading-relaxed" dir="auto">{entry.message}</p>}
      {entry.link && (
        <a href={entry.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[13px] text-accent break-all" dir="ltr">
          <ExternalLink size={13} className="shrink-0" />{entry.link}
        </a>
      )}
      <div className="mt-3 text-[12px] text-muted space-y-0.5">
        <p>{t('admin.from', { name: entry.userName || t('admin.anonymous') })}{entry.contact && <> · <span dir="auto" className="text-white/80 select-all">{entry.contact}</span></>}</p>
        {entry.page && <p className="truncate" dir="ltr">{entry.page.replace(/^https?:\/\//, '')}</p>}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => service.setInboxDone(entry.id, !entry.done)}
          className="h-8 px-3 rounded-full border border-ink-600 text-[12.5px] inline-flex items-center gap-1.5 hover:border-white/40"
        >
          {entry.done ? <RotateCcw size={14} /> : <Check size={14} />}
          {entry.done ? t('admin.reopen') : t('admin.markDone')}
        </button>
        <button type="button" onClick={remove} className="h-8 px-3 rounded-full text-[12.5px] inline-flex items-center gap-1.5 text-rose-400 hover:bg-rose-500/10">
          <Trash2 size={14} />{t('admin.delete')}
        </button>
      </div>
    </li>
  )
}

// Event suggestions and problem reports sent from the site menu.
export default function AdminInbox() {
  const { entries, error } = useInbox(true)
  const open = entries.filter((e) => !e.done).length
  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[17px] font-semibold">{t('admin.inbox')}</h2>
        <span className={`text-[12px] ${open ? 'text-accent' : 'text-muted'}`}>{t('admin.inboxOpen', { count: open })}</span>
      </div>
      {error ? (
        <p className="text-sm text-amber-300 border border-amber-300/30 rounded-xl px-3 py-2">{t('admin.inboxError')}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted">{t('admin.inboxEmpty')}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {[...entries.filter((e) => !e.done), ...entries.filter((e) => e.done)].map((e) => <Entry key={e.id} entry={e} />)}
        </ul>
      )}
    </section>
  )
}
