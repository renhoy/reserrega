/**
 * =====================================================
 * GIFT-FLOW MODULE - Utility Functions
 * =====================================================
 * Helper functions for gift operations
 * =====================================================
 */

import { differenceInMinutes, addMinutes, isPast, parseISO, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import type {
  PaymentStatus,
  ShippingStatus,
  WishlistStatus,
  LockStatus,
  LockTimerState,
  GiftStats,
  GiftWithDetails,
} from '../types/gift.types'

// =====================================================
// CONSTANTS
// =====================================================

/** Default lock duration in minutes */
export const DEFAULT_LOCK_DURATION_MINUTES = 15

/** Minimum time remaining for lock warning (minutes) */
export const LOCK_WARNING_THRESHOLD_MINUTES = 5

// =====================================================
// LOCK MANAGEMENT
// =====================================================

/**
 * Calculate lock expiration date
 *
 * @param durationMinutes - Duration in minutes (default: 15)
 * @returns Expiration date
 *
 * @example
 * ```ts
 * const expiresAt = calculateLockExpiration()
 * const expiresAt30 = calculateLockExpiration(30)
 * ```
 */
export function calculateLockExpiration(
  durationMinutes: number = DEFAULT_LOCK_DURATION_MINUTES
): Date {
  return addMinutes(new Date(), durationMinutes)
}

/**
 * Check if a lock is expired
 *
 * @param lockedUntil - Lock expiration date (ISO string or Date)
 * @returns True if expired
 *
 * @example
 * ```ts
 * isLockExpired('2024-01-15T10:00:00Z') // true (if past)
 * ```
 */
export function isLockExpired(lockedUntil: string | Date | null): boolean {
  if (!lockedUntil) return true
  const expirationDate = typeof lockedUntil === 'string' ? parseISO(lockedUntil) : lockedUntil
  return isPast(expirationDate)
}

/**
 * Get time remaining on a lock in minutes
 *
 * @param lockedUntil - Lock expiration date (ISO string or Date)
 * @returns Minutes remaining (0 if expired)
 *
 * @example
 * ```ts
 * const remaining = getLockTimeRemaining('2024-12-31T23:59:59Z')
 * console.log(`${remaining} minutes left`)
 * ```
 */
export function getLockTimeRemaining(lockedUntil: string | Date | null): number {
  if (!lockedUntil) return 0
  const expirationDate = typeof lockedUntil === 'string' ? parseISO(lockedUntil) : lockedUntil
  const now = new Date()
  const minutesRemaining = differenceInMinutes(expirationDate, now)
  return Math.max(0, minutesRemaining)
}

/**
 * Get detailed lock timer state
 *
 * @param lockedUntil - Lock expiration date (ISO string or Date)
 * @returns Lock timer state object
 *
 * @example
 * ```ts
 * const timer = getLockTimerState(checkout.lockExpiresAt)
 * if (timer.hasExpired) {
 *   // Show expiration message
 * }
 * ```
 */
export function getLockTimerState(lockedUntil: string | Date | null): LockTimerState {
  if (!lockedUntil) {
    return {
      isActive: false,
      minutesRemaining: 0,
      secondsRemaining: 0,
      percentRemaining: 0,
      hasExpired: true,
    }
  }

  const expirationDate = typeof lockedUntil === 'string' ? parseISO(lockedUntil) : lockedUntil
  const now = new Date()
  const totalSeconds = Math.floor((expirationDate.getTime() - now.getTime()) / 1000)
  const hasExpired = totalSeconds <= 0

  const minutesRemaining = Math.floor(totalSeconds / 60)
  const secondsRemaining = totalSeconds % 60
  const percentRemaining = Math.min(
    100,
    (totalSeconds / (DEFAULT_LOCK_DURATION_MINUTES * 60)) * 100
  )

  return {
    isActive: !hasExpired,
    minutesRemaining: Math.max(0, minutesRemaining),
    secondsRemaining: Math.max(0, secondsRemaining),
    percentRemaining: Math.max(0, percentRemaining),
    hasExpired,
  }
}

/**
 * Check if current user can release a lock
 *
 * @param lockBuyerId - ID of user who locked the item
 * @param currentUserId - ID of current user
 * @returns True if user can release
 *
 * @example
 * ```ts
 * if (canReleaseLock(lock.buyerId, user.id)) {
 *   // Show "Cancel" button
 * }
 * ```
 */
export function canReleaseLock(lockBuyerId: string, currentUserId: string): boolean {
  return lockBuyerId === currentUserId
}

/**
 * Format lock time remaining to human-readable text
 *
 * @param lockedUntil - Lock expiration date
 * @returns Formatted text
 *
 * @example
 * ```ts
 * formatLockTimeRemaining(expiresAt) // "Expira en 12 minutos"
 * ```
 */
export function formatLockTimeRemaining(lockedUntil: string | Date | null): string {
  if (!lockedUntil) return 'Sin bloqueo'

  const expirationDate = typeof lockedUntil === 'string' ? parseISO(lockedUntil) : lockedUntil
  const minutesRemaining = getLockTimeRemaining(expirationDate)

  if (minutesRemaining === 0) {
    return 'Bloqueo expirado'
  } else if (minutesRemaining === 1) {
    return 'Expira en 1 minuto'
  } else if (minutesRemaining <= LOCK_WARNING_THRESHOLD_MINUTES) {
    return `Expira en ${minutesRemaining} minutos`
  } else {
    return `${minutesRemaining} minutos restantes`
  }
}

/**
 * Check if lock is in warning state (< 5 minutes remaining)
 *
 * @param lockedUntil - Lock expiration date
 * @returns True if in warning state
 */
export function isLockInWarningState(lockedUntil: string | Date | null): boolean {
  const minutesRemaining = getLockTimeRemaining(lockedUntil)
  return minutesRemaining > 0 && minutesRemaining <= LOCK_WARNING_THRESHOLD_MINUTES
}

// =====================================================
// STATUS FORMATTING
// =====================================================

/**
 * Format payment status to human-readable Spanish text
 *
 * @param status - Payment status
 * @returns Formatted status text
 *
 * @example
 * ```ts
 * formatPaymentStatus('completed') // 'Completado'
 * formatPaymentStatus('pending') // 'Pendiente'
 * ```
 */
export function formatPaymentStatus(status: PaymentStatus): string {
  const statusMap: Record<PaymentStatus, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  }

  return statusMap[status] || status
}

