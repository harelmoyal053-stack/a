import { motion } from 'framer-motion'

/**
 * VipBadge — shown when the user has referred 3+ friends
 * Props:
 *   referralCount: number
 *   isVip: boolean
 *   size: "sm" | "md" (default "md")
 */
export default function VipBadge({ referralCount = 0, isVip = false, size = 'md' }) {
  const VIP_THRESHOLD = 3
  const progress = Math.min(referralCount, VIP_THRESHOLD)
  const isSm = size === 'sm'

  if (!isVip && referralCount === 0) return null

  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${isSm ? 'p-3' : 'p-4'}`}
      style={{
        background: isVip
          ? 'linear-gradient(135deg, rgba(123,47,247,0.15), rgba(255,215,0,0.08))'
          : 'rgba(123,47,247,0.08)',
        border: isVip
          ? '1px solid rgba(255,215,0,0.35)'
          : '1px solid rgba(123,47,247,0.25)',
        boxShadow: isVip ? '0 0 30px rgba(255,215,0,0.1)' : 'none',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 18 }}
    >
      <div className="flex items-center gap-3">
        {/* Badge icon */}
        <div className={`${isSm ? 'w-10 h-10 text-2xl' : 'w-12 h-12 text-3xl'} rounded-xl flex items-center justify-center shrink-0`}
          style={{
            background: isVip
              ? 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(123,47,247,0.2))'
              : 'rgba(123,47,247,0.15)',
            border: isVip ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(123,47,247,0.3)',
          }}>
          {isVip ? '🌟' : '🏅'}
        </div>

        <div className="flex-1 text-right min-w-0">
          {isVip ? (
            <>
              <div className="flex items-center gap-2 justify-end">
                <p className={`font-black ${isSm ? 'text-sm' : 'text-base'}`}
                  style={{ background: 'linear-gradient(135deg, #ffd700, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  VIP Member 👑
                </p>
              </div>
              <p className={`${isSm ? 'text-xs' : 'text-sm'} text-slate-400 mt-0.5`}>
                הפנית {referralCount} חברים • 5% הנחה נוספת 🎁
              </p>
            </>
          ) : (
            <>
              <p className={`font-bold ${isSm ? 'text-xs' : 'text-sm'} text-purple-300`}>
                {referralCount}/{VIP_THRESHOLD} הפניות ל-VIP 🚀
              </p>
              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,47,247,0.2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7b2ff7, #a855f7)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / VIP_THRESHOLD) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1">
                עוד {VIP_THRESHOLD - progress} הפניות לקבלת VIP + 5% הנחה
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
