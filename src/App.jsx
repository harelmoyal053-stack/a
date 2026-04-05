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

  // ── Price-drop handler (SSE + join response) ────────────────────────────────
  const handlePriceDrop = useCallback((payload) => {
    setPriceDropToast(payload)
  }, [])

  // ── Real data from backend ──────────────────────────────────────────────────
  const { deals, timers, loading, error, updateDeal } = useDeals({ onPriceDrop: handlePriceDrop })

  // ── Capture ?ref=&deal= params from invite links on first mount ────────────
  useEffect(() => {
    const { dealId } = capturePendingRef()
    if (dealId && deals.length > 0) {
      const found = deals.find(d => d.id === dealId)
      if (found) navigate('product', { deal: found })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deals.length])

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
    <div className="min-h-screen" style={{ background: '#f4fbf7' }} dir="rtl">
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

      {/* ── Deals section ────────────────────────────────────────────────── */}
      <div style={{ background: '#f4fbf7', borderTop: '1px solid #e2e8f0' }}>
        {/* Category filter */}
        <div className="max-w-7xl mx-auto px-4 pb-4 pt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 flex-row-reverse">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                style={selectedCategory === cat
                  ? { background: 'linear-gradient(135deg, #22a855, #1a7a40)', color: '#fff', boxShadow: '0 4px 14px rgba(34,168,85,0.25)' }
                  : { background: '#fff', border: '1px solid #e2e8f0', color: '#475569' }
                }
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
              <h2 className="text-2xl font-black" style={{ color: '#0d3320' }}>עסקאות פעילות</h2>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                {loading ? 'טוען עסקאות...' : `${filteredDeals.length} עסקאות זמינות עכשיו`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(34,168,85,0.08)', border: '1px solid rgba(34,168,85,0.2)' }}>
              <Flame className="w-4 h-4" style={{ color: '#22a855' }} />
              <span className="text-sm font-black" style={{ color: '#1a7a40' }}>
                {loading ? '…' : filteredDeals.length}
              </span>
              <span className="text-xs" style={{ color: '#94a3b8' }}>פעילות</span>
            </div>
          </div>
        </div>

        {/* Deals grid */}
        <main className="max-w-7xl mx-auto px-4 pb-14">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(34,168,85,0.08)', border: '1px solid rgba(34,168,85,0.2)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#22a855' }} />
              </div>
              <p className="font-semibold" style={{ color: '#94a3b8' }}>טוען עסקאות מהשרת...</p>
            </div>
          )}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <WifiOff className="w-8 h-8 text-red-400" />
              </div>
              <p className="font-bold text-lg text-red-500">שגיאת חיבור לשרת</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{error}</p>
              <button onClick={() => window.location.reload()}
                className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm">
                נסה שוב
              </button>
            </div>
          )}
          <AnimatePresence mode="wait">
            {!loading && !error && (
              filteredDeals.length === 0 ? (
                <motion.div key="empty" className="text-center py-24"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-6xl mb-4">🔍</p>
                  <p className="text-xl font-semibold" style={{ color: '#94a3b8' }}>לא נמצאו עסקאות</p>
                  <p className="mt-1" style={{ color: '#64748b' }}>נסה חיפוש אחר</p>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedCategory}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden" animate="show"
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
      </div>

      <FAQAccordion />
      <LeadForm />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer dir="rtl" style={{ background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-2xl font-black" style={{ color: '#155c34' }}>Drop</span>
                <span className="text-2xl font-black" style={{ color: '#22a855' }}>Price</span>
                <span className="w-2 h-2 rounded-full mr-0.5 mb-3 inline-block"
                  style={{ background: '#22a855' }} />
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
                הפלטפורמה המובילה לקבוצות רחישה בישראל. מחברים קונים חכמים ויזמים איכותיים.
              </p>
              <div className="flex gap-3">
                {[
                  { label: 'פייסבוק', icon: '📘' },
                  { label: 'אינסטגרם', icon: '📸' },
                  { label: 'לינקדאין', icon: '💼' },
                  { label: 'טלגרם', icon: '✈️' },
                ].map(({ label, icon }) => (
                  <a key={label} href="#" aria-label={label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all hover:scale-110"
                    style={{ background: '#f4fbf7', border: '1px solid #e2e8f0' }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <h4 className="font-black mb-4 text-sm tracking-wide uppercase" style={{ color: '#0d3320' }}>פרויקטים</h4>
              <ul className="space-y-2.5">
                {['פרויקטים פעילים', 'בית פרטי / וילה', 'דירות 3–4 חדרים', 'נכסים להשקעה', 'פרויקטים בתכנון'].map(l => (
                  <li key={l}><a href="#" className="text-sm transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#22a855' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8' }}>{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-black mb-4 text-sm tracking-wide uppercase" style={{ color: '#0d3320' }}>החברה</h4>
              <ul className="space-y-2.5">
                {['אודות DropPrice', 'צוות המומחים', 'שאלות נפוצות', 'בלוג נדל"ן', 'צור קשר'].map(l => (
                  <li key={l}><a href="#" className="text-sm transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#22a855' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8' }}>{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-black mb-4 text-sm tracking-wide uppercase" style={{ color: '#0d3320' }}>יצירת קשר</h4>
              <ul className="space-y-2.5 mb-5 text-sm" style={{ color: '#94a3b8' }}>
                <li className="flex items-center gap-2"><span>📞</span><a href="tel:*1234" style={{ color: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#155c34' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8' }}>*1234</a></li>
                <li className="flex items-center gap-2"><span>✉️</span><a href="mailto:info@dropprice.co.il" style={{ color: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#155c34' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8' }}>info@dropprice.co.il</a></li>
                <li className="flex items-center gap-2"><span>📍</span><span>רחוב הברזל 3, תל אביב</span></li>
                <li className="flex items-center gap-2"><span>🕘</span><span>א׳–ה׳ 09:00–18:00</span></li>
              </ul>
              <div className="flex flex-wrap gap-2">
                {['🔒 SSL', '✅ רשום ברשם', '🏅 ISO 27001'].map(b => (
                  <span key={b} className="text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: '#f0fdf4', border: '1px solid #d1fae5', color: '#1a7a40' }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs" style={{ color: '#cbd5e1' }}>© 2026 DropPrice בע"מ. כל הזכויות שמורות.</p>
            <div className="flex flex-wrap gap-4">
              {['תקנון האתר', 'מדיניות פרטיות', 'הצהרת נגישות', 'תנאי שימוש'].map(l => (
                <a key={l} href="#" className="text-xs transition-colors"
                  style={{ color: '#cbd5e1' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#22a855' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#cbd5e1' }}>
                  {l}
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
