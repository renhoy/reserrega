/**
 * =====================================================
 * GIFT-FLOW MODULE - Type Definitions
 * =====================================================
 * Complete type system for Gift functionality
 * =====================================================
 */

import type {
  Gift,
  GiftInsert,
  GiftUpdate,
  PaymentStatus,
  ShippingStatus,
  Product,
  Wishlist,
  WishlistStatus,
  User,
  Store,
} from '@/shared/database/types/database.types'

// =====================================================
// EXTENDED TYPES (with relations)
// =====================================================

/**
 * Gift with full product, user, and store details
 */
export interface GiftWithDetails extends Gift {
  product: Product
  recipient: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>
  buyer: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>
  store: Store
  wishlist_item: Wishlist
}

/**
 * Minimal gift for list views
 */
export interface GiftSummary {
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
  recipient: {
    id: string
    name: string
    avatar_url: string | null
  }
  amount: number
  payment_status: PaymentStatus
  shipping_status: ShippingStatus
  created_at: string
  delivered_at: string | null
}

/**
 * Gift for recipient view (received gifts)
 */
export interface ReceivedGift {
  id: string
  product: {
    name: string
    brand: string | null
    size: string
    color: string
    image_url: string | null
  }
  buyer: {
    name: string
    avatar_url: string | null
  }
  store: {
    name: string
    address: string
  }
  shipping_status: ShippingStatus
  tracking_number: string | null
  created_at: string
  delivered_at: string | null
}

// =====================================================
// GIFT LOCK TYPES
// =====================================================

/**
 * Temporary lock on a wishlist item to prevent double-gifting
 * This represents an active gift selection before payment completion
 */
export interface GiftLock {
  wishlistItemId: string
  buyerId: string
  lockedUntil: Date
  productId: string
  recipientId: string
}

/**
 * Lock status for a wishlist item
 */
export interface LockStatus {
  isLocked: boolean
  lockedBy: string | null // buyer_id
  lockedUntil: Date | null
  timeRemaining: number | null // minutes
  canRelease: boolean // true if current user is the locker
}

/**
 * Lock creation data
 */
export interface CreateLockData {
  wishlistItemId: string
  buyerId: string
  productId: string
  recipientId: string
  lockDurationMinutes?: number // default: 15
}

// =====================================================
// GIFT TRANSACTION TYPES
// =====================================================

/**
 * Transaction data for processing a gift payment
 */
export interface GiftTransaction {
  wishlistItemId: string
  buyerId: string
  recipientId: string
  productId: string
  storeId: number
  amount: number
  paymentMethod: string
}

/**
 * Payment form data
 */
export interface GiftPaymentFormData {
  wishlistItemId: string
  paymentMethod: 'card' | 'paypal' // Placeholder for MVP
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  message?: string // Optional message to recipient
}

/**
 * Gift checkout session
 */
export interface GiftCheckoutSession {
  wishlistItemId: string
  product: Product
  recipient: Pick<User, 'id' | 'name' | 'avatar_url'>
  store: Store
  lockExpiresAt: Date
  amount: number
}

// =====================================================
// FILTER & QUERY TYPES
// =====================================================

/**
 * Filters for gift queries
 */
export interface GiftFilters {
  payment_status?: PaymentStatus | PaymentStatus[]
  shipping_status?: ShippingStatus | ShippingStatus[]
  recipientId?: string
  buyerId?: string
  dateFrom?: string
  dateTo?: string
}

/**
 * Sort options for gifts
 */
export type GiftSortBy = 'created_at' | 'amount' | 'shipping_status' | 'payment_status'
export type GiftSortOrder = 'asc' | 'desc'

export interface GiftSortOptions {
  sortBy: GiftSortBy
  sortOrder: GiftSortOrder
}

// =====================================================
// FRIEND WISHLIST VIEW TYPES
// =====================================================

/**
 * Wishlist item visible to friends (for gifting)
 */
export interface GiftableWishlistItem {
  id: string
  product: {
    id: string
    name: string
    brand: string | null
    size: string
    color: string
    price: number
    image_url: string | null
    category: string | null
  }
  store: {
    id: number
    name: string
    address: string
    locality: string
  }
  status: WishlistStatus
  priority: number | null
  notes: string | null
  lockStatus: LockStatus
}

/**
 * Friend's wishlist with owner info
 */
export interface FriendWishlist {
  owner: {
    id: string
    name: string
    avatar_url: string | null
  }
  items: GiftableWishlistItem[]
  totalCount: number
}

// =====================================================
// FORM & INPUT TYPES
// =====================================================

/**
 * Form data for confirming delivery
 */
export interface ConfirmDeliveryFormData {
  giftId: string
  confirmationCode?: string
}

/**
 * Form data for updating shipping status
 */
export interface UpdateShippingFormData {
  giftId: string
  shipping_status: ShippingStatus
  tracking_number?: string
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

/**
 * Response for viewFriendWishlist action
 */
export interface ViewFriendWishlistResponse {
  success: boolean
  data?: FriendWishlist
  error?: string
}

/**
 * Response for lockGiftItem action
 */
export interface LockGiftItemResponse {
  success: boolean
  data?: {
    lockExpiresAt: Date
    checkoutSession: GiftCheckoutSession
  }
  error?: string
}

/**
 * Response for processGiftPayment action
 */
export interface ProcessGiftPaymentResponse {
  success: boolean
  data?: {
    giftId: string
    orderNumber: string
    gift: GiftWithDetails
  }
  error?: string
}

/**
 * Response for confirmDelivery action
 */
export interface ConfirmDeliveryResponse {
  success: boolean
  data?: {
    gift: GiftWithDetails
  }
  error?: string
}

/**
 * Response for getGiftHistory action
 */
export interface GetGiftHistoryResponse {
  success: boolean
  data?: {
    sent: GiftSummary[]
    received: ReceivedGift[]
    totalSent: number
    totalReceived: number
  }
  error?: string
}

/**
 * Response for releaseExpiredLocks action
 */
export interface ReleaseExpiredLocksResponse {
  success: boolean
  data?: {
    releasedCount: number
  }
  error?: string
}

// =====================================================
// VIEW TYPES
// =====================================================

/**
 * Gift statistics for a user
 */
export interface GiftStats {
  totalSent: number
  totalReceived: number
  totalSpent: number
  pendingDeliveries: number
}

/**
 * Payment status badge props
 */
export interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

/**
 * Shipping status badge props
 */
export interface ShippingStatusBadgeProps {
  status: ShippingStatus
  className?: string
}

// =====================================================
// GIFT FLOW STATE TYPES
// =====================================================

/**
 * Gift flow stages
 */
export type GiftFlowStage = 'viewing' | 'selecting' | 'checkout' | 'processing' | 'confirmed'

/**
 * Gift flow state
 */
export interface GiftFlowState {
  stage: GiftFlowStage
  selectedItem: GiftableWishlistItem | null
  checkoutSession: GiftCheckoutSession | null
  lockExpiresAt: Date | null
  error: string | null
}

// =====================================================
// LOCK TIMER TYPES
// =====================================================

/**
 * Lock timer state
 */
export interface LockTimerState {
  isActive: boolean
  minutesRemaining: number
  secondsRemaining: number
  percentRemaining: number
  hasExpired: boolean
}

// =====================================================
// RE-EXPORTS
// =====================================================

export type {
  Gift,
  GiftInsert,
  GiftUpdate,
  PaymentStatus,
  ShippingStatus,
  WishlistStatus,
}
