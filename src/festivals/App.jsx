import { useCallback, useEffect, useMemo, useState } from 'react'
import { Globe, Heart, MessageCircle, Plus, Search, ShieldCheck, Sparkles, Users, X } from 'lucide-react'
import FestivalCard from './components/FestivalCard'
import FestivalModal from './components/FestivalModal'
import { CONTINENTS, FESTIVALS, GENRES, MONTHS } from './data/festivals'
import { groupsFor } from './data/groups'
import { REPO_URL, suggestFestivalUrl } from './config'

const FAVORITES_KEY = 'festival-groups:favorites'

function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function festivalIdFromHash() {
  const match = window.location.hash.match(/^#\/festival\/([\w-]+)$/)
  return match ? match[1] : null
}

// Months from now until the festival's usual month, so upcoming ones sort first.
function monthsAway(month) {
  return (month - 1 - new Date().getMonth() + 12) % 12
}

const STEPS = [
  { icon: Search, title: 'מוצאים פסטיבל', text: 'מחפשים לפי שם, מדינה, סגנון או חודש.' },
  { icon: Users, title: 'בוחרים קבוצה', text: 'כללית, טרמפים, לינה, כרטיסים, ישראלים ומגיעים לבד.' },
  { icon: MessageCircle, title: 'נכנסים בלחיצה', text: 'הקישור פותח את הקבוצה ישירות בוואטסאפ.' },
]

const GROUPS = Object.fromEntries(FESTIVALS.map((f) => [f.id, groupsFor(f.id)]))

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [continent, setContinent] = useState('all')
  const [genre, setGenre] = useState('all')
  const [month, setMonth] = useState('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [openId, setOpenId] = useState(festivalIdFromHash)

  useEffect(() => {
    const onHash = () => setOpenId(festivalIdFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
    } catch {
      // Storage unavailable (private mode) – favorites just won't persist.
    }
  }, [favorites])

  const toggleFavorite = (id) =>
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const openFestival = (id) => {
    history.pushState(null, '', `#/festival/${id}`)
    setOpenId(id)
  }
  const closeFestival = useCallback(() => {
    history.replaceState(null, '', window.location.pathname + window.location.search)
    setOpenId(null)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FESTIVALS.filter((f) => {
      if (continent !== 'all' && f.continent !== continent) return false
      if (genre !== 'all' && !f.genres.includes(genre)) return false
      if (month !== 'all' && f.month !== Number(month)) return false
      if (favoritesOnly && !favorites.has(f.id)) return false
      if (!q) return true
      return [f.name, f.city, f.country, CONTINENTS[f.continent], ...f.genres.map((g) => GENRES[g])]
        .some((text) => text.toLowerCase().includes(q))
    }).sort((a, b) => monthsAway(a.month) - monthsAway(b.month))
  }, [query, continent, genre, month, favoritesOnly, favorites])

  const groupsPerFestival = GROUPS[FESTIVALS[0].id].length
  const countries = new Set(FESTIVALS.map((f) => f.country)).size
  const openFestivalData = FESTIVALS.find((f) => f.id === openId)
  const hasFilters = query || continent !== 'all' || genre !== 'all' || month !== 'all' || favoritesOnly

  const resetFilters = () => {
    setQuery('')
    setContinent('all')
    setGenre('all')
    setMonth('all')
    setFavoritesOnly(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="./" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white">
              <MessageCircle size={20} />
            </span>
            FestiChat
          </a>
          <a
            href={suggestFestivalUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold bg-slate-900 text-white px-3.5 py-2 rounded-xl hover:bg-slate-700"
          >
            <Plus size={16} /> הצעת פסטיבל
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-20 text-[10rem] leading-none select-none pointer-events-none" aria-hidden="true">
          <span className="absolute -top-6 right-10">🎶</span>
          <span className="absolute bottom-0 left-6">🎪</span>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <p className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm mb-4">
            <Sparkles size={14} /> כל קבוצות הפסטיבלים במקום אחד
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            מוצאים את <span className="text-emerald-300">החבר׳ה</span> לפסטיבל הבא
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            קבוצות וואטסאפ לפסטיבלים בכל העולם – טרמפים, לינה, כרטיסים וישראלים שמגיעים. בוחרים פסטיבל ונכנסים.
          </p>
          <label className="mt-8 max-w-xl mx-auto flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-xl text-slate-900">
            <Search size={20} className="text-slate-400 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפשו פסטיבל, עיר או מדינה…"
              className="flex-1 outline-none bg-transparent text-base"
              aria-label="חיפוש פסטיבל"
            />
          </label>
          <dl className="mt-10 grid grid-cols-3 max-w-lg mx-auto gap-4">
            {[
              [FESTIVALS.length, 'פסטיבלים'],
              [countries, 'מדינות'],
              [groupsPerFestival, 'קבוצות לכל פסטיבל'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-extrabold">{value}</dd>
                <dd className="text-sm text-white/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            <Chip active={continent === 'all'} onClick={() => setContinent('all')}><Globe size={14} className="inline ml-1" />כל העולם</Chip>
            {Object.entries(CONTINENTS).map(([key, label]) => (
              <Chip key={key} active={continent === key} onClick={() => setContinent(key)}>{label}</Chip>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            <Chip active={genre === 'all'} onClick={() => setGenre('all')}>כל הסגנונות</Chip>
            {Object.entries(GENRES).map(([key, label]) => (
              <Chip key={key} active={genre === key} onClick={() => setGenre(key)}>{label}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm"
              aria-label="סינון לפי חודש"
            >
              <option value="all">כל החודשים</option>
              {MONTHS.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
            </select>
            <Chip active={favoritesOnly} onClick={() => setFavoritesOnly((v) => !v)}>
              <Heart size={14} className={`inline ml-1 ${favoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
              המועדפים שלי ({favorites.size})
            </Chip>
            {hasFilters && (
              <button type="button" onClick={resetFilters} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
                <X size={14} /> ניקוי
              </button>
            )}
            <span className="text-sm text-slate-500 mr-auto">{results.length} פסטיבלים · לפי הקרובים ביותר</span>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((festival) => (
              <FestivalCard
                key={festival.id}
                festival={festival}
                groups={GROUPS[festival.id]}
                isFavorite={favorites.has(festival.id)}
                onToggleFavorite={() => toggleFavorite(festival.id)}
                onOpen={() => openFestival(festival.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-semibold text-slate-700">לא מצאנו פסטיבל כזה</p>
            <p className="text-sm mt-1">
              נסו לנקות את הסינון, או{' '}
              <a href={suggestFestivalUrl()} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">הציעו פסטיבל חדש</a>
            </p>
          </div>
        )}

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="bg-white rounded-3xl p-6 border border-slate-100">
                <span className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <Icon size={22} />
                </span>
                <p className="font-bold">{i + 1}. {step.title}</p>
                <p className="text-sm text-slate-500 mt-1">{step.text}</p>
              </div>
            )
          })}
        </section>

        <section className="mt-6 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="flex gap-3">
            <ShieldCheck size={28} className="text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-lg">מנהלים קבוצת פסטיבל?</p>
              <p className="text-sm text-white/70">שלחו את הקישור דרך כפתור ״הוספת קישור״ בעמוד הפסטיבל. כל קישור נבדק לפני שהוא עולה.</p>
            </div>
          </div>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-emerald-500 hover:bg-emerald-600 font-semibold px-5 py-2.5 rounded-xl text-center">
            לבקשות פתוחות
          </a>
        </section>
      </main>

      <footer className="text-center text-xs text-slate-400 py-8">
        FestiChat הוא אינדקס קהילתי ואינו קשור לפסטיבלים או ל-WhatsApp. תאריכים משוערים – בדקו באתר הרשמי.
      </footer>

      {openFestivalData && (
        <FestivalModal
          festival={openFestivalData}
          groups={GROUPS[openFestivalData.id]}
          isFavorite={favorites.has(openFestivalData.id)}
          onToggleFavorite={() => toggleFavorite(openFestivalData.id)}
          onClose={closeFestival}
        />
      )}
    </div>
  )
}
