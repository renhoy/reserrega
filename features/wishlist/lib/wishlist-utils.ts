/**
 * =====================================================
 * WISHLIST MODULE - Utility Functions
 * =====================================================
 * Helper functions for wishlist operations
 * =====================================================
 */

import { differenceInDays, isPast, parseISO } from 'date-fns'
import type {
  WishlistStatus,
  WishlistVisibility,
  UserRelationship,
  WishlistAccessPermissions,
  ExpirationInfo,
  WishlistItemWithDetails,
} from '../types/wishlist.types'

// =====================================================
// STATUS FORMATTING
// =====================================================

/**
 * Format wishlist status to human-readable Spanish text
 *
 * @param status - Wishlist status
 * @returns Formatted status text
 *
 * @example
 * ```ts
 * formatWishlistStatus('available') // 'Disponible'
 * formatWishlistStatus('in_process') // 'En Proceso'
 * ```
 */
export function formatWishlistStatus(status: WishlistStatus): string {
  const statusMap: Record<WishlistStatus, string> = {
    available: 'Disponible',
    in_process: 'En Proceso',
    gifted: 'Regalado',
    expired: 'Expirado',
  }

  return statusMap[status] || status
}

/**
 * Get status color for UI display
 *
 * @param status - Wishlist status
 * @returns Tailwind color class
 */
export function getStatusColor(status: WishlistStatus): string {
  const colorMap: Record<WishlistStatus, string> = {
    available: 'lime',
    in_process: 'amber',
    gifted: 'violet',
    expired: 'gray',
  }

  return colorMap[status] || 'gray'
}

/**
 * Get status icon name
 *
 * @param status - Wishlist status
 * @returns Lucide icon name
 */
export function getStatusIcon(status: WishlistStatus): string {
  const iconMap: Record<WishlistStatus, string> = {
    available: 'Check',
    in_process: 'Clock',
    gifted: 'Gift',
    expired: 'X',
  }

  return iconMap[status] || 'HelpCircle'
}

// =====================================================
// VISIBILITY FORMATTING
// =====================================================

/**
 * Format visibility to human-readable Spanish text
 *
 * @param visibility - Wishlist visibility
 * @returns Formatted visibility text
 *
 * @example
 * ```ts
 * formatVisibility('private') // 'Privado'
 * formatVisibility('friends') // 'Solo Amigos'
 * ```
 */
export function formatVisibility(visibility: WishlistVisibility): string {
  const visibilityMap: Record<WishlistVisibility, string> = {
    private: 'Privado',
    friends: 'Solo Amigos',
    public: 'Público',
  }

  return visibilityMap[visibility] || visibility
}

/**
 * Get visibility description
 *
 * @param visibility - Wishlist visibility
 * @returns Description text
 */
export function getVisibilityDescription(visibility: WishlistVisibility): string {
  const descriptionMap: Record<WishlistVisibility, string> = {
    private: 'Solo tú puedes ver este producto',
    friends: 'Tus amigos pueden ver este producto',
    public: 'Cualquiera puede ver este producto',
  }

  return descriptionMap[visibility] || ''
}

/**
 * Get visibility icon name
 *
 * @param visibility - Wishlist visibility
 * @returns Lucide icon name
 */
export function getVisibilityIcon(visibility: WishlistVisibility): string {
  const iconMap: Record<WishlistVisibility, string> = {
    private: 'Lock',
    friends: 'Users',
    public: 'Globe',
  }

  return iconMap[visibility] || 'Eye'
}

// =====================================================
// EXPIRATION CHECKS
// =====================================================

/**
 * Check if a product reservation is expired
 *
 * @param expiresAt - Expiration date (ISO string or Date)
 * @returns True if expired
 *
 * @example
 * ```ts
 * isProductExpired('2024-01-15T10:00:00Z') // true (if past)
 * ```
 */
export function isProductExpired(expiresAt: string | Date): boolean {
  const expirationDate = typeof expiresAt === 'string' ? parseISO(expiresAt) : expiresAt
  return isPast(expirationDate)
}

/**
 * Get detailed expiration information
 *
 * @param expiresAt - Expiration date (ISO string or Date)
 * @returns Expiration info object
 *
 * @example
 * ```ts
 * const info = getExpirationInfo('2024-12-31T23:59:59Z')
 * if (info.expirationWarning) {
 *   console.log(`Only ${info.daysRemaining} days left!`)
 * }
 * ```
 */
export function getExpirationInfo(expiresAt: string | Date): ExpirationInfo {
  const expirationDate = typeof expiresAt === 'string' ? parseISO(expiresAt) : expiresAt
  const now = new Date()
  const daysRemaining = differenceInDays(expirationDate, now)
  const isExpired = isPast(expirationDate)

  return {
    isExpired,
    daysRemaining: Math.max(0, daysRemaining),
    expiresAt: expirationDate,
    expirationWarning: !isExpired && daysRemaining <= 3,
  }
}

