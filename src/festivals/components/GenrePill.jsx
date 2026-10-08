import { GENRES } from '../data/festivals'
import { t } from '../i18n'

const COLORS = {
  electronic: 'bg-violet-600',
  rock: 'bg-rose-600',
  pop: 'bg-pink-600',
  hiphop: 'bg-orange-600',
  indie: 'bg-teal-600',
  jazz: 'bg-sky-600',
  metal: 'bg-zinc-600',
  afro: 'bg-emerald-600',
}

// Coloured tag with the event's main genre, or its kind when the genre is unknown.
export default function GenrePill({ festival }) {
  const genre = festival.genres?.find((g) => COLORS[g])
  const label = genre ? GENRES[genre] : t(festival.kind === 'party' ? 'kind.oneParty' : 'kind.oneFestival')
  const color = genre ? COLORS[genre] : festival.kind === 'party' ? 'bg-fuchsia-600' : 'bg-indigo-600'
  return <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium text-white ${color}`}>{label}</span>
}
