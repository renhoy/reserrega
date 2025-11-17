/**
 * =====================================================
 * WISHLIST MODULE - Main Exports
 * =====================================================
 * Central export point for Wishlist module
 * =====================================================
 */

// Components
export { WishlistGrid } from './components/WishlistGrid'
export { WishlistItem } from './components/WishlistItem'
export { ProductStatusBadge } from './components/ProductStatusBadge'
export { VisibilityToggle } from './components/VisibilityToggle'

// Hooks
export { useWishlist } from './hooks/useWishlist'

// Actions
export {
  getWishlistAction,
  getWishlistItemAction,
  getPublicWishlistAction,
} from './actions/getWishlist'

export {
  updateProductStatusAction,
  bulkUpdateStatusAction,
} from './actions/updateProductStatus'

export {
  updateVisibilityAction,
  bulkUpdateVisibilityAction,
  removeFromWishlistAction,
} from './actions/updateVisibility'

// Utilities
export * from './lib/wishlist-utils'

// Types
export * from './types/wishlist.types'
