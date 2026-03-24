import { Search, Store, User, Bell, LayoutDashboard, Zap } from 'lucide-react'

export default function Header({ searchQuery, setSearchQuery, myGroupsCount = 0, onNavigate }) {
  return (
    <header className="sticky top-0 z-50"
      style={{
        background: 'rgba(5,8,16,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,255,136,0.12)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
      }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4" dir="rtl">

          {/* RIGHT: Logo + Search + Create Store */}
          <div className="flex items-center gap-3 flex-1 min-w-0">

            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-0.5 shrink-0 select-none hover:opacity-85 transition-opacity"
            >
              <span className="text-2xl font-black leading-none"
                style={{ color: '#00ff88', textShadow: '0 0 14px rgba(0,255,136,0.7)' }}>
                Drop
              </span>
              <span className="text-2xl font-black text-white leading-none">Price</span>
              <span className="w-2 h-2 rounded-full mb-3 mr-0.5 inline-block animate-pulse"
                style={{ background: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.9)' }} />
            </button>

            {/* Divider */}
            <div className="w-px h-7 hidden sm:block" style={{ background: 'rgba(0,255,136,0.2)' }} />

            {/* Search */}
            <div className="relative flex-1 max-w-xs hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0,255,136,0.5)' }} />
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-dark w-full pr-10 pl-4 py-2.5 rounded-xl text-sm"
                dir="rtl"
              />
            </div>

            {/* Create Store */}
            <button
              onClick={() => onNavigate('business')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 btn-neon"
            >
              <Store className="w-4 h-4" />
              <span>יצירת חנות</span>
            </button>
          </div>

          {/* LEFT: My Groups + Bell + Avatar */}
          <div className="flex items-center gap-1 shrink-0">

            {/* My Groups */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="relative hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold text-sm text-slate-400 hover:text-neon-green hover:bg-neon-green/5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>הקבוצות שלי</span>
              {myGroupsCount > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-dark-900"
                  style={{ background: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.6)' }}>
                  {myGroupsCount}
                </span>
              )}
            </button>

            {/* Bell */}
            <button className="relative p-2 rounded-xl transition-colors text-slate-500 hover:text-neon-green hover:bg-neon-green/5 hidden sm:flex items-center">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-dark-900"
                style={{ boxShadow: '0 0 6px rgba(239,68,68,0.7)' }} />
            </button>

            {/* Avatar */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="group flex items-center gap-2.5 p-1.5 rounded-xl transition-all hover:bg-neon-green/5"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #00ff88, #00b4ff)', boxShadow: '0 0 14px rgba(0,255,136,0.3)' }}>
                  <User className="w-5 h-5 text-dark-900" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2"
                  style={{ borderColor: '#050810', boxShadow: '0 0 6px rgba(0,255,136,0.8)' }} />
              </div>
              <div className="hidden md:block text-right leading-tight">
                <p className="text-xs font-semibold text-white">אריאל כהן</p>
                <p className="text-xs font-medium" style={{ color: '#00ff88' }}>
                  <Zap className="w-3 h-3 inline mb-0.5" /> פרו-גיימר
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile row */}
        <div className="mt-3 flex gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(0,255,136,0.5)' }} />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-dark w-full pr-10 pl-4 py-2.5 rounded-xl text-sm"
              dir="rtl"
            />
          </div>
          <button onClick={() => onNavigate('dashboard')}
            className="relative flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold shrink-0 text-slate-400"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <LayoutDashboard className="w-4 h-4" />
            {myGroupsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-dark-900"
                style={{ background: '#00ff88' }}>
                {myGroupsCount}
              </span>
            )}
          </button>
          <button onClick={() => onNavigate('business')}
            className="btn-neon flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold shrink-0">
            <Store className="w-4 h-4" />
            <span>חנות</span>
          </button>
        </div>
      </div>
    </header>
  )
}
