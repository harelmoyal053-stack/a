import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, WifiOff, Loader2 } from 'lucide-react'

import Header         from './components/Header'
import DealCard       from './components/DealCard'
import HeroSection    from './components/HeroSection'
import StatsBar       from './components/StatsBar'
import JoinModal      from './components/JoinModal'
import LiveTicker     from './components/LiveTicker'
import InviteButton   from './components/InviteButton'
import PriceDropToast from './components/PriceDropToast'
import LoginModal     from './components/LoginModal'

import ProductDetailPage  from './pages/ProductDetailPage'
import CheckoutPage       from './pages/CheckoutPage'
import DashboardPage      from './pages/DashboardPage'
import BusinessPortalPage from './pages/BusinessPortalPage'
import RealEstateUrgency  from './components/RealEstateUrgency'
import LeadForm           from './components/LeadForm'
import HowItWorks         from './components/HowItWorks'
import FAQAccordion       from './components/FAQAccordion'

import { useDeals } from './hooks/useDeals'
import { useJoin  } from './hooks/useJoin'
import { capturePendingRef } from './utils/invite'

import './App.css'

// ── Navigation ─────────────────────────────────────────────────────────────────
function useNav() {
  const [stack, setStack] = useState([{ page: 'home' }])
  const current  = stack[stack.length - 1]
  const navigate = (page, data = {}) => { setStack(s => [...s, { page, ...data }]); window.scrollTo({ top: 0, behavior: 'instant' }) }
  const goBack   = () => { setStack(s => s.length > 1 ? s.slice(0, -1) : s); window.scrollTo({ top: 0, behavior: 'instant' }) }
  return { current, navigate, goBack }
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const { current, navigate, goBack } = useNav()

  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedCategory, setSelectedCategory] = useState('הכל')
  // Restore joined set from localStorage so button state survives refreshes
  const [joinedDeals, setJoinedDeals] = useState(() => {
    try {
      const raw = localStorage.getItem('dropprice_joined')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
  })
  const [myGroups,         setMyGroups]         = useState([])
  const [modalDeal,        setModalDeal]        = useState(null)
  const [priceDropToast,   setPriceDropToast]   = useState(null)
  const [loginOpen,        setLoginOpen]        = useState(false)
  const [loggedInUser,     setLoggedInUser]     = useState(() => {
    try { const r = localStorage.getItem('dropprice_user'); return r ? JSON.parse(r) : null } catch { return null }
  })

  // ── Capture ?ref=&deal= params from invite links on first mount ────────────
  useEffect(() => {
    const { dealId } = capturePendingRef()
    if (dealId && deals.length > 0) {
      const found = deals.find(d => d.id === dealId)
      if (found) navigate('product', { deal: found })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deals.length])

  // ── Price-drop handler (SSE + join response) ────────────────────────────────
  const handlePriceDrop = useCallback((payload) => {
    setPriceDropToast(payload)
  }, [])

  // ── Real data from backend ──────────────────────────────────────────────────
  const { deals, timers, loading, error, updateDeal } = useDeals({ onPriceDrop: handlePriceDrop })

  // ── Join logic ──────────────────────────────────────────────────────────────
  const handleJoinSuccess = useCallback((updatedDeal) => {
    // Persist joined state to localStorage so it survives page refreshes
    setJoinedDeals(prev => {
      const next = new Set([...prev, updatedDeal.id])
      try { localStorage.setItem('dropprice_joined', JSON.stringify([...next])) } catch (_) {}
      return next
    })
    setMyGroups(prev => {
      if (prev.find(g => g.id === updatedDeal.id)) return prev
      return [...prev, {
        ...updatedDeal,
        joinedAt: new Date().toLocaleDateString('he-IL'),
        status: 'active',
      }]
    })
    updateDeal(updatedDeal)
    // Do NOT close modal here — let JoinModal show its success step 2 first.
    // The modal's "מעולה, תודה!" button calls onClose which sets modalDeal(null).
  }, [updateDeal])

  const { join, joining } = useJoin({
    onSuccess:   handleJoinSuccess,
    onPriceDrop: handlePriceDrop,
  })

  // ── Category filter ─────────────────────────────────────────────────────────
  const categories    = ['הכל', ...new Set(deals.map(d => d.category))]
  const filteredDeals = deals.filter(d => {
    const q = searchQuery.trim()
    return (!q || d.title.includes(q) || (d.subtitle || '').includes(q)) &&
      (selectedCategory === 'הכל' || d.category === selectedCategory)
  })

  // ── From card → quick modal (home page join) ────────────────────────────────
  const handleCardJoin   = useCallback((deal) => setModalDeal(deal), [])
  // Return the promise so JoinModal can await the result and show API errors
  const confirmModalJoin = useCallback((deal) => join(deal), [join])

  // ── Checkout flow ───────────────────────────────────────────────────────────
  const handleDetailJoin      = useCallback((deal) => navigate('checkout', { deal }), [navigate])
  const handleCheckoutSuccess = useCallback((deal) => {
    setJoinedDeals(prev => new Set([...prev, deal.id]))
    setMyGroups(prev => prev.find(g => g.id === deal.id) ? prev : [
      ...prev,
      { ...deal, joinedAt: new Date().toLocaleDateString('he-IL'), status: 'active' },
    ])
  }, [])

  // ── Sub-pages ───────────────────────────────────────────────────────────────
  const { page, deal } = current
  if (page === 'product'  && deal) return <ProductDetailPage deal={deal} timeLeft={timers[deal.id] || '00:00:00'} isJoined={joinedDeals.has(deal.id)} onJoin={handleDetailJoin} onBack={goBack} />
  if (page === 'checkout' && deal) return <CheckoutPage deal={deal} onSuccess={handleCheckoutSuccess} onBack={goBack} />
  if (page === 'dashboard')        return <DashboardPage myGroups={myGroups} onBack={goBack} />
  if (page === 'business')         return <BusinessPortalPage onBack={goBack} onSubmit={() => {}} />

  // ── Home page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#050810' }} dir="rtl">
      {/* Global price-drop toast (above everything) */}
      <PriceDropToast toast={priceDropToast} onClose={() => setPriceDropToast(null)} />

      <LiveTicker />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        myGroupsCount={myGroups.length}
        onNavigate={navigate}
        onLogin={() => setLoginOpen(true)}
        user={loggedInUser}
      />
      <StatsBar />
      <HeroSection />
      <HowItWorks />
      <RealEstateUrgency />

      {/* ── Category filter ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 flex-row-reverse">
          {categories.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'text-dark-900' : 'text-slate-400 hover:text-white'
              }`}
              style={selectedCategory === cat
                ? { background: 'linear-gradient(135deg, #00ff88, #00b4ff)', boxShadow: '0 0 18px rgba(0,255,136,0.4)' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-5">
        <div className="flex items-center justify-end gap-3">
          <div className="text-right">
            <h2 className="text-2xl font-black text-white">עסקאות פעילות</h2>
            <p className="text-sm text-slate-500">
              {loading ? 'טוען עסקאות...' : `${filteredDeals.length} עסקאות זמינות עכשיו`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)' }}>
            <Flame className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-black text-neon-green">
              {loading ? '…' : filteredDeals.length}
            </span>
            <span className="text-xs text-slate-400">פעילות</span>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 pb-14">

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}>
              <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
            </div>
            <p className="text-slate-400 font-semibold">טוען עסקאות מהשרת...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <WifiOff className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 font-bold text-lg">שגיאת חיבור לשרת</p>
              <p className="text-slate-600 text-sm mt-1">{error}</p>
            </div>
            <button onClick={() => window.location.reload()}
              className="btn-neon px-6 py-2.5 rounded-xl font-bold text-sm">
              נסה שוב
            </button>
          </div>
        )}

        {/* Deals grid */}
        <AnimatePresence mode="wait">
          {!loading && !error && (
            filteredDeals.length === 0 ? (
              <motion.div key="empty" className="text-center py-24"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                  <motion.div key={d.id}
                    variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }}>
                    <DealCard
                      deal={d}
                      timeLeft={timers[d.id] || '00:00:00'}
                      isJoined={joinedDeals.has(d.id)}
                      isJoining={joining === d.id}
                      onJoin={handleCardJoin}
                      onCardClick={() => navigate('product', { deal: d })}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQAccordion />

      {/* ── Lead form ────────────────────────────────────────────────────── */}
      <LeadForm />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer dir="rtl"
        style={{ background: 'rgba(2,4,8,0.98)', borderTop: '1px solid rgba(0,255,136,0.12)' }}>

        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-0.5 mb-3">
                <span className="text-2xl font-black" style={{ color: '#00ff88', textShadow: '0 0 14px rgba(0,255,136,0.6)' }}>Drop</span>
                <span className="text-2xl font-black text-white">Price</span>
                <span className="w-2 h-2 rounded-full mr-1 inline-block animate-pulse"
                  style={{ background: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.9)' }} />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                הפלטפורמה המובילה לקבוצות רחישה בישראל. מחברים קונים חכמים ויזמים איכותיים.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                {[
                  { label: 'פייסבוק', icon: '📘', href: '#' },
                  { label: 'אינסטגרם', icon: '📸', href: '#' },
                  { label: 'לינקדאין', icon: '💼', href: '#' },
                  { label: 'טלגרם', icon: '✈️', href: '#' },
                ].map(({ label, icon, href }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Projects column */}
            <div>
              <h4 className="font-black text-white mb-4 text-sm tracking-wide uppercase">פרויקטים</h4>
              <ul className="space-y-2">
                {['פרויקטים פעילים', 'בית פרטי / וילה', 'דירות 3-4 חדרים', 'נכסים להשקעה', 'פרויקטים בתכנון'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-neon-green transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="font-black text-white mb-4 text-sm tracking-wide uppercase">החברה</h4>
              <ul className="space-y-2">
                {['אודות DropPrice', 'צוות המומחים', 'שאלות נפוצות', 'בלוג נדל"ן', 'צור קשר'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-neon-green transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + trust column */}
            <div>
              <h4 className="font-black text-white mb-4 text-sm tracking-wide uppercase">יצירת קשר</h4>
              <ul className="space-y-3 mb-5">
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <span>📞</span><a href="tel:*1234" className="hover:text-white transition-colors">*1234</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <span>✉️</span><a href="mailto:info@dropprice.co.il" className="hover:text-white transition-colors">info@dropprice.co.il</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <span>📍</span><span>רחוב הברזל 3, תל אביב</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <span>🕘</span><span>א׳–ה׳ 09:00–18:00</span>
                </li>
              </ul>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {['🔒 SSL מאובטח', '✅ רשום ברשם', '🏅 ISO 27001'].map(b => (
                  <span key={b} className="text-[10px] font-semibold px-2 py-1 rounded-full text-slate-500"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-slate-700 text-xs">© 2026 DropPrice בע"מ. כל הזכויות שמורות.</p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'תקנון האתר',          href: '#' },
                { label: 'מדיניות פרטיות',       href: '#' },
                { label: 'הצהרת נגישות',          href: '#' },
                { label: 'תנאי שימוש',            href: '#' },
                { label: 'מפת האתר',             href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Quick-join modal */}
      {modalDeal && (
        <JoinModal
          deal={modalDeal}
          onConfirm={confirmModalJoin}
          onClose={() => setModalDeal(null)}
        />
      )}

      <InviteButton />

      {/* Login modal */}
      <AnimatePresence>
        {loginOpen && (
          <LoginModal
            onClose={() => setLoginOpen(false)}
            onLogin={(user) => { setLoggedInUser(user); setLoginOpen(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
