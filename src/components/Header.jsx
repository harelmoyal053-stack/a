import { useState } from 'react'
import { Search, Store, Bell, ShoppingCart, ChevronDown } from 'lucide-react'

export default function Header({ searchQuery, setSearchQuery }) {
  const [notifCount] = useState(3)
  const [cartCount] = useState(2)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4" dir="rtl">

          {/* Right: Logo + Search + Create Store */}
          <div className="flex items-center gap-3 flex-1">
            {/* Logo */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-0.5">
                <span className="text-2xl font-black text-green-600 tracking-tight leading-none">Drop</span>
                <span className="text-2xl font-black text-gray-800 tracking-tight leading-none">Price</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 mb-3 animate-pulse"></div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 shrink-0 hidden sm:block"></div>

            {/* Search */}
            <div className="relative flex-1 max-w-sm hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="חיפוש..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                dir="rtl"
              />
            </div>

            {/* Create Store Button */}
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-green-200 hover:shadow-green-300 hover:shadow-lg shrink-0 hidden sm:flex">
              <Store className="w-4 h-4" />
              <span>יצירת חנות</span>
            </button>
          </div>

          {/* Left: User Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart */}
            <button className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200">
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {notifCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <button className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">א</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-gray-700 leading-tight">אריאל כהן</p>
                <p className="text-xs text-gray-400 leading-tight">חבר פרימיום</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors hidden md:block" />
            </button>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="mt-3 flex gap-2 sm:hidden">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              dir="rtl"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-semibold shrink-0">
            <Store className="w-4 h-4" />
            <span>חנות</span>
          </button>
        </div>
      </div>
    </header>
  )
}
