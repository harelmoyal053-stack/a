import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fromIssue, parseIssueForm } from './community.mjs'
import { mergeAll, sameEvent } from './merge.mjs'
import { fromSeatGeek } from './seatgeek.mjs'
import { fromTicketmaster } from './ticketmaster.mjs'

const TODAY = '2026-10-07'
const base = {
  kind: 'festival', time: null, venue: null, lat: null, lng: null, genres: [], image: null,
  url: null, priceFrom: null, currency: null,
}
const entry = (fields) => ({ ...base, endDate: fields.startDate, ...fields })

test('Ticketmaster listings: passes fold together, parking is dropped', () => {
  const venue = { id: 'v1', name: 'Empire Polo Club', city: { name: 'Indio' }, country: { countryCode: 'US' } }
  const raws = [
    { id: '1', name: 'Coachella Valley Music and Arts Festival - Weekend 1 - 3-Day GA', dates: { start: { localDate: '2027-04-09' } }, priceRanges: [{ min: 549, currency: 'USD' }], _embedded: { venues: [venue] } },
    { id: '2', name: 'Coachella Valley Music and Arts Festival - Weekend 2 - VIP', dates: { start: { localDate: '2027-04-16' } }, priceRanges: [{ min: 499, currency: 'USD' }], _embedded: { venues: [venue] } },
    { id: '3', name: 'Coachella Parking Pass', dates: { start: { localDate: '2027-04-09' } }, _embedded: { venues: [venue] } },
  ]
  const entries = raws.map((r) => fromTicketmaster(r, 'festival')).filter(Boolean)
  assert.equal(entries.length, 2)
  const [event] = mergeAll(entries, [], { today: TODAY })
  assert.equal(event.name, 'Coachella Valley Music and Arts Festival')
  assert.equal(event.startDate, '2027-04-09')
  assert.equal(event.endDate, '2027-04-16')
  assert.deepEqual(event.tickets.map((t) => t.priceFrom), [499])
})

test('the same festival from Ticketmaster and SeatGeek becomes one event with both ticket links', () => {
  const tm = entry({ source: 'ticketmaster', name: 'Coachella Valley Music and Arts Festival', startDate: '2027-04-09', endDate: '2027-04-11', city: 'Indio', countryCode: 'US', url: 'https://tm/1', priceFrom: 549, currency: 'USD' })
  const sg = fromSeatGeek({
    id: 9, short_title: 'Coachella 2027 - Weekend 1', datetime_local: '2027-04-10T12:00:00',
    venue: { name: 'Empire Polo Club', city: 'Indio', country: 'US' }, performers: [{ image: 'https://img/c.jpg' }],
    url: 'https://sg/9', stats: { lowest_price: 520 },
  }, 'festival')
  const events = mergeAll([sg, tm], [], { today: TODAY })
  assert.equal(events.length, 1)
  assert.equal(events[0].name, 'Coachella Valley Music and Arts Festival') // Ticketmaster outranks SeatGeek.
  assert.equal(events[0].image, 'https://img/c.jpg') // Filled in from SeatGeek.
  assert.deepEqual(events[0].sources.sort(), ['seatgeek', 'ticketmaster'])
  assert.deepEqual(events[0].tickets.map((t) => t.source), ['seatgeek', 'ticketmaster']) // Cheapest first.
})

test('different cities or far-apart dates stay separate events', () => {
  const a = entry({ source: 'ticketmaster', kind: 'party', name: 'Afterlife', startDate: '2026-11-12', city: 'Tel Aviv', countryCode: 'IL' })
  assert.equal(sameEvent(a, { ...a, city: 'Haifa' }), false)
  assert.equal(sameEvent(a, { ...a, startDate: '2026-11-20', endDate: '2026-11-20' }), false)
  assert.equal(sameEvent(a, { ...a, countryCode: 'ES', city: 'Barcelona' }), false)
  assert.equal(sameEvent(a, { ...a, name: 'Afterlife Tel Aviv', startDate: '2026-11-13', endDate: '2026-11-13' }), true)
  assert.equal(sameEvent(a, { ...a, name: 'Keinemusik' }), false)
})

