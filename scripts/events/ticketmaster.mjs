import { NOT_AN_EVENT, cleanName, genreKeys, getJson, isFestivalName, isoNoMillis, sleep, windowDates } from './shared.mjs'

// Ticketmaster Discovery API: https://developer.ticketmaster.com
const API = 'https://app.ticketmaster.com/discovery/v2/events.json'
const MUSIC_SEGMENT = 'KZFzniwnSyZfZ7v7nJ'
const DANCE_ELECTRONIC_GENRE = 'KnvZfZ7vAvF'
const COUNTRIES = [
  'US', 'CA', 'MX', 'GB', 'IE', 'DE', 'NL', 'BE', 'FR', 'ES', 'IT', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI',
  'PL', 'CZ', 'TR', 'AE', 'ZA', 'AU', 'NZ', 'BR', 'IL',
]
const PAGE_SIZE = 200
const MAX_PAGES = 5 // The API refuses to page past 1000 results per query.
const REQUEST_GAP_MS = 250 // Free keys allow 5 requests per second.

const QUERIES = [
  { kind: 'festival', params: { segmentId: MUSIC_SEGMENT, keyword: 'festival' } },
  { kind: 'party', params: { genreId: DANCE_ELECTRONIC_GENRE } },
]

function pickImage(images = []) {
  const wide = images.filter((i) => ['16_9', '3_2', '4_3'].includes(i.ratio))
  const sorted = (wide.length ? wide : images).sort((a, b) => b.width - a.width)
  return sorted.find((i) => i.width <= 1100)?.url ?? sorted.at(-1)?.url ?? null
}

export function fromTicketmaster(raw, kind) {
  if (!raw?.id || !raw.name || NOT_AN_EVENT.test(raw.name)) return null
  const venue = raw._embedded?.venues?.[0]
  const start = raw.dates?.start?.localDate
  if (!venue?.country?.countryCode || !start) return null
  const c = raw.classifications?.[0]
  return {
    source: 'ticketmaster',
    name: cleanName(raw.name),
    kind: kind === 'festival' || isFestivalName(raw.name) ? 'festival' : 'party',
    startDate: start,
    endDate: start,
    time: raw.dates?.start?.localTime?.slice(0, 5) ?? null,
    venue: venue.name ?? null,
    city: venue.city?.name ?? '',
    countryCode: venue.country.countryCode,
    lat: venue.location ? Number(venue.location.latitude) : null,
    lng: venue.location ? Number(venue.location.longitude) : null,
    genres: genreKeys([c?.genre?.name, c?.subGenre?.name]),
    image: pickImage(raw.images),
    url: raw.url ?? null,
    priceFrom: raw.priceRanges?.[0]?.min ?? null,
    currency: raw.priceRanges?.[0]?.currency ?? null,
  }
}

export async function fetchTicketmaster(apiKey) {
  const { from, until } = windowDates()
  const entries = []
  for (const countryCode of COUNTRIES) {
    for (const query of QUERIES) {
      for (let page = 0; page < MAX_PAGES; page++) {
        const params = new URLSearchParams({
          apikey: apiKey, ...query.params, countryCode, sort: 'date,asc',
          startDateTime: isoNoMillis(from), endDateTime: isoNoMillis(until), size: String(PAGE_SIZE), page: String(page),
        })
        const data = await getJson(`${API}?${params}`, { label: `Ticketmaster ${countryCode}` })
        for (const raw of data._embedded?.events ?? []) {
          const entry = fromTicketmaster(raw, query.kind)
          if (entry) entries.push(entry)
        }
        await sleep(REQUEST_GAP_MS)
        if (page + 1 >= (data.page?.totalPages ?? 0)) break
      }
    }
  }
  return entries
}
