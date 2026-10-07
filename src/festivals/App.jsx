import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight, CalendarClock, CalendarRange, Disc3, Heart, Home, Lock, Menu, MessageCircle, Search, SearchX, Tent, User, X,
} from 'lucide-react'
import Carousel from './components/Carousel'
import EventSlide from './components/EventSlide'
import PopularGroups, { PopularGroupsPage } from './components/PopularGroups'
import ProfileTab from './components/ProfileTab'
import FestivalGrid from './components/FestivalGrid'
import FestivalModal from './components/FestivalModal'
import ChatScreen from './components/ChatScreen'
import MyGroups from './components/MyGroups'
import { useChat } from './chat/ChatContext'
import { CONTINENTS, GENRES, MONTHS } from './data/festivals'
import { findGroup, groupsFor } from './data/groups'
import { useCatalog } from './data/CatalogContext'
import { REPO_URL, addEventUrl } from './config'
import { sourceLabel } from './data/catalog'
import { overlaps, thisWeekRange, todayIso, weekendRange } from './utils'

const FAVORITES_KEY = 'festival-groups:favorites'
const TABS = [
  { id: 'home', label: 'בית', icon: Home },
  { id: 'search', label: 'חיפוש', icon: Search },
  { id: 'chats', label: 'צ׳אטים', icon: MessageCircle },
  { id: 'favorites', label: 'שמורים', icon: Heart },
  { id: 'profile', label: 'פרופיל', icon: User },
]

const KINDS = [
  { id: 'all', label: 'הכול' },
  { id: 'festival', label: 'פסטיבלים' },
  { id: 'party', label: 'מסיבות' },
]

const numberFormat = new Intl.NumberFormat('he-IL')

// Home shortcuts; each opens a filtered list.
const PRESETS = [
  { id: 'today', label: 'היום', icon: CalendarClock, match: (f) => overlaps(f, todayIso(), todayIso()) },
  { id: 'weekend', label: 'סופ״ש', icon: CalendarRange, match: (f) => overlaps(f, ...weekendRange()) },
  { id: 'festival', label: 'פסטיבלים', icon: Tent, match: (f) => f.kind === 'festival' },
  { id: 'party', label: 'מסיבות', icon: Disc3, match: (f) => f.kind === 'party' },
]
// Lists reachable from "see all" links but not shown as shortcuts.
const ALL_PRESETS = [...PRESETS, { id: 'week', label: 'השבוע', match: (f) => overlaps(f, ...thisWeekRange()) }]
const CAROUSEL_SIZE = 12

function loadFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

