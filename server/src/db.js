'use strict'
const path = require('path')
const { PrismaClient } = require('@prisma/client')

// ── Absolute path for SQLite ───────────────────────────────────────────────────
// Resolves to server/prisma/dev.db regardless of which directory the process
// is started from (project root, server/, or anywhere else).
const DB_PATH = path.resolve(__dirname, '../prisma/dev.db')
process.env.DATABASE_URL = `file:${DB_PATH}`

console.log(`[DB] SQLite → ${DB_PATH}`)

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

module.exports = prisma
