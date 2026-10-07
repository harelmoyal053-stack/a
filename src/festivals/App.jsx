import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Globe, Heart, Home, Menu, MessageCircle, Search, X } from 'lucide-react'
import FestivalGrid from './components/FestivalGrid'
import FestivalModal from './components/FestivalModal'
import ChatScreen from './components/ChatScreen'
import MyGroups from './components/MyGroups'
import { useChat } from './chat/ChatContext'
import { CONTINENTS, GENRES, MONTHS } from './data/festivals'
import { findGroup, groupsFor } from './data/groups'
import { useCatalog } from './data/CatalogContext'
import { REPO_URL, addEventUrl, suggestFestivalUrl } from './config'
import { sourceLabel } from './data/catalog'

const FAVORITES_KEY = 'festival-groups:favorites'
const TABS = [
  { id: 'home', label: 'בית', icon: Home },
  { id: 'search', label: 'חיפוש', icon: Search },
  { id: 'chats', label: 'צ׳אטים', icon: MessageCircle },
  { id: 'world', label: 'בעולם', icon: Globe },
  { id: 'favorites', label: 'מועדפים', icon: Heart },
]

const KINDS = [
  { id: 'all', label: 'הכול' },
  { id: 'festival', label: 'פסטיבלים' },
  { id: 'party', label: 'מסיבות' },
]

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

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active ? 'bg-white text-black border-white' : 'bg-white/5 text-white/80 border-white/15 hover:border-white/40'
      }`}
    >
      {children}
    </button>
  )
}

function ChipRow({ children }) {
  return <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">{children}</div>
}

function SectionTitle({ children, count }) {
  return (
    <h2 className="font-black text-2xl mb-4 flex items-baseline gap-2">
      {children}
      {count !== undefined && <span className="text-sm font-medium text-white/40">{count}</span>}
    </h2>
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

  const renderGrid = (list, key) => (
    <FestivalGrid key={key} items={list} favorites={favorites} onToggleFavorite={toggleFavorite} onOpen={openFestival} />
  )

  const kindChips = (
    <ChipRow>
      {KINDS.map((k) => (
        <Chip key={k.id} active={kind === k.id} onClick={() => setKind(k.id)}>{k.label}</Chip>
      ))}
    </ChipRow>
  )

  // Only offer filters that match at least one event.
  const genreOptions = Object.entries(GENRES).filter(([key]) => catalog.items.some((f) => f.genres.includes(key)))
  const continentOptions = Object.entries(CONTINENTS).filter(([key]) => catalog.items.some((f) => f.continent === key))

  const genreChips = (
    <ChipRow>
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

  return (
    <div className="min-h-screen bg-ink-900 text-white pb-24">
      <header className="sticky top-0 z-40 bg-ink-900/90 backdrop-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button type="button" onClick={() => setTab('home')} className="text-3xl tracking-tight" dir="ltr" aria-label="FestiChat – דף הבית">
            <span className="font-black">FESTI</span><span className="font-light">CHAT</span>
          </button>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setMenuOpen(true)} className="w-11 h-11 flex items-center justify-center" aria-label="תפריט">
              <Menu size={26} />
            </button>
            <button type="button" onClick={() => setTab('search')} className="w-11 h-11 flex items-center justify-center" aria-label="חיפוש">
              <Search size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-5">
        {tab === 'home' && (
          <>
            <section className="mb-6">
              <p className="text-white/50 text-sm">קבוצות צ׳אט לפסטיבלים ומסיבות בכל העולם</p>
              <h1 className="font-black text-3xl sm:text-5xl leading-tight mt-1">
                מוצאים את החבר׳ה <span className="text-accent">לפסטיבל הבא</span>
              </h1>
            </section>
            {hasGroups && (
              <section className="mb-8">
                <div className="flex justify-between items-baseline">
                  <SectionTitle>הקבוצות שלי</SectionTitle>
                  <button type="button" onClick={() => setTab('chats')} className="text-sm text-whatsapp">לכל הצ׳אטים</button>
                </div>
                <MyGroups onOpen={openChat} limit={3} />
              </section>
            )}
            <div className="mb-5 flex flex-col gap-2.5">
              {kindChips}
              {genreChips}
            </div>
            <SectionTitle count={catalog.loaded ? homeResults.length : undefined}>{kind === 'party' ? 'המסיבות הקרובות' : 'האירועים הקרובים'}</SectionTitle>
            {!catalog.loaded && (
              <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="טוען אירועים">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="bg-ink-800 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            )}
            {catalog.loaded && catalog.items.length === 0 && (
              <p className="text-center text-white/50 py-16">לא הצלחנו לטעון אירועים כרגע. נסו לרענן בעוד כמה דקות.</p>
            )}
            {catalog.loaded && renderGrid(homeResults, `home-${kind}-${genre}`)}
            {catalog.updatedAt && (
              <p className="text-xs text-white/30 mt-4 text-center">
                האירועים מתעדכנים אוטומטית מ: {catalog.sources.map(sourceLabel).join(', ')} · עודכן {new Date(catalog.updatedAt).toLocaleDateString('he-IL')}
              </p>
            )}
          </>
        )}

        {tab === 'search' && (
          <>
            <label className="flex items-center gap-2 bg-ink-800 border border-white/10 rounded-2xl px-4 py-3 mb-4">
              <Search size={20} className="text-white/40 shrink-0" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="פסטיבל, עיר או מדינה…"
                className="flex-1 outline-none bg-transparent text-base placeholder:text-white/40"
                aria-label="חיפוש פסטיבל"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="ניקוי חיפוש"><X size={18} className="text-white/50" /></button>
              )}
            </label>
            <div className="flex flex-col gap-2.5 mb-6">
              {kindChips}
              <ChipRow>
                <Chip active={continent === 'all'} onClick={() => setContinent('all')}>כל העולם</Chip>
                {continentOptions.map(([key, label]) => (
                  <Chip key={key} active={continent === key} onClick={() => setContinent(key)}>{label}</Chip>
                ))}
              </ChipRow>
              {genreChips}
              <ChipRow>
                <Chip active={month === 'all'} onClick={() => setMonth('all')}>כל השנה</Chip>
                {MONTHS.map((name, i) => (
                  <Chip key={name} active={month === String(i + 1)} onClick={() => setMonth(String(i + 1))}>{name}</Chip>
                ))}
              </ChipRow>
            </div>
            <SectionTitle count={searchResults.length}>תוצאות</SectionTitle>
            {searchResults.length > 0 ? renderGrid(searchResults, `search-${query}-${continent}-${genre}-${month}-${kind}`) : (
              <div className="text-center py-16 text-white/50">
                <p className="text-5xl mb-3">🔍</p>
                <p className="font-bold text-white">לא מצאנו פסטיבל כזה</p>
                <a href={addEventUrl()} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-accent underline">מפיקים? הוסיפו את האירוע שלכם</a>
              </div>
            )}
          </>
        )}

        {tab === 'chats' && (
          <>
            <SectionTitle>צ׳אטים</SectionTitle>
            <MyGroups onOpen={openChat} emptyHint />
          </>
        )}

        {tab === 'world' && Object.entries(CONTINENTS).map(([key, label]) => {
          const list = catalog.items.filter((f) => f.continent === key)
          if (list.length === 0) return null
          return (
            <section key={key} className="mb-10">
              <SectionTitle count={list.length}>{label}</SectionTitle>
              {renderGrid(list, `world-${key}`)}
            </section>
          )
        })}

        {tab === 'favorites' && (
          <>
            <SectionTitle count={favoriteList.length}>המועדפים שלי</SectionTitle>
            {favoriteList.length > 0 ? renderGrid(favoriteList, 'favorites') : (
              <div className="text-center py-16 text-white/50">
                <Heart size={40} className="mx-auto mb-3 text-white/30" />
                <p className="font-bold text-white">עוד אין מועדפים</p>
                <p className="text-sm mt-1">לחצו על הלב בכרטיס של פסטיבל כדי לשמור אותו כאן.</p>
              </div>
            )}
          </>
        )}

        <footer className="text-center text-xs text-white/30 py-10">
          FestiChat היא קהילה עצמאית ואינה קשורה לפסטיבלים. החודשים משוערים – בדקו באתר הרשמי.
        </footer>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-xl mx-auto grid grid-cols-5">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs ${active ? 'text-white' : 'text-white/50'}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={24} className={active && item.id === 'favorites' ? 'fill-white' : ''} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 h-full w-72 max-w-[85%] bg-ink-800 p-6 flex flex-col gap-1 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setMenuOpen(false)} className="self-end mb-4" aria-label="סגירת תפריט"><X size={24} /></button>
            <a href={addEventUrl()} target="_blank" rel="noopener noreferrer" className="py-3 font-bold border-b border-white/10">מפיקים? הוסיפו אירוע</a>
            <a href={suggestFestivalUrl()} target="_blank" rel="noopener noreferrer" className="py-3 font-bold border-b border-white/10">הצעת פסטיבל חדש</a>
            <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="py-3 font-bold border-b border-white/10">דיווח על בעיה</a>
            <p className="text-sm text-white/50 mt-4 leading-relaxed">
              בוחרים פסטיבל, מצטרפים לקבוצה ומתכתבים עם כל מי שמגיע. הקבוצות שהצטרפתם אליהן מחכות לכם בלשונית ״צ׳אטים״.
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
          <div className="bg-ink-800 rounded-3xl p-6 max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-black text-xl">הקבוצה סגורה</p>
            <p className="text-sm text-white/60 mt-2">האירוע הסתיים, ורק מי שהיה בקבוצה לפני כן יכול להמשיך להתכתב בה.</p>
            <button type="button" onClick={closeScreen} className="mt-5 w-full bg-white text-black font-bold py-3 rounded-xl">לאירועים הקרובים</button>
          </div>
        </div>
      )}

      {openChatData && (
        <ChatScreen festival={openChatData.festival} group={openChatData.group} onClose={closeScreen} />
      )}
    </div>
  )
}
