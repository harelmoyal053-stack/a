'use strict'
// Use the shared singleton — DATABASE_URL absolute path is set there
const prisma = require('../db')

// ── Helper: compute the applicable tier for a given buyer count ───────────────
function computeTier(memberCount, tiers) {
  // tiers must be sorted by requiredParticipants ASC
  let active = tiers[0]
  for (const t of tiers) {
    if (memberCount >= t.requiredParticipants) active = t
    else break
  }
  return active
}

// ── Helper: compute nextPrice (price of the very next tier) ──────────────────
function computeNextPrice(memberCount, tiers) {
  for (const t of tiers) {
    if (t.requiredParticipants > memberCount) return t.priceAtTier
  }
  return null // already at the best tier
}

// ── Shape a raw Prisma product into the API deal format ───────────────────────
function shapeProduct(product) {
  const tiers = [...product.tiers].sort(
    (a, b) => a.requiredParticipants - b.requiredParticipants,
  )
  const memberCount = product.groups[0]?.members?.length ?? 0
  const currentTier = computeTier(memberCount, tiers)
  const nextPrice   = computeNextPrice(memberCount, tiers)

  return {
    id:            product.id,
    title:         product.title,
    subtitle:      product.subtitle ?? '',
    emoji:         product.emoji,
    category:      product.category,
    badge:         product.badge ?? '',
    badgeColor:    product.badgeColor ?? 'bg-slate-500',
    originalPrice: product.originalPrice,
    currentPrice:  product.currentPrice,
    nextPrice:     nextPrice ?? product.currentPrice,
    savings:       Math.round(product.originalPrice - product.currentPrice),
    targetBuyers:  product.targetBuyers,
    currentBuyers: memberCount,
    endTime:       product.endTime.toISOString(),
    rating:        product.rating,
    reviews:       product.reviews,
    isActive:      product.isActive,
    priceTiers: tiers.map((t) => ({
      buyers: t.requiredParticipants,
      price:  t.priceAtTier,
    })),
  }
}

// ── Get all active deals ──────────────────────────────────────────────────────
async function getActiveDeals() {
  const products = await prisma.product.findMany({
    where:   { isActive: true },
    include: {
      tiers:  { orderBy: { requiredParticipants: 'asc' } },
      groups: { include: { members: true } },
    },
    orderBy: { createdAt: 'asc' },
  })
  return products.map(shapeProduct)
}

// ── Get one deal ──────────────────────────────────────────────────────────────
async function getDeal(productId) {
  const product = await prisma.product.findUnique({
    where:   { id: productId },
    include: {
      tiers:  { orderBy: { requiredParticipants: 'asc' } },
      groups: { include: { members: true } },
    },
  })
  if (!product) return null
  return shapeProduct(product)
}

// ── Core business logic: join a group ─────────────────────────────────────────
// Returns: { deal, priceDropped, oldPrice, newPrice, newCount, message }
async function joinGroup(userId, productId) {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch product + tiers (with lock via select for update is unavailable in SQLite,
    //    but $transaction serialises writes)
    const product = await tx.product.findUnique({
      where:   { id: productId },
      include: {
        tiers:  { orderBy: { requiredParticipants: 'asc' } },
        groups: { include: { members: true } },
      },
    })
    if (!product) throw new Error('מוצר לא נמצא')
    if (!product.isActive) throw new Error('עסקה זו כבר לא פעילה')
    if (new Date() > product.endTime) throw new Error('זמן העסקה פג — ביטול אוטומטי')

    // 2. Find or create group
    let group = product.groups[0] ?? null
    if (!group) {
      group = await tx.group.create({
        data: { productId },
        include: { members: true },
      })
    }

    // 3. Idempotency check
    const alreadyJoined = group.members.some((m) => m.userId === userId)
    if (alreadyJoined) throw new Error('כבר הצטרפת לקבוצה זו')

    // 4. Add member
    await tx.groupMember.create({ data: { groupId: group.id, userId } })
    const newCount = group.members.length + 1

    // 5. Calculate new tier
    const oldPrice   = product.currentPrice
    const newTier    = computeTier(newCount, product.tiers)
    const newPrice   = newTier.priceAtTier
    const priceDropped = newPrice < oldPrice

    // 6. Persist price change if a tier was hit
    if (priceDropped) {
      await tx.product.update({
        where: { id: productId },
        data:  { currentPrice: newPrice },
      })
    }

    // 7. Fetch the final shaped deal for broadcasting
    const updatedProduct = await tx.product.findUnique({
      where:   { id: productId },
      include: {
        tiers:  { orderBy: { requiredParticipants: 'asc' } },
        groups: { include: { members: true } },
      },
    })

    const deal = shapeProduct(updatedProduct)

    const message = priceDropped
      ? `🎉 המחיר ירד! עכשיו ₪${newPrice} לכל חברי הקבוצה!`
      : `הצטרפת בהצלחה! ${newCount} קונים בקבוצה`

    return { deal, priceDropped, oldPrice, newPrice, newCount, message }
  })
}

// ── Check if a user has joined a specific product ─────────────────────────────
async function hasUserJoined(userId, productId) {
  const membership = await prisma.groupMember.findFirst({
    where: {
      userId,
      group: { productId },
    },
  })
  return !!membership
}

// ── Get all products a user has joined ────────────────────────────────────────
async function getUserJoins(userId) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    include: { group: true },
  })
  return memberships.map((m) => m.group.productId)
}

module.exports = { getActiveDeals, getDeal, joinGroup, hasUserJoined, getUserJoins }
