'use strict'
const express  = require('express')
const { getActiveDeals, getDeal } = require('../services/groupService')
const { addClient }               = require('../sse')

const router = express.Router()

// ── GET /api/deals — all active deals ────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const deals = await getActiveDeals()
    res.json({ deals, count: deals.length })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/deals/:id — single deal ─────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const deal = await getDeal(req.params.id)
    if (!deal) return res.status(404).json({ error: 'עסקה לא נמצאה' })
    res.json(deal)
  } catch (err) {
    next(err)
  }
})

// ── GET /api/events — SSE stream for real-time deal updates ──────────────────
router.get('/events/stream', (req, res) => {
  res.set({
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':    'keep-alive',
    'X-Accel-Buffering': 'no', // disable nginx buffering if behind proxy
  })
  res.flushHeaders()

  // Initial handshake event
  res.write('event: connected\ndata: {"message":"חיבור SSE נוצר בהצלחה"}\n\n')

  // Keep-alive ping every 25 s (browsers time out SSE after ~30 s of silence)
  const ping = setInterval(() => {
    try {
      res.write(':ping\n\n')
    } catch (_) {
      clearInterval(ping)
    }
  }, 25_000)

  res.on('close', () => clearInterval(ping))

  addClient(res)
})

module.exports = router
