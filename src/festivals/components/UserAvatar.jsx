import { useState } from 'react'
import { initials } from '../utils'

const SIZES = { xs: 'w-7 h-7 text-[10px]', sm: 'w-9 h-9 text-[12px]', md: 'w-12 h-12 text-sm', xl: 'w-24 h-24 text-2xl' }

// Round person avatar: their photo, or initials on a neutral tile.
export default function UserAvatar({ name, photo, size = 'sm' }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={`${SIZES[size]} shrink-0 rounded-full overflow-hidden bg-ink-600 flex items-center justify-center font-num font-semibold text-white/80 relative`}>
      {photo && !failed
        ? <img src={photo} alt="" onError={() => setFailed(true)} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
        : initials(name || '?')}
    </span>
  )
}
