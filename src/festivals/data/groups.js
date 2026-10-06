// Every festival gets these group chats.
export const GROUP_TYPES = [
  { type: 'general', title: 'קבוצה כללית', description: 'עדכונים, ליינאפ ושאלות לפני ובמהלך הפסטיבל', icon: 'MessageCircle' },
  { type: 'israelis', title: 'ישראלים שמגיעים', description: 'מכירים את החבר׳ה מהארץ שמגיעים', icon: 'Flag' },
  { type: 'rides', title: 'טרמפים והסעות', description: 'חלוקת נסיעות משדה התעופה ומהעיר', icon: 'Car' },
  { type: 'camping', title: 'קמפינג ולינה', description: 'שותפים לאוהל, דירה או מלון', icon: 'Tent', festivalOnly: true },
  { type: 'tickets', title: 'החלפת כרטיסים', description: 'מכירה והחלפה של כרטיסים במחיר מקור', icon: 'Ticket' },
  { type: 'solo', title: 'מגיעים לבד', description: 'מוצאים חברים לפני שנוחתים', icon: 'UserRound' },
]

const SEPARATOR = '__'

export function groupsFor(item) {
  return GROUP_TYPES
    .filter((group) => !group.festivalOnly || item.kind !== 'party')
    .map((group) => ({ ...group, id: `${item.id}${SEPARATOR}${group.type}` }))
}

// Resolves a group id back to its festival and group, or null if unknown.
export function findGroup(id, byId) {
  const [festivalId, type] = id.split(SEPARATOR)
  const festival = byId.get(festivalId)
  const group = GROUP_TYPES.find((g) => g.type === type)
  return festival && group ? { festival, group: { ...group, id } } : null
}
