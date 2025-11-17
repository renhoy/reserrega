'use client'

/**
 * =====================================================
 * WISHLIST GRID COMPONENT
 * =====================================================
 * Grid layout for displaying wishlist items with filters
 * =====================================================
 */

import { useState, useMemo } from 'react'
import { Filter, X, ShoppingBag, Gift } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/components/ui/select'
import { EmptyState } from '@/shared/common/components/shared/EmptyState'
import { LoadingSpinner } from '@/shared/common/components/shared/LoadingSpinner'
import { cn } from '@/shared/common/lib/utils'
import { WishlistItem } from './WishlistItem'
import type { WishlistItemWithDetails, WishlistStatus } from '../types/wishlist.types'
import { filterByStatus, isProductExpired, calculateWishlistStats } from '../lib/wishlist-utils'

interface WishlistGridProps {
  items: WishlistItemWithDetails[]
  isLoading?: boolean
  onStatusChange?: (itemId: string, newStatus: string) => void
  onVisibilityChange?: (itemId: string, newVisibility: string) => void
  onDelete?: (itemId: string) => void
  showFilters?: boolean
  className?: string
}

/**
 * Wishlist Grid component
 *
 * Displays wishlist items in responsive grid with filtering
 *
 * @example
 * ```tsx
 * <WishlistGrid
 *   items={wishlistItems}
 *   onStatusChange={handleStatusChange}
 *   showFilters
 * />
 * ```
 */
export function WishlistGrid({
  items,
  isLoading = false,
  onStatusChange,
  onVisibilityChange,
  onDelete,
  showFilters = true,
  className,
}: WishlistGridProps) {
  const [selectedStatus, setSelectedStatus] = useState<WishlistStatus | 'all'>('all')
  const [showExpired, setShowExpired] = useState(true)

  // Calculate statistics
  const stats = useMemo(() => calculateWishlistStats(items), [items])

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = [...items]

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filterByStatus(filtered, selectedStatus)
    }

    // Filter out expired if needed
    if (!showExpired) {
      filtered = filtered.filter((item) => {
        if (!item.reservation) return true
        return !isProductExpired(item.reservation.expires_at)
      })
    }

    return filtered
  }, [items, selectedStatus, showExpired])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Cargando wishlist..." />
      </div>
    )
  }

  // Empty state (no items at all)
  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Tu wishlist está vacía"
        description="Empieza a reservar productos en tiendas para crear tu lista de deseos"
        actionLabel="Ir a Reservar"
        actionHref="/qr"
      />
    )
  }

  // Empty filtered results
  if (filteredItems.length === 0) {
    return (
      <div className="space-y-6">
        {/* Filters */}
        {showFilters && (
          <WishlistFilters
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            showExpired={showExpired}
            onShowExpiredChange={setShowExpired}
            stats={stats}
          />
        )}

        <EmptyState
          icon={Filter}
          title="No hay productos con estos filtros"
          description="Intenta cambiar los filtros para ver más productos"
          actionLabel="Limpiar Filtros"
          onAction={() => {
            setSelectedStatus('all')
            setShowExpired(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters */}
      {showFilters && (
        <WishlistFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          showExpired={showExpired}
          onShowExpiredChange={setShowExpired}
          stats={stats}
        />
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filteredItems.length}</span> de{' '}
          <span className="font-semibold text-foreground">{items.length}</span> productos
        </p>

        {selectedStatus !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtro
          </Button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <WishlistItem
            key={item.id}
            item={item}
            onStatusChange={onStatusChange}
            onVisibilityChange={onVisibilityChange}
            onDelete={onDelete}
            showActions
          />
        ))}
      </div>
    </div>
  )
}

// =====================================================
// FILTERS COMPONENT
// =====================================================

interface WishlistFiltersProps {
  selectedStatus: WishlistStatus | 'all'
  onStatusChange: (status: WishlistStatus | 'all') => void
  showExpired: boolean
  onShowExpiredChange: (show: boolean) => void
  stats: ReturnType<typeof calculateWishlistStats>
}

function WishlistFilters({
  selectedStatus,
  onStatusChange,
  showExpired,
  onShowExpiredChange,
  stats,
}: WishlistFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/50 p-4 rounded-lg">
      {/* Status Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={selectedStatus}
          onValueChange={(value) => onStatusChange(value as WishlistStatus | 'all')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              Todos ({stats.totalItems})
            </SelectItem>
            <SelectItem value="available">
              Disponible ({stats.availableCount})
            </SelectItem>
            <SelectItem value="in_process">
              En Proceso ({stats.inProcessCount})
            </SelectItem>
            <SelectItem value="gifted">
              Regalado ({stats.giftedCount})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1">
          <Gift className="h-3 w-3" />
          {stats.totalItems} productos
        </Badge>

        {stats.expiredCount > 0 && (
          <Badge variant="destructive" className="gap-1">
            {stats.expiredCount} expirados
          </Badge>
        )}

        {/* Show/Hide Expired Toggle */}
        {stats.expiredCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowExpiredChange(!showExpired)}
          >
            {showExpired ? 'Ocultar' : 'Mostrar'} expirados
          </Button>
        )}
      </div>
    </div>
  )
}
