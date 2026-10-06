import { cleanName, genreKeys, getJson } from './shared.mjs'

// Events submitted through the "add an event" issue form
// (.github/ISSUE_TEMPLATE/event.yml). Only issues the repo owner labels
// `event-approved` are published.
export const APPROVED_LABEL = 'event-approved'

const FIELDS = {
  'שם האירוע': 'name',
  'סוג': 'kind',
  'תאריך התחלה': 'startDate',
  'תאריך סיום': 'endDate',
  'שעת פתיחה': 'time',
  'מקום': 'venue',
  'עיר': 'city',
  'קוד מדינה': 'countryCode',
  'סגנון מוזיקה': 'genre',
  'קישור לכרטיסים': 'url',
  'קישור לתמונה': 'image',
  'מחיר החל מ': 'priceFrom',
  'מטבע': 'currency',
}
const GENRE_WORDS = { 'טכנו': 'techno', 'האוס': 'house', 'טראנס': 'trance', 'היפ הופ': 'hip hop', 'רוק': 'rock', 'פופ': 'pop', "ג'אז": 'jazz', 'מטאל': 'metal', 'אינדי': 'indie', 'אפרו': 'afro', 'אלקטרוני': 'electronic' }

const DATE = /^\d{4}-\d{2}-\d{2}$/
const httpsUrl = (value) => (/^https:\/\/\S+$/.test(value ?? '') ? value : null)

// GitHub renders issue forms as "### <label>\n\n<value>" sections.
export function parseIssueForm(body) {
  const values = {}
  for (const section of (body ?? '').split(/^### /m).slice(1)) {
    const [label, ...rest] = section.split('\n')
    const key = FIELDS[label.trim()]
    const value = rest.join('\n').trim()
    if (key && value && value !== '_No response_') values[key] = value
  }
  return values
}

export function fromIssue(issue) {
  const v = parseIssueForm(issue.body)
  const startDate = v.startDate?.trim()
  const countryCode = v.countryCode?.trim().toUpperCase()
  if (!v.name || !DATE.test(startDate ?? '') || !/^[A-Z]{2}$/.test(countryCode ?? '') || !v.city) return null
  const endDate = DATE.test(v.endDate ?? '') && v.endDate >= startDate ? v.endDate : startDate
  const genreText = Object.entries(GENRE_WORDS).reduce((text, [he, en]) => text.replace(he, en), v.genre ?? '')
  return {
    source: 'community',
    sourceRef: issue.html_url,
    name: cleanName(v.name).slice(0, 120),
    kind: v.kind === 'מסיבה' ? 'party' : 'festival',
    startDate,
    endDate,
    time: /^\d{1,2}:\d{2}$/.test(v.time ?? '') ? v.time.padStart(5, '0') : null,
    venue: v.venue?.slice(0, 120) ?? null,
    city: v.city.slice(0, 80),
    countryCode,
    lat: null,
    lng: null,
    genres: genreKeys(genreText.split(/[,،\s]+/)),
    image: httpsUrl(v.image),
    url: httpsUrl(v.url),
    priceFrom: Number.isFinite(Number(v.priceFrom)) && v.priceFrom ? Number(v.priceFrom) : null,
    currency: ['ILS', 'USD', 'EUR', 'GBP'].includes(v.currency) ? v.currency : null,
  }
}

export async function fetchCommunity(repo, token) {
  const entries = []
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/repos/${repo}/issues?labels=${APPROVED_LABEL}&state=all&per_page=100&page=${page}`
    const issues = await getJson(url, {
      label: 'GitHub issues',
      headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    for (const issue of issues) {
      const entry = fromIssue(issue)
      if (entry) entries.push(entry)
    }
    if (issues.length < 100) break
  }
  return entries
}
