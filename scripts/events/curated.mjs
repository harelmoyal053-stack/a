import { readFile } from 'node:fs/promises'
import { genreKeys } from './shared.mjs'

// The big international festivals that ticket APIs miss (Tomorrowland, Zamna,
// Ozora…), kept by hand in scripts/curated-festivals.json:
//   [{ name, startDate, endDate, datesConfirmed, city, countryCode, lat, lng, genres, url }]
// Entries whose dates aren't announced yet carry an estimate and show as
// "expected in <month>" on the site.

const DATE = /^\d{4}-\d{2}-\d{2}$/

export function fromCurated(raw) {
  if (!raw?.name || !DATE.test(raw.startDate ?? '') || !/^[A-Z]{2}$/.test(raw.countryCode ?? '') || !raw.city) return null
  return {
    source: 'curated',
    name: String(raw.name).slice(0, 120),
    kind: 'festival',
    startDate: raw.startDate,
    endDate: DATE.test(raw.endDate ?? '') && raw.endDate >= raw.startDate ? raw.endDate : raw.startDate,
    tba: raw.datesConfirmed === false,
    time: null,
    venue: null,
    city: String(raw.city),
    countryCode: raw.countryCode,
    lat: Number.isFinite(raw.lat) ? raw.lat : null,
    lng: Number.isFinite(raw.lng) ? raw.lng : null,
    genres: genreKeys(Array.isArray(raw.genres) ? raw.genres : []),
    image: null,
    url: /^https:\/\/\S+$/.test(raw.url ?? '') ? raw.url : null,
    priceFrom: null,
    currency: null,
  }
}

export async function fetchCurated(path) {
  const list = JSON.parse(await readFile(path, 'utf8'))
  return list.map(fromCurated).filter(Boolean)
}
