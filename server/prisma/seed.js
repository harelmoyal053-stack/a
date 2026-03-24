'use strict'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ── Helper: create endTime N hours from now ───────────────────────────────────
const hoursFromNow = (h) => new Date(Date.now() + h * 3_600_000)

// ── Seed data — mirrors the static deals in the frontend ─────────────────────
const PRODUCTS = [
  {
    title: 'מארז חיתולים פמפרס XL',
    subtitle: '120 יחידות | מידה 4',
    emoji: '👶',
    category: 'תינוקות',
    badge: 'פופולרי',
    badgeColor: 'bg-blue-500',
    basePrice: 149,
    originalPrice: 149,
    currentPrice: 89,
    targetBuyers: 25,
    endTime: hoursFromNow(2.75),
    rating: 4.8,
    reviews: 234,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 149 },
      { requiredParticipants: 10, priceAtTier: 89  },
      { requiredParticipants: 25, priceAtTier: 69  },
      { requiredParticipants: 50, priceAtTier: 55  },
    ],
    initialBuyers: 18,
  },
  {
    title: 'מגש פיצה ענקי 50 ס"מ',
    subtitle: 'עם כל התוספות | 4 חתיכות',
    emoji: '🍕',
    category: 'מזון',
    badge: 'מבצע חם',
    badgeColor: 'bg-orange-500',
    basePrice: 89,
    originalPrice: 89,
    currentPrice: 45,
    targetBuyers: 15,
    endTime: hoursFromNow(1.38),
    rating: 4.9,
    reviews: 567,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 89 },
      { requiredParticipants: 5,  priceAtTier: 45 },
      { requiredParticipants: 15, priceAtTier: 35 },
      { requiredParticipants: 30, priceAtTier: 28 },
    ],
    initialBuyers: 9,
  },
  {
    title: 'דלק 30 ליטר בנזין 95',
    subtitle: 'תקף בכל תחנות פז | הזמנה מראש',
    emoji: '⛽',
    category: 'תחבורה',
    badge: 'חוסך כסף',
    badgeColor: 'bg-yellow-600',
    basePrice: 198,
    originalPrice: 198,
    currentPrice: 142,
    targetBuyers: 50,
    endTime: hoursFromNow(4.17),
    rating: 4.7,
    reviews: 891,
    tiers: [
      { requiredParticipants: 0,   priceAtTier: 198 },
      { requiredParticipants: 20,  priceAtTier: 142 },
      { requiredParticipants: 50,  priceAtTier: 125 },
      { requiredParticipants: 100, priceAtTier: 110 },
    ],
    initialBuyers: 37,
  },
  {
    title: 'ארגז פירות טריים עונתיים',
    subtitle: '10 ק"ג | ישיר מהחקלאי',
    emoji: '🍎',
    category: 'מזון',
    badge: 'כמעט הגענו!',
    badgeColor: 'bg-green-600',
    basePrice: 110,
    originalPrice: 110,
    currentPrice: 65,
    targetBuyers: 20,
    endTime: hoursFromNow(0.98),
    rating: 4.6,
    reviews: 312,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 110 },
      { requiredParticipants: 8,  priceAtTier: 65  },
      { requiredParticipants: 20, priceAtTier: 52  },
      { requiredParticipants: 40, priceAtTier: 42  },
    ],
    initialBuyers: 14,
  },
  {
    title: 'ציוד כושר - כדור כוח',
    subtitle: '20 ק"ג | איכות מקצועית',
    emoji: '🏋️',
    category: 'ספורט',
    badge: 'חדש',
    badgeColor: 'bg-purple-500',
    basePrice: 320,
    originalPrice: 320,
    currentPrice: 189,
    targetBuyers: 30,
    endTime: hoursFromNow(5.5),
    rating: 4.5,
    reviews: 128,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 320 },
      { requiredParticipants: 15, priceAtTier: 189 },
      { requiredParticipants: 30, priceAtTier: 159 },
      { requiredParticipants: 60, priceAtTier: 139 },
    ],
    initialBuyers: 22,
  },
  {
    title: 'חבילת קפה 1 ק"ג פרימיום',
    subtitle: 'קפה אתיופי | קלייה בינונית',
    emoji: '☕',
    category: 'מזון',
    badge: 'מועדפים',
    badgeColor: 'bg-amber-700',
    basePrice: 135,
    originalPrice: 135,
    currentPrice: 78,
    targetBuyers: 25,
    endTime: hoursFromNow(3.25),
    rating: 4.9,
    reviews: 445,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 135 },
      { requiredParticipants: 12, priceAtTier: 78  },
      { requiredParticipants: 25, priceAtTier: 62  },
      { requiredParticipants: 50, priceAtTier: 49  },
    ],
    initialBuyers: 19,
  },
]

// ── Seed ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 מנקה נתונים ישנים...')
  await prisma.groupMember.deleteMany()
  await prisma.group.deleteMany()
  await prisma.tier.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log('👤 יוצר משתמשים לדוגמה...')
  const demoUsers = await Promise.all([
    prisma.user.create({ data: { name: 'מיכל כהן',    email: 'michal@example.com',  phone: '052-1234567' } }),
    prisma.user.create({ data: { name: 'דניאל לוי',    email: 'daniel@example.com',  phone: '054-2345678' } }),
    prisma.user.create({ data: { name: 'שרה מזרחי',   email: 'sarah@example.com',   phone: '050-3456789' } }),
    prisma.user.create({ data: { name: 'אביב רוזן',    email: 'aviv@example.com',    phone: '053-4567890' } }),
    prisma.user.create({ data: { name: 'נועה גלילי',   email: 'noa@example.com',     phone: '058-5678901' } }),
  ])
  console.log(`  ✓ ${demoUsers.length} משתמשים נוצרו`)

  console.log('🛍️  יוצר מוצרים ועסקאות...')
  for (const p of PRODUCTS) {
    const { tiers, initialBuyers, ...productData } = p

    // Create product + tiers in one transaction
    const product = await prisma.product.create({
      data: {
        ...productData,
        tiers: { create: tiers },
      },
    })

    // Create group with initial simulated buyers
    if (initialBuyers > 0) {
      const group = await prisma.group.create({ data: { productId: product.id } })

      // Add demo users as members (up to initialBuyers count)
      const membersToAdd = Math.min(initialBuyers, demoUsers.length)
      await prisma.groupMember.createMany({
        data: demoUsers.slice(0, membersToAdd).map((u) => ({
          groupId: group.id,
          userId: u.id,
        })),
      })
    }

    console.log(`  ✓ "${product.title}" — ${initialBuyers} קונים ראשוניים`)
  }

  const totals = {
    users:    await prisma.user.count(),
    products: await prisma.product.count(),
    tiers:    await prisma.tier.count(),
    groups:   await prisma.group.count(),
    members:  await prisma.groupMember.count(),
  }
  console.log('\n✅ Seed הושלם בהצלחה!')
  console.log(`   משתמשים: ${totals.users} | מוצרים: ${totals.products} | שלבים: ${totals.tiers} | קבוצות: ${totals.groups} | חברים: ${totals.members}`)
}

main()
  .catch((e) => { console.error('❌ שגיאה ב-seed:', e); process.exit(1) })
  .finally(async () => prisma.$disconnect())
