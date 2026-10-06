import { useState } from 'react'
import { groupsFor } from '../data/groups'
import FestivalCard from './FestivalCard'

// Card grid that renders a page at a time, so thousands of events stay fast.
// Give it a `key` that changes with the filters to start again from page one.
export default function FestivalGrid({ items, pageSize = 24, favorites, onToggleFavorite, onOpen }) {
  const [shown, setShown] = useState(pageSize)
  return (
    <>
      <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.slice(0, shown).map((item) => (
          <FestivalCard
            key={item.id}
            festival={item}
            groups={groupsFor(item)}
            isFavorite={favorites.has(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
            onOpen={() => onOpen(item.id)}
          />
        ))}
      </div>
      {shown < items.length && (
        <button
          type="button"
          onClick={() => setShown((n) => n + pageSize)}
          className="mt-5 w-full py-3 rounded-2xl border border-white/15 text-white/80 hover:bg-white/5 font-medium"
        >
          הצגת עוד ({items.length - shown})
        </button>
      )}
    </>
  )
}
