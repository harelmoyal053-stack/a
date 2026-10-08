import { useMemo, useState } from 'react'
import { ArrowLeft, Search, Send } from 'lucide-react'
import { locale, t } from '../i18n'
import heroTall from '../assets/hero-tall.webp'
import heroWide from '../assets/hero-wide.webp'

// Home banner: a party photo, the pitch, search and the main call to action.
export default function Hero({ items, signedIn, onSearch, onJoin }) {
  const [failed, setFailed] = useState(new Set())
  const withPhoto = useMemo(() => items.filter((f) => f.image?.src && !failed.has(f.image.src)), [items, failed])
  const faces = withPhoto.slice(0, 5)
  const countries = useMemo(() => new Set(items.map((f) => f.country)).size, [items])
  const nf = new Intl.NumberFormat(locale())
  const drop = (src) => setFailed((prev) => new Set(prev).add(src))

  return (
    <section className="relative -mx-4 -mt-[4.5rem] mb-2 overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute -top-20 end-[-6rem] w-96 h-96 rounded-full bg-fuchsia-600/40 blur-3xl" />
        <div className="absolute top-40 -start-24 w-80 h-80 rounded-full bg-violet-600/40 blur-3xl" />
        <div className="absolute bottom-0 end-10 w-72 h-72 rounded-full bg-blue-600/30 blur-3xl" />
      </div>
      <picture>
        <source media="(min-width: 768px)" srcSet={heroWide} />
        <img src={heroTall} alt="" className="absolute inset-0 w-full h-full object-cover object-[50%_60%]" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/10 to-ink-900" />
      <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-ink-900/75 via-ink-900/25 to-transparent" />
      <div className="absolute -top-24 -start-24 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-7">
        <h1 className="text-[42px] sm:text-6xl leading-[1.04] font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          {t('hero.l1')}
          <br />
          <span className="text-brand">{t('hero.l2')}</span>
          <br />
          <span className="text-[32px] sm:text-5xl">{t('hero.l3')}</span>
        </h1>
        <p className="mt-4 text-[16px] text-white/90 max-w-sm leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{t('hero.body')}</p>

        <button
          type="button"
          onClick={onSearch}
          className="mt-6 w-full max-w-md h-[52px] rounded-full bg-ink-900/55 backdrop-blur-md border border-white/15 flex items-center gap-3 px-5 text-muted text-start"
        >
          <Search size={20} className="text-white/80 shrink-0" />
          <span className="truncate">{t('search.placeholder')}</span>
        </button>
        <button
          type="button"
          onClick={onJoin}
          className="mt-3 h-[52px] px-6 rounded-full bg-brand shadow-brand font-semibold text-[16px] inline-flex items-center gap-2.5 hover:brightness-110"
        >
          <Send size={18} className="rtl:-scale-x-100" />
          {signedIn ? t('hero.explore') : t('hero.join')}
          <ArrowLeft size={18} className="ltr:-scale-x-100" />
        </button>

        {items.length > 0 && (
          <div className="mt-6 flex items-center gap-3">
            {faces.length > 0 && (
              <span className="flex -space-x-2.5 rtl:space-x-reverse shrink-0">
                {faces.map((f) => (
                  <img
                    key={f.id}
                    src={f.image.src}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => drop(f.image.src)}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-ink-900"
                  />
                ))}
              </span>
            )}
            <p className="text-[14px] leading-snug">
              {t('hero.proof', { events: nf.format(items.length), countries: nf.format(countries) })}
              <span className="block text-white/60 text-[13px]">{t('hero.proofSub')}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
