'use strict'
require('dotenv').config()
const express = require('express')
const cors    = require('cors')

const dealsRouter = require('./routes/deals')
const joinRouter  = require('./routes/join')
const usersRouter = require('./routes/users')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(express.json())

// Request logger (dev mode)
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString('he-IL')}] ${req.method} ${req.path}`)
  next()
})

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/deals',  dealsRouter)
app.use('/api/join',   joinRouter)
app.use('/api/users',  usersRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'DropPrice API פעיל 🚀', ts: new Date().toISOString() })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[שגיאה]', err.message)
  res.status(500).json({
    ok:    false,
    error: 'שגיאת שרת פנימית — נסה שנית',
    ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
  })
})

// ── 404 ────────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'הנתיב לא נמצא' }))

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🟢 DropPrice Server פועל על פורט ${PORT}`)
  console.log(`   API:    http://localhost:${PORT}/api/health`)
  console.log(`   Events: http://localhost:${PORT}/api/deals/events/stream\n`)
})
