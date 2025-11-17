'use client'

/**
 * =====================================================
 * WISHLIST PAGE
 * =====================================================
 * Main wishlist page - displays user's wishlist items
 * =====================================================
 */

import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { WishlistGrid } from '@/features/wishlist/components/WishlistGrid'
import { Heart, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'

/**
 * Wishlist Page
 *
 * Displays user's wishlist with filtering and management options
 */
export default function WishlistPage() {
  const {
    items,
    isLoading,
    updateStatus,
    updateVisibility,
    removeItem,
    refresh,
  } = useWishlist()

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-lime-600" />
            Mi Wishlist
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus productos reservados y su visibilidad
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Wishlist Grid */}
      <WishlistGrid
        items={items}
        isLoading={isLoading}
        onStatusChange={updateStatus}
        onVisibilityChange={updateVisibility}
        onDelete={removeItem}
        showFilters
      />
    </div>
  )
}
