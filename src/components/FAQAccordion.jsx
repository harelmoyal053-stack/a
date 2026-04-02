import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'מה ההבדל בין קבוצת רחישה לקנייה ישירה מקבלן?',
    a: 'בקנייה ישירה אתה לבד מול קבלן עם נסיון ניהולי רב. בקבוצת רחישה אתה חלק מגוש רוכשים שמגיע עם כוח מיקוח, עורך דין קבוצתי, שמאי מוסכם ויועץ נדל"ן — כולם מטעם הקבוצה. התוצאה: מחיר נמוך בעשרות אחוזים ותנאי חוזה טובים בהרבה.',
    cat: 'בסיס',
  },
  {
    q: 'איך הכסף שלי מוגן לאורך כל התהליך?',
    a: 'הכספים מוחזקים בחשבון נאמנות (Escrow) אצל עורך דין מוסמך, בנפרד מחשבונות היזם. אין שחרור כספים ליזם ללא אבני דרך מוגדרות בחוזה (יציקות, גמר גרוס, קבלת טופס 4 וכדומה). הכספים שלך מוגנים בכל שלב.',
    cat: 'כסף',
  },
  {
    q: 'מי מנהל את הקבוצה ומייצג אותה מול היזם?',
    a: 'הקבוצה מיוצגת על ידי רכז מקצועי מטעם DropPrice, עורך דין מקרקעין מנוסה ויועץ נדל"ן בלתי-תלוי. כל המשלוש הזה עובד לטובת הקבוצה בלבד — ולא מטעם היזם.',
    cat: 'ניהול',
  },
  {
    q: 'כמה זמן לוקח התהליך עד לקבלת המפתחות?',
    a: 'בפרויקטים בשלבים מוקדמים (טרום יציקה) — 3-4 שנים. בפרויקטים בשלבים מתקדמים — 1-2 שנים. הרכז שלנו מציג לכל לקוח את ציר הזמן הצפוי לפרויקט הספציפי שמתאים לו.',
    cat: 'לוחות זמנים',
  },
  {
    q: 'האם אני יכול לצאת מהקבוצה אם שינית דעתך?',
    a: 'עד לחתימת החוזה הקבוצתי — ביטול אפשרי ללא עלות. לאחר חתימה, תנאי הביטול מוגדרים בחוזה, בדרך כלל עם אפשרות להעברת הזכות לרוכש חלופי. הרכז שלנו ילווה אותך בכל תרחיש.',
    cat: 'גמישות',
  },
  {
    q: 'מה גובה ההנחה שאפשר לצפות לה?',
    a: 'ההנחה הממוצעת בקבוצות שליוינו עמדה על 12%–22% מהמחיר הרשמי של היזם, בתלות בגודל הקבוצה, שלב הפרויקט ועוצמת המיקוח. על נכס של ₪2M — מדובר בחיסכון של ₪240,000–₪440,000.',
    cat: 'כסף',
  },
  {
    q: 'האם ניתן לקנות דרך משכנתא?',
    a: 'בהחלט. רוב חברי הקבוצות שלנו מממנים חלק מהרכישה במשכנתא. הרכז שלנו עובד בשיתוף עם יועצי משכנתא שמכירים את הספציפיקה של רכישה קבוצתית ויכולים לסייע לך לקבל את התנאים הטובים ביותר.',
    cat: 'מימון',
  },
  {
    q: 'מה ההבדל בין "קבוצת רחישה" ל"קבוצת רכישה"?',
    a: '"קבוצת רחישה" (הגדרת המינהל האזרחי והרשות לניירות ערך) ו-"קבוצת רכישה" הן מינוחים נרדפים. בשני המקרים מדובר בקבוצת יחידים שמתאגדת לרכוש נכס יחד ישירות מיזם, תוך דילוג על מתווכים ושמירה על כוח קנייה משותף.',
    cat: 'בסיס',
  },
]

const CAT_COLORS = {
  בסיס: '#00ff88',
  כסף: '#f5c518',
  ניהול: '#00b4ff',
  'לוחות זמנים': '#a855f7',
  גמישות: '#f97316',
  מימון: '#10b981',
}

export default function FAQAccordion() {
  const [open,   setOpen]   = useState(null)
  const [filter, setFilter] = useState('הכל')

  const categories = ['הכל', ...new Set(FAQS.map(f => f.cat))]
  const visible    = filter === 'הכל' ? FAQS : FAQS.filter(f => f.cat === filter)

  return (
    <section className="py-16 px-4" dir="rtl"
      style={{ background: 'linear-gradient(180deg, #040912 0%, #050810 100%)' }}>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold"
            style={{ background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.35)', color: '#00b4ff' }}>
            <HelpCircle className="w-4 h-4" />
            <span>שאלות נפוצות</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            כל מה ש<span style={{ color: '#00b4ff', textShadow: '0 0 14px rgba(0,180,255,0.5)' }}>רצית לדעת</span>
          </h2>
          <p className="text-slate-400 text-lg">
            יש לך שאלה שלא ענינו עליה? <span className="text-white font-bold">צור קשר</span> ונחזור אליך תוך 24 שעות.
          </p>
        </motion.div>

        {/* Category filter chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => {
            const color = cat === 'הכל' ? '#ffffff' : CAT_COLORS[cat] || '#ffffff'
            const isActive = filter === cat
            return (
              <motion.button
                key={cat}
                onClick={() => { setFilter(cat); setOpen(null) }}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
                style={isActive
                  ? { background: `${color}20`, border: `1px solid ${color}60`, color }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }
                }
                whileTap={{ scale: 0.94 }}
              >
                {cat}
              </motion.button>
            )
          })}
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          <AnimatePresence>
            {visible.map((faq, i) => {
              const isOpen  = open === i
              const color   = CAT_COLORS[faq.cat] || '#00ff88'

              return (
                <motion.div
                  key={`${filter}-${i}`}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: isOpen ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.07)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  layout
                >
                  {/* Question row */}
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-right transition-colors"
                    style={isOpen
                      ? { background: `${color}0a` }
                      : { background: 'rgba(10,14,26,0.8)' }
                    }
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {/* Chevron */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" style={{ color: isOpen ? color : '#4a5568' }} />
                    </motion.div>

                    {/* Category chip */}
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 hidden sm:inline"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {faq.cat}
                    </span>

                    <span className="flex-1 font-bold text-white text-base">{faq.q}</span>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-5 pb-5 pt-1"
                          style={{ background: `${color}06`, borderTop: `1px solid ${color}15` }}>
                          <p className="text-slate-300 leading-relaxed text-sm">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Still have questions */}
        <motion.div
          className="mt-8 text-center rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-300 font-semibold mb-3">עדיין יש לך שאלה?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              className="btn-neon px-5 py-2.5 rounded-xl font-bold text-sm"
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              השאר פרטים ונחזור אליך
            </motion.button>
            <a
              href="tel:*1234"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2eaf8' }}
            >
              📞 *1234 — שירות לקוחות
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
