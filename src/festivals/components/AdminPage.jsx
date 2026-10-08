import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpLeft, RefreshCw } from 'lucide-react'
import { useChat } from '../chat/ChatContext'
import { useIsAdmin } from '../chat/admin'
import { useCatalog } from '../data/CatalogContext'
import { findGroup } from '../data/groups'
import { locale, t } from '../i18n'
import AdminInbox from './AdminInbox'
import EventAvatar from './EventAvatar'
import UserAvatar from './UserAvatar'

const CONSOLE = 'https://console.firebase.google.com/project/festichat-e3f5f'
// One series, so one colour: a darker step of the accent that passes the
// dark-surface lightness band (the bright accent is too light for a filled mark).
const BAR = '#8b5cf6'
const plain = (n) => new Intl.NumberFormat(locale()).format(n)
// Full figures until they get long; 2,963 shouldn't read as "3K".
const tileValue = (n) => (n >= 10000 ? new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }).format(n) : plain(n))

function StatTile({ label, value, hero = false, note }) {
  return (
    <div className={`rounded-2xl border hairline bg-ink-800 p-4 ${hero ? 'col-span-2' : ''}`}>
      <p className="text-[13px] text-muted">{label}</p>
      <p className={`font-semibold tracking-tight mt-1 ${hero ? 'text-5xl' : 'text-[28px]'}`} title={value == null ? t('admin.unavailable') : undefined}>
        {value == null ? '–' : tileValue(value)}
      </p>
      {note && <p className="text-[12px] text-muted mt-1">{note}</p>}
    </div>
  )
}

function Section({ title, meta, children }) {
  return (
    <section className="mt-9">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-[17px] font-semibold">{title}</h2>
        {meta && <span className="text-[12px] text-muted">{meta}</span>}
      </div>
      {children}
    </section>
  )
}

