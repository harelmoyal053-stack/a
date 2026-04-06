import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, TrendingDown, Users, Target, XCircle, Plus, BarChart2, Package, RefreshCw } from 'lucide-react'
import { getCachedUser } from '../utils/user'
import { subscribeToMyDeals, endFirestoreDeal } from '../services/dealsService'
import { isFirebaseReady } from '../firebase'

// ── localStorage helpers (fallback) ───────────────────────────────────────────
function loadCustomProducts() {
  try { return JSON.parse(localStorage.getItem('customProducts') || '[]') } catch { return [] }
}
function saveCustomProducts(products) {
  try { localStorage.setItem('customProducts', JSON.stringify(products)) } catch (_) {}
}

function getCurrentTier(deal) {
  const tiers = [...(deal.priceTiers || [])].sort((a, b) => a.buyers - b.buyers)
  let active = tiers[0]
  for (const t of tiers) {
    if (deal.currentBuyers >= t.buyers) active = t
  }
  return active
}

function getNextTier(deal) {
  const tiers = [...(deal.priceTiers || [])].sort((a, b) => a.buyers - b.buyers)
  return tiers.find(t => t.buyers > deal.currentBuyers) || null
}

export default function BusinessDashboardPage({ onBack, onNewDeal }) {
  const user = getCachedUser()

  const loadFromLocalStorage = useCallback(() =>
    loadCustomProducts().filter(p =>
      p.creatorId === user?.id || p.businessName === user?.businessName
    ), [user?.id, user?.businessName])

  const [products, setProducts] = useState(loadFromLocalStorage)

  // ── Subscribe to Firestore or fall back to localStorage ────────────────────
  useEffect(() => {
    if (isFirebaseReady) {
      // Real-time Firestore subscription
      const unsub = subscribeToMyDeals(user?.id, user?.businessName, (myDeals) => {
        setProducts(myDeals)
      })
      return unsub
    } else {
      // localStorage fallback — refresh on focus
      const refresh = () => setProducts(loadFromLocalStorage())
      window.addEventListener('focus', refresh)
      return () => window.removeEventListener('focus', refresh)
    }
  }, [user?.id, user?.businessName, loadFromLocalStorage])
  const [endingId, setEndingId] = useState(null)

  const totalParticipants = products.reduce((s, p) => s + (p.currentBuyers || 0), 0)
  const activeCount       = products.filter(p => !p.ended).length

  async function handleEnd(id) {
    if (isFirebaseReady) {
      await endFirestoreDeal(id)
      // Firestore listener will update products automatically
    } else {
      const updated = loadCustomProducts().map(p =>
        p.id === id ? { ...p, ended: true, isActive: false } : p
      )
      saveCustomProducts(updated)
      setProducts(updated.filter(p =>
        p.creatorId === user?.id || p.businessName === user?.businessName
      ))
    }
    setEndingId(null)
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: '#f4fbf7' }} dir="rtl">
      {/* Nav */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Manual refresh only needed in localStorage fallback mode */}
            {!isFirebaseReady && (
            <button onClick={() => setProducts(loadFromLocalStorage())}
              className="p-2 rounded-xl transition-colors"
              style={{ background: '#f4fbf7', border: '1px solid #e2e8f0', color: '#94a3b8' }}
              title="רענן נתונים"
              onMouseEnter={e => e.currentTarget.style.color = '#1a7a40'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              <RefreshCw className="w-4 h-4" />
            </button>
            )}
            <button onClick={onNewDeal}
              className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold">
              <Plus className="w-4 h-4" />עסקה חדשה
            </button>
          </div>
          <span className="font-black" style={{ color: '#0d3320' }}>ניהול עסקאות</span>
          <button onClick={onBack}
            className="flex items-center gap-1.5 font-semibold text-sm transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a7a40'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <ArrowRight className="w-5 h-5" />חזרה
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Business hero */}
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #155c34 0%, #1e7a40 100%)', boxShadow: '0 8px 30px rgba(21,92,52,0.2)' }}>
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,168,85,0.2), transparent 70%)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              🏢
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-white">{user?.businessName || user?.name}</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>פורטל ניהול עסקאות קבוצתיות</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Package,   label: 'עסקאות פעילות',   value: activeCount,        color: '#1a7a40', bg: '#f0fdf4', border: '#bbf7d0' },
            { icon: Users,     label: 'סה"כ משתתפים',    value: totalParticipants,  color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
            { icon: BarChart2, label: 'סה"כ עסקאות',     value: products.length,    color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
          ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
            <motion.div key={i} className="card-clean rounded-2xl p-4 text-center"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-xl font-black" style={{ color }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Products list */}
        {products.length === 0 ? (
          <div className="card-clean rounded-2xl p-14 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-bold text-lg" style={{ color: '#475569' }}>עדיין לא פרסמת עסקאות</p>
            <p className="text-sm mt-1 mb-6" style={{ color: '#94a3b8' }}>לחץ על "עסקה חדשה" כדי להתחיל</p>
            <button onClick={onNewDeal} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm">
              פרסם עסקה ראשונה
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((deal, i) => {
              const currentTier = getCurrentTier(deal)
              const nextTier    = getNextTier(deal)
              const progress    = Math.min(100, Math.round((deal.currentBuyers / deal.targetBuyers) * 100))
              const discountPct = Math.round(((deal.originalPrice - (currentTier?.price ?? deal.currentPrice)) / deal.originalPrice) * 100)

              return (
                <motion.div key={deal.id}
                  className="card-clean rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>

                  {/* Ended banner */}
                  {deal.ended && (
                    <div className="px-4 py-2 text-sm font-bold text-center"
                      style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                      עסקה הסתיימה
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-4xl"
                        style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
                        {deal.image
                          ? <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                          : deal.emoji || '🛍️'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 shrink-0">
                            {!deal.ended && (
                              <>
                                <button
                                  onClick={() => setEndingId(deal.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                  style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48' }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#ffe4e6'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#fff1f2'}>
                                  <XCircle className="w-3.5 h-3.5" />סיום
                                </button>
                              </>
                            )}
                          </div>
                          <div>
                            <h3 className="font-black text-base leading-snug" style={{ color: '#0d3320' }}>{deal.title}</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{deal.category}</p>
                          </div>
                        </div>

                        {/* Price info */}
                        <div className="flex items-center gap-3 justify-end mb-3">
                          <span className="text-xs" style={{ color: '#94a3b8' }}>
                            מחיר מקורי: <span className="line-through">₪{deal.originalPrice}</span>
                          </span>
                          <span className="font-black text-lg" style={{ color: '#1a7a40' }}>
                            ₪{currentTier?.price ?? deal.currentPrice}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>
                            -{discountPct}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {/* Participants */}
                      <div className="rounded-xl p-3 text-right"
                        style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                        <div className="flex items-center justify-end gap-1.5 mb-1">
                          <p className="text-xs font-bold" style={{ color: '#0284c7' }}>משתתפים</p>
                          <Users className="w-3.5 h-3.5" style={{ color: '#0284c7' }} />
                        </div>
                        <p className="text-2xl font-black" style={{ color: '#0284c7' }}>{deal.currentBuyers}</p>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>מתוך {deal.targetBuyers} יעד</p>
                      </div>

                      {/* Current tier */}
                      <div className="rounded-xl p-3 text-right"
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <div className="flex items-center justify-end gap-1.5 mb-1">
                          <p className="text-xs font-bold" style={{ color: '#1a7a40' }}>שלב נוכחי</p>
                          <TrendingDown className="w-3.5 h-3.5" style={{ color: '#1a7a40' }} />
                        </div>
                        <p className="text-2xl font-black" style={{ color: '#1a7a40' }}>₪{currentTier?.price ?? deal.currentPrice}</p>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>{currentTier?.buyers ?? 0}+ קונים</p>
                      </div>

                      {/* Next goal */}
                      <div className="rounded-xl p-3 text-right"
                        style={{ background: nextTier ? '#fff7ed' : '#f8fafc', border: `1px solid ${nextTier ? '#fed7aa' : '#e2e8f0'}` }}>
                        <div className="flex items-center justify-end gap-1.5 mb-1">
                          <p className="text-xs font-bold" style={{ color: nextTier ? '#ea580c' : '#94a3b8' }}>יעד הבא</p>
                          <Target className="w-3.5 h-3.5" style={{ color: nextTier ? '#ea580c' : '#94a3b8' }} />
                        </div>
                        {nextTier ? (
                          <>
                            <p className="text-2xl font-black" style={{ color: '#ea580c' }}>
                              {nextTier.buyers - deal.currentBuyers}
                            </p>
                            <p className="text-xs" style={{ color: '#94a3b8' }}>
                              קונים נוספים → ₪{nextTier.price}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg font-black" style={{ color: '#94a3b8' }}>✓</p>
                            <p className="text-xs" style={{ color: '#94a3b8' }}>הגעת ליעד!</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold" style={{ color: '#1a7a40' }}>{progress}% הושלם</span>
                        <span style={{ color: '#94a3b8' }}>{deal.currentBuyers} / {deal.targetBuyers} קונים</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                        <div className="h-full rounded-full progress-gold transition-all duration-700"
                          style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* End deal confirm dialog */}
      <AnimatePresence>
        {endingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
            <motion.div className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEndingId(null)} />
            <motion.div className="relative card-clean rounded-2xl p-6 max-w-sm w-full text-right"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <h3 className="font-black text-lg mb-2" style={{ color: '#0d3320' }}>סיום עסקה</h3>
              <p className="text-sm mb-5" style={{ color: '#64748b' }}>
                האם אתה בטוח שברצונך לסיים את העסקה? פעולה זו לא ניתנת לביטול.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setEndingId(null)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: '#f1f5f9', color: '#475569' }}>
                  ביטול
                </button>
                <button onClick={() => handleEnd(endingId)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: '#e11d48', color: '#fff' }}>
                  סיים עסקה
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
