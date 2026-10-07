import { useEffect } from 'react'
import { ArrowRight, Calendar, ExternalLink, Heart, MapPin, Share2, Ticket } from 'lucide-react'
import { GENRES, MONTHS } from '../data/festivals'
import { sourceLabel } from '../data/catalog'
import { whatsappShareUrl } from '../config'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { countdownFor, dateChip, isEnded, membersLabel, priceLabel } from '../utils'
import GroupIcon from './GroupIcon'
import Poster from './Poster'

function GroupRow({ festival, group, onOpenChat }) {
  const { myGroups, withUser, join } = useChat()
  const { memberCount } = useGroupMeta(group.id)
  const isMember = Boolean(myGroups[group.id])

  const joinAndOpen = () =>
    withUser(async () => {
      await join(group, festival)
      onOpenChat(group.id)
    })

  return (
    <li className="flex items-center gap-3 p-3 rounded-2xl bg-ink-800">
      <button type="button" onClick={() => onOpenChat(group.id)} className="flex items-center gap-3 flex-1 min-w-0 text-right">
        <span className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${isMember ? 'bg-whatsapp/15 text-whatsapp' : 'bg-white/5 text-white/60'}`}>
          <GroupIcon name={group.icon} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold">{group.title}</p>
          <p className="text-xs text-white/50 truncate">{group.description}</p>
          <p className="text-xs text-white/40 mt-0.5">{membersLabel(memberCount)}</p>
        </div>
      </button>
      {isMember ? (
        <button type="button" onClick={() => onOpenChat(group.id)} className="shrink-0 border border-whatsapp text-whatsapp text-sm font-bold px-4 py-2 rounded-full">
          לצ׳אט
        </button>
      ) : isEnded(festival) ? (
        <span className="shrink-0 text-xs text-white/40 px-2">האירוע הסתיים</span>
      ) : (
        <button type="button" onClick={joinAndOpen} className="shrink-0 bg-whatsapp hover:brightness-110 text-black text-sm font-bold px-4 py-2 rounded-full">
          הצטרפות
        </button>
      )}
    </li>
  )
}

export default function FestivalModal({ festival, groups, isFavorite, onToggleFavorite, onClose, onOpenChat }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const shareText = `מצאתי את קבוצות הצ׳אט של ${festival.name} 🎶 ${window.location.href}`

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="festival-title"
        className="bg-ink-900 w-full sm:max-w-xl h-full sm:h-auto sm:max-h-full overflow-y-auto sm:rounded-3xl animate-slide-up border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square sm:aspect-[4/3]">
          <Poster festival={festival} large />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/10 to-black/40" />
          <div className="absolute top-4 inset-x-4 flex justify-between">
            <button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10" aria-label="חזרה">
              <ArrowRight size={20} />
            </button>
            <div className="flex gap-2">
              <a href={whatsappShareUrl(shareText)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10" aria-label="שיתוף">
                <Share2 size={18} />
              </a>
              <button type="button" onClick={onToggleFavorite} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10" aria-label={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'} aria-pressed={isFavorite}>
                <Heart size={18} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-8 -mt-10 relative">
          <span className="inline-block text-sm text-white/80 border border-white/15 bg-white/5 rounded-full px-3 py-1">
            {countdownFor(festival)}
          </span>
          <h2 id="festival-title" className="text-4xl font-black mt-3 leading-none" dir="auto">{festival.name}</h2>
          <div className="mt-3 flex flex-col gap-1.5 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-rose-500" /> {festival.flag} {festival.venue ? `${festival.venue}, ` : ''}{festival.city}, {festival.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {festival.startDate ? `${dateChip(festival, MONTHS)}${festival.time ? ` · ${festival.time}` : ''}` : `בדרך כלל ב${MONTHS[festival.month - 1]}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {festival.genres.map((genre) => (
              <span key={genre} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full">{GENRES[genre]}</span>
            ))}
            {festival.website && (
              <a href={festival.website} target="_blank" rel="noopener noreferrer" className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white/10">
                <ExternalLink size={12} /> אתר רשמי
              </a>
            )}
          </div>
          {festival.tickets?.length > 0 && (
            <div className="mt-5 flex flex-col gap-2">
              {festival.tickets.map((ticket, i) => (
                <a
                  key={ticket.source}
                  href={ticket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between gap-2 font-bold py-3 px-4 rounded-2xl ${i === 0 ? 'bg-accent text-black' : 'bg-white/5 border border-white/15'}`}
                >
                  <span className="flex items-center gap-2"><Ticket size={18} /> כרטיסים ב-{sourceLabel(ticket.source)}</span>
                  {priceLabel(ticket) && <span className="text-sm">{priceLabel(ticket)}</span>}
                </a>
              ))}
            </div>
          )}
          {festival.sources?.length > 0 && (
            <p className="text-xs text-white/40 mt-3">מקורות המידע: {festival.sources.map(sourceLabel).join(' · ')}</p>
          )}

          <h3 className="font-black text-xl mt-8 mb-3">קבוצות</h3>
          <ul className="flex flex-col gap-2.5">
            {groups.map((group) => <GroupRow key={group.id} festival={festival} group={group} onOpenChat={onOpenChat} />)}
          </ul>
        </div>
      </div>
    </div>
  )
}