/**
 * Format shipping status to human-readable Spanish text
 *
 * @param status - Shipping status
 * @returns Formatted status text
 *
 * @example
 * ```ts
 * formatShippingStatus('shipped') // 'Enviado'
 * formatShippingStatus('delivered') // 'Entregado'
 * ```
 */
export function formatShippingStatus(status: ShippingStatus): string {
  const statusMap: Record<ShippingStatus, string> = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }

  return statusMap[status] || status
}

/**
 * Get payment status color for UI display
 *
 * @param status - Payment status
 * @returns Tailwind color class
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colorMap: Record<PaymentStatus, string> = {
    pending: 'amber',
    completed: 'lime',
    failed: 'rose',
    refunded: 'gray',
  }

  return colorMap[status] || 'gray'
}

/**
 * Get shipping status color for UI display
 *
 * @param status - Shipping status
 * @returns Tailwind color class
 */
export function getShippingStatusColor(status: ShippingStatus): string {
  const colorMap: Record<ShippingStatus, string> = {
    pending: 'amber',
    shipped: 'sky',
    delivered: 'lime',
    cancelled: 'gray',
  }

  return colorMap[status] || 'gray'
}

/**
 * Get payment status icon name
 *
 * @param status - Payment status
 * @returns Lucide icon name
 */
export function getPaymentStatusIcon(status: PaymentStatus): string {
  const iconMap: Record<PaymentStatus, string> = {
    pending: 'Clock',
    completed: 'CheckCircle',
    failed: 'XCircle',
    refunded: 'RotateCcw',
  }

  return iconMap[status] || 'HelpCircle'
}

