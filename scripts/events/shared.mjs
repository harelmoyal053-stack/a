// Helpers shared by the event sources and the merge step.

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const isoNoMillis = (date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z')

export function windowDates(monthsAhead = 12) {
  const from = new Date()
  const until = new Date(from)
  until.setMonth(until.getMonth() + monthsAhead)
  return { from, until }
}

// Ticket add-ons that sources list as their own "events".
export const NOT_AN_EVENT = /\b(parking|shuttle|locker|upgrade|camping pass|hotel package|merch|gift card|fast lane|bus to)\b/i

// Ticket-type words stripped so that passes for one event merge together.
const TICKET_WORDS = /\b(\d+[- ]?day|day \d+|weekend \d*|w\d|ga|ga\+|vip|general admission|single day|tickets?|pass(es)?|presale|wristband|(19|20)\d\d)\b/gi

export function cleanName(name) {
  return name.replace(/\s*[-–|:(].*$/, '').replace(TICKET_WORDS, '').replace(/\s+/g, ' ').trim() || name.trim()
}

export const isFestivalName = (name) => /festival|festiwal|festivaali|fesztivál|festivál|fest\b|open air|weekender/i.test(name)

// Our genre keys, from the many ways sources spell them.
const GENRE_PATTERNS = [
  ['electronic', /electro|edm|techno|house|trance|dance|dubstep|drum|bass music|rave/i],
  ['hiphop', /hip.?hop|rap|trap/i],
  ['metal', /metal|hardcore|punk/i],
  ['rock', /rock/i],
  ['indie', /indie|alternative/i],
  ['jazz', /jazz|blues/i],
  ['afro', /afro|reggae|latin|world|r&b|soul/i],
  ['pop', /pop/i],
]

export function genreKeys(names) {
  const keys = []
  for (const name of names.filter(Boolean)) {
    const match = GENRE_PATTERNS.find(([, pattern]) => pattern.test(name))
    if (match && !keys.includes(match[0])) keys.push(match[0])
  }
  return keys
}

export async function getJson(url, { headers = {}, label = url } = {}) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers })
    if (res.ok) return res.json()
    if (res.status !== 429 && res.status < 500) throw new Error(`${label}: HTTP ${res.status} ${await res.text()}`)
    await sleep(2000 * attempt)
  }
  throw new Error(`${label}: kept failing`)
}