// Ranked horizontal bars, one series. Value labels stay in text ink.
function BarList({ rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="flex flex-col gap-2.5" role="table" aria-label={t('admin.byCountry')}>
      {rows.map((row) => (
        <li key={row.label} role="row" className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3" title={`${row.label}: ${t('count.events', { count: row.value })}`}>
          <span role="cell" className="text-[13px] truncate">{row.label}</span>
          <span role="cell" className="h-2.5 rounded-md bg-ink-700 overflow-hidden" aria-hidden="true">
            <span className="block h-full rounded-md" style={{ width: `${(row.value / max) * 100}%`, background: BAR }} />
          </span>
          <span role="cell" className="font-num text-[12px] text-white/80 text-end tabular-nums">{plain(row.value)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AdminPage({ onBack, onOpenChat }) {
  const { service, myGroups } = useChat()
  const isAdmin = useIsAdmin()
  const catalog = useCatalog()
  const [stats, setStats] = useState(null)
  const [loadedAt, setLoadedAt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [topGroups, setTopGroups] = useState([])

  const load = useCallback(async () => {
    if (!service) return
    setLoading(true)
    try {
      setStats(await service.getAdminStats())
      setLoadedAt(new Date())
    } finally {
      setLoading(false)
    }
  }, [service])

  useEffect(() => {
    if (isAdmin) load()
  }, [isAdmin, load])

  useEffect(() => (service && isAdmin ? service.onTopGroups(5, setTopGroups) : undefined), [service, isAdmin])

  const byCountry = useMemo(() => {
    const counts = {}
    for (const item of catalog.items) counts[item.country] = (counts[item.country] ?? 0) + 1
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, 7).map(([label, value]) => ({ label, value }))
    const rest = sorted.slice(7).reduce((n, [, v]) => n + v, 0)
    return rest ? [...top, { label: t('admin.other'), value: rest }] : top
  }, [catalog.items])

  if (!isAdmin) {
    return (
      <div className="py-20 text-center">
        <p className="font-medium">{t('admin.noAccess')}</p>
        <p className="text-sm text-muted mt-1">{t('admin.noAccessBody')}</p>
        <button type="button" onClick={onBack} className="mt-6 h-10 px-5 rounded-xl border border-ink-600">{t('common.back')}</button>
      </div>
    )
  }

  const festivals = catalog.items.filter((f) => f.kind === 'festival').length
  const groups = topGroups.map((g) => ({ ...g, ...findGroup(g.id, catalog.byId, myGroups) })).filter((g) => g.festival)

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={onBack} className="w-9 h-9 -ms-2 flex items-center justify-center" aria-label={t('common.back')}><ArrowRight size={20} className="ltr:-scale-x-100" /></button>
        <h1 className="text-[22px] font-semibold tracking-tight flex-1">{t('admin.title')}</h1>
        <button type="button" onClick={load} disabled={loading} className="w-9 h-9 flex items-center justify-center text-muted hover:text-white disabled:opacity-40" aria-label={t('common.refresh')}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <p className="text-[12px] text-muted mb-5">
        {loadedAt ? t('admin.updated', { time: loadedAt.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' }) }) : t('common.loading')}
        {service?.mode === 'local' && ` · ${t('admin.previewNote')}`}
      </p>

      <AdminInbox />

      <div className="grid grid-cols-2 gap-2 mt-9">
        <StatTile hero label={t('admin.users')} value={stats?.users} note={stats?.newUsers != null ? t('admin.newUsers', { n: plain(stats.newUsers) }) : null} />
        <StatTile label={t('admin.groups')} value={stats?.groups} />
        <StatTile label={t('admin.activeGroups')} value={stats?.activeGroups} />
        <StatTile label={t('admin.messages')} value={stats?.messages} />
        <StatTile label={t('admin.events')} value={catalog.loaded ? catalog.items.length : null} note={catalog.loaded ? t('admin.festivals', { n: plain(festivals) }) : null} />
      </div>

      <Section title={t('admin.recent')}>
        {stats?.recentUsers?.length ? (
          <ul className="border-t hairline">
            {stats.recentUsers.map((u) => (
              <li key={u.uid} className="flex items-center gap-3 py-2.5 border-b hairline">
                <UserAvatar name={u.name} photo={u.photo} size="sm" />
                <span className="flex-1 min-w-0 truncate">{u.name}</span>
                <span className="font-num text-[11px] text-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString(locale(), { day: '2-digit', month: '2-digit' }) : ''}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{stats ? t('admin.noRecent') : '…'}</p>}
      </Section>

      <Section title={t('admin.biggest')} meta={t('admin.byMembers')}>
        {groups.length ? (
          <ul className="border-t hairline">
            {groups.map((g) => (
              <li key={g.id}>
                <button type="button" onClick={() => onOpenChat(g.id)} className="w-full flex items-center gap-3 py-2.5 border-b hairline text-start">
                  <EventAvatar festival={g.festival} size="sm" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] truncate">{g.group.title}</span>
                    <span className="block text-[12px] text-muted truncate" dir="auto">{g.festival.name}</span>
                  </span>
                  <span className="font-num text-[12px] text-white/80">{plain(g.memberCount)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{t('admin.noGroups')}</p>}
      </Section>

      <Section title={t('admin.byCountry')} meta={catalog.loaded ? t('admin.total', { n: plain(catalog.items.length) }) : null}>
        {byCountry.length ? <BarList rows={byCountry} /> : <p className="text-sm text-muted">…</p>}
      </Section>

      <Section title={t('admin.firebase')}>
        <div className="flex flex-col border-t hairline">
          {[
            [t('admin.linkUsers'), `${CONSOLE}/authentication/users`],
            [t('admin.linkDb'), `${CONSOLE}/firestore/data`],
            [t('admin.linkAnalytics'), `${CONSOLE}/analytics`],
          ].map(([label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-3 border-b hairline hover:text-accent">
              {label} <ArrowUpLeft size={16} className="ltr:-scale-x-100" />
            </a>
          ))}
        </div>
      </Section>
    </>
  )
}
