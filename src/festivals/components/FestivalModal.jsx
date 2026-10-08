import { useEffect } from 'react'
import { ArrowRight, ArrowUpLeft, Heart, Share2 } from 'lucide-react'
import { GENRES } from '../data/festivals'
import { t } from '../i18n'
import { sourceLabel } from '../data/catalog'
import { whatsappShareUrl } from '../config'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { countdownFor, dateChip, isEnded, monthName, priceLabel } from '../utils'
import GroupIcon from './GroupIcon'
import Poster from './Poster'

function GroupRow({ festival, group, onOpenChat }) {
  const { myGroups, withUser, join } = useChat()
  const { memberCount } = useGroupMeta(group.id)
  const isMember = Boolean(myGroups[group.id])

  const joinAndOpen = () =>
    withUser(async () => {
      await join(group, festival)
      onOpenChat(group.id)
    })

  return (
    <li className="flex items-center gap-3 py-3.5 border-b hairline">
      <button type="button" onClick={() => onOpenChat(group.id)} className="flex items-center gap-3 flex-1 min-w-0 text-start">
        <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${isMember ? 'bg-brand text-white' : 'bg-ink-700 text-white/70'}`}>
          <GroupIcon name={group.icon} size={17} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-medium">{group.title}</span>
          <span className="block text-[13px] text-muted truncate">{group.description}</span>
        </span>
        {memberCount > 0 && <span className="font-num text-[11px] text-muted shrink-0">{memberCount}</span>}
      </button>
      {isMember ? (
        <button type="button" onClick={() => onOpenChat(group.id)} className="shrink-0 h-8 px-3 rounded-xl border border-ink-600 text-[13px] hover:border-white/40">
          {t('common.open')}
        </button>
      ) : isEnded(festival) ? (
        <span className="shrink-0 text-[12px] text-muted px-2">{t('common.closed')}</span>
      ) : (
        <button type="button" onClick={joinAndOpen} className="shrink-0 h-8 px-3 rounded-xl bg-brand text-white text-[13px] font-medium hover:brightness-110">
          {t('common.join')}
        </button>
      )}
    </li>
  )
}

function Fact({ label, children }) {
  return (
    <div className="flex gap-4 py-3 border-b hairline">
      <dt className="text-[11px] text-muted w-16 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-[14px] min-w-0">{children}</dd>
    </div>
  )
}

export default function FestivalModal({ festival, groups, isFavorite, onToggleFavorite, onClose, onOpenChat }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const shareText = t('event.share', { name: festival.name, url: window.location.href })
  const iconButton = 'w-9 h-9 rounded-xl bg-black/60 backdrop-blur flex items-center justify-center'

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/80 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="festival-title"
        className="bg-ink-900 w-full sm:max-w-lg h-full sm:h-auto sm:max-h-full overflow-y-auto sm:rounded-2xl sm:border hairline animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3]">
          <Poster festival={festival} large showTitle={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-black/30" />
          <div className="absolute top-3 inset-x-3 flex justify-between">
            <button type="button" onClick={onClose} className={iconButton} aria-label={t('common.back')}><ArrowRight size={18} className="ltr:-scale-x-100" /></button>
            <div className="flex gap-2">
              <a href={whatsappShareUrl(shareText)} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label={t('common.share')}><Share2 size={16} /></a>
              <button type="button" onClick={onToggleFavorite} className={iconButton} aria-label={isFavorite ? t('saved.remove') : t('saved.add')} aria-pressed={isFavorite}>
                <Heart size={16} className={isFavorite ? 'fill-accent text-accent' : ''} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-10 -mt-6 relative">
          <p className="text-[11px] text-accent">{countdownFor(festival)}</p>
          <h2 id="festival-title" className="text-[28px] font-semibold leading-tight tracking-tight mt-1.5" dir="auto">{festival.name}</h2>

          <dl className="mt-5 border-t hairline">
            <Fact label={t('event.when')}>
              {festival.startDate ? `${dateChip(festival)}${festival.time ? ` · ${festival.time}` : ''}` : monthName(festival.month)}
            </Fact>
            <Fact label={t('event.where')}>
              <span className="block" dir="auto">{[festival.venue, festival.city].filter(Boolean).join(', ')}</span>
              <span className="block text-muted text-[13px]">{festival.country}</span>
            </Fact>
            {festival.genres.length > 0 && <Fact label={t('event.genre')}>{festival.genres.map((g) => GENRES[g]).filter(Boolean).join(', ')}</Fact>}
            {festival.sources?.length > 0 && <Fact label={t('event.source')}>{festival.sources.map(sourceLabel).join(', ')}</Fact>}
          </dl>

          {festival.tickets?.length > 0 && (
            <div className="mt-5 flex flex-col gap-2">
              {festival.tickets.map((ticket, i) => (
                <a
                  key={ticket.source}
                  href={ticket.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-12 px-4 rounded-xl flex items-center justify-between text-[15px] font-medium ${
                    i === 0 ? 'bg-brand text-white hover:brightness-110' : 'border border-ink-600 hover:border-white/40'
                  }`}
                >
                  <span className="flex items-center gap-2">{t('event.tickets', { source: sourceLabel(ticket.source) })}<ArrowUpLeft size={16} className="ltr:-scale-x-100" /></span>
                  {priceLabel(ticket) && <span className="font-num text-[13px]">{priceLabel(ticket)}</span>}
                </a>
              ))}
            </div>
          )}
          {festival.website && (
            <a href={festival.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-white mt-3">
              {t('event.website')} <ArrowUpLeft size={14} className="ltr:-scale-x-100" />
            </a>
          )}

          <div className="flex items-baseline justify-between mt-9 mb-1">
            <h3 className="text-[17px] font-semibold">{t('event.groups')}</h3>
            <span className="font-num text-[11px] text-muted">{t('event.members')}</span>
          </div>
          <ul className="border-t hairline">
            {groups.map((group) => <GroupRow key={group.id} festival={festival} group={group} onOpenChat={onOpenChat} />)}
          </ul>
        </div>
      </div>
    </div>
  )
}
