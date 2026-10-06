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
