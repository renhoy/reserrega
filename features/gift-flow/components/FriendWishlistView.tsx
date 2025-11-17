'use client'

/**
 * =====================================================
 * FRIEND WISHLIST VIEW COMPONENT
 * =====================================================
 * Grid layout for displaying friend's giftable wishlist items
 * =====================================================
 */

import { useState, useMemo } from 'react'
import { Filter, X, Gift, Users, ShoppingBag } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/components/ui/select'
import { Separator } from '@/shared/common/components/ui/separator'
import { EmptyState } from '@/shared/common/components/shared/EmptyState'
import { LoadingSpinner } from '@/shared/common/components/shared/LoadingSpinner'
import { cn } from '@/shared/common/lib/utils'
import { GiftSelectionCard } from './GiftSelectionCard'
import type { FriendWishlist, GiftableWishlistItem } from '../types/gift.types'
import type { WishlistStatus } from '@/shared/database/types/database.types'

interface FriendWishlistViewProps {
  wishlist: FriendWishlist | null
  currentUserId: string
  isLoading?: boolean
  onSelectGift?: (itemId: string) => void
  onReleaseLock?: (itemId: string) => void
  onContinueCheckout?: (itemId: string) => void
  className?: string
}

/**
 * Friend Wishlist View component
 *
 * Displays friend's wishlist items available for gifting
 *
 * @example
 * ```tsx
 * <FriendWishlistView
 *   wishlist={friendWishlist}
 *   currentUserId={user.id}
 *   onSelectGift={handleSelectGift}
 *   onReleaseLock={handleReleaseLock}
 * />
 * ```
 */
export function FriendWishlistView({
  wishlist,
  currentUserId,
  isLoading = false,
  onSelectGift,
  onReleaseLock,
  onContinueCheckout,
  className,
}: FriendWishlistViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<WishlistStatus | 'all'>('all')
  const [showLocked, setShowLocked] = useState(true)

  // Calculate statistics
  const stats = useMemo(() => {
    if (!wishlist) return { total: 0, available: 0, inProcess: 0, locked: 0 }

    const items = wishlist.items
    return {
      total: items.length,
      available: items.filter((i) => i.status === 'available' && !i.lockStatus.isLocked).length,
      inProcess: items.filter((i) => i.status === 'in_process').length,
      locked: items.filter((i) => i.lockStatus.isLocked).length,
    }
  }, [wishlist])

  // Filter items
  const filteredItems = useMemo(() => {
    if (!wishlist) return []

    let filtered = [...wishlist.items]

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === selectedStatus)
    }

    // Filter out locked items if needed
    if (!showLocked) {
      filtered = filtered.filter((item) => !item.lockStatus.isLocked)
    }

    // Only show available and in_process items (not gifted or expired)
    filtered = filtered.filter(
      (item) => item.status === 'available' || item.status === 'in_process'
    )

    return filtered
  }, [wishlist, selectedStatus, showLocked])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Cargando wishlist..." />
      </div>
    )
  }

  // No wishlist
  if (!wishlist) {
    return (
      <EmptyState
        icon={Users}
        title="No se pudo cargar la wishlist"
        description="No tienes permiso para ver la wishlist de este usuario o no existe"
      />
    )
  }

  const { owner, items } = wishlist

  // Empty wishlist
  if (items.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Owner Header */}
        <FriendHeader owner={owner} totalItems={0} />

        <EmptyState
          icon={Gift}
          title={`${owner.name} no tiene productos en su wishlist`}
          description="Cuando añada productos, podrás verlos aquí para regalarlos"
        />
      </div>
    )
  }

  // Empty filtered results
  if (filteredItems.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Owner Header */}
        <FriendHeader owner={owner} totalItems={items.length} />

        {/* Filters */}
        <WishlistFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          showLocked={showLocked}
          onShowLockedChange={setShowLocked}
          stats={stats}
        />

        <EmptyState
          icon={Filter}
          title="No hay productos con estos filtros"
          description="Intenta cambiar los filtros para ver más productos disponibles"
          actionLabel="Limpiar Filtros"
          onAction={() => {
            setSelectedStatus('all')
            setShowLocked(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Owner Header */}
      <FriendHeader owner={owner} totalItems={items.length} />

      {/* Filters */}
      <WishlistFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        showLocked={showLocked}
        onShowLockedChange={setShowLocked}
        stats={stats}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filteredItems.length}</span> de{' '}
          <span className="font-semibold text-foreground">{items.length}</span> productos
        </p>

        {selectedStatus !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedStatus('all')}>
            <X className="mr-2 h-4 w-4" />
            Limpiar filtro
          </Button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <GiftSelectionCard
            key={item.id}
            item={item}
            currentUserId={currentUserId}
            onSelectGift={onSelectGift}
            onReleaseLock={onReleaseLock}
            onContinueCheckout={onContinueCheckout}
          />
        ))}
      </div>
    </div>
  )
}

// =====================================================
// FRIEND HEADER COMPONENT
// =====================================================

interface FriendHeaderProps {
  owner: {
    id: string
    name: string
    avatar_url: string | null
  }
  totalItems: number
}

function FriendHeader({ owner, totalItems }: FriendHeaderProps) {
  const initials = owner.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20 rounded-lg p-6 border border-violet-200 dark:border-violet-800">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-lg">
          <AvatarImage src={owner.avatar_url || undefined} alt={owner.name} />
          <AvatarFallback className="bg-violet-600 text-white text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wishlist de {owner.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems === 0
              ? 'No hay productos en la wishlist'
              : totalItems === 1
                ? '1 producto en la wishlist'
                : `${totalItems} productos en la wishlist`}
          </p>
        </div>

        <Badge variant="outline" className="gap-2 px-4 py-2 text-base">
          <Gift className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <span className="font-semibold">{totalItems}</span>
        </Badge>
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
  showLocked: boolean
  onShowLockedChange: (show: boolean) => void
  stats: {
    total: number
    available: number
    inProcess: number
    locked: number
  }
}

function WishlistFilters({
  selectedStatus,
  onStatusChange,
  showLocked,
  onShowLockedChange,
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
            <SelectItem value="all">Todos ({stats.total})</SelectItem>
            <SelectItem value="available">Disponible ({stats.available})</SelectItem>
            <SelectItem value="in_process">En Proceso ({stats.inProcess})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1">
          <ShoppingBag className="h-3 w-3" />
          {stats.available} disponibles
        </Badge>

        {stats.locked > 0 && (
          <Badge variant="outline" className="gap-1 bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30">
            {stats.locked} bloqueados
          </Badge>
        )}

        {/* Show/Hide Locked Toggle */}
        {stats.locked > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onShowLockedChange(!showLocked)}>
            {showLocked ? 'Ocultar' : 'Mostrar'} bloqueados
          </Button>
        )}
      </div>
    </div>
  )
}
