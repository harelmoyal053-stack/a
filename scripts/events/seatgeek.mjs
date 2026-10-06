import { NOT_AN_EVENT, cleanName, genreKeys, getJson, isFestivalName, sleep, windowDates } from './shared.mjs'

// SeatGeek Platform API: https://platform.seatgeek.com
const API = 'https://api.seatgeek.com/2/events'
const PER_PAGE = 100
const MAX_PAGES = 10
const ELECTRONIC = /electro|edm|techno|house|trance|dance|dubstep|drum/i

const QUERIES = [
  { kind: 'festival', params: { 'taxonomies.name': 'music_festival' }, keep: () => true },
  // SeatGeek has no electronic-only filter, so concerts are narrowed by performer genre.
  { kind: 'party', params: { 'taxonomies.name': 'concert' }, keep: (raw) => performerGenres(raw).some((g) => ELECTRONIC.test(g)) },
]

function performerGenres(raw) {
  return (raw.performers ?? []).flatMap((p) => (p.genres ?? []).map((g) => g.name ?? g.slug))
}

export function fromSeatGeek(raw, kind) {
  const title = raw?.short_title || raw?.title
  if (raw?.id == null || !title || NOT_AN_EVENT.test(title) || raw.datetime_tbd) return null
  const venue = raw.venue
  const start = raw.datetime_local?.slice(0, 10)
  if (!venue?.country || !start) return null
  const performer = raw.performers?.find((p) => p.image) ?? raw.performers?.[0]
  return {
    source: 'seatgeek',
    name: cleanName(title),
    kind: kind === 'festival' || isFestivalName(title) ? 'festival' : 'party',
    startDate: start,
    endDate: raw.enddatetime_utc?.slice(0, 10) ?? start,
    time: raw.time_tbd ? null : raw.datetime_local?.slice(11, 16) ?? null,
    venue: venue.name ?? null,
    city: venue.city ?? '',
    countryCode: venue.country.length === 2 ? venue.country.toUpperCase() : 'US',
    lat: venue.location?.lat ?? null,
    lng: venue.location?.lon ?? null,
    genres: genreKeys(performerGenres(raw)),
    image: performer?.images?.huge ?? performer?.image ?? null,
    url: raw.url ?? null,
    priceFrom: raw.stats?.lowest_price ?? null,
    currency: raw.stats?.lowest_price ? 'USD' : null,
  }
}

export async function fetchSeatGeek(clientId) {
  const { from, until } = windowDates()
  const entries = []
  for (const query of QUERIES) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const params = new URLSearchParams({
        client_id: clientId, ...query.params, per_page: String(PER_PAGE), page: String(page), sort: 'datetime_local.asc',
        'datetime_utc.gte': from.toISOString().slice(0, 19), 'datetime_utc.lte': until.toISOString().slice(0, 19),
      })
      const data = await getJson(`${API}?${params}`, { label: 'SeatGeek' })
      for (const raw of data.events ?? []) {
        if (!query.keep(raw)) continue
        const entry = fromSeatGeek(raw, query.kind)
        if (entry) entries.push(entry)
      }
      await sleep(300)
      if (page * PER_PAGE >= (data.meta?.total ?? 0)) break
    }
  }
  return entries
}
