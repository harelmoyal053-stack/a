import { useRef, useState } from 'react'
import { AtSign, Camera, LogOut, MessageCircle, Pencil } from 'lucide-react'
import { useChat } from '../chat/ChatContext'
import { compressAvatar } from '../chat/media'
import { instagramUrl, parseInstagram } from '../utils'
import UserAvatar from './UserAvatar'

const BIO_MAX = 160

function EditProfile({ user, onDone }) {
  const { updateProfile } = useChat()
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio ?? '')
  const [instagram, setInstagram] = useState(user.instagram ?? '')
  const [photo, setPhoto] = useState(user.photo ?? null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setPhoto(await compressAvatar(file))
    } catch {
      setError('לא הצלחנו לטעון את התמונה.')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    const handle = instagram.trim() ? parseInstagram(instagram) : ''
    if (handle === null) return setError('שם המשתמש באינסטגרם לא תקין.')
    if (!name.trim()) return setError('צריך שם.')
    setBusy(true)
    setError('')
    try {
      await updateProfile({ name: name.trim().slice(0, 30), bio: bio.trim().slice(0, BIO_MAX), instagram: handle, photo })
      onDone()
    } catch {
      setError('השמירה נכשלה. נסו שוב.')
      setBusy(false)
    }
  }

  const field = 'w-full bg-ink-800 border border-ink-600 rounded-md px-3 outline-none focus:border-white/40'
  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => fileRef.current.click()} className="relative" aria-label="החלפת תמונה">
          <UserAvatar name={name} photo={photo} size="xl" />
          <span className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center"><Camera size={15} /></span>
        </button>
        <div className="flex flex-col gap-1.5 text-[13px]">
          <button type="button" onClick={() => fileRef.current.click()} className="text-accent text-right">העלאת תמונה</button>
          {photo && <button type="button" onClick={() => setPhoto(null)} className="text-muted text-right">הסרת תמונה</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
      </div>

      <label className="block">
        <span className="text-[13px] text-muted">שם</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} className={`${field} h-11 mt-1.5`} />
      </label>
      <label className="block">
        <span className="flex justify-between text-[13px] text-muted">ביו <span className="font-num text-[11px]">{bio.length}/{BIO_MAX}</span></span>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={BIO_MAX} rows={3} placeholder="כמה מילים עליך: איזה מוזיקה, לאן נוסעים…" className={`${field} py-2.5 mt-1.5 resize-none`} />
      </label>
      <label className="block">
        <span className="text-[13px] text-muted">אינסטגרם</span>
        <span className={`${field} h-11 mt-1.5 flex items-center gap-2`} dir="ltr">
          <AtSign size={16} className="text-muted shrink-0" />
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} maxLength={60} placeholder="username" className="flex-1 bg-transparent outline-none" />
        </span>
      </label>

      {error && <p className="text-rose-400 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="flex-1 h-11 rounded-md bg-accent text-black font-medium disabled:opacity-50">{busy ? 'שומרים…' : 'שמירה'}</button>
        <button type="button" onClick={onDone} className="h-11 px-5 rounded-md border border-ink-600">ביטול</button>
      </div>
    </form>
  )
}

export default function ProfileTab({ onOpenChats }) {
  const { service, user, myGroups, withUser, signOut } = useChat()
  const [editing, setEditing] = useState(false)

  if (!user) {
    return (
      <div className="py-16 flex flex-col items-center text-center">
        <UserAvatar name="?" size="xl" />
        <h1 className="text-[22px] font-semibold mt-5">הפרופיל שלך</h1>
        <p className="text-sm text-muted mt-2 max-w-xs leading-relaxed">התחברו כדי להצטרף לקבוצות, לכתוב בהן, ולהראות לאחרים מי אתם.</p>
        <button type="button" onClick={() => withUser()} className="mt-6 h-11 px-6 rounded-md bg-white text-black font-medium">
          {service?.canUseGoogle ? 'התחברות עם Google' : 'התחברות'}
        </button>
      </div>
    )
  }

  if (editing) {
    return (
      <>
        <h1 className="text-[22px] font-semibold tracking-tight mb-6">עריכת פרופיל</h1>
        <EditProfile user={user} onDone={() => { setEditing(false); window.scrollTo({ top: 0 }) }} />
      </>
    )
  }

  const groupCount = Object.keys(myGroups).length
  return (
    <>
      <div className="flex flex-col items-center text-center pt-4">
        <UserAvatar name={user.name} photo={user.photo} size="xl" />
        <h1 className="text-[22px] font-semibold mt-4">{user.name}</h1>
        {user.bio
          ? <p className="text-[14px] text-white/75 mt-2 max-w-sm leading-relaxed whitespace-pre-wrap" dir="auto">{user.bio}</p>
          : <p className="text-[13px] text-muted mt-2">עוד אין ביו.</p>}
        {user.instagram && (
          <a href={instagramUrl(user.instagram)} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1 text-[14px] text-accent" dir="ltr">
            <AtSign size={15} />{user.instagram}
          </a>
        )}
        <button type="button" onClick={() => { setEditing(true); window.scrollTo({ top: 0 }) }} className="mt-6 h-10 px-5 rounded-md border border-ink-600 hover:border-white/40 flex items-center gap-2 text-[14px]">
          <Pencil size={15} /> עריכת פרופיל
        </button>
      </div>

      <div className="mt-10 border-t hairline">
        <button type="button" onClick={onOpenChats} className="w-full flex items-center justify-between py-4 border-b hairline">
          <span className="flex items-center gap-3"><MessageCircle size={18} strokeWidth={1.75} className="text-muted" /> הקבוצות שלי</span>
          <span className="font-num text-[13px] text-muted">{groupCount}</span>
        </button>
        <button type="button" onClick={() => signOut()} className="w-full flex items-center gap-3 py-4 border-b hairline text-rose-400">
          <LogOut size={18} strokeWidth={1.75} /> התנתקות
        </button>
      </div>
      {service?.mode === 'local' && (
        <p className="text-[12px] text-muted mt-6 leading-relaxed">מצב תצוגה: החשבון נשמר רק במכשיר הזה. אחרי חיבור השרת ההתחברות תהיה עם Google.</p>
      )}
    </>
  )
}
