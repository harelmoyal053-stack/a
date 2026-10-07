// Months from now until the festival's usual month (0 = this month).
export function monthsAway(month) {
  return (month - 1 - new Date().getMonth() + 12) % 12
}

const DAY_MS = 86400000

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
  if (item.priceFrom === 0) return 'כניסה חופשית'
  try {
    const price = new Intl.NumberFormat('he-IL', { style: 'currency', currency: item.currency || 'USD', maximumFractionDigits: 0 }).format(item.priceFrom)
    return `החל מ-${price}`
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