// "#/festival/<id>" or "#/chat/<group id>" → { type, id }, else null.
function routeFromHash() {
  const match = window.location.hash.match(/^#\/(festival|chat)\/([\w-]+)$/)
  return match ? { type: match[1], id: match[2] } : null
}

// Underlined segmented control, for the primary festival/party switch.
function Segments({ options, value, onChange }) {
  return (
    <div className="flex gap-6 border-b hairline" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={`relative pb-2.5 text-[15px] font-medium transition-colors ${value === o.id ? 'text-white' : 'text-muted hover:text-white'}`}
        >
          {o.label}
          {value === o.id && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
        </button>
      ))}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap h-8 px-3 rounded-md text-[13px] border transition-colors ${
        active ? 'bg-white text-black border-white font-medium' : 'text-white/75 border-ink-600 hover:border-white/40'
      }`}
    >
      {children}
    </button>
  )
}

function ChipRow({ label, children }) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-[10px] text-muted shrink-0 w-14">{label}</span>}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -ml-4 pl-4 min-w-0">{children}</div>
    </div>
  )
}

function PageTitle({ children, meta }) {
  return (
    <div className="flex items-baseline justify-between mb-5">
      <h1 className="text-[22px] font-semibold tracking-tight">{children}</h1>
      {meta && <span className="font-num text-[11px] text-muted">{meta}</span>}
    </div>
  )
}

function EmptyState({ icon, title, children }) {
  const Icon = icon
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <Icon size={22} strokeWidth={1.5} className="text-muted mb-4" />
      <p className="font-medium">{title}</p>
      <div className="text-sm text-muted mt-1 max-w-xs">{children}</div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [preset, setPreset] = useState(null)
  const [query, setQuery] = useState('')
  const [continent, setContinent] = useState('all')
  const [genre, setGenre] = useState('all')
  const [kind, setKind] = useState('all')
  const [month, setMonth] = useState('all')
  const [favorites, setFavorites] = useState(loadFavorites)
  const [route, setRoute] = useState(routeFromHash)
  const { myGroups, groupsReady } = useChat()
  const catalog = useCatalog()
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const onNav = () => setRoute(routeFromHash())
    window.addEventListener('popstate', onNav)
    window.addEventListener('hashchange', onNav)
    return () => {
      window.removeEventListener('popstate', onNav)
      window.removeEventListener('hashchange', onNav)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]))
    } catch {
      // Storage unavailable (private mode) – favorites just won't persist.
    }
  }, [favorites])

  useEffect(() => {
    if (tab === 'search') searchRef.current?.focus()
    window.scrollTo({ top: 0 })
  }, [tab, preset])

  const goTab = (id) => {
    setTab(id)
    setPreset(null)
  }

  const toggleFavorite = (id) =>
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const navigate = (type, id) => {
    history.pushState({ inApp: true }, '', `#/${type}/${id}`)
    setRoute({ type, id })
  }
  const openFestival = (id) => navigate('festival', id)
  const openChat = (id) => navigate('chat', id)
  // Go back when we opened this screen ourselves, so the back button stays in sync.
  const closeScreen = useCallback(() => {
    if (history.state?.inApp) {
      history.back()
    } else {
      history.replaceState(null, '', window.location.pathname + window.location.search)
      setRoute(null)
    }
  }, [])

  const presetCounts = useMemo(
    () => Object.fromEntries(PRESETS.map((p) => [p.id, catalog.items.filter(p.match).length])),
    [catalog.items],
  )
  const activePreset = ALL_PRESETS.find((p) => p.id === preset)
  const presetResults = useMemo(
    () => (activePreset ? catalog.items.filter(activePreset.match) : []),
    [catalog.items, activePreset],
  )
  const upcomingFestivals = useMemo(
    () => catalog.items.filter((f) => f.kind === 'festival').slice(0, CAROUSEL_SIZE),
    [catalog.items],
  )
  const thisWeek = useMemo(() => {
    const [from, to] = thisWeekRange()
    // Lead with events that have artwork; they make the row.
    return catalog.items.filter((f) => overlaps(f, from, to))
      .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
      .slice(0, CAROUSEL_SIZE)
  }, [catalog.items])
  const thisWeekCount = useMemo(() => {
    const [from, to] = thisWeekRange()
    return catalog.items.filter((f) => overlaps(f, from, to)).length
  }, [catalog.items])


  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.items.filter((f) => {
      if (kind !== 'all' && f.kind !== kind) return false
      if (continent !== 'all' && f.continent !== continent) return false
      if (genre !== 'all' && !f.genres.includes(genre)) return false
      if (month !== 'all' && f.month !== Number(month)) return false
      if (!q) return true
      return [f.name, f.city, f.country, f.venue, CONTINENTS[f.continent], ...f.genres.map((g) => GENRES[g])]
        .some((text) => text?.toLowerCase().includes(q))
    })
  }, [catalog.items, query, continent, genre, month, kind])

  const renderGrid = (list, key, grouped = false) => (
    <FestivalGrid key={key} items={list} grouped={grouped} favorites={favorites} onToggleFavorite={toggleFavorite} onOpen={openFestival} />
  )

  // Only offer filters that match at least one event.
  const genreOptions = Object.entries(GENRES).filter(([key]) => catalog.items.some((f) => f.genres.includes(key)))
  const continentOptions = Object.entries(CONTINENTS).filter(([key]) => catalog.items.some((f) => f.continent === key))

  const genreChips = (
    <ChipRow label="סגנון">
      <Chip active={genre === 'all'} onClick={() => setGenre('all')}>הכול</Chip>
      {genreOptions.map(([key, label]) => (
        <Chip key={key} active={genre === key} onClick={() => setGenre(key)}>{label}</Chip>
      ))}
    </ChipRow>
  )

  const openFestivalData = route?.type === 'festival' ? catalog.byId.get(route.id) : null
  const openChatData = route?.type === 'chat' ? findGroup(route.id, catalog.byId, myGroups) : null
  // A chat link for an event that has ended (or never existed), opened by someone outside the group.
  const chatClosed = route?.type === 'chat' && !openChatData && catalog.loaded && groupsReady
  const hasGroups = Object.keys(myGroups).length > 0
  const favoriteList = catalog.items.filter((f) => favorites.has(f.id))
  const updated = catalog.updatedAt ? new Date(catalog.updatedAt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }) : null

  return (
    <div className="min-h-screen bg-ink-900 text-[#ededed] font-ui pb-20">
      <header className="sticky top-0 z-40 bg-ink-900/90 backdrop-blur-md border-b hairline">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button type="button" onClick={() => goTab('home')} className="flex items-center gap-2" dir="ltr" aria-label="FestiChat – דף הבית">
            <span className="w-2.5 h-2.5 bg-accent rounded-[2px]" />
            <span className="text-[17px] font-semibold tracking-tight lowercase">festichat</span>
          </button>
          <div className="flex items-center -ml-2">
            <button type="button" onClick={() => goTab('search')} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white" aria-label="חיפוש">
              <Search size={20} strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white" aria-label="תפריט">
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-5">
        {tab === 'home' && preset === 'groups' && (
          <PopularGroupsPage onOpen={openChat} onBack={() => setPreset(null)} />
        )}

        {tab === 'home' && activePreset && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <button type="button" onClick={() => setPreset(null)} className="w-9 h-9 -mr-2 flex items-center justify-center" aria-label="חזרה">
                <ArrowRight size={20} />
              </button>
              <h1 className="text-[22px] font-semibold tracking-tight flex-1">{activePreset.label}</h1>
              <span className="font-num text-[11px] text-muted">{numberFormat.format(presetResults.length)} אירועים</span>
            </div>
            {presetResults.length > 0
              ? renderGrid(presetResults, `preset-${preset}`, true)
              : <EmptyState icon={SearchX} title="אין אירועים כרגע">נסו קטגוריה אחרת.</EmptyState>}
          </>
        )}

        {tab === 'home' && !preset && (
          <>
            <div className="grid grid-cols-4 gap-2 mb-8">
              {PRESETS.map((p) => {
                const Icon = p.icon
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPreset(p.id)}
                    className="flex flex-col items-start gap-3 rounded-lg border hairline bg-ink-800 px-3 py-3 hover:border-white/20 text-right"
                  >
                    <Icon size={18} strokeWidth={1.75} className="text-accent" />
                    <span>
                      <span className="block text-[13px] font-medium leading-tight">{p.label}</span>
                      <span className="block font-num text-[10px] text-muted mt-0.5">{catalog.loaded ? numberFormat.format(presetCounts[p.id]) : '–'}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            {hasGroups && (
              <section className="mb-10">
                <div className="flex items-end justify-between mb-1">
                  <h2 className="text-[19px] font-semibold tracking-tight">הקבוצות שלי</h2>
                  <button type="button" onClick={() => goTab('chats')} className="text-[13px] text-accent">הכול</button>
                </div>
                <MyGroups onOpen={openChat} limit={3} />
              </section>
            )}

            <PopularGroups onOpen={openChat} onSeeAll={() => setPreset('groups')} />

            {!catalog.loaded && (
              <div className="flex gap-3 overflow-hidden mb-10" aria-label="טוען אירועים">
                {[0, 1].map((i) => <div key={i} className="shrink-0 w-[78%] sm:w-80 aspect-[4/5] rounded-lg bg-ink-800 animate-pulse" />)}
              </div>
            )}

            {upcomingFestivals.length > 0 && (
              <Carousel title="פסטיבלים קרובים" subtitle="הפסטיבלים הבאים בעולם" onSeeAll={() => setPreset('festival')}>
                {upcomingFestivals.map((f) => <EventSlide key={f.id} festival={f} onOpen={() => openFestival(f.id)} />)}
              </Carousel>
            )}

            {thisWeek.length > 0 && (
              <Carousel title="השבוע" count={numberFormat.format(thisWeekCount)} subtitle="מסיבות והופעות בשבעת הימים הקרובים" onSeeAll={() => setPreset('week')}>
                {thisWeek.map((f) => <EventSlide key={f.id} festival={f} onOpen={() => openFestival(f.id)} />)}
              </Carousel>
            )}

            {catalog.loaded && catalog.items.length === 0 && (
              <EmptyState icon={SearchX} title="אין אירועים להצגה">לא הצלחנו לטעון את האירועים. נסו לרענן בעוד כמה דקות.</EmptyState>
            )}

          </>
        )}

        {tab === 'search' && (
          <>
            <label className="flex items-center gap-2.5 h-11 bg-ink-800 border border-ink-600 rounded-md px-3 mb-4 focus-within:border-white/40">
              <Search size={18} strokeWidth={1.75} className="text-muted shrink-0" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="אמן, אירוע, עיר או מדינה"
                className="flex-1 outline-none bg-transparent text-base placeholder:text-muted"
                aria-label="חיפוש אירוע"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="ניקוי חיפוש"><X size={16} className="text-muted" /></button>
              )}
            </label>
            <Segments options={KINDS} value={kind} onChange={setKind} />
            <div className="flex flex-col gap-2.5 mt-4 mb-6">
              <ChipRow label="אזור">
                <Chip active={continent === 'all'} onClick={() => setContinent('all')}>הכול</Chip>
                {continentOptions.map(([key, label]) => (
                  <Chip key={key} active={continent === key} onClick={() => setContinent(key)}>{label}</Chip>
                ))}
              </ChipRow>
              {genreChips}
              <ChipRow label="חודש">
                <Chip active={month === 'all'} onClick={() => setMonth('all')}>הכול</Chip>
                {MONTHS.map((name, i) => (
                  <Chip key={name} active={month === String(i + 1)} onClick={() => setMonth(String(i + 1))}>{name}</Chip>
                ))}
              </ChipRow>
            </div>
            <p className="font-num text-[11px] text-muted mb-4">{numberFormat.format(searchResults.length)} תוצאות</p>
            {searchResults.length > 0 ? renderGrid(searchResults, `search-${query}-${continent}-${genre}-${month}-${kind}`) : (
              <EmptyState icon={SearchX} title="לא נמצאו אירועים">
                נסו מילה אחרת או הסירו סינון.{' '}
                <a href={addEventUrl()} target="_blank" rel="noopener noreferrer" className="text-accent">מפיקים? הוסיפו אירוע</a>
              </EmptyState>
            )}
          </>
        )}

        {tab === 'chats' && (
          <>
            <PageTitle>צ׳אטים</PageTitle>
            <MyGroups onOpen={openChat} emptyHint />
          </>
        )}

        {tab === 'favorites' && (
          <>
            <PageTitle meta={favoriteList.length ? numberFormat.format(favoriteList.length) : null}>שמורים</PageTitle>
            {favoriteList.length > 0 ? renderGrid(favoriteList, 'favorites') : (
              <EmptyState icon={Heart} title="עוד לא שמרת אירועים">לחצו על הלב בכרטיס של אירוע כדי לשמור אותו כאן.</EmptyState>
            )}
          </>
        )}

        {tab === 'profile' && <ProfileTab onOpenChats={() => goTab('chats')} />}

        <footer className="border-t hairline mt-10 py-6 text-[12px] text-muted leading-relaxed">
          {catalog.sources.length > 0 && (
            <p>נתוני אירועים: {catalog.sources.map(sourceLabel).join(', ')}. מתעדכן כל לילה{updated && `, עדכון אחרון ${updated}`}.</p>
          )}
          <p>FestiChat היא קהילה עצמאית ואינה קשורה למארגני האירועים.</p>
        </footer>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-ink-950/95 backdrop-blur-md border-t hairline pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTab(item.id)}
                className={`relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] transition-colors ${active ? 'text-white' : 'text-muted hover:text-white/80'}`}
                aria-current={active ? 'page' : undefined}
              >
                {active && <span className="absolute top-0 h-0.5 w-6 bg-accent" />}
                <Icon size={21} strokeWidth={active ? 2 : 1.6} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 h-full w-72 max-w-[85%] bg-ink-800 border-r hairline flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="h-14 px-4 flex items-center justify-between border-b hairline">
              <span className="text-[11px] text-muted">תפריט</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="סגירת תפריט"><X size={20} strokeWidth={1.75} /></button>
            </div>
            <a href={addEventUrl()} target="_blank" rel="noopener noreferrer" className="px-4 py-3.5 border-b hairline hover:bg-white/5">הוספת אירוע (למפיקים)</a>
            <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="px-4 py-3.5 border-b hairline hover:bg-white/5">דיווח על בעיה</a>
            <p className="px-4 py-4 text-[13px] text-muted leading-relaxed">
              בוחרים אירוע, מצטרפים לקבוצה ומתכתבים עם מי שמגיע. הקבוצות שלכם נמצאות בלשונית ״צ׳אטים״.
            </p>
          </div>
        </div>
      )}

      {openFestivalData && (
        <FestivalModal
          festival={openFestivalData}
          groups={groupsFor(openFestivalData)}
          isFavorite={favorites.has(openFestivalData.id)}
          onToggleFavorite={() => toggleFavorite(openFestivalData.id)}
          onClose={closeScreen}
          onOpenChat={openChat}
        />
      )}

      {chatClosed && (
        <div className="fixed inset-0 z-[55] bg-black/80 flex items-center justify-center p-6" onClick={closeScreen}>
          <div className="bg-ink-800 border hairline rounded-lg p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <Lock size={20} strokeWidth={1.75} className="text-muted" />
            <p className="font-semibold text-lg mt-4">הקבוצה סגורה</p>
            <p className="text-sm text-muted mt-1.5 leading-relaxed">האירוע הסתיים, ורק מי שהיה בקבוצה לפני כן יכול להמשיך להתכתב בה.</p>
            <button type="button" onClick={closeScreen} className="mt-6 w-full h-11 bg-white text-black font-medium rounded-md">לאירועים הקרובים</button>
          </div>
        </div>
      )}

      {openChatData && (
        <ChatScreen festival={openChatData.festival} group={openChatData.group} onClose={closeScreen} />
      )}
    </div>
  )
}
