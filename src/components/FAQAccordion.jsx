import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'מה ההבדל בין קבוצת רחישה לקנייה ישירה מקבלן?',
    a: 'בקנייה ישירה אתה לבד מול קבלן עם נסיון רב. בקבוצת רחישה אתה חלק מגוש רוכשים שמגיע עם כוח מיקוח, עורך דין קבוצתי, שמאי מוסכם ויועץ נדל"ן — כולם מטעם הקבוצה. התוצאה: מחיר נמוך בעשרות אחוזים ותנאי חוזה טובים בהרבה.',
    cat: 'בסיס',
  },
  {
    q: 'איך הכסף שלי מוגן לאורך כל התהליך?',
    a: 'הכספים מוחזקים בחשבון נאמנות (Escrow) אצל עורך דין מוסמך, בנפרד מחשבונות היזם. אין שחרור כספים ליזם ללא אבני דרך מוגדרות בחוזה. הכספים שלך מוגנים בכל שלב.',
    cat: 'כסף',
  },
  {
    q: 'מי מנהל את הקבוצה ומייצג אותה מול היזם?',
    a: 'הקבוצה מיוצגת על ידי רכז מקצועי מטעם DropPrice, עורך דין מקרקעין מנוסה ויועץ נדל"ן בלתי-תלוי. כל המשלוש הזה עובד לטובת הקבוצה בלבד — ולא מטעם היזם.',
    cat: 'ניהול',
  },
  {
    q: 'כמה זמן לוקח התהליך עד לקבלת המפתחות?',
    a: 'בפרויקטים בשלבים מוקדמים — 3-4 שנים. בפרויקטים מתקדמים — 1-2 שנים. הרכז שלנו מציג לכל לקוח את ציר הזמן הצפוי לפרויקט הספציפי.',
    cat: 'לוחות זמנים',
  },
  {
    q: 'האם אני יכול לצאת מהקבוצה אם שינית דעתך?',
    a: 'עד לחתימת החוזה הקבוצתי — ביטול אפשרי ללא עלות. לאחר חתימה, תנאי הביטול מוגדרים בחוזה, בדרך כלל עם אפשרות להעברת הזכות לרוכש חלופי.',
    cat: 'גמישות',
  },
  {
    q: 'מה גובה ההנחה שאפשר לצפות לה?',
    a: 'ההנחה הממוצעת בקבוצות שליוינו עמדה על 12%–22% מהמחיר הרשמי של היזם. על נכס של ₪2M — מדובר בחיסכון של ₪240,000–₪440,000.',
    cat: 'כסף',
  },
  {
    q: 'האם ניתן לקנות דרך משכנתא?',
    a: 'בהחלט. רוב חברי הקבוצות שלנו מממנים חלק מהרכישה במשכנתא. הרכז שלנו עובד עם יועצי משכנתא שמכירים את הספציפיקה של רכישה קבוצתית.',
    cat: 'מימון',
  },
  {
    q: 'מה ההבדל בין "קבוצת רחישה" ל"קבוצת רכישה"?',
    a: '"קבוצת רחישה" ו-"קבוצת רכישה" הם מינוחים נרדפים — קבוצת יחידים שמתאגדת לרכוש נכס ישירות מיזם, תוך דילוג על מתווכים ושמירה על כוח קנייה משותף.',
    cat: 'בסיס',
  },
]

export default function FAQAccordion() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-16 px-4" style={{ background: '#fff' }} dir="rtl">
      <div className="max-w-3xl mx-auto">

        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="chip-navy mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            שאלות נפוצות
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3" style={{ color: '#0f1f3d' }}>
            כל מה ש<span style={{ color: '#0f2d5e' }}>רצית לדעת</span>
          </h2>
          <p className="text-lg" style={{ color: '#64748b' }}>
            יש לך שאלה נוספת?{' '}
            <button
              className="font-bold underline underline-offset-2"
              style={{ color: '#0f2d5e' }}
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
              השאר פרטים
            </button>{' '}
            ונחזור אליך.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div key={i}
                className="rounded-2xl overflow-hidden"
                style={{ border: isOpen ? '1.5px solid #0f2d5e' : '1px solid #e2e8f0' }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                layout>

                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-right transition-colors"
                  style={{ background: isOpen ? '#f7f9fc' : '#fff' }}
                  onClick={() => setOpen(isOpen ? null : i)}>

                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                    <ChevronDown className="w-5 h-5 shrink-0"
                      style={{ color: isOpen ? '#0f2d5e' : '#94a3b8' }} />
                  </motion.div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline chip-navy">
                    {faq.cat}
                  </span>

                  <span className="flex-1 font-bold text-base" style={{ color: '#0f1f3d' }}>{faq.q}</span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}>
                      <div className="px-5 pb-5 pt-1"
                        style={{ background: '#f7f9fc', borderTop: '1px solid #e2e8f0' }}>
                        <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <motion.div className="mt-8 text-center rounded-2xl p-6"
          style={{ background: '#f7f9fc', border: '1px solid #e2e8f0' }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-semibold mb-3" style={{ color: '#475569' }}>עדיין יש לך שאלה?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              className="btn-gold px-5 py-2.5 rounded-xl text-sm"
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}>
              השאר פרטים ונחזור אליך
            </motion.button>
            <a href="tel:*1234"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: '#fff', border: '1.5px solid #e2e8f0', color: '#0f2d5e' }}>
              📞 *1234 — שירות לקוחות
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