/**
 * Get shipping status icon name
 *
 * @param status - Shipping status
 * @returns Lucide icon name
 */
export function getShippingStatusIcon(status: ShippingStatus): string {
  const iconMap: Record<ShippingStatus, string> = {
    pending: 'Package',
    shipped: 'Truck',
    delivered: 'Home',
    cancelled: 'X',
  }

  return iconMap[status] || 'HelpCircle'
}

// =====================================================
// GIFT VALIDATION
// =====================================================

/**
 * Check if a wishlist item can be gifted
 *
 * @param status - Wishlist item status
 * @param isLocked - Whether item is currently locked
 * @param lockedByCurrentUser - Whether current user has the lock
 * @returns True if item can be gifted
 *
 * @example
 * ```ts
 * if (canGiftItem(item.status, lockStatus.isLocked, lockStatus.canRelease)) {
 *   // Show "Select Gift" button
 * }
 * ```
 */
export function canGiftItem(
  status: WishlistStatus,
  isLocked: boolean,
  lockedByCurrentUser: boolean
): boolean {
  // Can only gift available items
  if (status !== 'available') return false

  // If locked by someone else, cannot gift
  if (isLocked && !lockedByCurrentUser) return false

  return true
}

/**
 * Check if a wishlist status allows gifting
 *
 * @param status - Wishlist status
 * @returns True if status is giftable
 */
export function isGiftableStatus(status: WishlistStatus): boolean {
  return status === 'available'
}

/**
 * Validate gift transaction data
 *
 * @param amount - Gift amount
 * @param productPrice - Product price
 * @returns Validation result
 */
export function validateGiftTransaction(
  amount: number,
  productPrice: number
): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: 'El monto debe ser mayor a 0' }
  }

  if (amount !== productPrice) {
    return {
      valid: false,
      error: 'El monto no coincide con el precio del producto',
    }
  }

  return { valid: true }
}

/**
 * Check if gift can be delivered/confirmed
 *
 * @param paymentStatus - Payment status
 * @param shippingStatus - Shipping status
 * @returns True if can be confirmed as delivered
 */
export function canConfirmDelivery(
  paymentStatus: PaymentStatus,
  shippingStatus: ShippingStatus
): boolean {
  return paymentStatus === 'completed' && shippingStatus === 'shipped'
}

// =====================================================
// FORMATTING HELPERS
// =====================================================

/**
 * Generate unique order number for a gift
 *
 * @param giftId - Gift UUID
 * @returns Order number (e.g., "GF-ABC123")
 *
 * @example
 * ```ts
 * const orderNum = generateOrderNumber(gift.id)
 * // "GF-A1B2C3"
 * ```
 */
export function generateOrderNumber(giftId: string): string {
  // Take first 6 chars of UUID and uppercase
  const shortId = giftId.replace(/-/g, '').substring(0, 6).toUpperCase()
  return `GF-${shortId}`
}

/**
 * Format gift amount with currency
 *
 * @param amount - Amount in euros
 * @returns Formatted amount
 *
 * @example
 * ```ts
 * formatGiftAmount(49.99) // "49,99 €"
 * formatGiftAmount(100) // "100,00 €"
 * ```
 */
export function formatGiftAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Format date for gift display
 *
 * @param date - Date (ISO string or Date)
 * @returns Formatted relative date
 *
 * @example
 * ```ts
 * formatGiftDate('2024-01-15T10:00:00Z') // "hace 2 días"
 * ```
 */
export function formatGiftDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: es })
}

/**
 * Format delivery date
 *
 * @param date - Date (ISO string or Date) or null
 * @returns Formatted date or "Pendiente"
 */
