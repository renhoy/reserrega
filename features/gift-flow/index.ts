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

// Components (will be added in GF-003)
// export * from './components/GiftCheckoutForm'
// export * from './components/GiftConfirmation'
// export * from './components/GiftSummary'
// export * from './components/DeliveryTracking'
// export * from './components/GiftHistory'

// Actions (will be added in GF-004)
// export * from './actions/gift-flow.actions'

// Hooks (will be added in GF-005)
// export * from './hooks/use-gift-flow'
