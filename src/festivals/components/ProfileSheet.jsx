import { useEffect } from 'react'
import { AtSign, X } from 'lucide-react'
import { useProfile } from '../chat/ChatContext'
import { instagramUrl } from '../utils'
import { t } from '../i18n'
import UserAvatar from './UserAvatar'

// Another member's public profile. `fallbackName` covers profiles we can't load.
export default function ProfileSheet({ uid, fallbackName, onClose }) {
  const profile = useProfile(uid)
  const name = profile?.name ?? fallbackName

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-ink-800 w-full sm:max-w-sm rounded-t-lg sm:rounded-lg border hairline p-6 animate-slide-up">
        <div className="flex justify-end -mt-2 -me-2">
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center" aria-label={t('common.close')}><X size={20} className="text-muted" /></button>
        </div>
        <div className="flex flex-col items-center text-center -mt-4">
          <UserAvatar name={name} photo={profile?.photo} size="xl" />
          <p className="text-xl font-semibold mt-4">{name}</p>
          {profile?.bio && <p className="text-[14px] text-white/75 mt-2 leading-relaxed whitespace-pre-wrap" dir="auto">{profile.bio}</p>}
          {!profile && <p className="text-[13px] text-muted mt-2">{t('profile.noDetails')}</p>}
        </div>
        {profile?.instagram && (
          <a
            href={instagramUrl(profile.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 h-11 rounded-md border border-ink-600 hover:border-white/40 flex items-center justify-center gap-2 text-[15px]"
          >
            <AtSign size={16} /> <span dir="ltr">{profile.instagram}</span> {t('profile.onInstagram')}
          </a>
        )}
      </div>
    </div>
  )
}
