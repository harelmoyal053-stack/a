'use strict'
// ── db.js MUST be required first — it sets DATABASE_URL to the absolute path
// of the SQLite file before any Prisma Client is instantiated.
const prisma = require('./db')

const express = require('express')
const cors    = require('cors')

const dealsRouter    = require('./routes/deals')
const joinRouter     = require('./routes/join')
const usersRouter    = require('./routes/users')
const activityRouter = require('./routes/activity')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(express.json())

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString('he-IL')}] ${req.method} ${req.path}`)
  next()
})

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/deals',    dealsRouter)
app.use('/api/join',     joinRouter)
app.use('/api/users',    usersRouter)
app.use('/api/activity', activityRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'DropPrice API פעיל 🚀', ts: new Date().toISOString() })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[שגיאה]', err.message)
  res.status(500).json({
    ok:    false,
    error: 'שגיאת שרת פנימית — נסה שנית',
    details: err.message,
  })
})

app.use((_req, res) => res.status(404).json({ error: 'הנתיב לא נמצא' }))

// ── Start: verify DB before accepting traffic ─────────────────────────────────
async function start() {
  try {
    const productCount = await prisma.product.count()
    const memberCount  = await prisma.groupMember.count()
    console.log(`[DB] ✓ ${productCount} מוצרים | ${memberCount} חברי קבוצה`)

    if (productCount === 0) {
      console.warn('[DB] ⚠️  הבסיס נתונים ריק! הרץ: npm run db:seed')
    }
  } catch (e) {
    console.error('[DB] ✗ שגיאה בחיבור לבסיס נתונים:', e.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`\n🟢 DropPrice Server פועל על פורט ${PORT}`)
    console.log(`   API:    http://localhost:${PORT}/api/health`)
    console.log(`   Events: http://localhost:${PORT}/api/deals/events/stream`)
    console.log(`   הרץ "npm run dev" בתיקייה הראשית כדי להפעיל גם את Vite\n`)
  })
}

start()
