'use strict'
const express  = require('express')
const prisma   = require('../db')
const { joinGroup, hasUserJoined } = require('../services/groupService')
const { broadcast }                = require('../sse')

const router = express.Router()

// ── POST /api/join — join a group deal ────────────────────────────────────────
// Body: { userId, productId, referredBy? }
// Returns: { deal, priceDropped, oldPrice, newPrice, newCount, message,
//            referrerVip? }
router.post('/', async (req, res, next) => {
  try {
    const { userId, productId, referredBy } = req.body

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId ו-productId הם שדות חובה' })
    }

    // ── Core join transaction ──────────────────────────────────────────────
    const result = await joinGroup(userId, productId, referredBy ?? null)
    const { deal, priceDropped, oldPrice, newPrice, newCount, message } = result

    // ── Handle referral reward ─────────────────────────────────────────────
    let referrerVip = false
    if (referredBy && referredBy !== userId) {
      const referrer = await prisma.user.update({
        where: { id: referredBy },
        data: {
          referralCount: { increment: 1 },
          // Grant VIP badge after 3 successful referrals
          isVip: { set: true },  // we check the count below
        },
      }).catch(() => null)  // silently ignore invalid referrerId

      if (referrer) {
        // Only keep VIP if they've reached the threshold
        const newCount_ = referrer.referralCount + 1
        const shouldBeVip = newCount_ >= 3
        if (!shouldBeVip) {
          await prisma.user.update({ where: { id: referredBy }, data: { isVip: false } })
        }
        referrerVip = shouldBeVip && !referrer.isVip  // true = just unlocked VIP

        // Create a referral activity message
        const referrerUser = await prisma.user.findUnique({ where: { id: referredBy } })
        const joinerUser   = await prisma.user.findUnique({ where: { id: userId } })
        if (referrerUser && joinerUser) {
          const actMsg = await prisma.activityMessage.create({
            data: {
              productId,
              type:     'referral',
              userName: 'System',
              content:  `🔗 ${joinerUser.name} הצטרף דרך הקישור של ${referrerUser.name}! ${shouldBeVip && !referrer.isVip ? '🌟 ' + referrerUser.name + ' קיבל VIP!' : ''}`,
            },
          })
          broadcast('activity:new', actMsg)
        }
      }
    }

    // ── Create join activity message ───────────────────────────────────────
    const joiner = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null)
    const toNextTier = deal.targetBuyers - newCount
    const actMsg = await prisma.activityMessage.create({
      data: {
        productId,
        userId,
        type:     'join',
        userName: joiner?.name ?? 'משתמש חדש',
        content:  toNextTier > 0
          ? `${joiner?.name ?? 'מישהו'} הצטרף! חסרים עוד ${toNextTier} להנחה הבאה 🎯`
          : `${joiner?.name ?? 'מישהו'} הצטרף! הגענו ליעד! 🎉`,
      },
    })
    broadcast('activity:new', actMsg)

    // ── Broadcast deal update + optional price drop ─────────────────────────
    broadcast('deal:updated', deal)
    if (priceDropped) {
      broadcast('price:dropped', {
        productId: deal.id, productTitle: deal.title,
        oldPrice, newPrice, newCount,
        message: `🎉 המחיר ירד! "${deal.title}" עכשיו ב-₪${newPrice}`,
      })
      // Price drop activity message
      const dropMsg = await prisma.activityMessage.create({
        data: {
          productId,
          type:     'milestone',
          userName: 'System',
          content:  `🎉 המחיר ירד! המחיר החדש הוא ₪${newPrice} לכולם!`,
        },
      })
      broadcast('activity:new', dropMsg)
    }
    broadcast('group:joined', { productId: deal.id, newCount, userId })

    return res.json({
      ok: true, deal, priceDropped, oldPrice, newPrice, newCount, message,
      referrerVip,
    })
  } catch (err) {
    const businessErrors = ['כבר הצטרפת לקבוצה זו','מוצר לא נמצא','עסקה זו כבר לא פעילה','זמן העסקה פג']
    if (businessErrors.some(m => err.message.startsWith(m))) {
      return res.status(409).json({ ok: false, error: err.message })
    }
    next(err)
  }
})

// ── GET /api/join/check ───────────────────────────────────────────────────────
router.get('/check', async (req, res, next) => {
  try {
    const { userId, productId } = req.query
    if (!userId || !productId) return res.status(400).json({ error: 'userId ו-productId נדרשים' })
    const joined = await hasUserJoined(userId, productId)
    return res.json({ joined })
  } catch (err) { next(err) }
})

module.exports = router
