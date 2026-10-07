import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpLeft, RefreshCw } from 'lucide-react'
import { useChat } from '../chat/ChatContext'
import { useIsAdmin } from '../chat/admin'
import { useCatalog } from '../data/CatalogContext'
import { findGroup } from '../data/groups'
import EventAvatar from './EventAvatar'
import UserAvatar from './UserAvatar'

const CONSOLE = 'https://console.firebase.google.com/project/festichat-e3f5f'
// One series, so one colour: a darker step of the accent that passes the
// dark-surface lightness band (the bright accent is too light for a filled mark).
const BAR = '#7aa61a'
const compact = new Intl.NumberFormat('he-IL', { notation: 'compact', maximumFractionDigits: 1 })
const plain = new Intl.NumberFormat('he-IL')
// Full figures until they get long; 2,963 shouldn't read as "3K".
const tileValue = (n) => (n >= 10000 ? compact : plain).format(n)

function StatTile({ label, value, hero = false, note }) {
  return (
    <div className={`rounded-lg border hairline bg-ink-800 p-4 ${hero ? 'col-span-2' : ''}`}>
      <p className="text-[13px] text-muted">{label}</p>
      <p className={`font-semibold tracking-tight mt-1 ${hero ? 'text-5xl' : 'text-[28px]'}`} title={value == null ? 'לא זמין כרגע' : undefined}>
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
    <ul className="flex flex-col gap-2.5" role="table" aria-label="אירועים לפי מדינה">
      {rows.map((row) => (
        <li key={row.label} role="row" className="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3" title={`${row.label}: ${plain.format(row.value)} אירועים`}>
          <span role="cell" className="text-[13px] truncate">{row.label}</span>
          <span role="cell" className="h-2.5 rounded-sm bg-ink-700 overflow-hidden" aria-hidden="true">
            <span className="block h-full rounded-sm" style={{ width: `${(row.value / max) * 100}%`, background: BAR }} />
          </span>
          <span role="cell" className="font-num text-[12px] text-white/80 text-left tabular-nums">{plain.format(row.value)}</span>
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
    return rest ? [...top, { label: 'אחר', value: rest }] : top
  }, [catalog.items])

  if (!isAdmin) {
    return (
      <div className="py-20 text-center">
        <p className="font-medium">אין גישה</p>
        <p className="text-sm text-muted mt-1">העמוד הזה זמין רק למנהל האתר.</p>
        <button type="button" onClick={onBack} className="mt-6 h-10 px-5 rounded-md border border-ink-600">חזרה</button>
      </div>
    )
  }

  const festivals = catalog.items.filter((f) => f.kind === 'festival').length
  const groups = topGroups.map((g) => ({ ...g, ...findGroup(g.id, catalog.byId, myGroups) })).filter((g) => g.festival)

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={onBack} className="w-9 h-9 -mr-2 flex items-center justify-center" aria-label="חזרה"><ArrowRight size={20} /></button>
        <h1 className="text-[22px] font-semibold tracking-tight flex-1">לוח ניהול</h1>
        <button type="button" onClick={load} disabled={loading} className="w-9 h-9 flex items-center justify-center text-muted hover:text-white disabled:opacity-40" aria-label="רענון">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <p className="text-[12px] text-muted mb-5">
        {loadedAt ? `עודכן ${loadedAt.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}` : 'טוען…'}
        {service?.mode === 'local' && ' · מצב תצוגה: נתונים מהמכשיר הזה בלבד'}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <StatTile hero label="משתמשים רשומים" value={stats?.users} note={stats?.newUsers != null ? `${plain.format(stats.newUsers)} חדשים ב-7 הימים האחרונים` : null} />
        <StatTile label="קבוצות עם חברים" value={stats?.groups} />
        <StatTile label="קבוצות פעילות השבוע" value={stats?.activeGroups} />
        <StatTile label="הודעות שנשלחו" value={stats?.messages} />
        <StatTile label="אירועים באתר" value={catalog.loaded ? catalog.items.length : null} note={catalog.loaded ? `${plain.format(festivals)} פסטיבלים` : null} />
      </div>

      <Section title="נרשמו לאחרונה">
        {stats?.recentUsers?.length ? (
          <ul className="border-t hairline">
            {stats.recentUsers.map((u) => (
              <li key={u.uid} className="flex items-center gap-3 py-2.5 border-b hairline">
                <UserAvatar name={u.name} photo={u.photo} size="sm" />
                <span className="flex-1 min-w-0 truncate">{u.name}</span>
                <span className="font-num text-[11px] text-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }) : ''}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">{stats ? 'עוד אין נרשמים עם תאריך הרשמה.' : '…'}</p>}
      </Section>

      <Section title="הקבוצות הגדולות" meta="לפי מספר חברים">
        {groups.length ? (
          <ul className="border-t hairline">
            {groups.map((g) => (
              <li key={g.id}>
                <button type="button" onClick={() => onOpenChat(g.id)} className="w-full flex items-center gap-3 py-2.5 border-b hairline text-right">
                  <EventAvatar festival={g.festival} size="sm" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] truncate">{g.group.title}</span>
                    <span className="block text-[12px] text-muted truncate" dir="auto">{g.festival.name}</span>
                  </span>
                  <span className="font-num text-[12px] text-white/80">{plain.format(g.memberCount)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted">עוד אין קבוצות עם חברים.</p>}
      </Section>

      <Section title="אירועים לפי מדינה" meta={catalog.loaded ? `${plain.format(catalog.items.length)} סה״כ` : null}>
        {byCountry.length ? <BarList rows={byCountry} /> : <p className="text-sm text-muted">…</p>}
      </Section>

      <Section title="עוד נתונים ב-Firebase">
        <div className="flex flex-col border-t hairline">
          {[
            ['משתמשים', `${CONSOLE}/authentication/users`],
            ['מסד הנתונים', `${CONSOLE}/firestore/data`],
            ['מבקרים באתר (Analytics)', `${CONSOLE}/analytics`],
          ].map(([label, href]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-3 border-b hairline hover:text-accent">
              {label} <ArrowUpLeft size={16} />
            </a>
          ))}
        </div>
      </Section>
    </>
  )
}
