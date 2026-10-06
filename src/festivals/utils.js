// Months from now until the festival's usual month (0 = this month).
export function monthsAway(month) {
  return (month - 1 - new Date().getMonth() + 12) % 12
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
