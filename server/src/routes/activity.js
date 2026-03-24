'use strict'
const express  = require('express')
const prisma   = require('../db')
const { broadcast } = require('../sse')

const router = express.Router({ mergeParams: true })

// ── GET /api/activity/:productId — last 40 messages ──────────────────────────
router.get('/:productId', async (req, res, next) => {
  try {
    const messages = await prisma.activityMessage.findMany({
      where:   { productId: req.params.productId },
      orderBy: { createdAt: 'asc' },
      take:    40,
    })
    res.json({ messages })
  } catch (err) {
    next(err)
  }
})

// ── POST /api/activity/:productId — post a chat message ──────────────────────
// Body: { userId?, userName, content }
router.post('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params
    const { userId, userName, content } = req.body

    if (!userName || !content?.trim()) {
      return res.status(400).json({ error: 'userName ו-content הם שדות חובה' })
    }
    if (content.length > 280) {
      return res.status(400).json({ error: 'הודעה ארוכה מדי (מקסימום 280 תווים)' })
    }

    const message = await prisma.activityMessage.create({
      data: {
        productId,
        userId: userId ?? null,
        userName: userName.trim(),
        content:  content.trim(),
        type:     'chat',
      },
    })

    // Broadcast to all SSE clients
    broadcast('activity:new', message)

    res.json({ message })
  } catch (err) {
    next(err)
  }
})

module.exports = router
