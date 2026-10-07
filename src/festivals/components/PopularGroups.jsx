import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { useCatalog } from '../data/CatalogContext'
import { findGroup } from '../data/groups'
import Carousel from './Carousel'
import EventAvatar from './EventAvatar'

function GroupCard({ id, memberCount, festival, group, onOpen }) {
  const { lastMessage } = useGroupMeta(id)
  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="snap-start shrink-0 w-64 text-right rounded-lg border hairline bg-ink-800 p-3.5 hover:border-white/20"
    >
      <span className="flex items-center gap-3">
        <EventAvatar festival={festival} size="sm" />
        <span className="min-w-0">
          <span className="block text-[14px] font-medium truncate">{group.title}</span>
          <span className="block text-[12px] text-muted truncate" dir="auto">{festival.name}</span>
        </span>
      </span>
      <span className="block text-[13px] text-white/70 mt-3 h-10 line-clamp-2 leading-snug">
        {lastMessage ? `${lastMessage.name}: ${lastMessage.text}` : group.description}
      </span>
      <span className="flex items-center gap-1.5 font-num text-[11px] text-accent mt-3">
        <Users size={13} /> {memberCount}
      </span>
    </button>
  )
}

// Groups with the most members. Hidden until some group has members.
export default function PopularGroups({ onOpen }) {
  const { service, myGroups } = useChat()
  const { byId } = useCatalog()
  const [top, setTop] = useState([])

  useEffect(() => (service ? service.onTopGroups(12, setTop) : undefined), [service])

  const groups = top
    .map((g) => ({ ...g, ...findGroup(g.id, byId, myGroups) }))
    .filter((g) => g.festival)
  if (groups.length === 0) return null

  return (
    <Carousel title="קבוצות פופולריות" subtitle="הקבוצות עם הכי הרבה חברים עכשיו">
      {groups.map((g) => <GroupCard key={g.id} {...g} onOpen={onOpen} />)}
    </Carousel>
  )
}
