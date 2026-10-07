import { t } from '../i18n'

const groupType = (type, icon, extra = {}) => ({
  type,
  icon,
  ...extra,
  get title() {
    return t(`group.${type}.title`)
  },
  get description() {
    return t(`group.${type}.description`)
  },
})

// Every festival gets these group chats.
export const GROUP_TYPES = [
  groupType('general', 'MessageCircle'),
  groupType('israelis', 'Flag'),
  groupType('rides', 'Car'),
  groupType('camping', 'Tent', { festivalOnly: true }),
  groupType('tickets', 'Ticket'),
  groupType('solo', 'UserRound'),
]

const SEPARATOR = '__'

export function groupsFor(item) {
  return GROUP_TYPES
    .filter((group) => !group.festivalOnly || item.kind !== 'party')
    .map((group) => ({ ...group, id: `${item.id}${SEPARATOR}${group.type}` }))
}

// What a member keeps of the event when joining, so the group still shows
// after the event has ended and dropped out of the catalog.
export function eventSnapshot(item) {
  const { id, name, kind, emoji, colors, city, country, flag, startDate, endDate } = item
  return { id, name, kind, emoji, colors, city, country, flag, startDate, endDate, image: item.image ?? null }
}

// Resolves a group id to its event and group: from the live catalog, or for
// a member, from the snapshot saved when they joined. Null if neither.
export function findGroup(id, byId, myGroups = {}) {
  const [festivalId, type] = id.split(SEPARATOR)
  const festival = byId.get(festivalId) ?? myGroups[id]?.event
  const group = GROUP_TYPES.find((g) => g.type === type)
  return festival && group ? { festival, group: { ...group, id } } : null
}
