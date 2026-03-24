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
    title: 'אייפון 15 פרו מקס 256GB',
    subtitle: 'טיטניום שחור | אחריות Apple ישראל',
    emoji: '📱',
    category: 'טכנולוגיה',
    badge: 'פופולרי',
    badgeColor: 'bg-blue-500',
    basePrice: 5990, originalPrice: 5990, currentPrice: 4490,
    targetBuyers: 30, endTime: hoursFromNow(3.5),
    rating: 4.9, reviews: 1284,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 5990 },
      { requiredParticipants: 10, priceAtTier: 4990 },
      { requiredParticipants: 20, priceAtTier: 4490 },
      { requiredParticipants: 30, priceAtTier: 3990 },
    ],
    initialBuyers: 18,
  },
  {
    title: 'ארוחת פיצה משפחתית XL',
    subtitle: 'פיצה 50 ס"מ + שתייה 1.5 ל׳ + 2 תוספות',
    emoji: '🍕',
    category: 'מזון',
    badge: 'מבצע חם',
    badgeColor: 'bg-orange-500',
    basePrice: 129, originalPrice: 129, currentPrice: 79,
    targetBuyers: 20, endTime: hoursFromNow(1.5),
    rating: 4.9, reviews: 843,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 129 },
      { requiredParticipants: 8,  priceAtTier: 99  },
      { requiredParticipants: 20, priceAtTier: 79  },
      { requiredParticipants: 40, priceAtTier: 65  },
    ],
    initialBuyers: 9,
  },
  {
    title: 'תדלוק מלא - בנזין 95',
    subtitle: 'עד 60 ליטר | תקף בכל תחנות פז',
    emoji: '⛽',
    category: 'שירותים',
    badge: 'חוסך כסף',
    badgeColor: 'bg-yellow-600',
    basePrice: 396, originalPrice: 396, currentPrice: 299,
    targetBuyers: 50, endTime: hoursFromNow(4.17),
    rating: 4.7, reviews: 2091,
    tiers: [
      { requiredParticipants: 0,   priceAtTier: 396 },
      { requiredParticipants: 20,  priceAtTier: 340 },
      { requiredParticipants: 50,  priceAtTier: 299 },
      { requiredParticipants: 100, priceAtTier: 265 },
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
  {
    title: 'סוף שבוע באילת - מלון 4★',
    subtitle: '2 לילות + ארוחת בוקר | אפריל 2026',
    emoji: '🏖️',
    category: 'נסיעות',
    badge: 'עסקת הדגל',
    badgeColor: 'bg-cyan-600',
    basePrice: 1299, originalPrice: 1299, currentPrice: 799,
    targetBuyers: 40, endTime: hoursFromNow(6),
    rating: 4.8, reviews: 562,
    tiers: [
      { requiredParticipants: 0,  priceAtTier: 1299 },
      { requiredParticipants: 15, priceAtTier: 999  },
      { requiredParticipants: 30, priceAtTier: 799  },
      { requiredParticipants: 50, priceAtTier: 699  },
    ],
    initialBuyers: 24,
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
