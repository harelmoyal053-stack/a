// Pulls upcoming music festivals and electronic parties from the Ticketmaster
// Discovery API and writes them as the FestiChat event catalog.
//
//   TICKETMASTER_API_KEY=... node scripts/fetch-events.mjs <output.json>
//   node scripts/fetch-events.mjs <output.json> --fixture <raw-responses.json>
import { readFile, writeFile } from 'node:fs/promises'

const API = 'https://app.ticketmaster.com/discovery/v2/events.json'
const MUSIC_SEGMENT = 'KZFzniwnSyZfZ7v7nJ'
const DANCE_ELECTRONIC_GENRE = 'KnvZfZ7vAvF'
const COUNTRIES = [
  'US', 'CA', 'MX', 'GB', 'IE', 'DE', 'NL', 'BE', 'FR', 'ES', 'IT', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI',
  'PL', 'CZ', 'TR', 'AE', 'ZA', 'AU', 'NZ', 'BR', 'IL',
]
const PAGE_SIZE = 200
const MAX_PAGES = 5 // The API refuses to page past 1000 results per query.
const MONTHS_AHEAD = 12
const MAX_EVENTS = 3000
const REQUEST_GAP_MS = 250 // Free keys allow 5 requests per second.

const QUERIES = [
  { kind: 'festival', params: { segmentId: MUSIC_SEGMENT, keyword: 'festival' } },
  { kind: 'party', params: { genreId: DANCE_ELECTRONIC_GENRE } },
]

// Ticket add-ons that are listed as their own "events".
const NOT_AN_EVENT = /\b(parking|shuttle|locker|upgrade|camping pass|hotel package|merch|gift card|fast lane)\b/i
// Ticket-type words stripped so that passes for one event merge together.
const TICKET_WORDS = /\b(\d+[- ]?day|day \d+|weekend \d*|ga|ga\+|vip|general admission|single day|tickets?|pass(es)?|presale|sunday|saturday|friday|thursday|wristband)\b/gi

const GENRES = {
  'Dance/Electronic': 'electronic',
  Rock: 'rock',
  Pop: 'pop',
  'Hip-Hop/Rap': 'hiphop',
  'Alternative': 'indie',
  Jazz: 'jazz',
  Metal: 'metal',
  'R&B': 'afro',
  Reggae: 'afro',
  World: 'afro',
}

// Short, stable hash (FNV-1a) so ids survive re-fetches.
function hash(text) {
  let h = 0x811c9dc5
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0
  return h.toString(36)
}

function slug(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
}

// Festivals keep one entry (and chat) per yearly edition; parties one per night.
function groupKey(entry) {
  const when = entry.kind === 'festival' ? entry.startDate.slice(0, 4) : entry.startDate
  return `${entry.name.toLowerCase()}|${entry.venueId ?? entry.city.toLowerCase()}|${entry.countryCode}|${when}`
}

