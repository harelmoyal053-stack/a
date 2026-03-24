'use strict'
const express  = require('express')
const { joinGroup, hasUserJoined } = require('../services/groupService')
const { broadcast }                = require('../sse')

const router = express.Router()

// ── POST /api/join — join a group deal ────────────────────────────────────────
// Body: { userId, productId }
// Returns: { deal, priceDropped, oldPrice, newPrice, newCount, message }
// Side effect: broadcasts 'deal:updated' and optionally 'price:dropped' via SSE
router.post('/', async (req, res, next) => {
  try {
    const { userId, productId } = req.body

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId ו-productId הם שדות חובה' })
    }

    const result = await joinGroup(userId, productId)
    const { deal, priceDropped, oldPrice, newPrice, newCount, message } = result

    // ── Broadcast deal update to all SSE clients ───────────────────────────
    broadcast('deal:updated', deal)

    // ── Broadcast price-drop event if a tier was hit ───────────────────────
    if (priceDropped) {
      broadcast('price:dropped', {
        productId: deal.id,
        productTitle: deal.title,
        oldPrice,
        newPrice,
        newCount,
        message: `🎉 המחיר ירד! "${deal.title}" עכשיו ב-₪${newPrice}`,
      })
    }

    // ── Broadcast a lightweight member-count update for all watchers ───────
    broadcast('group:joined', {
      productId: deal.id,
      newCount,
      userId,
      message: `👥 ${newCount} קונים הצטרפו לעסקת "${deal.title}"`,
    })

    return res.json({
      ok: true,
      deal,
      priceDropped,
      oldPrice,
      newPrice,
      newCount,
      message,
    })
  } catch (err) {
    // Known business errors → 409 Conflict with Hebrew message
    const businessErrors = [
      'כבר הצטרפת לקבוצה זו',
      'מוצר לא נמצא',
      'עסקה זו כבר לא פעילה',
      'זמן העסקה פג',
    ]
    const isBusinessError = businessErrors.some((msg) => err.message.startsWith(msg))
    if (isBusinessError) {
      return res.status(409).json({ ok: false, error: err.message })
    }
    next(err)
  }
})

// ── GET /api/join/check?userId=&productId= ────────────────────────────────────
router.get('/check', async (req, res, next) => {
  try {
    const { userId, productId } = req.query
    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId ו-productId נדרשים' })
    }
    const joined = await hasUserJoined(userId, productId)
    return res.json({ joined })
  } catch (err) {
    next(err)
  }
})

module.exports = router
