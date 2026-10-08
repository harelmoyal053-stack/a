import { ArrowLeft } from 'lucide-react'
import { t } from '../i18n'

// Section with a heading, a "view all" link and a horizontally scrolling row.
export default function Carousel({ title, subtitle, badge, onSeeAll, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between gap-3 mb-3.5">
        <div className="min-w-0">
          <h2 className="flex items-center gap-3 text-[22px] font-bold tracking-tight">
            {title}
            {badge}
          </h2>
          {subtitle && <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        {onSeeAll && (
          <button type="button" onClick={onSeeAll} className="flex items-center gap-1 text-[14px] font-medium text-accent shrink-0 pb-0.5">
            {t('common.all')} <ArrowLeft size={16} className="ltr:-scale-x-100" />
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 scroll-px-4 pb-1">
        {children}
      </div>
    </section>
  )
}
