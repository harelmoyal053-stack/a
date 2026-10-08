import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Pin, Search, X } from 'lucide-react'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { replyRef } from '../chat/messages'
import { compressImage, currentLocation } from '../chat/media'
import { dayLabel, isEnded, membersLabel } from '../utils'
import { t } from '../i18n'
import EventAvatar from './EventAvatar'
import GroupIcon from './GroupIcon'
import Composer from './chat/Composer'
import GroupInfo from './chat/GroupInfo'
import ImageComposer from './chat/ImageComposer'
import ImageViewer from './chat/ImageViewer'
import MessageBubble from './chat/MessageBubble'
import MessageMenu from './chat/MessageMenu'
import PollComposer from './chat/PollComposer'
import ProfileSheet from './ProfileSheet'

export default function ChatScreen({ festival, group, onClose }) {
  const chat = useChat()
  const { service, user, myGroups, withUser } = chat
  const { memberCount, pinned } = useGroupMeta(group.id)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [menuFor, setMenuFor] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [editing, setEditing] = useState(null)
  const [pendingImage, setPendingImage] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [pollOpen, setPollOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [flashId, setFlashId] = useState(null)
  const [profileOf, setProfileOf] = useState(null)
  const bottomRef = useRef(null)
  const isMember = Boolean(myGroups[group.id])
  const ended = isEnded(festival)
  const overlayOpen = Boolean(menuFor || pendingImage || viewing || pollOpen || infoOpen || profileOf)

  useEffect(() => (service ? service.onMessages(group.id, setMessages) : undefined), [service, group.id])

  useEffect(() => {
    if (!searchOpen) bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, searchOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !overlayOpen && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, overlayOpen])

  const flash = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2000)
  }

  const run = async (action) => {
    setError('')
    try {
      await action()
    } catch (e) {
      setError(e?.message === 'storage-full'
        ? t('chat.errStorage')
        : t('chat.errAction'))
    }
  }

  const send = (payload) =>
    run(async () => {
      await chat.send(group.id, { ...payload, replyTo: replyTo ? replyRef(replyTo) : undefined })
      setReplyTo(null)
    })

  const sendText = (text) => {
    if (editing) {
      const id = editing.id
      setEditing(null)
      return run(() => chat.edit(group.id, id, text))
    }
    return send({ type: 'text', text })
  }

  const pickImage = (file) =>
    run(async () => {
      try {
        setPendingImage(await compressImage(file))
      } catch {
        setError(t('chat.errImage'))
      }
    })

  const shareLocation = () =>
    run(async () => {
      try {
        const location = await currentLocation()
        await send({ type: 'location', location })
      } catch {
        setError(t('chat.errLocation'))
      }
    })

  const jumpTo = useCallback((id) => {
    setInfoOpen(false)
    setSearchOpen(false)
    setSearch('')
    requestAnimationFrame(() => {
      const el = document.getElementById(`msg-${id}`)
      if (!el) return
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      setFlashId(id)
      setTimeout(() => setFlashId(null), 1500)
    })
  }, [])

  const menuAction = (action) => {
    const m = menuFor
    setMenuFor(null)
    if (action === 'reply') {
      setEditing(null)
      setReplyTo(m)
    }
    if (action === 'copy') {
      navigator.clipboard?.writeText(m.text || m.caption || '').then(() => flash(t('common.copied')), () => {})
    }
    if (action === 'pin') run(() => chat.pin(group.id, pinned?.id === m.id ? null : m))
    if (action === 'edit') {
      setReplyTo(null)
      setEditing(m)
    }
    if (action === 'delete' && window.confirm(t('chat.confirmDelete'))) run(() => chat.remove(group.id, m.id))
  }

  const leaveGroup = () => {
    if (window.confirm(t('chat.confirmLeave', { title: group.title }))) {
      setInfoOpen(false)
      run(() => chat.leave(group.id))
    }
  }

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return messages
    return messages.filter((m) => !m.deleted && [m.text, m.caption, m.poll?.question, m.name].some((t) => t?.toLowerCase().includes(q)))
  }, [messages, search])

  const pinnedMessage = pinned && messages.find((m) => m.id === pinned.id && !m.deleted) ? pinned : null

  return (
    <div className="fixed inset-0 z-[55] bg-ink-900 flex flex-col animate-slide-up" role="dialog" aria-modal="true" aria-label={t('chat.dialog', { title: group.title })}>
      <header className="flex items-center gap-2 px-2 h-14 bg-ink-900 border-b hairline shrink-0">
        <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center" aria-label={t('common.back')}>
          <ArrowRight size={22} className="ltr:-scale-x-100" />
        </button>
        {searchOpen ? (
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('chat.searchPlaceholder')}
            className="flex-1 h-9 bg-ink-700 rounded-xl px-3 outline-none text-base"
            aria-label={t('chat.search')}
          />
        ) : (
          <button type="button" onClick={() => setInfoOpen(true)} className="flex items-center gap-3 flex-1 min-w-0 text-start" aria-label={t('chat.info')}>
            <EventAvatar festival={festival} size="sm" />
            <span className="min-w-0">
              <span className="block text-[15px] font-medium truncate">{group.title}</span>
              <span className="flex gap-1.5 text-[12px] text-muted min-w-0">
                <span className="truncate" dir="auto">{festival.name}</span>
                <span className="shrink-0">· {membersLabel(memberCount)}</span>
              </span>
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={() => { setSearchOpen(!searchOpen); setSearch('') }}
          className="w-10 h-10 flex items-center justify-center text-white/70"
          aria-label={searchOpen ? t('chat.closeSearch') : t('chat.search')}
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
      </header>

      {service?.mode === 'local' && (
        <p className="border-b hairline text-accent text-[12px] text-center px-4 py-1.5 shrink-0">
          {t('chat.preview')}
        </p>
      )}

      {ended && (
        <p className="border-b hairline text-muted text-xs text-center px-4 py-1.5 shrink-0">
          {t('chat.endedBanner')}
        </p>
      )}

      {pinnedMessage && !searchOpen && (
        <button type="button" onClick={() => jumpTo(pinnedMessage.id)} className="flex items-center gap-2 px-4 py-2 bg-ink-800/90 border-b border-white/5 text-start shrink-0">
          <Pin size={16} className="text-accent shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-accent font-semibold">{t('chat.pinned')} · {pinnedMessage.name}</span>
            <span className="block text-sm truncate" dir="auto">{pinnedMessage.text}</span>
          </span>
        </button>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-4 chat-wallpaper">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {!search && (
            <div className="self-center text-center border hairline text-muted text-xs rounded-2xl px-4 py-3 mb-4 max-w-xs">
              <GroupIcon name={group.icon} size={16} className="mx-auto mb-1.5 text-white/70" />
              {group.description}
              <span className="block mt-1 text-white/40">{t('chat.hint')}</span>
            </div>
          )}
          {visible.map((m, i) => {
            const prev = visible[i - 1]
            const day = dayLabel(m.createdAt)
            const showDay = !prev || day !== dayLabel(prev.createdAt)
            return (
              <div key={m.id} className="flex flex-col">
                {showDay && <span className="self-center text-[10px] text-muted my-3">{day}</span>}
                <MessageBubble
                  message={m}
                  mine={m.uid === user?.uid}
                  myUid={user?.uid}
                  canInteract={isMember}
                  highlight={search.trim()}
                  flash={flashId === m.id}
                  showName={showDay || prev?.uid !== m.uid}
                  onMenu={(msg) => !msg.deleted && setMenuFor(msg)}
                  onReact={(msg, emoji) => run(() => chat.react(group.id, msg.id, emoji))}
                  onVote={(msg, ids) => run(() => chat.vote(group.id, msg.id, ids))}
                  onOpenImage={setViewing}
                  onJumpTo={jumpTo}
                  onOpenProfile={(uid, name) => setProfileOf({ uid, name })}
                />
              </div>
            )
          })}
          {messages.length === 0 && <p className="self-center text-white/40 text-sm mt-10">{t('chat.empty')}</p>}
          {search && visible.length === 0 && <p className="self-center text-white/40 text-sm mt-10">{t('chat.noResults')}</p>}
          <div ref={bottomRef} />
        </div>
      </div>

      {error && <p className="text-rose-400 text-sm text-center py-1 shrink-0">{error}</p>}
      {toast && <p className="fixed bottom-24 inset-x-0 mx-auto w-fit bg-white text-black text-[13px] rounded-xl px-3 py-1.5 z-[90]">{toast}</p>}

      <footer className="shrink-0 bg-ink-900 border-t hairline px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {isMember ? (
          <Composer
            key={editing?.id ?? 'compose'}
            replyTo={replyTo}
            editing={editing}
            onCancel={() => { setReplyTo(null); setEditing(null) }}
            onSend={sendText}
            onPickImage={pickImage}
            onPoll={() => setPollOpen(true)}
            onLocation={shareLocation}
          />
        ) : ended ? (
          <p className="max-w-2xl mx-auto text-center text-sm text-white/50 py-2">{t('chat.endedFooter')}</p>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-2 py-1">
            <p className="text-xs text-white/50">{t('chat.membersOnly')}</p>
            <button type="button" onClick={() => withUser(() => run(() => chat.join(group, festival)))} className="w-full h-11 bg-brand text-white font-medium rounded-xl">
              {t('chat.join')}
            </button>
          </div>
        )}
      </footer>

      {menuFor && (
        <MessageMenu
          message={menuFor}
          mine={menuFor.uid === user?.uid}
          myReaction={menuFor.reactions?.[user?.uid]}
          canInteract={isMember}
          isPinned={pinned?.id === menuFor.id}
          onReact={(emoji) => {
            const m = menuFor
            setMenuFor(null)
            run(() => chat.react(group.id, m.id, emoji))
          }}
          onAction={menuAction}
          onClose={() => setMenuFor(null)}
        />
      )}
      {pendingImage && (
        <ImageComposer
          image={pendingImage}
          onClose={() => setPendingImage(null)}
          onSend={(caption) => {
            const image = pendingImage
            setPendingImage(null)
            send({ type: 'image', image, caption })
          }}
        />
      )}
      {pollOpen && (
        <PollComposer
          onClose={() => setPollOpen(false)}
          onSend={(poll) => {
            setPollOpen(false)
            send({ type: 'poll', poll })
          }}
        />
      )}
      {viewing && <ImageViewer message={viewing} onClose={() => setViewing(null)} />}
      {infoOpen && (
        <GroupInfo
          festival={festival}
          group={group}
          messages={messages}
          memberCount={memberCount}
          isMember={isMember}
          onOpenImage={setViewing}
          onJumpTo={jumpTo}
          onLeave={leaveGroup}
          onClose={() => setInfoOpen(false)}
          onOpenProfile={(uid, name) => setProfileOf({ uid, name })}
        />
      )}
      {profileOf && <ProfileSheet uid={profileOf.uid} fallbackName={profileOf.name} onClose={() => setProfileOf(null)} />}
    </div>
  )
}
