import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, Image as ImageIcon, LogOut, Users } from 'lucide-react'
import { useChat, useProfile } from '../../chat/ChatContext'
import { membersLabel } from '../../utils'
import { t } from '../../i18n'
import EventAvatar from '../EventAvatar'
import UserAvatar from '../UserAvatar'

function MemberRow({ member, isMe, onOpenProfile }) {
  const profile = useProfile(member.uid)
  return (
    <li>
      <button type="button" onClick={() => onOpenProfile(member.uid, member.name)} className="w-full flex items-center gap-3 px-4 py-3 border-b hairline text-start hover:bg-white/[0.03]">
        <UserAvatar name={profile?.name ?? member.name} photo={profile?.photo} size="sm" />
        <span className="flex-1 min-w-0">
          <span className="block truncate">{profile?.name ?? member.name}</span>
          {profile?.bio && <span className="block text-[12px] text-muted truncate" dir="auto">{profile.bio}</span>}
        </span>
        {isMe && <span className="text-xs text-muted">{t('common.you')}</span>}
      </button>
    </li>
  )
}

export default function GroupInfo({ festival, group, messages, memberCount, isMember, onOpenImage, onJumpTo, onLeave, onClose, onOpenProfile }) {
  const { service, user } = useChat()
  const [members, setMembers] = useState([])
  useEffect(() => (service ? service.onMembers(group.id, setMembers) : undefined), [service, group.id])

  const live = messages.filter((m) => !m.deleted)
  const images = live.filter((m) => m.type === 'image').reverse()
  const polls = live.filter((m) => m.type === 'poll').reverse()

  return (
    <div className="fixed inset-0 z-[65] bg-ink-900 overflow-y-auto animate-slide-up">
      <header className="sticky top-0 bg-ink-900/95 backdrop-blur flex items-center gap-3 px-3 h-14 border-b border-white/5">
        <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center" aria-label={t('common.back')}><ArrowRight size={22} className="ltr:-scale-x-100" /></button>
        <p className="font-semibold">{t('info.title')}</p>
      </header>
      <div className="max-w-2xl mx-auto p-5">
        <div className="flex flex-col items-center text-center">
          <EventAvatar festival={festival} size="lg" />
          <h2 className="font-semibold text-2xl mt-3"><span dir="auto">{festival.name}</span> · {group.title}</h2>
          <p className="text-white/50 text-sm mt-1">{group.description}</p>
          <p className="text-white/50 text-sm">{membersLabel(memberCount)}</p>
        </div>

        <section className="mt-8">
          <h3 className="flex items-center gap-2 font-semibold mb-3"><ImageIcon size={18} /> {t('info.images')} <span className="text-white/40 text-sm">{images.length}</span></h3>
          {images.length ? (
            <div className="grid grid-cols-3 gap-1">
              {images.map((m) => (
                <button key={m.id} type="button" onClick={() => onOpenImage(m)} className="aspect-square overflow-hidden rounded-lg">
                  <img src={m.image} alt={m.caption || t('common.image')} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : <p className="text-sm text-white/40">{t('info.noImages')}</p>}
        </section>

        {polls.length > 0 && (
          <section className="mt-8">
            <h3 className="flex items-center gap-2 font-semibold mb-3"><BarChart3 size={18} /> {t('info.polls')} <span className="text-white/40 text-sm">{polls.length}</span></h3>
            <ul className="flex flex-col gap-2">
              {polls.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => onJumpTo(m.id)} className="w-full text-start bg-ink-800 rounded-lg px-4 py-3">
                    <p className="font-semibold" dir="auto">{m.poll.question}</p>
                    <p className="text-xs text-white/50">{t('count.votes', { count: Object.keys(m.votes ?? {}).length })} · {m.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h3 className="flex items-center gap-2 font-semibold mb-3"><Users size={18} /> {t('info.members')} <span className="text-white/40 text-sm">{members.length}</span></h3>
          <ul className="bg-ink-800 rounded-lg overflow-hidden">
            {members.map((member) => (
              <MemberRow key={member.uid} member={member} isMe={member.uid === user?.uid} onOpenProfile={onOpenProfile} />
            ))}
            {members.length === 0 && <li className="px-4 py-3 text-sm text-white/40">{t('info.noMembers')}</li>}
          </ul>
        </section>

        {isMember && (
          <button type="button" onClick={onLeave} className="w-full mt-8 flex items-center justify-center gap-2 text-rose-400 bg-ink-800 rounded-lg py-3.5">
            <LogOut size={18} /> {t('info.leave')}
          </button>
        )}
      </div>
    </div>
  )
}
