import { FESTIVALS } from './festivals'

// Every festival gets these group chats.
export const GROUP_TYPES = [
  { type: 'general', title: 'קבוצה כללית', description: 'עדכונים, ליינאפ ושאלות לפני ובמהלך הפסטיבל', icon: 'MessageCircle' },
  { type: 'israelis', title: 'ישראלים בפסטיבל', description: 'מכירים את החבר׳ה מהארץ שמגיעים', icon: 'Flag' },
  { type: 'rides', title: 'טרמפים והסעות', description: 'חלוקת נסיעות משדה התעופה ומהעיר', icon: 'Car' },
  { type: 'camping', title: 'קמפינג ולינה', description: 'שותפים לאוהל, דירה או מלון', icon: 'Tent' },
  { type: 'tickets', title: 'החלפת כרטיסים', description: 'מכירה והחלפה של כרטיסים במחיר מקור', icon: 'Ticket' },
  { type: 'solo', title: 'מגיעים לבד', description: 'מוצאים חברים לפני שנוחתים', icon: 'UserRound' },
]

const SEPARATOR = '__'

export function groupsFor(festivalId) {
  return GROUP_TYPES.map((group) => ({ ...group, id: `${festivalId}${SEPARATOR}${group.type}` }))
}

// Resolves a group id back to its festival and group, or null if unknown.
export function findGroup(id) {
  const [festivalId, type] = id.split(SEPARATOR)
  const festival = FESTIVALS.find((f) => f.id === festivalId)
  const group = GROUP_TYPES.find((g) => g.type === type)
  return festival && group ? { festival, group: { ...group, id } } : null
}
