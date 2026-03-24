'use strict'
const path = require('path')
// Set absolute DATABASE_URL before loading Prisma
process.env.DATABASE_URL = `file:${path.resolve(__dirname, 'dev.db')}`

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const hoursFromNow = (h) => new Date(Date.now() + h * 3_600_000)

// ── Enough seed users to cover the largest initialBuyers count (37) ───────────
function makeUsers(n) {
  const firstNames = ['מיכל','דניאל','שרה','אביב','נועה','יוסי','רנה','עמית','לאה','גל',
                      'יואב','מיה','ניר','הדס','תמר','ברק','שי','ליאור','אלון','ריטה',
                      'טל','אורן','מוראל','אסף','יעל','רון','נדב','מאיה','איתי','הילה',
                      'ידין','ורד','דרור','שמעון','כרמית','נחום','פנינה']
  const lastNames  = ['כהן','לוי','מזרחי','פרץ','ביטון','אזולאי','שפירא','גרוס','דהן','שמש']

  return Array.from({ length: n }, (_, i) => ({
    name:  `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `seed_user_${i + 1}@dropprice.app`,
    phone: `05${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
  }))
}

const PRODUCTS = [
  {
    title: 'מארז חיתולים פמפרס XL',
    subtitle: '120 יחידות | מידה 4',
    emoji: '👶',
    category: 'תינוקות',
    badge: 'פופולרי',
    badgeColor: 'bg-blue-500',
    basePrice: 149, originalPrice: 149, currentPrice: 89,
    targetBuyers: 25, endTime: hoursFromNow(2.75),
    rating: 4.8, reviews: 234,
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
    basePrice: 89, originalPrice: 89, currentPrice: 45,
    targetBuyers: 15, endTime: hoursFromNow(1.38),
    rating: 4.9, reviews: 567,
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
    basePrice: 198, originalPrice: 198, currentPrice: 142,
    targetBuyers: 50, endTime: hoursFromNow(4.17),
    rating: 4.7, reviews: 891,
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
    basePrice: 110, originalPrice: 110, currentPrice: 65,
    targetBuyers: 20, endTime: hoursFromNow(0.98),
    rating: 4.6, reviews: 312,
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
    basePrice: 320, originalPrice: 320, currentPrice: 189,
    targetBuyers: 30, endTime: hoursFromNow(5.5),
    rating: 4.5, reviews: 128,
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
    basePrice: 135, originalPrice: 135, currentPrice: 78,
    targetBuyers: 25, endTime: hoursFromNow(3.25),
    rating: 4.9, reviews: 445,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 135 },
      { requiredParticipants: 12, priceAtTier: 78  },
      { requiredParticipants: 25, priceAtTier: 62  },
      { requiredParticipants: 50, priceAtTier: 49  },
    ],
    initialBuyers: 19,
  },
]

// ── Realistic Hebrew activity feed messages per deal ─────────────────────────
const ACTIVITY_TEMPLATES = [
  // [type, userName, content template — {n} = buyers remaining, {p} = next price]
  ['join',    'System',   'ברוכים הבאים לקבוצה! הצטרפו עד כה {buyers} אנשים 🙌'],
  ['chat',    'דני כהן',  'יאללה חברים, שתפו בקבוצת ה-WhatsApp שנוריד את המחיר 🔥'],
  ['chat',    'מיכל לוי', 'שיתפתי בקבוצת האמהות, בדרך עוד אנשים 💪'],
  ['join',    'System',   'עוד {remaining} קונים ומגיעים למחיר ₪{nextPrice}! ⏳'],
  ['chat',    'שרה מ.',   'מישהו יכול לשתף בקבוצת החברים? ננסה להגיע ל-{remaining} יחד'],
  ['chat',    'יוסי ב.',  'כבר שיתפתי בגרופ של העבודה, מחכים לתגובות 👍'],
  ['chat',    'נועה ג.',  'הדיל הזה מטורף! שיתפתי גם בטלגרם 📣'],
  ['referral','System',   '🔗 אבי הצטרף דרך שיתוף של דני! כבר {buyers} בקבוצה'],
  ['chat',    'רן ש.',    'מחיר כזה לא ראיתי בשום מקום אחר 😱'],
]

async function seedActivity(productId, buyers, nextPrice, remaining) {
  const messages = ACTIVITY_TEMPLATES.slice(0, 7).map(([ type, userName, tpl ], i) => ({
    productId,
    type,
    userName,
    content: tpl
      .replace('{buyers}', buyers)
      .replace('{nextPrice}', nextPrice)
      .replace('{remaining}', remaining),
    // Stagger times so they look natural
    createdAt: new Date(Date.now() - (7 - i) * 8 * 60 * 1000),
  }))
  await prisma.activityMessage.createMany({ data: messages })
}

async function main() {
  const maxBuyers = Math.max(...PRODUCTS.map(p => p.initialBuyers))
  console.log(`🌱 מנקה נתונים ישנים...`)
  await prisma.activityMessage.deleteMany()
  await prisma.groupMember.deleteMany()
  await prisma.group.deleteMany()
  await prisma.tier.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log(`👤 יוצר ${maxBuyers} משתמשי seed...`)
  const users = await Promise.all(
    makeUsers(maxBuyers).map(u => prisma.user.create({ data: u }))
  )
  console.log(`  ✓ ${users.length} משתמשים נוצרו`)

  console.log('🛍️  יוצר מוצרים...')
  for (const p of PRODUCTS) {
    const { tiers, initialBuyers, ...productData } = p

    const product = await prisma.product.create({
      data: { ...productData, tiers: { create: tiers } },
    })

    // Create group with exactly initialBuyers members
    const group = await prisma.group.create({ data: { productId: product.id } })
    await prisma.groupMember.createMany({
      data: users.slice(0, initialBuyers).map(u => ({
        groupId: group.id,
        userId:  u.id,
      })),
    })

    // Recompute currentPrice based on actual tier for initialBuyers count
    const sortedTiers = [...tiers].sort((a, b) => a.requiredParticipants - b.requiredParticipants)
    let correctPrice = productData.basePrice
    for (const t of sortedTiers) {
      if (initialBuyers >= t.requiredParticipants) correctPrice = t.priceAtTier
    }
    if (correctPrice !== productData.currentPrice) {
      await prisma.product.update({ where: { id: product.id }, data: { currentPrice: correctPrice } })
    }

    // Seed activity feed for this deal
    const nextTierData = sortedTiers.find(t => t.requiredParticipants > initialBuyers)
    const nextPrice = nextTierData?.priceAtTier ?? correctPrice
    const remaining = nextTierData ? (nextTierData.requiredParticipants - initialBuyers) : 0
    await seedActivity(product.id, initialBuyers, nextPrice, remaining)

    console.log(`  ✓ "${product.title}" — ${initialBuyers} קונים, מחיר נוכחי ₪${correctPrice}`)
  }

  const totals = {
    users:    await prisma.user.count(),
    products: await prisma.product.count(),
    members:  await prisma.groupMember.count(),
  }
  console.log(`\n✅ Seed הושלם! משתמשים: ${totals.users} | מוצרים: ${totals.products} | קונים: ${totals.members}`)
}

main()
  .catch(e => { console.error('❌ Seed נכשל:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
