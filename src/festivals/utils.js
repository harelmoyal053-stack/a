// Months from now until the festival's usual month (0 = this month).
export function monthsAway(month) {
  return (month - 1 - new Date().getMonth() + 12) % 12
}

const DAY_MS = 86400000

// Today's date in the visitor's time zone, as YYYY-MM-DD.
export const todayIso = () => new Date().toLocaleDateString('sv-SE')

export const isEnded = (item) => (item.endDate ?? item.startDate) < todayIso()

function daysUntil(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const now = new Date()
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / DAY_MS)
}

// Countdown badge: days for the next six weeks, then months.
export function countdownFor(item) {
  if (!item.startDate) return countdownLabel(item.month)
  const days = daysUntil(item.startDate)
  if (days <= 0) return daysUntil(item.endDate ?? item.startDate) >= 0 ? 'עכשיו!' : 'הסתיים'
  if (days === 1) return 'מחר'
  if (days <= 45) return `בעוד ${days} ימים`
  return countdownLabel(Number(item.startDate.slice(5, 7)))
}

function shortDate(isoDate) {
  const [, m, d] = isoDate.split('-')
  return `${d}.${m}`
}

// "חמישי · 12.11", "09.04–16.04", or the usual month for undated festivals.
export function dateChip(item, months) {
  if (!item.startDate) return months[item.month - 1]
  // Isolated as left-to-right, or the range reads backwards inside Hebrew text.
  if (item.endDate && item.endDate !== item.startDate) return `\u2066${shortDate(item.startDate)}–${shortDate(item.endDate)}\u2069`
  const weekday = new Date(`${item.startDate}T12:00:00`).toLocaleDateString('he-IL', { weekday: 'long' }).replace(/^יום /, '')
  return `${weekday} · ${shortDate(item.startDate)}`
}

export function priceLabel(item) {
  if (item.priceFrom == null) return null
  if (item.priceFrom === 0) return 'חינם'
  try {
    // "CA$27", "€40", "₪180", isolated so the symbol stays next to the number in Hebrew text.
    const price = new Intl.NumberFormat('en', { style: 'currency', currency: item.currency || 'USD', maximumFractionDigits: 0 }).format(item.priceFrom)
    return `מ-\u2066${price}\u2069`
  } catch {
    return null
  }
}

export function countdownLabel(month) {
  const n = monthsAway(month)
  if (n === 0) return 'החודש'
  if (n === 1) return 'בחודש הבא'
  if (n === 2) return 'בעוד חודשיים'
  return `בעוד ${n} חודשים`
}

export function membersLabel(count) {
  if (count === 0) return 'עוד אין חברים'
  if (count === 1) return 'חבר אחד'
  return `${count} חברים`
}

const pad = (n) => String(n).padStart(2, '0')

// "14:05" for today, "06.10" otherwise.
export function shortTime(ms) {
  const d = new Date(ms)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return `${pad(d.getHours())}:${pad(d.getMinutes())}`
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`
}

export function clockTime(ms) {
  const d = new Date(ms)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function dayLabel(ms) {
  const d = new Date(ms)
  const today = new Date()
  const yesterday = new Date(Date.now() - 86400000)
  if (d.toDateString() === today.toDateString()) return 'היום'
  if (d.toDateString() === yesterday.toDateString()) return 'אתמול'
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })
}

function addDaysIso(isoDate, days) {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('sv-SE')
}

// Is the event on during [from, to] (inclusive ISO dates)?
export const overlaps = (item, from, to) => item.startDate <= to && (item.endDate ?? item.startDate) >= from

export function thisWeekRange() {
  const from = todayIso()
  return [from, addDaysIso(from, 6)]
}

// The coming Israeli weekend, Thursday to Saturday (this one if we're in it).
export function weekendRange() {
  const today = todayIso()
  const day = new Date(`${today}T12:00:00`).getDay()
  const toThursday = day >= 4 ? 0 : 4 - day
  const from = day >= 4 ? today : addDaysIso(today, toThursday)
  return [from, addDaysIso(from, 6 - Math.max(day, 4))]
}

const WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

// Section heading for a day in the event list: "היום", "מחר", "שבת 11.10".
export function dayHeading(isoDate) {
  const today = todayIso()
  if (isoDate <= today) return 'היום'
  const days = daysUntil(isoDate)
  if (days === 1) return 'מחר'
  const [, m, d] = isoDate.split('-')
  const weekday = WEEKDAYS[new Date(`${isoDate}T12:00:00`).getDay()]
  return `${weekday} ${d}.${m}`
}

// Compact meta line for a card: "שבת 11.10 · 23:00" or "09.04–16.04".
export function cardDate(item) {
  if (item.endDate && item.endDate !== item.startDate) {
    const [, m1, d1] = item.startDate.split('-')
    const [, m2, d2] = item.endDate.split('-')
    return `\u2066${d1}.${m1}–${d2}.${m2}\u2069`
  }
  return [dayHeading(item.startDate), item.time].filter(Boolean).join(' · ')
}

export function initials(name) {
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean)
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '?').slice(0, 2)).toUpperCase()
}

export const instagramUrl = (handle) => `https://instagram.com/${encodeURIComponent(handle)}`

// Accepts "@name", "name" or an instagram.com link; returns the bare handle, or null if invalid.
export function parseInstagram(value) {
  const handle = value.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/\/.*$/, '')
  return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? handle : null
}
