import { useRef } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { clockTime } from '../../utils'
import { t } from '../../i18n'
import { useProfile } from '../../chat/ChatContext'
import UserAvatar from '../UserAvatar'
import PollCard from './PollCard'
import { isBigEmoji } from '../../chat/messages'
import RichText from './RichText'

const LONG_PRESS_MS = 450

function Reactions({ reactions, myUid, onToggle }) {
  const entries = Object.entries(reactions ?? {})
  if (entries.length === 0) return null
  const counts = {}
  for (const [, emoji] of entries) counts[emoji] = (counts[emoji] ?? 0) + 1
  const mine = reactions[myUid]
  return (
    <div className="flex flex-wrap gap-1 -mt-2 mx-2 relative z-[1]">
      {Object.entries(counts).map(([emoji, count]) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onToggle(emoji)}
          className={`text-sm rounded-full px-1.5 py-0.5 border shadow ${mine === emoji ? 'bg-accent/20 border-accent/50' : 'bg-ink-800 border-ink-600'}`}
        >
          {emoji}{count > 1 && <span className="text-[11px] text-white/70 ms-0.5">{count}</span>}
        </button>
      ))}
    </div>
  )
}

function SenderAvatar({ uid, name, onOpen }) {
  const profile = useProfile(uid)
  return (
    <button type="button" onClick={onOpen} className="self-start mt-0.5" aria-label={t('msg.profileOf', { name })}>
      <UserAvatar name={profile?.name ?? name} photo={profile?.photo} size="xs" />
    </button>
  )
}

export default function MessageBubble({
  message: m, mine, myUid, canInteract, highlight, flash, onMenu, onReact, onVote, onOpenImage, onJumpTo, showName, onOpenProfile,
}) {
  const pressTimer = useRef(null)
  const big = m.type === 'text' && !m.deleted && isBigEmoji(m.text)

  const startPress = (e) => {
    if (e.pointerType === 'mouse') return
    pressTimer.current = setTimeout(() => onMenu(m), LONG_PRESS_MS)
  }
  const cancelPress = () => clearTimeout(pressTimer.current)

  const toggleReaction = (emoji) => {
    if (canInteract) onReact(m, m.reactions?.[myUid] === emoji ? null : emoji)
  }

  return (
    <div id={`msg-${m.id}`} className={`flex gap-2 max-w-[88%] sm:max-w-[72%] ${mine ? 'self-end' : 'self-start'}`}>
      {!mine && (showName
        ? <SenderAvatar uid={m.uid} name={m.name} onOpen={() => onOpenProfile(m.uid, m.name)} />
        : <span className="w-7 shrink-0" />)}
      <div className={`group flex flex-col min-w-0 ${mine ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative select-none sm:select-text transition-shadow ${flash ? 'ring-2 ring-accent' : ''} ${
            big ? 'px-1' : `rounded-2xl px-3 py-2 ${mine ? 'bg-brand rounded-ee-sm' : 'bg-ink-800 border hairline rounded-es-sm'}`
          }`}
          onPointerDown={startPress}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
          onPointerMove={cancelPress}
          onContextMenu={(e) => {
            e.preventDefault()
            onMenu(m)
          }}
          onDoubleClick={() => toggleReaction('❤️')}
        >
          {!m.deleted && (
            <button
              type="button"
              onClick={() => onMenu(m)}
              className={`absolute top-1 ${mine ? 'end-1' : 'start-1'} hidden sm:group-hover:flex w-6 h-6 rounded-full bg-black/40 items-center justify-center z-[2]`}
              aria-label={t('msg.options')}
            >
              <ChevronDown size={16} />
            </button>
          )}

          {showName && !mine && (
            <button type="button" onClick={() => onOpenProfile(m.uid, m.name)} className="block text-[12px] font-medium text-accent mb-0.5 hover:underline">
              {m.name}
            </button>
          )}

          {m.replyTo && !m.deleted && (
            <button
              type="button"
              onClick={() => onJumpTo(m.replyTo.id)}
              className="block w-full text-start bg-black/30 border-s-2 border-accent rounded-md px-2 py-1 mb-1.5"
            >
              <p className="text-[12px] font-medium text-accent">{m.replyTo.name}</p>
              <p className="text-xs text-white/70 line-clamp-2" dir="auto">{m.replyTo.text}</p>
            </button>
          )}

          {m.deleted ? (
            <p className="italic text-white/50 text-sm">🚫 {t('msg.deleted')}</p>
          ) : (
            <>
              {m.type === 'image' && (
                <button type="button" onClick={() => onOpenImage(m)} className="block -mx-1 mb-1">
                  <img src={m.image} alt={m.caption || t('common.image')} className="rounded-xl max-h-80 w-full object-cover" loading="lazy" />
                </button>
              )}
              {m.type === 'location' && (
                <a
                  href={`https://www.google.com/maps?q=${m.location.lat},${m.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-black/30 rounded-xl p-2.5 mb-1 min-w-[12rem]"
                >
                  <span className="w-10 h-10 rounded-xl bg-ink-600 flex items-center justify-center"><MapPin size={18} /></span>
                  <span>
                    <span className="block font-semibold text-sm">{t('msg.myLocation')}</span>
                    <span className="block text-xs text-white/60">{t('msg.openMaps')}</span>
                  </span>
                </a>
              )}
              {m.type === 'poll' && (
                <PollCard poll={m.poll} votes={m.votes} myUid={myUid} canVote={canInteract} onVote={(ids) => onVote(m, ids)} />
              )}
              {(m.text || m.caption) && (
                <p className={`whitespace-pre-wrap break-words leading-snug ${big ? 'text-5xl leading-tight' : ''}`} dir="auto">
                  <RichText text={m.text || m.caption} highlight={highlight} />
                </p>
              )}
            </>
          )}

          <p className={`font-num text-[10px] text-white/45 mt-0.5 flex gap-1 ${big ? 'justify-center' : 'justify-end'}`} dir="ltr">
            {clockTime(m.createdAt)}
            {m.edited && !m.deleted && <span>{t('msg.edited')}</span>}
          </p>
        </div>
        <Reactions reactions={m.reactions} myUid={myUid} onToggle={toggleReaction} />
      </div>
    </div>
  )
}
