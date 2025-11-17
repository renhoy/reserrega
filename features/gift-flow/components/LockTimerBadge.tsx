'use client'

/**
 * =====================================================
 * LOCK TIMER BADGE COMPONENT
 * =====================================================
 * Badge displaying lock countdown timer
 * =====================================================
 */

import { useEffect, useState } from 'react'
import { Lock, Clock } from 'lucide-react'
import { Badge } from '@/shared/common/components/ui/badge'
import { cn } from '@/shared/common/lib/utils'
import { getLockTimerState, isLockInWarningState } from '../lib/gift-utils'
import type { LockTimerState } from '../types/gift.types'

interface LockTimerBadgeProps {
  lockedUntil: Date | string | null
  className?: string
  showIcon?: boolean
}

/**
 * Lock Timer Badge component
 *
 * Displays countdown timer for gift item locks with live updates
 *
 * @example
 * ```tsx
 * <LockTimerBadge lockedUntil={checkout.lockExpiresAt} />
 * <LockTimerBadge lockedUntil={item.locked_until} showIcon />
 * ```
 */
export function LockTimerBadge({
  lockedUntil,
  className,
  showIcon = true,
}: LockTimerBadgeProps) {
  const [timerState, setTimerState] = useState<LockTimerState>(() =>
    getLockTimerState(lockedUntil)
  )

  // Update timer every second
  useEffect(() => {
    if (!lockedUntil) return

    const interval = setInterval(() => {
      const newState = getLockTimerState(lockedUntil)
      setTimerState(newState)

      // Stop interval if expired
      if (newState.hasExpired) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockedUntil])

  // If no lock or expired, don't show badge
  if (!timerState.isActive) {
    return null
  }

  const isWarning = isLockInWarningState(lockedUntil)

  // Format time as MM:SS
  const formattedTime = `${timerState.minutesRemaining}:${timerState.secondsRemaining.toString().padStart(2, '0')}`

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 font-mono font-semibold tabular-nums',
        isWarning
          ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-700 animate-pulse'
          : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
        className
      )}
    >
      {showIcon && <Clock className="h-3.5 w-3.5" />}
      <span>{formattedTime}</span>
      {isWarning && <Lock className="h-3 w-3" />}
    </Badge>
  )
}

/**
 * Lock Timer Progress Bar
 *
 * Visual progress bar showing time remaining
 */
export function LockTimerProgress({
  lockedUntil,
  className,
}: {
  lockedUntil: Date | string | null
  className?: string
}) {
  const [timerState, setTimerState] = useState<LockTimerState>(() =>
    getLockTimerState(lockedUntil)
  )

  useEffect(() => {
    if (!lockedUntil) return

    const interval = setInterval(() => {
      const newState = getLockTimerState(lockedUntil)
      setTimerState(newState)

      if (newState.hasExpired) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lockedUntil])

  if (!timerState.isActive) return null

  const isWarning = timerState.percentRemaining < 33

  return (
    <div className={cn('w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2', className)}>
      <div
        className={cn(
          'h-2 rounded-full transition-all duration-1000',
          isWarning
            ? 'bg-rose-500 dark:bg-rose-600'
            : 'bg-amber-500 dark:bg-amber-600'
        )}
        style={{ width: `${timerState.percentRemaining}%` }}
      />
    </div>
  )
}
