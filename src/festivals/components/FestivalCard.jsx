import { Heart, MapPin } from 'lucide-react'
import { MONTHS } from '../data/festivals'
import { countdownLabel } from '../utils'
import Poster from './Poster'

export default function FestivalCard({ festival, groups, isFavorite, onToggleFavorite, onOpen }) {
  return (
    <article className="relative bg-ink-800 rounded-2xl overflow-hidden flex flex-col">
      <button type="button" onClick={onOpen} className="relative aspect-square text-right group" aria-label={`פתח את ${festival.name}`}>
        <Poster festival={festival} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full border border-white/10">
          {countdownLabel(festival.month)}
        </span>
        <span className="absolute bottom-2.5 right-3 flex items-center gap-1 font-black text-lg sm:text-2xl drop-shadow-lg">
          <span className="text-white">{groups.length} קבוצות</span>
        </span>
      </button>

      <button
        type="button"
        onClick={onToggleFavorite}
        className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center border border-white/10"
        aria-label={isFavorite ? 'הסר ממועדפים' : 'הוסף למועדפים'}
        aria-pressed={isFavorite}
      >
        <Heart size={16} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'} />
      </button>

      <button type="button" onClick={onOpen} className="p-3 sm:p-4 flex flex-col items-start gap-2 text-right flex-1">
        <span className="text-xs sm:text-sm text-white/80 border border-white/15 bg-white/5 rounded-full px-3 py-1">
          {MONTHS[festival.month - 1]} · {festival.flag} {festival.country}
        </span>
        <h3 className="font-black text-base sm:text-xl leading-tight text-white" dir="auto">{festival.name}</h3>
        <p className="text-xs sm:text-sm text-white/50 flex items-start gap-1">
          <MapPin size={14} className="text-rose-500 fill-rose-500/30 shrink-0 mt-0.5" /> {festival.city}, {festival.country}
        </p>
      </button>
    </article>
  )
}