/**
 * Format days remaining to human-readable text
 *
 * @param daysRemaining - Number of days remaining
 * @returns Formatted text
 */
export function formatDaysRemaining(daysRemaining: number): string {
  if (daysRemaining === 0) {
    return 'Expira hoy'
  } else if (daysRemaining === 1) {
    return 'Expira mañana'
  } else if (daysRemaining <= 3) {
    return `Expira en ${daysRemaining} días`
  } else if (daysRemaining <= 7) {
    return `${daysRemaining} días restantes`
  } else {
    return `${daysRemaining} días restantes`
  }
}

// =====================================================
// VISIBILITY & PERMISSIONS
// =====================================================

/**
 * Check if user can view a wishlist product
 *
 * @param visibility - Product visibility setting
 * @param relationship - User's relationship to owner
 * @returns True if user can view
 *
 * @example
 * ```ts
 * canViewProduct('friends', 'friend') // true
 * canViewProduct('private', 'stranger') // false
 * ```
 */
export function canViewProduct(
  visibility: WishlistVisibility,
  relationship: UserRelationship
): boolean {
  if (relationship === 'owner') return true

  switch (visibility) {
    case 'public':
      return true
    case 'friends':
      return relationship === 'friend'
    case 'private':
      return false
    default:
      return false
  }
}

/**
 * Get access permissions for a wishlist item
 *
 * @param relationship - User's relationship to owner
 * @param visibility - Product visibility
 * @returns Access permissions object
 *
 * @example
 * ```ts
 * const perms = getAccessPermissions('owner', 'private')
 * if (perms.canEdit) {
 *   // Show edit button
 * }
 * ```
 */
export function getAccessPermissions(
  relationship: UserRelationship,
  visibility: WishlistVisibility
): WishlistAccessPermissions {
  const isOwner = relationship === 'owner'

  return {
    canView: canViewProduct(visibility, relationship),
    canEdit: isOwner,
    canChangeStatus: isOwner,
    canChangeVisibility: isOwner,
    canDelete: isOwner,
  }
}

// =====================================================
// FILTERING & SORTING
// =====================================================

/**
 * Filter wishlist items by status
 *
 * @param items - Array of wishlist items
 * @param status - Status to filter by (or array of statuses)
 * @returns Filtered items
 */
export function filterByStatus(
  items: WishlistItemWithDetails[],
  status: WishlistStatus | WishlistStatus[]
): WishlistItemWithDetails[] {
  const statuses = Array.isArray(status) ? status : [status]
  return items.filter((item) => statuses.includes(item.status))
}

/**
 * Filter out expired items
 *
 * @param items - Array of wishlist items
 * @returns Items that are not expired
 */
export function filterActiveItems(
  items: WishlistItemWithDetails[]
): WishlistItemWithDetails[] {
  return items.filter((item) => {
    if (!item.reservation) return true
    return !isProductExpired(item.reservation.expires_at)
  })
}

/**
 * Sort wishlist items
 *
 * @param items - Array of wishlist items
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order
 * @returns Sorted items
 */
export function sortWishlistItems(
  items: WishlistItemWithDetails[],
  sortBy: 'created_at' | 'priority' | 'price' | 'status',
  sortOrder: 'asc' | 'desc' = 'desc'
): WishlistItemWithDetails[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
      case 'priority':
        comparison = (a.priority || 0) - (b.priority || 0)
        break
      case 'price':
        comparison = a.product.price - b.product.price
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  return sorted
}

// =====================================================
// VALIDATION
// =====================================================

/**
 * Validate wishlist status
 *
 * @param status - Status string to validate
 * @returns True if valid
 */
export function isValidWishlistStatus(status: string): status is WishlistStatus {
  return ['available', 'in_process', 'gifted', 'expired'].includes(status)
}

/**
 * Validate wishlist visibility
 *
 * @param visibility - Visibility string to validate
 * @returns True if valid
 */
export function isValidVisibility(visibility: string): visibility is WishlistVisibility {
  return ['private', 'friends', 'public'].includes(visibility)
}

/**
 * Validate priority value
 *
 * @param priority - Priority number to validate
 * @returns True if valid (1-5)
 */
export function isValidPriority(priority: number): boolean {
  return Number.isInteger(priority) && priority >= 1 && priority <= 5
}

// =====================================================
// STATISTICS
// =====================================================

/**
 * Calculate wishlist statistics
 *
 * @param items - Array of wishlist items
 * @returns Statistics object
 */
export function calculateWishlistStats(items: WishlistItemWithDetails[]) {
  return {
    totalItems: items.length,
    availableCount: items.filter((item) => item.status === 'available').length,
    inProcessCount: items.filter((item) => item.status === 'in_process').length,
    giftedCount: items.filter((item) => item.status === 'gifted').length,
    expiredCount: items.filter((item) => {
      if (!item.reservation) return false
      return isProductExpired(item.reservation.expires_at)
    }).length,
  }
}
