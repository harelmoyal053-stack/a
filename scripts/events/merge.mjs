// Cross-source de-duplication. Every source yields "entries" (one per ticket
// listing); this turns them into one event per real-world happening, keeps
// every ticket link, and reuses the previous run's ids so chats survive.

// When sources disagree, the earlier one wins for names and details.
export const SOURCE_PRIORITY = ['community', 'partner', 'ticketmaster', 'seatgeek']
const priority = (source) => {
  const i = SOURCE_PRIORITY.indexOf(source.split(':')[0])
  return i === -1 ? SOURCE_PRIORITY.length : i
}

const STOPWORDS = new Set([
  'the', 'a', 'and', 'of', 'at', 'in', 'presents', 'present', 'live', 'music', 'festival', 'fest', 'tour',
  'edition', 'official', 'night', 'party', 'open', 'air', 'with', 'feat', 'ft', 'x', 'vs',
])

export function nameTokens(name) {
  return new Set(
    name.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9֐-׿]+/)
      .filter((t) => t && !STOPWORDS.has(t) && !/^(19|20)\d\d$/.test(t)),
  )
}

const normPlace = (text) => (text ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9֐-׿]+/g, '')

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Same country, same city or venue, overlapping dates (±1 day for
// time-zone slips), and the shorter name's words contained in the longer one.
export function sameEvent(a, b) {
  if (a.countryCode !== b.countryCode) return false
  const cityA = normPlace(a.city)
  const cityB = normPlace(b.city)
  const venueMatch = a.venue && b.venue && normPlace(a.venue) === normPlace(b.venue)
  if (cityA && cityB && cityA !== cityB && !venueMatch) return false
  if (a.startDate > addDays(b.endDate, 1) || b.startDate > addDays(a.endDate, 1)) return false
  const ta = nameTokens(a.name)
  const tb = nameTokens(b.name)
  if (ta.size === 0 || tb.size === 0) return normPlace(a.name) === normPlace(b.name)
  const [small, large] = ta.size <= tb.size ? [ta, tb] : [tb, ta]
  const shared = [...small].filter((t) => large.has(t)).length
  return shared / small.size >= 0.6
}

// Festivals keep one entry per yearly edition; parties one per night.
function listingKey(e) {
  const when = e.kind === 'festival' ? e.startDate.slice(0, 4) : e.startDate
  return [e.source, e.name.toLowerCase(), normPlace(e.venue) || normPlace(e.city), e.countryCode, when].join('|')
}

function hash(text) {
  let h = 0x811c9dc5
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0
  return h.toString(36)
}

const slug = (text) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

function newId(event) {
  const when = event.kind === 'festival' ? event.startDate.slice(0, 4) : event.startDate
  const key = [event.name.toLowerCase(), normPlace(event.city), event.countryCode, when].join('|')
  return ['ev', slug(event.name), event.countryCode.toLowerCase(), hash(key)].filter(Boolean).join('-')
}

function absorb(target, entry) {
  if (entry.startDate < target.startDate) {
    target.startDate = entry.startDate
    target.time = entry.time ?? target.time
  }
  if (entry.endDate > target.endDate) target.endDate = entry.endDate
  if (entry.kind === 'festival') target.kind = 'festival'
  for (const key of ['time', 'venue', 'city', 'lat', 'lng', 'image']) target[key] ??= entry[key]
  for (const g of entry.genres) if (!target.genres.includes(g)) target.genres.push(g)
  const ticket = target.tickets.find((t) => t.source === entry.source)
  if (!ticket) {
    if (entry.url || entry.priceFrom != null) {
      target.tickets.push({ source: entry.source, url: entry.url, priceFrom: entry.priceFrom, currency: entry.currency })
    }
  } else if (entry.priceFrom != null && (ticket.priceFrom == null || entry.priceFrom < ticket.priceFrom)) {
    Object.assign(ticket, { priceFrom: entry.priceFrom, currency: entry.currency })
  }
  if (!target.sources.includes(entry.source)) target.sources.push(entry.source)
}

function startEvent(entry) {
  const event = {
    name: entry.name, kind: entry.kind, startDate: entry.startDate, endDate: entry.endDate, time: entry.time,
    venue: entry.venue, city: entry.city, countryCode: entry.countryCode, lat: entry.lat, lng: entry.lng,
    genres: [], image: entry.image, tickets: [], sources: [],
  }
  absorb(event, entry)
  return event
}

export function mergeAll(entries, previous = [], { today = new Date().toISOString().slice(0, 10), maxEvents = 4000 } = {}) {
  // 1. Within a source, fold day/weekend/VIP listings into one entry.
  const listings = new Map()
  for (const entry of entries) {
    if (!entry || entry.endDate < today) continue
    const key = listingKey(entry)
    const existing = listings.get(key)
    if (!existing) listings.set(key, startEvent(entry))
    else absorb(existing, entry)
  }

  // 2. Across sources, fold matching events, best source first.
  const ordered = [...listings.values()].sort((a, b) => priority(a.sources[0]) - priority(b.sources[0]) || a.startDate.localeCompare(b.startDate))
  const byCountry = new Map()
  const events = []
  for (const candidate of ordered) {
    const bucket = byCountry.get(candidate.countryCode) ?? []
    const match = bucket.find((e) => sameEvent(e, candidate))
    if (match) {
      for (const ticket of candidate.tickets) {
        absorb(match, { ...candidate, ...ticket, startDate: candidate.startDate, endDate: candidate.endDate, genres: candidate.genres })
      }
      if (candidate.tickets.length === 0) absorb(match, { ...candidate, source: candidate.sources[0], url: null, priceFrom: null })
      continue
    }
    bucket.push(candidate)
    byCountry.set(candidate.countryCode, bucket)
    events.push(candidate)
  }

  // 3. Reuse last run's id for the same event, so its chat groups stay attached.
  const unclaimed = [...previous]
  for (const event of events) {
    const i = unclaimed.findIndex((p) => sameEvent(p, event))
    event.id = i === -1 ? newId(event) : unclaimed.splice(i, 1)[0].id
  }
  const seen = new Set()
  for (const event of events) {
    while (seen.has(event.id)) event.id = `${event.id}x`
    seen.add(event.id)
    event.tickets.sort((a, b) => (a.priceFrom ?? Infinity) - (b.priceFrom ?? Infinity))
  }

  return events
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name))
    .slice(0, maxEvents)
}

// Turns a previous catalog event back into entries, used when a source fails
// so its events don't vanish for a day.
export function entriesFromPrevious(event, source) {
  const ticket = event.tickets?.find((t) => t.source === source)
  return [{ ...event, source, url: ticket?.url ?? null, priceFrom: ticket?.priceFrom ?? null, currency: ticket?.currency ?? null }]
}
