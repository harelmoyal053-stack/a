import { useState, useEffect } from 'react'
import Header from './components/Header'
import DealCard from './components/DealCard'
import HeroSection from './components/HeroSection'
import StatsBar from './components/StatsBar'
import JoinModal from './components/JoinModal'
import './App.css'

const deals = [
  {
    id: 1,
    title: 'מארז חיתולים פמפרס XL',
    subtitle: '120 יחידות | מידה 4',
    emoji: '👶',
    bgColor: 'from-blue-50 to-blue-100',
    accentColor: 'bg-blue-500',
    currentPrice: 89,
    originalPrice: 149,
    nextPrice: 69,
    priceTiers: [
      { buyers: 0, price: 149 },
      { buyers: 10, price: 89 },
      { buyers: 25, price: 69 },
      { buyers: 50, price: 55 },
    ],
    currentBuyers: 18,
    targetBuyers: 25,
    timeLeft: '02:45:10',
    category: 'תינוקות',
    badge: 'פופולרי',
    badgeColor: 'bg-blue-500',
    savings: 60,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    title: 'מגש פיצה ענקי 50 ס"מ',
    subtitle: 'עם כל התוספות | 4 חתיכות',
    emoji: '🍕',
    bgColor: 'from-orange-50 to-orange-100',
    accentColor: 'bg-orange-500',
    currentPrice: 45,
    originalPrice: 89,
    nextPrice: 35,
    priceTiers: [
      { buyers: 0, price: 89 },
      { buyers: 5, price: 45 },
      { buyers: 15, price: 35 },
      { buyers: 30, price: 28 },
    ],
    currentBuyers: 9,
    targetBuyers: 15,
    timeLeft: '01:22:45',
    category: 'מזון',
    badge: 'מבצע חם',
    badgeColor: 'bg-orange-500',
    savings: 44,
    rating: 4.9,
    reviews: 567,
  },
  {
    id: 3,
    title: 'דלק 30 ליטר בנזין 95',
    subtitle: 'תקף בכל תחנות פז | הזמנה מראש',
    emoji: '⛽',
    bgColor: 'from-yellow-50 to-yellow-100',
    accentColor: 'bg-yellow-500',
    currentPrice: 142,
    originalPrice: 198,
    nextPrice: 125,
    priceTiers: [
      { buyers: 0, price: 198 },
      { buyers: 20, price: 142 },
      { buyers: 50, price: 125 },
      { buyers: 100, price: 110 },
    ],
    currentBuyers: 37,
    targetBuyers: 50,
    timeLeft: '04:10:22',
    category: 'תחבורה',
    badge: 'חוסך כסף',
    badgeColor: 'bg-yellow-600',
    savings: 56,
    rating: 4.7,
    reviews: 891,
  },
  {
    id: 4,
    title: 'ארגז פירות טריים עונתיים',
    subtitle: '10 ק"ג | ישיר מהחקלאי',
    emoji: '🍎',
    bgColor: 'from-red-50 to-red-100',
    accentColor: 'bg-red-500',
    currentPrice: 65,
    originalPrice: 110,
    nextPrice: 52,
    priceTiers: [
      { buyers: 0, price: 110 },
      { buyers: 8, price: 65 },
      { buyers: 20, price: 52 },
      { buyers: 40, price: 42 },
    ],
    currentBuyers: 14,
    targetBuyers: 20,
    timeLeft: '00:58:33',
    category: 'מזון',
    badge: 'כמעט הגענו!',
    badgeColor: 'bg-green-600',
    savings: 45,
    rating: 4.6,
    reviews: 312,
  },
  {
    id: 5,
    title: 'ציוד כושר - כדור כוח',
    subtitle: '20 ק"ג | איכות מקצועית',
    emoji: '🏋️',
    bgColor: 'from-purple-50 to-purple-100',
    accentColor: 'bg-purple-500',
    currentPrice: 189,
    originalPrice: 320,
    nextPrice: 159,
    priceTiers: [
      { buyers: 0, price: 320 },
      { buyers: 15, price: 189 },
      { buyers: 30, price: 159 },
      { buyers: 60, price: 139 },
    ],
    currentBuyers: 22,
    targetBuyers: 30,
    timeLeft: '05:30:00',
    category: 'ספורט',
    badge: 'חדש',
    badgeColor: 'bg-purple-500',
    savings: 131,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 6,
    title: 'חבילת קפה 1 ק"ג פרימיום',
    subtitle: 'קפה אתיופי | קלייה בינונית',
    emoji: '☕',
    bgColor: 'from-amber-50 to-amber-100',
    accentColor: 'bg-amber-700',
    currentPrice: 78,
    originalPrice: 135,
    nextPrice: 62,
    priceTiers: [
      { buyers: 0, price: 135 },
      { buyers: 12, price: 78 },
      { buyers: 25, price: 62 },
      { buyers: 50, price: 49 },
    ],
    currentBuyers: 19,
    targetBuyers: 25,
    timeLeft: '03:15:07',
    category: 'מזון',
    badge: 'מועדפים',
    badgeColor: 'bg-amber-700',
    savings: 57,
    rating: 4.9,
    reviews: 445,
  },
]

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('הכל')
  const [joinedDeals, setJoinedDeals] = useState(new Set())
  const [modalDeal, setModalDeal] = useState(null)
  const [timers, setTimers] = useState({})

  useEffect(() => {
    const initialTimers = {}
    deals.forEach(deal => {
      initialTimers[deal.id] = deal.timeLeft
    })
    setTimers(initialTimers)

    const interval = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(id => {
          updated[id] = decrementTime(updated[id])
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const decrementTime = (timeStr) => {
    const [h, m, s] = timeStr.split(':').map(Number)
    let totalSeconds = h * 3600 + m * 60 + s - 1
    if (totalSeconds < 0) totalSeconds = 0
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const categories = ['הכל', ...new Set(deals.map(d => d.category))]

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.includes(searchQuery) || deal.subtitle.includes(searchQuery)
    const matchesCategory = selectedCategory === 'הכל' || deal.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleJoin = (deal) => {
    setModalDeal(deal)
  }

  const confirmJoin = (deal) => {
    setJoinedDeals(prev => new Set([...prev, deal.id]))
    setModalDeal(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 font-['Rubik',Arial,sans-serif]" dir="rtl">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <StatsBar />
      <HeroSection />

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 pb-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-row-reverse">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex items-center gap-3 justify-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">עסקאות פעילות</h2>
            <p className="text-sm text-gray-500">הצטרף עכשיו לפני שהמחיר עולה</p>
          </div>
          <div className="w-1 h-10 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Deals Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-500">לא נמצאו עסקאות התואמות לחיפוש</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                timeLeft={timers[deal.id] || deal.timeLeft}
                isJoined={joinedDeals.has(deal.id)}
                onJoin={handleJoin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl font-black text-green-400">Drop</span>
            <span className="text-2xl font-black text-white">Price</span>
          </div>
          <p className="text-gray-400 text-sm">חסכו יחד, קנו חכם יותר 🛍️</p>
          <p className="text-gray-600 text-xs mt-3">© 2026 DropPrice. כל הזכויות שמורות.</p>
        </div>
      </footer>

      {/* Modal */}
      {modalDeal && (
        <JoinModal deal={modalDeal} onConfirm={confirmJoin} onClose={() => setModalDeal(null)} />
      )}
    </div>
  )
}

export default App
