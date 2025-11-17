/**
 * =====================================================
 * WISHLIST MODULE - Type Definitions
 * =====================================================
 * Complete type system for Wishlist functionality
 * =====================================================
 */

import type {
  Wishlist,
  WishlistInsert,
  WishlistUpdate,
  WishlistStatus,
  WishlistVisibility,
  Product,
  Reservation,
  Store,
  User,
} from '@/shared/database/types/database.types'

// =====================================================
// EXTENDED TYPES (with relations)
// =====================================================

/**
 * Wishlist item with full product, reservation, and store details
 */
export interface WishlistItemWithDetails extends Wishlist {
  product: Product
  reservation: Reservation | null
  store: Store
}

/**
 * Minimal wishlist item for list views
 */
export interface WishlistItemSummary {
  id: string
  product: {
    id: string
    name: string
    brand: string | null
    size: string
    color: string
    price: number
    image_url: string | null
  }
  status: WishlistStatus
  visibility: WishlistVisibility
  priority: number | null
  created_at: string
  isExpired: boolean
}

/**
 * Wishlist item for display in friend's view
 */
export interface WishlistItemPublic {
  id: string
  product: {
    name: string
    brand: string | null
    size: string
    color: string
    price: number
    image_url: string | null
  }
  store: {
    name: string
    address: string | null
  }
  status: WishlistStatus
  priority: number | null
  notes: string | null
  isExpired: boolean
}

// =====================================================
// FILTER & QUERY TYPES
// =====================================================

/**
 * Filters for wishlist queries
 */
export interface WishlistFilters {
  status?: WishlistStatus | WishlistStatus[]
  visibility?: WishlistVisibility | WishlistVisibility[]
  includeExpired?: boolean
  minPriority?: number
  maxPriority?: number
}

/**
 * Sort options for wishlist
 */
export type WishlistSortBy = 'created_at' | 'priority' | 'price' | 'status'
export type WishlistSortOrder = 'asc' | 'desc'

export interface WishlistSortOptions {
  sortBy: WishlistSortBy
  sortOrder: WishlistSortOrder
}

// =====================================================
// FORM & INPUT TYPES
// =====================================================

/**
 * Form data for updating product status
 */
export interface UpdateStatusFormData {
  wishlistId: string
  status: WishlistStatus
}

/**
 * Form data for updating visibility
 */
export interface UpdateVisibilityFormData {
  wishlistId: string
  visibility: WishlistVisibility
}

/**
 * Form data for updating priority
 */
export interface UpdatePriorityFormData {
  wishlistId: string
  priority: number
}

/**
 * Form data for updating notes
 */
export interface UpdateNotesFormData {
  wishlistId: string
  notes: string
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

/**
 * Response for getWishlist action
 */
export interface GetWishlistResponse {
  items: WishlistItemWithDetails[]
  totalCount: number
}

/**
 * Response for updateProductStatus action
 */
export interface UpdateStatusResponse {
  wishlistItem: WishlistItemWithDetails
  message: string
}

/**
 * Response for updateVisibility action
 */
export interface UpdateVisibilityResponse {
  wishlistItem: WishlistItemWithDetails
  message: string
}

/**
 * Response for removeFromWishlist action
 */
export interface RemoveFromWishlistResponse {
  success: boolean
  message: string
}

// =====================================================
// VIEW TYPES
// =====================================================

/**
 * Wishlist statistics
 */
export interface WishlistStats {
  totalItems: number
  availableCount: number
  inProcessCount: number
  giftedCount: number
  expiredCount: number
}

/**
 * Status badge props
 */
export interface StatusBadgeProps {
  status: WishlistStatus
  isExpired?: boolean
  className?: string
}

/**
 * Visibility option
 */
export interface VisibilityOption {
  value: WishlistVisibility
  label: string
  description: string
  icon: string
}

// =====================================================
// RELATIONSHIP TYPES
// =====================================================

/**
 * User relationship for visibility checks
 */
export type UserRelationship = 'owner' | 'friend' | 'stranger'

/**
 * Access permissions based on relationship
 */
export interface WishlistAccessPermissions {
  canView: boolean
  canEdit: boolean
  canChangeStatus: boolean
  canChangeVisibility: boolean
  canDelete: boolean
}

// =====================================================
// EXPIRATION TYPES
// =====================================================

/**
 * Expiration info for a reservation
 */
export interface ExpirationInfo {
  isExpired: boolean
  daysRemaining: number
  expiresAt: Date
  expirationWarning: boolean // true if < 3 days remaining
}

// =====================================================
// RE-EXPORTS
// =====================================================

export type {
  Wishlist,
  WishlistInsert,
  WishlistUpdate,
  WishlistStatus,
  WishlistVisibility,
}
