import { Search, Store, User, Bell, LayoutDashboard, LogIn, Home } from 'lucide-react'
import { getCachedUser } from '../utils/user'

export default function Header({ searchQuery, setSearchQuery, myGroupsCount = 0, onNavigate, onLogin, user: userProp }) {
  const user = userProp !== undefined ? userProp : getCachedUser()

  return (
    <header className="sticky top-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 16px rgba(21,92,52,0.07)',
      }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4" dir="rtl">

          {/* RIGHT: Logo + Search + Business */}
          <div className="flex items-center gap-3 flex-1 min-w-0">

            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 shrink-0 select-none hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-black leading-none" style={{ color: '#155c34' }}>Drop</span>
              <span className="text-2xl font-black leading-none" style={{ color: '#22a855' }}>Price</span>
              <span className="w-2 h-2 rounded-full mr-0.5 mb-3 inline-block"
                style={{ background: '#22a855' }} />
            </button>

            <div className="w-px h-6 hidden sm:block" style={{ background: '#e2e8f0' }} />

            {/* Search */}
            <div className="relative flex-1 max-w-xs hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-clean w-full pr-10 pl-4 py-2 rounded-xl text-sm"
                dir="rtl"
              />
            </div>

            {/* Business portal */}
            <button
              onClick={() => onNavigate('business')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0"
              style={{ background: '#f4fbf7', border: '1.5px solid #e2e8f0', color: '#155c34' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#155c34' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0' }}
            >
              <Store className="w-4 h-4" />
              <span>יצירת חנות</span>
            </button>
          </div>

          {/* LEFT: Dashboard + Bell + Login / Avatar */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Dashboard */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#155c34' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>הקבוצות שלי</span>
              {myGroupsCount > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: '#22a855' }}>
                  {myGroupsCount}
                </span>
              )}
            </button>

            {/* Bell */}
            <button className="relative p-2 rounded-xl transition-colors text-slate-400 hover:text-slate-700 hidden sm:flex items-center"
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Avatar / login */}
            {user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all"
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #155c34, #1e7a40)' }}>
                  {user.name?.[0] || <User className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-right leading-tight">
                  <p className="text-xs font-semibold" style={{ color: '#0d3320' }}>היי, {user.name?.split(' ')[0]}</p>
                  <p className="text-xs font-medium" style={{ color: '#22a855' }}>{user.userType === 'business' ? 'חשבון עסקי' : 'חבר פעיל'}</p>
                </div>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>כניסה</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile row */}
        <div className="mt-2.5 flex gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-clean w-full pr-10 pl-4 py-2 rounded-xl text-sm"
              dir="rtl"
            />
          </div>
          <button onClick={() => onNavigate('dashboard')}
            className="relative flex items-center px-3 py-2 rounded-xl text-sm font-bold shrink-0"
            style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#155c34' }}>
            <LayoutDashboard className="w-4 h-4" />
            {myGroupsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                style={{ background: '#22a855' }}>
                {myGroupsCount}
              </span>
            )}
          </button>
          <button onClick={() => onNavigate('business')}
            className="btn-navy flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold shrink-0">
            <Store className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
