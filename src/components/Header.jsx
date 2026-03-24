import { Search, Store, User, Bell } from 'lucide-react'

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4" dir="rtl">

          {/* RIGHT side: Logo + divider + Search + Create Store button */}
          <div className="flex items-center gap-3 flex-1 min-w-0">

            {/* Logo */}
            <div className="flex items-center gap-0.5 shrink-0 select-none">
              <span className="text-2xl font-black text-green-600 tracking-tight leading-none">Drop</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">Price</span>
              <span className="w-2 h-2 rounded-full bg-green-500 mb-3 mr-0.5 animate-pulse inline-block" />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 shrink-0 hidden sm:block" />

            {/* Search */}
            <div className="relative flex-1 max-w-xs hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                dir="rtl"
              />
            </div>

            {/* Create Store Button */}
            <button className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md shadow-green-200 hover:shadow-green-300 hover:shadow-lg shrink-0">
              <Store className="w-4 h-4" />
              <span>יצירת חנות</span>
            </button>
          </div>

          {/* LEFT side: Notification bell + User Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors hidden sm:block">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            {/* User Avatar */}
            <button className="group flex items-center gap-2.5 p-1.5 hover:bg-gray-50 rounded-xl transition-all duration-200">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="hidden md:block text-right leading-tight">
                <p className="text-xs font-semibold text-gray-700">אריאל כהן</p>
                <p className="text-xs text-green-600 font-medium">חבר פרימיום ✦</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile row: Search + Create Store */}
        <div className="mt-3 flex gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              dir="rtl"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-green-600 active:bg-green-800 text-white px-3 py-2 rounded-xl text-sm font-bold shrink-0 shadow-md shadow-green-200">
            <Store className="w-4 h-4" />
            <span>חנות</span>
          </button>
        </div>
      </div>
    </header>
  )
}
