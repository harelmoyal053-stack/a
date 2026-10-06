import { useEffect } from 'react'
import {
  ArrowRight, Calendar, Car, ExternalLink, Flag, Heart, MapPin, MessageCircle, Plus, Share2, Tent, Ticket, UserRound,
} from 'lucide-react'
import { GENRES, MONTHS } from '../data/festivals'
import { addGroupLinkUrl, whatsappShareUrl } from '../config'
import { countdownLabel } from '../utils'
import Poster from './Poster'

const ICONS = { MessageCircle, Flag, Car, Tent, Ticket, UserRound }

export default function FestivalModal({ festival, groups, isFavorite, onToggleFavorite, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const shareText = `מצאתי את קבוצות הוואטסאפ של ${festival.name} 🎶 ${window.location.href}`

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
            {countdownLabel(festival.month)}
          </span>
          <h2 id="festival-title" className="text-4xl font-black mt-3 leading-none" dir="auto">{festival.name}</h2>
          <div className="mt-3 flex flex-col gap-1.5 text-white/60 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-rose-500" /> {festival.flag} {festival.city}, {festival.country}</span>
            <span className="flex items-center gap-1.5"><Calendar size={15} /> בדרך כלל ב{MONTHS[festival.month - 1]}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {festival.genres.map((genre) => (
              <span key={genre} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full">{GENRES[genre]}</span>
            ))}
            <a href={festival.website} target="_blank" rel="noopener noreferrer" className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white/10">
              <ExternalLink size={12} /> אתר רשמי
            </a>
          </div>

          <h3 className="font-black text-xl mt-8 mb-3">קבוצות וואטסאפ</h3>
          <ul className="flex flex-col gap-2.5">
            {groups.map((group) => {
              const Icon = ICONS[group.icon]
              return (
                <li key={group.type} className="flex items-center gap-3 p-3 rounded-2xl bg-ink-800">
                  <span className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${group.invite ? 'bg-whatsapp/15 text-whatsapp' : 'bg-white/5 text-white/50'}`}>
                    <Icon size={20} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{group.title}</p>
                    <p className="text-xs text-white/50">{group.description}</p>
                  </div>
                  {group.invite ? (
                    <a href={group.invite} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-whatsapp hover:brightness-110 text-black text-sm font-bold px-4 py-2 rounded-full">
                      הצטרפות
                    </a>
                  ) : (
                    <a
                      href={addGroupLinkUrl(festival, group)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 border border-white/15 text-white/70 hover:text-accent hover:border-accent text-xs font-medium px-3 py-2 rounded-full"
                      title="הקבוצה עוד לא נפתחה – פתחתם אותה? שלחו לנו את הקישור"
                    >
                      <Plus size={14} /> הוספת קישור
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-white/40 mt-4 leading-relaxed">
            קבוצה בלי קישור עוד לא נפתחה. פתחתם אותה בוואטסאפ? לחצו על ״הוספת קישור״ ונעלה אותה לאתר אחרי בדיקה.
          </p>
        </div>
      </div>
    </div>
  )
}
