import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useChat, useGroupMeta } from '../chat/ChatContext'
import { useCatalog } from '../data/CatalogContext'
import { findGroup, groupsFor } from '../data/groups'
import { isEnded, membersLabel } from '../utils'
import { t } from '../i18n'
import Carousel from './Carousel'
import EventAvatar from './EventAvatar'

const PAGE_SIZE = 50

// Groups ranked by members, plus the general groups of the next festivals as
// suggestions. Suggestions are labelled as such, never as "popular".
function usePopularGroups() {
  const { service, myGroups } = useChat()
  const { items, byId } = useCatalog()
  const [top, setTop] = useState([])

  useEffect(() => (service ? service.onTopGroups(PAGE_SIZE, setTop) : undefined), [service])

  return useMemo(() => {
    const ranked = top
      .map((g) => ({ ...g, ...findGroup(g.id, byId, myGroups) }))
      .filter((g) => g.festival)
    const rankedIds = new Set(ranked.map((g) => g.id))
    const suggested = items
      .filter((f) => f.kind === 'festival')
      .map((festival) => {
        const group = groupsFor(festival)[0]
        return { id: group.id, memberCount: 0, festival, group }
      })
      .filter((g) => !rankedIds.has(g.id))
      .slice(0, PAGE_SIZE)
    return { mode: ranked.length > 0 ? 'popular' : 'suggested', ranked, suggested }
  }, [top, items, byId, myGroups])
}

function MemberCount({ count }) {
  return count > 0
    ? <span className="flex items-center gap-1.5 text-[12px] text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-online" />{membersLabel(count)}</span>
    : <span className="text-[12px] text-muted">{t('group.new')}</span>
}

function GroupCard({ id, memberCount, festival, group, onOpen }) {
  const { lastMessage } = useGroupMeta(id)
  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="snap-start shrink-0 w-[17rem] text-start rounded-2xl border border-white/[0.06] bg-ink-800 p-3.5 hover:border-white/15 transition-colors"
    >
      <span className="flex items-start gap-3">
        <span className="relative shrink-0">
          <EventAvatar festival={festival} round />
          {memberCount > 0 && <span className="absolute bottom-0 end-0 w-3 h-3 rounded-full bg-online ring-2 ring-ink-800" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold truncate">{group.title}</span>
          <span className="block text-[12px] text-muted truncate" dir="auto">{festival.name}</span>
          <span className="block text-[13px] text-white/75 mt-1.5 h-9 line-clamp-2 leading-snug">
            {lastMessage ? `${lastMessage.name}: ${lastMessage.text}` : group.description}
          </span>
        </span>
      </span>
      <span className="flex items-center justify-between mt-3">
        <MemberCount count={memberCount} />
        <ArrowLeft size={16} className="text-muted ltr:-scale-x-100" />
      </span>
    </button>
  )
}

// Home-screen row; always shown once events have loaded.
export default function PopularGroups({ onOpen, onSeeAll }) {
  const { mode, ranked, suggested } = usePopularGroups()
  // Top up a short popular list with suggestions so the row always has something to scroll.
  const groups = [...ranked, ...suggested].slice(0, 12)
  if (groups.length === 0) return null
  const popular = mode === 'popular'
  const total = ranked.reduce((sum, g) => sum + g.memberCount, 0)
  return (
    <Carousel
      title={popular ? t('popular.title') : t('popular.suggested')}
      subtitle={popular ? null : t('popular.suggestedSub')}
      badge={popular && (
        <span className="flex items-center gap-1.5 text-[13px] font-normal text-white/80">
          <span className="w-2 h-2 rounded-full bg-online" />{membersLabel(total)}
        </span>
      )}
      onSeeAll={onSeeAll}
    >
      {groups.map((g) => <GroupCard key={g.id} {...g} onOpen={onOpen} />)}
    </Carousel>
  )
}

function GroupRow({ rank, id, memberCount, festival, group, onOpen }) {
  const { myGroups, withUser, join } = useChat()
  const { lastMessage } = useGroupMeta(id)
  const isMember = Boolean(myGroups[id])
  const joinAndOpen = () =>
    withUser(async () => {
      await join(group, festival)
      onOpen(id)
    })

  return (
    <li className="flex items-center gap-3 py-3.5 border-b hairline">
      <span className="font-num text-[12px] text-muted w-6 shrink-0 text-center">{rank}</span>
      <button type="button" onClick={() => onOpen(id)} className="flex items-center gap-3 flex-1 min-w-0 text-start">
        <EventAvatar festival={festival} />
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] font-medium truncate">{group.title}</span>
          <span className="block text-[13px] text-muted truncate" dir="auto">{festival.name}</span>
          <span className="flex items-center gap-2 mt-1 min-w-0">
            <MemberCount count={memberCount} />
            {lastMessage && <span className="text-[12px] text-white/50 truncate">{lastMessage.name}: {lastMessage.text}</span>}
          </span>
        </span>
      </button>
      {isMember ? (
        <button type="button" onClick={() => onOpen(id)} className="shrink-0 h-8 px-3 rounded-xl border border-ink-600 text-[13px] hover:border-white/40">{t('common.open')}</button>
      ) : isEnded(festival) ? (
        <span className="shrink-0 text-[12px] text-muted px-2">{t('common.closed')}</span>
      ) : (
        <button type="button" onClick={joinAndOpen} className="shrink-0 h-8 px-3 rounded-xl bg-brand text-white text-[13px] font-medium hover:brightness-110">{t('common.join')}</button>
      )}
    </li>
  )
}

// Full ranked list, opened from the row's "see all".
export function PopularGroupsPage({ onOpen, onBack }) {
  const { mode, ranked, suggested } = usePopularGroups()
  const popular = mode === 'popular'
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={onBack} className="w-9 h-9 -ms-2 flex items-center justify-center" aria-label={t('common.back')}>
          <ArrowRight size={20} className="ltr:-scale-x-100" />
        </button>
        <h1 className="text-[22px] font-semibold tracking-tight flex-1">{popular ? t('popular.title') : t('popular.suggested')}</h1>
        <span className="font-num text-[11px] text-muted">{ranked.length + suggested.length}</span>
      </div>
      <p className="text-[13px] text-muted mb-4">
        {popular ? t('popular.rankNote') : t('popular.suggestedNote')}
      </p>
      {ranked.length > 0 && (
        <ul className="border-t hairline">
          {ranked.map((g, i) => <GroupRow key={g.id} rank={i + 1} {...g} onOpen={onOpen} />)}
        </ul>
      )}
      {popular && suggested.length > 0 && (
        <h2 className="text-[17px] font-semibold mt-9 mb-1">{t('popular.more')}</h2>
      )}
      {suggested.length > 0 && (
        <ul className="border-t hairline">
          {suggested.map((g, i) => <GroupRow key={g.id} rank={popular ? '·' : i + 1} {...g} onOpen={onOpen} />)}
        </ul>
      )}
    </>
  )
}
