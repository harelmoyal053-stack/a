import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Home, Lock, Menu, MessageCircle, Search, SearchX, X } from 'lucide-react'
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

const FAVORITES_KEY = 'festival-groups:favorites'
const TABS = [
  { id: 'home', label: 'בית', icon: Home },
  { id: 'search', label: 'חיפוש', icon: Search },
  { id: 'chats', label: 'צ׳אטים', icon: MessageCircle },
  { id: 'favorites', label: 'שמורים', icon: Heart },
]

const KINDS = [
  { id: 'all', label: 'הכול' },
  { id: 'festival', label: 'פסטיבלים' },
  { id: 'party', label: 'מסיבות' },
]

const numberFormat = new Intl.NumberFormat('he-IL')

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
  }, [tab])

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

  const homeResults = useMemo(
    () => catalog.items.filter((f) => (genre === 'all' || f.genres.includes(genre)) && (kind === 'all' || f.kind === kind)),
    [catalog.items, genre, kind],
  )

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
          <button type="button" onClick={() => setTab('home')} className="flex items-center gap-2" dir="ltr" aria-label="FestiChat – דף הבית">
            <span className="w-2.5 h-2.5 bg-accent rounded-[2px]" />
            <span className="text-[17px] font-semibold tracking-tight lowercase">festichat</span>
          </button>
          <div className="flex items-center -ml-2">
            <button type="button" onClick={() => setTab('search')} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white" aria-label="חיפוש">
              <Search size={20} strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white" aria-label="תפריט">
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-5">
        {tab === 'home' && (
          <>
            {hasGroups && (
              <section className="mb-8">
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-[11px] text-muted">הקבוצות שלי</h2>
                  <button type="button" onClick={() => setTab('chats')} className="text-[13px] text-accent">הכול</button>
                </div>
                <MyGroups onOpen={openChat} limit={3} />
              </section>
            )}

            <Segments options={KINDS} value={kind} onChange={setKind} />
            <div className="mt-4 mb-2">{genreChips}</div>
            <p className="font-num text-[11px] text-muted mb-1">
              {catalog.loaded ? `${numberFormat.format(homeResults.length)} אירועים` : 'טוען…'}
              {updated && ` · עודכן ${updated}`}
            </p>

            {!catalog.loaded && (
              <div className="grid gap-x-3 gap-y-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6" aria-label="טוען אירועים">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i}>
                    <div className="aspect-[4/5] rounded-md bg-ink-800 animate-pulse" />
                    <div className="h-3 w-1/3 bg-ink-800 rounded-sm mt-3 animate-pulse" />
                    <div className="h-4 w-4/5 bg-ink-800 rounded-sm mt-2 animate-pulse" />
                  </div>
                ))}
              </div>
            )}
            {catalog.loaded && catalog.items.length === 0 && (
              <EmptyState icon={SearchX} title="אין אירועים להצגה">לא הצלחנו לטעון את האירועים. נסו לרענן בעוד כמה דקות.</EmptyState>
            )}
            {catalog.loaded && renderGrid(homeResults, `home-${kind}-${genre}`, true)}
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
                className="flex-1 outline-none bg-transparent text-[15px] placeholder:text-muted"
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

        <footer className="border-t hairline mt-10 py-6 text-[12px] text-muted leading-relaxed">
          {catalog.sources.length > 0 && <p>נתוני אירועים: {catalog.sources.map(sourceLabel).join(', ')}. מתעדכן כל לילה.</p>}
          <p>FestiChat היא קהילה עצמאית ואינה קשורה למארגני האירועים.</p>
        </footer>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-ink-950/95 backdrop-blur-md border-t hairline pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto grid grid-cols-4">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
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
