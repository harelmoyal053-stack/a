import { useEffect } from 'react'
import {
  Calendar, Car, ExternalLink, Flag, Heart, MapPin, MessageCircle, Plus, Share2, Tent, Ticket, UserRound, X,
} from 'lucide-react'
import { GENRES, MONTHS } from '../data/festivals'
import { addGroupLinkUrl, whatsappShareUrl } from '../config'

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

  const [from, to] = festival.colors
  const shareText = `מצאתי את קבוצות הוואטסאפ של ${festival.name} 🎶 ${window.location.href}`

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="festival-title"
        className="bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="relative p-6 pb-8 text-white" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
          <div className="flex justify-between items-start">
            <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center" aria-label="סגור">
              <X size={20} />
            </button>
            <span className="text-5xl drop-shadow-lg">{festival.emoji}</span>
          </div>
          <h2 id="festival-title" className="text-3xl font-extrabold mt-3" dir="auto">{festival.name}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-white/90 text-sm">
            <span className="flex items-center gap-1"><MapPin size={14} /> {festival.flag} {festival.city}, {festival.country}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> בדרך כלל ב{MONTHS[festival.month - 1]}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {festival.genres.map((genre) => (
              <span key={genre} className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{GENRES[genre]}</span>
            ))}
          </div>
        </header>

        <div className="p-5 sm:p-6">
          <div className="relative grid grid-cols-3 gap-2 -mt-12 mb-6">
            <button type="button" onClick={onToggleFavorite} className="bg-white shadow-md rounded-2xl py-3 flex flex-col items-center gap-1 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Heart size={20} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
              {isFavorite ? 'במועדפים' : 'שמור'}
            </button>
            <a href={whatsappShareUrl(shareText)} target="_blank" rel="noopener noreferrer" className="bg-white shadow-md rounded-2xl py-3 flex flex-col items-center gap-1 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Share2 size={20} /> שתף
            </a>
            <a href={festival.website} target="_blank" rel="noopener noreferrer" className="bg-white shadow-md rounded-2xl py-3 flex flex-col items-center gap-1 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <ExternalLink size={20} /> אתר רשמי
            </a>
          </div>

          <h3 className="font-bold text-lg text-slate-900 mb-3">קבוצות וואטסאפ</h3>
          <ul className="flex flex-col gap-3">
            {groups.map((group) => {
              const Icon = ICONS[group.icon]
              return (
                <li key={group.type} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/60">
                  <span className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${group.invite ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Icon size={22} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{group.title}</p>
                    <p className="text-xs text-slate-500">{group.description}</p>
                  </div>
                  {group.invite ? (
                    <a
                      href={group.invite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      הצטרפות
                    </a>
                  ) : (
                    <a
                      href={addGroupLinkUrl(festival, group)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 border border-dashed border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                      title="הקבוצה עוד לא נפתחה – פתחתם אותה? שלחו לנו את הקישור"
                    >
                      <Plus size={14} /> הוספת קישור
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            קבוצה בלי קישור עוד לא נפתחה. פתחתם אותה בוואטסאפ? לחצו על ״הוספת קישור״ ונעלה אותה לאתר אחרי בדיקה.
          </p>
        </div>
      </div>
    </div>
  )
}
