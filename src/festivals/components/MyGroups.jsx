import { MessageCircle } from 'lucide-react'
import { findGroup } from '../data/groups'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { useCatalog } from '../data/CatalogContext'
import { isEnded, shortTime } from '../utils'
import EventAvatar from './EventAvatar'

function GroupRow({ id, onOpen }) {
  const { byId } = useCatalog()
  const { myGroups } = useChat()
  const found = findGroup(id, byId, myGroups)
  const { lastMessage } = useGroupMeta(id)
  if (!found) return null
  const { festival, group } = found

  return (
    <li>
      <button type="button" onClick={() => onOpen(id)} className="w-full flex items-center gap-3 py-3 text-right border-b hairline hover:bg-white/[0.03] -mx-2 px-2 rounded-sm">
        <EventAvatar festival={festival} />
        <span className="flex-1 min-w-0">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-[15px] font-medium truncate">
              {group.title} <span className="text-muted font-normal" dir="auto">· {festival.name}</span>
            </span>
            {lastMessage && <span className="font-num text-[11px] text-muted shrink-0">{shortTime(lastMessage.createdAt)}</span>}
          </span>
          <span className="flex items-center gap-2 mt-0.5">
            {isEnded(festival) && <span className="text-[10px] text-muted border border-ink-600 rounded-sm px-1">הסתיים</span>}
            <span className="text-[13px] text-muted truncate">
              {lastMessage ? `${lastMessage.name}: ${lastMessage.text}` : 'עוד אין הודעות'}
            </span>
          </span>
        </span>
      </button>
    </li>
  )
}

// The visitor's joined groups, most recently joined first.
export default function MyGroups({ onOpen, emptyHint = false, limit }) {
  const { myGroups } = useChat()
  const ids = Object.entries(myGroups)
    .sort((a, b) => b[1].joinedAt - a[1].joinedAt)
    .map(([id]) => id)
    .slice(0, limit)

  if (ids.length === 0) {
    if (!emptyHint) return null
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <MessageCircle size={22} strokeWidth={1.5} className="text-muted mb-4" />
        <p className="font-medium">עוד לא הצטרפת לקבוצות</p>
        <p className="text-sm text-muted mt-1 max-w-xs">פתחו אירוע ולחצו ״הצטרפות״ ליד הקבוצה שמתאימה לכם.</p>
      </div>
    )
  }

  return <ul>{ids.map((id) => <GroupRow key={id} id={id} onOpen={onOpen} />)}</ul>
}
