import { useState } from 'react'

// Shrink for long names, and for long single words so they never split mid-word.
function titleSize(name, large) {
  const longestWord = Math.max(...name.split(/\s+/).map((w) => w.length))
  const long = name.length > 22 || longestWord > 8
  if (large) return long ? 'text-4xl' : 'text-6xl'
  return long ? 'text-xl' : 'text-3xl'
}

// Event artwork: the event's photo, or a typographic flyer in its colour.
export default function Poster({ festival, large = false, showTitle = true }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const src = festival.image?.src
  if (src && src !== failedSrc) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailedSrc(src)}
        className="absolute inset-0 w-full h-full object-cover"
      />
    )
  }

  const [tone] = festival.colors
  const [, m, d] = (festival.startDate ?? '').split('-')
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-800" aria-hidden="true">
      <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(160deg, ${tone}55 0%, transparent 55%)` }} />
      <div className="absolute inset-0 poster-grain" />
      <div className={`absolute inset-0 flex flex-col justify-between ${large ? 'p-6 pt-20' : 'p-3'}`} dir="ltr">
        <div className={`flex justify-between font-num uppercase tracking-[0.12em] text-white/50 ${large ? 'text-xs' : 'text-[9px]'}`}>
          <span>{large && (festival.kind === 'festival' ? 'Festival' : 'Club night')}</span>
          {d && <span>{d}.{m}</span>}
        </div>
        {showTitle ? (
          <p className={`font-poster font-bold uppercase leading-[0.88] tracking-tight text-white line-clamp-4 break-words ${titleSize(festival.name, large)}`} dir="auto">
            {festival.name}
          </p>
        ) : <span />}
        <p className={`font-num uppercase tracking-[0.12em] truncate ${large ? 'text-xs' : 'text-[9px]'}`} style={{ color: tone }}>
          {festival.city}
        </p>
      </div>
    </div>
  )
}