test('an event keeps its previous id even when its source changes', () => {
  const previous = [{ id: 'ev-old-id', name: 'Awakenings Festival', startDate: '2027-07-10', endDate: '2027-07-12', city: 'Hilvarenbeek', countryCode: 'NL' }]
  const now = entry({ source: 'seatgeek', name: 'Awakenings', startDate: '2027-07-10', city: 'Hilvarenbeek', countryCode: 'NL' })
  assert.equal(mergeAll([now], previous, { today: TODAY })[0].id, 'ev-old-id')
  const fresh = mergeAll([now], [], { today: TODAY })[0].id
  assert.match(fresh, /^ev-awakenings-nl-/)
  assert.equal(mergeAll([now], [], { today: TODAY })[0].id, fresh) // Deterministic.
})

test('event names keep weekdays but lose ticket words and years', async () => {
  const { cleanName } = await import('./shared.mjs')
  assert.equal(cleanName('Thursday Moon'), 'Thursday Moon')
  assert.equal(cleanName('Tomorrowland 2027 Weekend 1'), 'Tomorrowland')
  assert.equal(cleanName('Awakenings Festival - Saturday'), 'Awakenings Festival')
})

test('single shows from the festival search are dropped; festivals stay', () => {
  const venue = { id: 'v', city: { name: 'Guanajuato' }, country: { countryCode: 'MX' } }
  const raw = (name) => ({ id: name, name, dates: { start: { localDate: '2026-10-08' } }, _embedded: { venues: [venue] } })
  assert.equal(fromTicketmaster(raw('Orquesta Moderna'), 'festival'), null)
  assert.equal(fromTicketmaster(raw('Festival Internacional Cervantino'), 'festival').kind, 'festival')
  assert.equal(fromTicketmaster(raw('Afterlife'), 'party').kind, 'party')
  // From the "party" keyword search, only listings billed as a party stay.
  assert.equal(fromTicketmaster(raw('Taylor Swift Tribute Night'), 'party', { billedAsParty: true }), null)
  assert.equal(fromTicketmaster(raw('Emo Night Party'), 'party', { billedAsParty: true }).kind, 'party')
})

test('a weekly series stays one event per night; a festival weekend pair folds', () => {
  const weekly = ['2026-11-07', '2026-11-14', '2026-11-21'].map((startDate) =>
    entry({ source: 'ticketmaster', kind: 'party', name: 'Day Fever', startDate, city: 'Leeds', countryCode: 'GB' }))
  assert.equal(mergeAll(weekly, [], { today: TODAY }).length, 3)
  const series = ['2026-10-09', '2026-11-20'].map((startDate) =>
    entry({ source: 'ticketmaster', name: 'Brownstone Jazz Fest', startDate, city: 'Brooklyn', countryCode: 'US' }))
  assert.equal(mergeAll(series, [], { today: TODAY }).length, 2)
  const weekends = ['2027-04-09', '2027-04-16'].map((startDate) =>
    entry({ source: 'ticketmaster', name: 'Coachella', startDate, city: 'Indio', countryCode: 'US' }))
  assert.equal(mergeAll(weekends, [], { today: TODAY }).length, 1)
})

test('past events are dropped', () => {
  const old = entry({ source: 'ticketmaster', name: 'Old Party', startDate: '2026-01-01', city: 'Berlin', countryCode: 'DE' })
  assert.equal(mergeAll([old], [], { today: TODAY }).length, 0)
})

test('community issue form is parsed and validated', () => {
  const body = [
    '### שם האירוע', '', 'Shalvata Thursday', '',
    '### סוג', '', 'מסיבה', '',
    '### תאריך התחלה', '', '2026-10-15', '',
    '### תאריך סיום', '', '_No response_', '',
    '### שעת פתיחה', '', '23:00', '',
    '### מקום', '', 'שלוותה', '',
    '### עיר', '', 'תל אביב', '',
    '### קוד מדינה', '', 'il', '',
    '### סגנון מוזיקה', '', 'טכנו, האוס', '',
    '### קישור לכרטיסים', '', 'https://tickets.example/1', '',
    '### קישור לתמונה', '', 'javascript:alert(1)', '',
    '### מחיר החל מ', '', '90', '',
    '### מטבע', '', 'ILS',
  ].join('\n')
  assert.equal(parseIssueForm(body).city, 'תל אביב')
  const e = fromIssue({ body, html_url: 'https://github.com/x/1' })
  assert.equal(e.kind, 'party')
  assert.equal(e.countryCode, 'IL')
  assert.equal(e.endDate, '2026-10-15')
  assert.equal(e.image, null) // Only https links are accepted.
  assert.deepEqual(e.genres, ['electronic'])
  assert.equal(e.priceFrom, 90)
  assert.equal(fromIssue({ body: body.replace('2026-10-15', 'next week') }), null)
})
