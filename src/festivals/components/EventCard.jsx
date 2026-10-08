import { CalendarDays, Heart, MapPin } from 'lucide-react'
import { cardDate, priceLabel } from '../utils'
import { t } from '../i18n'
import GenrePill from './GenrePill'
import Poster from './Poster'

// Event card: artwork on top, then name, place, dates and genre.
export default function EventCard({ festival, onOpen, isFavorite, onToggleFavorite, className = '' }) {
  const price = priceLabel(festival)
  return (
    <article className={`group relative rounded-2xl overflow-hidden bg-ink-800 border border-white/[0.06] hover:border-white/15 transition-colors ${className}`}>
      <button type="button" onClick={onOpen} className="block w-full text-start outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
            <Poster festival={festival} showTitle={false} showCity={false} />
          </div>
          {price && (
            <span className="absolute bottom-2 start-2 bg-black/70 backdrop-blur-sm font-num text-[11px] text-white px-2 py-0.5 rounded-full">{price}</span>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-[15px] font-semibold leading-snug truncate" dir="auto">{festival.name}</h3>
          <p className="flex items-center gap-1.5 text-[12.5px] text-muted mt-1.5 min-w-0">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate" dir="auto">{[festival.city, festival.country].filter(Boolean).join(', ')}</span>
          </p>
          <p className="flex items-center gap-1.5 text-[12.5px] text-muted mt-1">
            <CalendarDays size={13} className="shrink-0" />
            <span className="font-num truncate">{cardDate(festival)}</span>
          </p>
          <div className="mt-3"><GenrePill festival={festival} /></div>
        </div>
      </button>
      {onToggleFavorite && (
        <button
          type="button"
          onClick={onToggleFavorite}
          className="absolute top-2 end-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          aria-label={isFavorite ? t('saved.remove') : t('saved.add')}
          aria-pressed={isFavorite}
        >
          <Heart size={15} strokeWidth={2} className={isFavorite ? 'fill-accent text-accent' : 'text-white'} />
        </button>
      )}
    </article>
  )
}
