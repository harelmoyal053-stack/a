/**
 * Firestore service layer for DropPrice deals.
 * All functions are no-ops (resolved promises / no-op unsubscribes) when
 * Firebase is not configured, so the app keeps working with localStorage.
 */

import { db, isFirebaseReady } from '../firebase'
import {
  collection, doc, addDoc, updateDoc, serverTimestamp,
  onSnapshot, query, orderBy, runTransaction,
} from 'firebase/firestore'

const DEALS_COL = 'deals'

// ── Helpers ───────────────────────────────────────────────────────────────────

function recalcTiers(deal, newCount) {
  const tiers = [...(deal.priceTiers || [])].sort((a, b) => a.buyers - b.buyers)
  let current = tiers[0]
  for (const t of tiers) { if (newCount >= t.buyers) current = t }
  const next = tiers.find(t => t.buyers > newCount) || null
  return {
    currentBuyers: newCount,
    currentPrice:  current?.price ?? deal.currentPrice,
    nextPrice:     next?.price   ?? current?.price ?? deal.currentPrice,
    savings:       deal.originalPrice - (current?.price ?? deal.currentPrice),
  }
}

// ── Publish a new deal ────────────────────────────────────────────────────────

export async function publishDeal(deal) {
  if (!isFirebaseReady || !db) return null           // caller falls back to localStorage

  // Strip base64 images > 900 KB to avoid Firestore 1 MB doc limit.
  // For production use Firebase Storage + a real URL instead.
  let image = deal.image || null
  if (image && image.length > 900_000) {
    console.warn('[DropPrice] Image too large for Firestore; stripped. Use Firebase Storage for production.')
    image = null
  }

  const payload = {
    ...deal,
    id:        undefined,          // Firestore will assign its own ID
    image,
    source:    'firestore',
    createdAt: serverTimestamp(),
  }
  delete payload.id                // remove undefined key cleanly

  const ref = await addDoc(collection(db, DEALS_COL), payload)
  return { ...deal, id: ref.id, source: 'firestore', image }
}

// ── Real-time subscription ────────────────────────────────────────────────────

export function subscribeToDeals(callback) {
  if (!isFirebaseReady || !db) return () => {}       // no-op unsubscribe

  const q = query(collection(db, DEALS_COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const deals = snap.docs.map(d => ({ ...d.data(), id: d.id, source: 'firestore' }))
    callback(deals)
  }, (err) => {
    console.error('[DropPrice] Firestore snapshot error:', err)
    callback([])
  })
}

// ── Subscribe to deals owned by a specific business ───────────────────────────

export function subscribeToMyDeals(userId, businessName, callback) {
  return subscribeToDeals((deals) => {
    const mine = deals.filter(d =>
      d.creatorId === userId || d.businessName === businessName
    )
    callback(mine)
  })
}

// ── Increment participant count (atomic transaction) ──────────────────────────

export async function joinFirestoreDeal(dealId) {
  if (!isFirebaseReady || !db) throw new Error('Firebase not configured')

  const ref = doc(db, DEALS_COL, dealId)
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('Deal not found')

    const deal     = snap.data()
    const newCount = (deal.currentBuyers || 0) + 1
    const updates  = recalcTiers(deal, newCount)

    tx.update(ref, updates)
    return { ...deal, ...updates, id: snap.id, source: 'firestore' }
  })
}

// ── End (deactivate) a deal ───────────────────────────────────────────────────

export async function endFirestoreDeal(dealId) {
  if (!isFirebaseReady || !db) return
  await updateDoc(doc(db, DEALS_COL, dealId), { ended: true, isActive: false })
}