// The chat groups hang off this id, so it must not depend on which ticket
// listing happened to come back first.
function stableId(entry, key) {
  const parts = ['ev', slug(entry.name), entry.countryCode.toLowerCase(), hash(key)].filter(Boolean)
  return parts.join('-')
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const isoNoMillis = (date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z')

function baseName(name) {
  return name.replace(/\s*[-–|:(].*$/, '').replace(TICKET_WORDS, '').replace(/\s+/g, ' ').trim()
}

function pickImage(images = []) {
  const wide = images.filter((i) => i.ratio === '16_9' || i.ratio === '3_2' || i.ratio === '4_3')
  const sorted = (wide.length ? wide : images).sort((a, b) => b.width - a.width)
  return sorted.find((i) => i.width <= 1100)?.url ?? sorted.at(-1)?.url ?? null
}

// One raw API event → catalog entry, or null when it is not a real event.
export function toEntry(raw, kind) {
  if (!raw?.id || !raw.name || NOT_AN_EVENT.test(raw.name)) return null
  const venue = raw._embedded?.venues?.[0]
  const start = raw.dates?.start?.localDate
  if (!venue?.country?.countryCode || !start) return null
  const classification = raw.classifications?.[0]
  const genre = GENRES[classification?.genre?.name]
  const isFestival = kind === 'festival' || /festival|fest\b|open air/i.test(raw.name)
  return {
    name: baseName(raw.name) || raw.name,
    kind: isFestival ? 'festival' : 'party',
    startDate: start,
    endDate: start,
    time: raw.dates?.start?.localTime?.slice(0, 5) ?? null,
    venue: venue.name ?? null,
    venueId: venue.id ?? null,
    city: venue.city?.name ?? '',
    country: venue.country?.name ?? '',
    countryCode: venue.country.countryCode,
    lat: venue.location ? Number(venue.location.latitude) : null,
    lng: venue.location ? Number(venue.location.longitude) : null,
    genres: genre ? [genre] : [],
    image: pickImage(raw.images),
    url: raw.url ?? null,
    priceFrom: raw.priceRanges?.[0]?.min ?? null,
    currency: raw.priceRanges?.[0]?.currency ?? null,
  }
}

// Merges the separate day/pass listings of one event into a single entry
// spanning all its dates, and keeps the soonest events first.
export function mergeEntries(entries) {
  const byKey = new Map()
  for (const entry of entries) {
    const key = groupKey(entry)
    const existing = byKey.get(key)
    if (!existing) {
      byKey.set(key, { id: stableId(entry, key), ...entry })
      continue
    }
    if (entry.startDate < existing.startDate) {
      Object.assign(existing, { startDate: entry.startDate, time: entry.time, url: entry.url ?? existing.url })
    }
    if (entry.startDate > existing.endDate) existing.endDate = entry.startDate
    if (entry.kind === 'festival') existing.kind = 'festival'
    existing.image ??= entry.image
    for (const g of entry.genres) if (!existing.genres.includes(g)) existing.genres.push(g)
    if (entry.priceFrom != null && (existing.priceFrom == null || entry.priceFrom < existing.priceFrom)) {
      existing.priceFrom = entry.priceFrom
      existing.currency = entry.currency
    }
  }
  return [...byKey.values()]
    .map(({ venueId: _venueId, ...entry }) => entry)
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.name.localeCompare(b.name))
    .slice(0, MAX_EVENTS)
}

async function fetchPage(apiKey, params) {
  const url = `${API}?${new URLSearchParams({ apikey: apiKey, ...params })}`
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url)
    if (res.ok) return res.json()
    if (res.status !== 429 && res.status < 500) throw new Error(`Ticketmaster ${res.status}: ${await res.text()}`)
    await sleep(2000 * attempt)
  }
  throw new Error(`Ticketmaster kept failing for ${params.countryCode}`)
}

async function fetchAll(apiKey) {
  const now = new Date()
  const until = new Date(now)
  until.setMonth(until.getMonth() + MONTHS_AHEAD)
  const responses = []
  for (const countryCode of COUNTRIES) {
    for (const query of QUERIES) {
      for (let page = 0; page < MAX_PAGES; page++) {
        const data = await fetchPage(apiKey, {
          ...query.params,
          countryCode,
          startDateTime: isoNoMillis(now),
          endDateTime: isoNoMillis(until),
          sort: 'date,asc',
          size: String(PAGE_SIZE),
          page: String(page),
        })
        responses.push({ kind: query.kind, data })
        await sleep(REQUEST_GAP_MS)
        if (page + 1 >= (data.page?.totalPages ?? 0)) break
      }
    }
    console.log(`${countryCode}: done`)
  }
  return responses
}

export function buildCatalog(responses) {
  const entries = responses.flatMap(({ kind, data }) =>
    (data._embedded?.events ?? []).map((raw) => toEntry(raw, kind)).filter(Boolean),
  )
  return { source: 'ticketmaster', updatedAt: new Date().toISOString(), events: mergeEntries(entries) }
}

async function main() {
  const [output, flag, fixture] = process.argv.slice(2)
  if (!output) throw new Error('Usage: fetch-events.mjs <output.json> [--fixture <file>]')
  let responses
  if (flag === '--fixture') {
    responses = JSON.parse(await readFile(fixture, 'utf8'))
  } else {
    const apiKey = process.env.TICKETMASTER_API_KEY
    if (!apiKey) throw new Error('TICKETMASTER_API_KEY is not set')
    responses = await fetchAll(apiKey)
  }
  const catalog = buildCatalog(responses)
  if (catalog.events.length === 0) throw new Error('No events found; keeping the previous catalog.')
  await writeFile(output, JSON.stringify(catalog))
  console.log(`Wrote ${catalog.events.length} events to ${output}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
