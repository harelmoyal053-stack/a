import { MapPin } from 'lucide-react'
import { cardDate, priceLabel } from '../utils'
import Poster from './Poster'

// Large carousel card: artwork with the details laid over its lower part.
export default function EventSlide({ festival, onOpen }) {
  const price = priceLabel(festival)
  // Over a photo the name goes in the caption; a generated poster already shows it big.
  const hasPhoto = Boolean(festival.image?.src)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="snap-start shrink-0 w-[78%] sm:w-80 relative aspect-[4/5] rounded-lg overflow-hidden bg-ink-800 text-right group"
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
        <Poster festival={festival} large showTitle={!hasPhoto} showCity={false} />
      </div>
      {hasPhoto && <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />}
      {price && (
        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm font-num text-[11px] px-1.5 py-0.5 rounded-sm">{price}</span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-num text-[11px] text-accent">{cardDate(festival)}</p>
        {hasPhoto && <p className="text-[19px] font-semibold leading-tight mt-1 line-clamp-2" dir="auto">{festival.name}</p>}
        <p className="flex items-center gap-1 text-[13px] text-white/70 mt-1.5 truncate">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate" dir="auto">{[festival.city, festival.country].filter(Boolean).join(', ')}</span>
        </p>
      </div>
    </button>
  )
}
