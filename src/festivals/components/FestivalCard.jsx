import { Calendar, Heart, MapPin, MessageCircle } from 'lucide-react'
import { GENRES, MONTHS } from '../data/festivals'

export default function FestivalCard({ festival, groups, isFavorite, onToggleFavorite, onOpen }) {
  const openCount = groups.filter((g) => g.invite).length
  const [from, to] = festival.colors

  return (
    <article className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col border border-slate-100">
      <button
        type="button"
        onClick={onOpen}
        className="relative h-36 text-right"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-label={`פתח את ${festival.name}`}
      >
        <span className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
          {festival.emoji}
        </span>
        <span className="absolute bottom-3 right-3 bg-black/30 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <Calendar size={12} /> {MONTHS[festival.month - 1]}
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleFavorite}
        className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
        aria-label={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
        aria-pressed={isFavorite}
      >
        <Heart size={18} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'} />
      </button>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-lg text-slate-900 leading-tight" dir="auto">{festival.name}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <MapPin size={14} /> {festival.flag} {festival.city}, {festival.country}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {festival.genres.map((genre) => (
            <span key={genre} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {GENRES[genre]}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          <MessageCircle size={18} />
          {groups.length} קבוצות
          {openCount > 0 && <span className="bg-white/25 text-xs px-2 py-0.5 rounded-full">{openCount} פעילות</span>}
        </button>
      </div>
    </article>
  )
}
