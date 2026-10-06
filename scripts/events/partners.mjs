import { readFile } from 'node:fs/promises'
import { cleanName, genreKeys, getJson } from './shared.mjs'

// JSON feeds published by partner promoters, listed in scripts/partner-feeds.json:
//   [{ "name": "Promoter", "url": "https://example.com/events.json" }]
// Each feed returns { "events": [{ name, kind, startDate, endDate?, time?, venue?,
// city, countryCode, genres?, image?, url?, priceFrom?, currency? }] }.

const DATE = /^\d{4}-\d{2}-\d{2}$/
const httpsUrl = (value) => (/^https:\/\/\S+$/.test(value ?? '') ? value : null)

export function fromPartner(raw, partner) {
  if (!raw?.name || !DATE.test(raw.startDate ?? '') || !/^[A-Za-z]{2}$/.test(raw.countryCode ?? '') || !raw.city) return null
  return {
    source: `partner:${partner}`,
    name: cleanName(String(raw.name)).slice(0, 120),
    kind: raw.kind === 'party' ? 'party' : 'festival',
    startDate: raw.startDate,
    endDate: DATE.test(raw.endDate ?? '') && raw.endDate >= raw.startDate ? raw.endDate : raw.startDate,
    time: /^\d{2}:\d{2}$/.test(raw.time ?? '') ? raw.time : null,
    venue: raw.venue ? String(raw.venue).slice(0, 120) : null,
    city: String(raw.city).slice(0, 80),
    countryCode: raw.countryCode.toUpperCase(),
    lat: Number.isFinite(raw.lat) ? raw.lat : null,
    lng: Number.isFinite(raw.lng) ? raw.lng : null,
    genres: genreKeys(Array.isArray(raw.genres) ? raw.genres : []),
    image: httpsUrl(raw.image),
    url: httpsUrl(raw.url),
    priceFrom: Number.isFinite(raw.priceFrom) ? raw.priceFrom : null,
    currency: typeof raw.currency === 'string' ? raw.currency.slice(0, 3).toUpperCase() : null,
  }
}

export async function fetchPartners(configPath) {
  const partners = JSON.parse(await readFile(configPath, 'utf8'))
  const entries = []
  for (const partner of partners) {
    try {
      const data = await getJson(partner.url, { label: `Partner ${partner.name}` })
      for (const raw of data.events ?? []) {
        const entry = fromPartner(raw, partner.name)
        if (entry) entries.push(entry)
      }
    } catch (err) {
      console.warn(err.message) // One broken partner feed should not stop the update.
    }
  }
  return entries
}
