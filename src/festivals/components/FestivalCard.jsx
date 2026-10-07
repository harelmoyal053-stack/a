import { Heart } from 'lucide-react'
import { cardDate, priceLabel } from '../utils'
import { t } from '../i18n'
import Poster from './Poster'

export default function FestivalCard({ festival, isFavorite, onToggleFavorite, onOpen }) {
  const price = priceLabel(festival)
  return (
    <article className="group relative">
      <button
        type="button"
        onClick={onOpen}
        className="relative block w-full aspect-[4/5] overflow-hidden rounded-md bg-ink-800 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={festival.name}
      >
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <Poster festival={festival} />
        </div>
        {price && (
          <span className="absolute bottom-2 start-2 bg-black/80 backdrop-blur-sm font-num text-[11px] text-white px-1.5 py-0.5 rounded-sm">
            {price}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onToggleFavorite}
        className="absolute top-2 end-2 w-8 h-8 rounded-sm bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-90 hover:opacity-100"
        aria-label={isFavorite ? t('saved.remove') : t('saved.add')}
        aria-pressed={isFavorite}
      >
        <Heart size={15} strokeWidth={2} className={isFavorite ? 'fill-accent text-accent' : 'text-white'} />
      </button>

      <button type="button" onClick={onOpen} className="block w-full text-start pt-2.5">
        <p className="font-num text-[11px] text-accent tracking-wide">{cardDate(festival)}</p>
        <h3 className="text-[15px] font-semibold leading-snug text-white mt-1 line-clamp-2" dir="auto">{festival.name}</h3>
        <p className="text-[13px] text-muted truncate mt-0.5" dir="auto">
          {[festival.venue, festival.city].filter(Boolean).join(', ')}
        </p>
      </button>
    </article>
  )
}
