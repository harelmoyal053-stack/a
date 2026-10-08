import { useEffect, useRef, useState } from 'react'
import { dayHeading } from '../utils'
import FestivalCard from './FestivalCard'

const PAGE = 24
const GRID = 'grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

// Event grid that loads more as you scroll, optionally split into day sections.
// Give it a `key` that changes with the filters to start again from the top.
export default function FestivalGrid({ items, grouped = false, favorites, onToggleFavorite, onOpen }) {
  const [shown, setShown] = useState(PAGE)
  const sentinel = useRef(null)
  const hasMore = shown < items.length

  // Re-observe after every page so a sentinel still on screen loads the next one.
  useEffect(() => {
    const el = sentinel.current
    if (!el) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShown((n) => n + PAGE)
    }, { rootMargin: '600px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown, hasMore])

  const visible = items.slice(0, shown)
  const card = (item) => (
    <FestivalCard
      key={item.id}
      festival={item}
      isFavorite={favorites.has(item.id)}
      onToggleFavorite={() => onToggleFavorite(item.id)}
      onOpen={() => onOpen(item.id)}
    />
  )

  let body
  if (grouped) {
    const sections = []
    for (const item of visible) {
      const heading = dayHeading(item.startDate)
      if (sections.at(-1)?.heading !== heading) sections.push({ heading, items: [] })
      sections.at(-1).items.push(item)
    }
    body = sections.map((section) => (
      <section key={section.heading} className="mb-8">
        <h2 className="sticky top-16 z-10 -mx-4 px-4 py-2 mb-3 bg-ink-900/95 backdrop-blur border-b hairline flex items-baseline justify-between">
          <span className="text-[13px] font-semibold">{section.heading}</span>
          <span className="font-num text-[11px] text-muted">{section.items.length}</span>
        </h2>
        <div className={GRID}>{section.items.map(card)}</div>
      </section>
    ))
  } else {
    body = <div className={GRID}>{visible.map(card)}</div>
  }

  return (
    <>
      {body}
      {hasMore && <div ref={sentinel} className="h-10" aria-hidden="true" />}
    </>
  )
}
