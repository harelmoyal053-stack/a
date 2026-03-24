import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Filter } from 'lucide-react'
import Header from './components/Header'
import DealCard from './components/DealCard'
import HeroSection from './components/HeroSection'
import StatsBar from './components/StatsBar'
import JoinModal from './components/JoinModal'
import LiveTicker from './components/LiveTicker'
import InviteButton from './components/InviteButton'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import DashboardPage from './pages/DashboardPage'
import BusinessPortalPage from './pages/BusinessPortalPage'
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
      { buyers: 0,  price: 149 },
      { buyers: 10, price: 89  },
      { buyers: 25, price: 69  },
      { buyers: 50, price: 55  },
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
      { buyers: 0,  price: 89 },
      { buyers: 5,  price: 45 },
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
      { buyers: 0,   price: 198 },
      { buyers: 20,  price: 142 },
      { buyers: 50,  price: 125 },
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
      { buyers: 0,  price: 110 },
      { buyers: 8,  price: 65  },
      { buyers: 20, price: 52  },
      { buyers: 40, price: 42  },
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
      { buyers: 0,  price: 320 },
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
      { buyers: 0,  price: 135 },
      { buyers: 12, price: 78  },
      { buyers: 25, price: 62  },
      { buyers: 50, price: 49  },
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

function useNav() {
  const [stack, setStack] = useState([{ page: 'home' }])
  const current  = stack[stack.length - 1]
  const navigate = (page, data = {}) => { setStack(s => [...s, { page, ...data }]); window.scrollTo({ top: 0, behavior: 'instant' }) }
  const goBack   = () => { setStack(s => s.length > 1 ? s.slice(0, -1) : s); window.scrollTo({ top: 0, behavior: 'instant' }) }
  const goHome   = () => { setStack([{ page: 'home' }]); window.scrollTo({ top: 0, behavior: 'instant' }) }
  return { current, navigate, goBack, goHome }
}

function App() {
  const { current, navigate, goBack } = useNav()
  const [searchQuery,       setSearchQuery]       = useState('')
  const [selectedCategory,  setSelectedCategory]  = useState('הכל')
  const [joinedDeals,       setJoinedDeals]       = useState(new Set())
  const [myGroups,          setMyGroups]          = useState([])
  const [modalDeal,         setModalDeal]         = useState(null)
  const [timers,            setTimers]            = useState({})

  useEffect(() => {
    const init = {}
    deals.forEach(d => { init[d.id] = d.timeLeft })
    setTimers(init)
    const iv = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(id => { next[id] = tick(next[id]) })
        return next
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  const tick = (t) => {
    const [h, m, s] = t.split(':').map(Number)
    let total = h * 3600 + m * 60 + s - 1
    if (total < 0) total = 0
    return [
      String(Math.floor(total / 3600)).padStart(2, '0'),
      String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
      String(total % 60).padStart(2, '0'),
    ].join(':')
  }

  const categories  = ['הכל', ...new Set(deals.map(d => d.category))]
  const filteredDeals = deals.filter(d => {
    const q = searchQuery.trim()
    return (!q || d.title.includes(q) || d.subtitle.includes(q)) &&
      (selectedCategory === 'הכל' || d.category === selectedCategory)
  })

  const handleCardJoin       = (deal) => setModalDeal(deal)
  const handleDetailJoin     = (deal) => navigate('checkout', { deal })
  const confirmModalJoin     = (deal) => {
    setJoinedDeals(prev => new Set([...prev, deal.id]))
    setMyGroups(prev => [...prev, { ...deal, joinedAt: new Date().toLocaleDateString('he-IL'), status: 'active' }])
    setModalDeal(null)
  }
  const handleCheckoutSuccess = (deal, orderData) => {
    setJoinedDeals(prev => new Set([...prev, deal.id]))
    setMyGroups(prev => prev.find(g => g.id === deal.id) ? prev : [...prev, { ...deal, joinedAt: new Date().toLocaleDateString('he-IL'), status: 'active', orderData }])
  }

  const { page, deal } = current

  // ── Sub-pages ──────────────────────────────────────────────────────────────
  if (page === 'product' && deal)  return <ProductDetailPage deal={deal} timeLeft={timers[deal.id] || deal.timeLeft} isJoined={joinedDeals.has(deal.id)} onJoin={handleDetailJoin} onBack={goBack} />
  if (page === 'checkout' && deal) return <CheckoutPage deal={deal} onSuccess={handleCheckoutSuccess} onBack={goBack} />
  if (page === 'dashboard')        return <DashboardPage myGroups={myGroups} onBack={goBack} />
  if (page === 'business')         return <BusinessPortalPage onBack={goBack} onSubmit={() => {}} />

  // ── Home ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#050810' }} dir="rtl">
      {/* Live ticker – above everything */}
      <LiveTicker />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        myGroupsCount={myGroups.length}
        onNavigate={navigate}
      />
      <StatsBar />
      <HeroSection />

      {/* Category filter */}
      <div className="max-w-7xl mx-auto px-4 pb-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-row-reverse">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'text-dark-900'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={selectedCategory === cat ? {
                background: 'linear-gradient(135deg, #00ff88, #00b4ff)',
                boxShadow: '0 0 18px rgba(0,255,136,0.4)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 pb-5">
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <h2 className="text-2xl font-black text-white">עסקאות פעילות</h2>
            <p className="text-sm text-slate-500">הצטרף עכשיו לפני שהמחיר יעלה</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)' }}>
            <Flame className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-black text-neon-green">{filteredDeals.length}</span>
            <span className="text-xs text-slate-400">פעילות</span>
          </div>
        </div>
      </div>

      {/* Deals grid */}
      <main className="max-w-7xl mx-auto px-4 pb-14">
        <AnimatePresence mode="wait">
          {filteredDeals.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-xl font-semibold text-slate-400">לא נמצאו עסקאות</p>
              <p className="text-slate-600 mt-1">נסה חיפוש אחר</p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            >
              {filteredDeals.map(d => (
                <motion.div
                  key={d.id}
                  variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }}
                >
                  <DealCard
                    deal={d}
                    timeLeft={timers[d.id] || d.timeLeft}
                    isJoined={joinedDeals.has(d.id)}
                    onJoin={handleCardJoin}
                    onCardClick={() => navigate('product', { deal: d })}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(2,4,8,0.95)', borderTop: '1px solid rgba(0,255,136,0.1)' }}
        className="py-10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-0.5 mb-3">
            <span className="text-2xl font-black" style={{ color: '#00ff88', textShadow: '0 0 14px rgba(0,255,136,0.6)' }}>Drop</span>
            <span className="text-2xl font-black text-white">Price</span>
            <span className="w-2 h-2 rounded-full mr-1 inline-block animate-pulse"
              style={{ background: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.9)' }} />
          </div>
          <p className="text-slate-500 text-sm mb-1">חסכו יחד, קנו חכם יותר 🛍️</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            {['תנאי שימוש', 'פרטיות', 'צור קשר', 'עזרה'].map(l => (
              <button key={l} className="text-xs text-slate-600 hover:text-neon-green transition-colors">{l}</button>
            ))}
          </div>
          <p className="text-slate-700 text-xs mt-4">© 2026 DropPrice. כל הזכויות שמורות.</p>
        </div>
      </footer>

      {/* Quick-join modal */}
      {modalDeal && (
        <JoinModal deal={modalDeal} onConfirm={confirmModalJoin} onClose={() => setModalDeal(null)} />
      )}

      {/* Floating invite button */}
      <InviteButton />
    </div>
  )
}

export default App
