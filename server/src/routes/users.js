'use strict'
const express          = require('express')
const prisma           = require('../db')
const { getUserJoins } = require('../services/groupService')
const router = express.Router()

// ── POST /api/users — get-or-create guest user ────────────────────────────────
// Body: { name, email, phone? }
// Returns the user record plus the list of product IDs they've already joined
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body
    if (!name || !email) {
      return res.status(400).json({ error: 'שם ומייל הם שדות חובה' })
    }

    const user = await prisma.user.upsert({
      where:  { email },
      update: { name, phone: phone ?? undefined },
      create: { name, email, phone: phone ?? undefined },
    })

    const joinedProductIds = await getUserJoins(user.id)

    return res.json({
      user,
      joinedProductIds,
      message: 'שלום! ברוכים הבאים ל-DropPrice 👋',
    })
  } catch (err) {
    next(err)
  }
})

// ── GET /api/users/:id — fetch user + joined deals ────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!user) return res.status(404).json({ error: 'משתמש לא נמצא' })

    const joinedProductIds = await getUserJoins(user.id)
    return res.json({ user, joinedProductIds })
  } catch (err) {
    next(err)
  }
})

module.exports = router
