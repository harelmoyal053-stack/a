import { useState } from 'react'
import { initials } from '../utils'

// Square event badge used in chat lists and headers.
export default function EventAvatar({ festival, size = 'md', round = false }) {
  const [tone] = festival.colors ?? ['#444']
  const box = { sm: 'w-9 h-9 text-[11px]', md: 'w-12 h-12 text-[13px]', lg: 'w-20 h-20 text-xl' }[size]
  const [failed, setFailed] = useState(false)
  const src = failed ? null : festival.image?.src
  return (
    <span
      className={`${box} shrink-0 ${round ? 'rounded-full' : 'rounded-xl'} overflow-hidden flex items-center justify-center font-num font-semibold text-white relative`}
      style={{ background: `linear-gradient(160deg, ${tone}, #111729)` }}
    >
      {src ? <img src={src} alt="" onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" /> : initials(festival.name)}
    </span>
  )
}
