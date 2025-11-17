/**
 * =====================================================
 * GIFT-FLOW MODULE - Public API
 * =====================================================
 * Barrel export file for gift-flow module
 * =====================================================
 */

// Types
export * from './types/gift.types'

// Utilities
export * from './lib/gift-utils'

// Components (GF-002 completed)
export { GiftSelectionCard } from './components/GiftSelectionCard'
export { FriendWishlistView } from './components/FriendWishlistView'
export { LockTimerBadge, LockTimerProgress } from './components/LockTimerBadge'

// Components (GF-003 completed)
export { GiftCheckoutForm } from './components/GiftCheckoutForm'
export { GiftConfirmation } from './components/GiftConfirmation'
export { GiftSummary, GiftSummaryCompact } from './components/GiftSummary'

// Components (will be added later)
// export * from './components/DeliveryTracking'
// export * from './components/GiftHistory'

// Actions (GF-004 completed)
export * from './actions/gift-flow.actions'

// Hooks (GF-005 completed)
export * from './hooks/use-gift-flow'
