import { useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'

// Horizontally scrolling row with snap points and a position indicator.
export default function Carousel({ title, subtitle, count, onSeeAll, children }) {
  const track = useRef(null)
  const [index, setIndex] = useState(0)
  const slides = Array.isArray(children) ? children.length : 1

  const onScroll = () => {
    const el = track.current
    const first = el?.firstElementChild
    if (!first) return
    // RTL scrolls into negative scrollLeft in modern browsers.
    const step = first.getBoundingClientRect().width + 12
    setIndex(Math.min(slides - 1, Math.round(Math.abs(el.scrollLeft) / step)))
  }

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight">
            {title}
            {count != null && <span className="font-num text-[12px] text-muted font-normal mr-2">{count}</span>}
          </h2>
          {subtitle && <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        {onSeeAll && (
          <button type="button" onClick={onSeeAll} className="flex items-center text-[13px] text-accent shrink-0">
            הכול <ChevronLeft size={16} />
          </button>
        )}
      </div>
      <div
        ref={track}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 scroll-px-4"
      >
        {children}
      </div>
      {slides > 1 && (
        <div className="flex justify-center gap-1 mt-3" aria-hidden="true">
          {Array.from({ length: Math.min(slides, 12) }, (_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === Math.min(index, 11) ? 'w-4 bg-accent' : 'w-1 bg-white/25'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
