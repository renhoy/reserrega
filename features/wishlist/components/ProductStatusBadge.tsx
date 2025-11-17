'use client'

/**
 * =====================================================
 * PRODUCT STATUS BADGE COMPONENT
 * =====================================================
 * Badge component to display wishlist product status
 * =====================================================
 */

import { Check, Clock, Gift, X, AlertCircle } from 'lucide-react'
import { Badge } from '@/shared/common/components/ui/badge'
import { cn } from '@/shared/common/lib/utils'
import type { WishlistStatus } from '../types/wishlist.types'
import { formatWishlistStatus, getStatusColor } from '../lib/wishlist-utils'

interface ProductStatusBadgeProps {
  status: WishlistStatus
  isExpired?: boolean
  className?: string
  showIcon?: boolean
}

/**
 * Product Status Badge component
 *
 * Displays wishlist item status with color coding
 *
 * @example
 * ```tsx
 * <ProductStatusBadge status="available" />
 * <ProductStatusBadge status="in_process" showIcon />
 * <ProductStatusBadge status="available" isExpired />
 * ```
 */
export function ProductStatusBadge({
  status,
  isExpired = false,
  className,
  showIcon = true,
}: ProductStatusBadgeProps) {
  // If expired, override status display
  const displayStatus = isExpired ? 'expired' : status
  const statusText = isExpired ? 'Expirado' : formatWishlistStatus(status)
  const colorScheme = getStatusColor(displayStatus)

  // Icon mapping
  const iconMap: Record<WishlistStatus, typeof Check> = {
    available: Check,
    in_process: Clock,
    gifted: Gift,
    expired: X,
  }

  const Icon = iconMap[displayStatus]

  // Color variants
  const colorClasses = {
    lime: 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/20 dark:text-lime-400 dark:border-lime-800',
    amber: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    violet: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
    gray: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1 font-medium',
        colorClasses[colorScheme as keyof typeof colorClasses],
        className
      )}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      <span>{statusText}</span>
      {isExpired && <AlertCircle className="h-3 w-3 ml-1" />}
    </Badge>
  )
}
