import { useState } from 'react'
import { MONTHS } from '../data/festivals'

function titleSize(name, large) {
  if (large) return name.length > 24 ? 'text-3xl' : 'text-5xl'
  return name.length > 24 ? 'text-lg' : 'text-2xl'
}

// Festival artwork: the festival's photo when one is set, otherwise a
// generated poster in the festival's colors.
export default function Poster({ festival, large = false }) {
  const [failedSrc, setFailedSrc] = useState(null)
  if (festival.image && festival.image.src !== failedSrc) {
    return (
      <div className="absolute inset-0">
        <img
          src={festival.image.src}
          alt={festival.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(festival.image.src)}
          className="w-full h-full object-cover"
        />
        {festival.image.credit && (
          <span className="absolute bottom-1 left-2 text-[9px] text-white/60" dir="ltr">{festival.image.credit}</span>
        )}
      </div>
    )
  }

  const [from, to] = festival.colors
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 75% 20%, ${from}cc, transparent 55%), radial-gradient(circle at 15% 85%, ${to}cc, transparent 60%), #0b0b0f`,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 poster-grain" />
      <span className={`absolute ${large ? 'text-[9rem] -left-4 -bottom-6' : 'text-[6.5rem] -left-3 -bottom-4'} opacity-90 drop-shadow-2xl rotate-[-12deg]`}>
        {festival.emoji}
      </span>
      <div className={`absolute inset-x-0 top-0 ${large ? 'p-6 pt-16' : 'p-3 pt-12'} text-left`} dir="ltr">
        <p className={`${large ? 'text-sm' : 'text-[10px]'} text-white/70 font-medium`} dir="rtl">
          {MONTHS[festival.month - 1]} · {festival.country}
        </p>
        <p className={`font-black uppercase leading-[0.9] text-white break-words line-clamp-3 ${titleSize(festival.name, large)}`} dir="auto">
          {festival.name}
        </p>
      </div>
    </div>
  )
}