export function formatDeliveryDate(date: string | Date | null): string {
  if (!date) return 'Pendiente'
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

// =====================================================
// STATISTICS
// =====================================================

/**
 * Calculate gift statistics for a user
 *
 * @param sentGifts - Array of gifts sent by user
 * @param receivedGifts - Array of gifts received by user
 * @returns Statistics object
 *
 * @example
 * ```ts
 * const stats = calculateGiftStats(sent, received)
 * console.log(`Total spent: ${formatGiftAmount(stats.totalSpent)}`)
 * ```
 */
export function calculateGiftStats(
  sentGifts: GiftWithDetails[],
  receivedGifts: GiftWithDetails[]
): GiftStats {
  const totalSpent = sentGifts.reduce((sum, gift) => sum + gift.amount, 0)
  const pendingDeliveries = sentGifts.filter(
    (gift) => gift.shipping_status === 'pending' || gift.shipping_status === 'shipped'
  ).length

  return {
    totalSent: sentGifts.length,
    totalReceived: receivedGifts.length,
    totalSpent,
    pendingDeliveries,
  }
}

/**
 * Get gift stats by status
 *
 * @param gifts - Array of gifts
 * @returns Object with counts by status
 */
export function getGiftStatsByStatus(gifts: GiftWithDetails[]): Record<string, number> {
  return {
    pending: gifts.filter((g) => g.payment_status === 'pending').length,
    completed: gifts.filter((g) => g.payment_status === 'completed').length,
    failed: gifts.filter((g) => g.payment_status === 'failed').length,
    refunded: gifts.filter((g) => g.payment_status === 'refunded').length,
  }
}

/**
 * Get gift stats by shipping status
 *
 * @param gifts - Array of gifts
 * @returns Object with counts by shipping status
 */
export function getGiftStatsByShipping(gifts: GiftWithDetails[]): Record<string, number> {
  return {
    pending: gifts.filter((g) => g.shipping_status === 'pending').length,
    shipped: gifts.filter((g) => g.shipping_status === 'shipped').length,
    delivered: gifts.filter((g) => g.shipping_status === 'delivered').length,
    cancelled: gifts.filter((g) => g.shipping_status === 'cancelled').length,
  }
}

// =====================================================
// FILTERING
// =====================================================

/**
 * Filter gifts by payment status
 *
 * @param gifts - Array of gifts
 * @param status - Status to filter by (or array of statuses)
 * @returns Filtered gifts
 */
export function filterByPaymentStatus(
  gifts: GiftWithDetails[],
  status: PaymentStatus | PaymentStatus[]
): GiftWithDetails[] {
  const statuses = Array.isArray(status) ? status : [status]
  return gifts.filter((gift) => statuses.includes(gift.payment_status))
}

/**
 * Filter gifts by shipping status
 *
 * @param gifts - Array of gifts
 * @param status - Status to filter by (or array of statuses)
 * @returns Filtered gifts
 */
export function filterByShippingStatus(
  gifts: GiftWithDetails[],
  status: ShippingStatus | ShippingStatus[]
): GiftWithDetails[] {
  const statuses = Array.isArray(status) ? status : [status]
  return gifts.filter((gift) => statuses.includes(gift.shipping_status))
}

/**
 * Get pending deliveries (payment completed but not delivered)
 *
 * @param gifts - Array of gifts
 * @returns Gifts pending delivery
 */
export function getPendingDeliveries(gifts: GiftWithDetails[]): GiftWithDetails[] {
  return gifts.filter(
    (gift) =>
      gift.payment_status === 'completed' &&
      (gift.shipping_status === 'pending' || gift.shipping_status === 'shipped')
  )
}

// =====================================================
// LOCK STATUS HELPERS
// =====================================================

/**
 * Create lock status object from gift data
 *
 * @param lockedUntil - Lock expiration date
 * @param buyerId - ID of user who locked
 * @param currentUserId - ID of current user
 * @returns Lock status object
 */
export function createLockStatus(
  lockedUntil: string | null,
  buyerId: string | null,
  currentUserId: string
): LockStatus {
  const isLocked = !isLockExpired(lockedUntil)
  const timeRemaining = isLocked ? getLockTimeRemaining(lockedUntil) : null

  return {
    isLocked,
    lockedBy: isLocked ? buyerId : null,
    lockedUntil: isLocked && lockedUntil ? parseISO(lockedUntil) : null,
    timeRemaining,
    canRelease: isLocked && buyerId ? canReleaseLock(buyerId, currentUserId) : false,
  }
}
