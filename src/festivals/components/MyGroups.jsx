import { MessageCircle } from 'lucide-react'
import { findGroup } from '../data/groups'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { useCatalog } from '../data/CatalogContext'
import { shortTime } from '../utils'

function GroupRow({ id, onOpen }) {
  const { byId } = useCatalog()
  const found = findGroup(id, byId)
  const { lastMessage } = useGroupMeta(id)
  if (!found) return null
  const { festival, group } = found
  const [from, to] = festival.colors

  return (
    <li>
      <button type="button" onClick={() => onOpen(id)} className="w-full flex items-center gap-3 py-3 text-right hover:bg-white/5 rounded-xl px-2 -mx-2">
        <span className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
          {festival.emoji}
        </span>
        <div className="flex-1 min-w-0 border-b border-white/5 pb-3">
          <div className="flex justify-between gap-2">
            <p className="font-bold truncate"><span dir="auto">{festival.name}</span> · {group.title}</p>
            {lastMessage && <span className="text-xs text-white/40 shrink-0">{shortTime(lastMessage.createdAt)}</span>}
          </div>
          <p className="text-sm text-white/50 truncate mt-0.5">
            {lastMessage ? `${lastMessage.name}: ${lastMessage.text}` : 'עוד אין הודעות – תכתבו ראשונים'}
          </p>
        </div>
      </button>
    </li>
  )
}

// The visitor's joined groups, newest first, WhatsApp-style.
export default function MyGroups({ onOpen, emptyHint = false, limit }) {
  const { myGroups } = useChat()
  const ids = Object.entries(myGroups).sort((a, b) => b[1] - a[1]).map(([id]) => id).slice(0, limit)

  if (ids.length === 0) {
    if (!emptyHint) return null
    return (
      <div className="text-center py-16 text-white/50">
        <MessageCircle size={40} className="mx-auto mb-3 text-white/30" />
        <p className="font-bold text-white">עוד לא הצטרפת לקבוצות</p>
        <p className="text-sm mt-1">פתחו פסטיבל ולחצו ״הצטרפות״ ליד הקבוצה שמעניינת אתכם.</p>
      </div>
    )
  }

  return <ul>{ids.map((id) => <GroupRow key={id} id={id} onOpen={onOpen} />)}</ul>
}
