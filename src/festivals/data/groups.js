// Every festival gets these group types. A group becomes joinable once its
// WhatsApp invite link is added to INVITES below.
export const GROUP_TYPES = [
  { type: 'general', title: 'קבוצה כללית', description: 'עדכונים, ליינאפ ושאלות לפני ובמהלך הפסטיבל', icon: 'MessageCircle' },
  { type: 'israelis', title: 'ישראלים בפסטיבל', description: 'מכירים את החבר׳ה מהארץ שמגיעים', icon: 'Flag' },
  { type: 'rides', title: 'טרמפים והסעות', description: 'חלוקת נסיעות משדה התעופה ומהעיר', icon: 'Car' },
  { type: 'camping', title: 'קמפינג ולינה', description: 'שותפים לאוהל, דירה או מלון', icon: 'Tent' },
  { type: 'tickets', title: 'החלפת כרטיסים', description: 'מכירה והחלפה של כרטיסים במחיר מקור', icon: 'Ticket' },
  { type: 'solo', title: 'מגיעים לבד', description: 'מוצאים חברים לפני שנוחתים', icon: 'UserRound' },
]

// Key: "<festival id>:<group type>", value: a https://chat.whatsapp.com/... invite link.
// Example:
//   'tomorrowland:general': 'https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv',
export const INVITES = {
}

const INVITE_PATTERN = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,40}$/

export function groupsFor(festivalId) {
  return GROUP_TYPES.map((group) => {
    const link = INVITES[`${festivalId}:${group.type}`]
    return { ...group, invite: INVITE_PATTERN.test(link ?? '') ? link : null }
  })
}
