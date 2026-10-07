// Turns the auto-updated event feed (events.json, written daily by
// scripts/fetch-events.mjs) into the catalog of festivals and parties.

const CONTINENT_BY_COUNTRY = {
  US: 'northAmerica', CA: 'northAmerica', MX: 'northAmerica',
  BR: 'southAmerica', AR: 'southAmerica', CL: 'southAmerica', CO: 'southAmerica', PE: 'southAmerica',
  AU: 'oceania', NZ: 'oceania',
  ZA: 'africa', MA: 'africa', EG: 'africa', NG: 'africa', KE: 'africa',
  IL: 'israel',
  AE: 'asia', TR: 'asia', JP: 'asia', IN: 'asia', TH: 'asia', SG: 'asia', KR: 'asia', CN: 'asia', ID: 'asia', PH: 'asia',
}

const GENRE_STYLE = {
  electronic: { emoji: '🎧', colors: ['#7c3aed', '#db2777'] },
  rock: { emoji: '🎸', colors: ['#b91c1c', '#1f2937'] },
  pop: { emoji: '🎤', colors: ['#ec4899', '#f97316'] },
  hiphop: { emoji: '🎙️', colors: ['#f59e0b', '#111827'] },
  indie: { emoji: '🌻', colors: ['#0ea5e9', '#65a30d'] },
  jazz: { emoji: '🎷', colors: ['#0369a1', '#0f766e'] },
  metal: { emoji: '🤘', colors: ['#3f3f46', '#a16207'] },
  afro: { emoji: '🌍', colors: ['#f59e0b', '#059669'] },
}
const DEFAULT_STYLE = { emoji: '🎶', colors: ['#4f46e5', '#0891b2'] }

const regionNames = new Intl.DisplayNames(['he'], { type: 'region' })

function flagEmoji(code) {
  return [...code.toUpperCase()].map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('')
}

export function sourceLabel(source) {
  if (source === 'ticketmaster') return 'Ticketmaster'
  if (source === 'seatgeek') return 'SeatGeek'
  if (source === 'community') return 'מפיקים ב-FestiChat'
  if (source.startsWith('partner:')) return source.slice('partner:'.length)
  return source
}

const today = () => new Date().toISOString().slice(0, 10)

function fromEvent(e) {
  const style = GENRE_STYLE[e.genres[0]] ?? DEFAULT_STYLE
  const tickets = (e.tickets ?? []).filter((t) => t.url)
  const cheapest = (e.tickets ?? []).find((t) => t.priceFrom != null)
  return {
    id: e.id,
    name: e.name,
    kind: e.kind,
    city: e.city,
    country: regionNames.of(e.countryCode) ?? e.countryCode,
    flag: flagEmoji(e.countryCode),
    continent: CONTINENT_BY_COUNTRY[e.countryCode] ?? 'europe',
    month: Number(e.startDate.slice(5, 7)),
    startDate: e.startDate,
    endDate: e.endDate,
    time: e.time,
    venue: e.venue,
    genres: e.genres,
    emoji: style.emoji,
    colors: style.colors,
    image: e.image ? { src: e.image } : null,
    website: null,
    tickets,
    priceFrom: cheapest?.priceFrom ?? null,
    currency: cheapest?.currency ?? null,
    sources: e.sources ?? [],
    source: 'feed',
  }
}

export function buildCatalog(feed) {
  return (feed?.events ?? [])
    .filter((e) => e.endDate >= today())
    .map(fromEvent)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export async function loadFeed() {
  const url = `${import.meta.env.BASE_URL}festivals/events.json?v=${today()}`
  try {
    const res = await fetch(url)
    return res.ok ? await res.json() : null
  } catch {
    return null
  }
}
