'use client'

/**
 * =====================================================
 * USE WISHLIST HOOK
 * =====================================================
 * Hook for managing wishlist state and operations
 * =====================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useToast } from '@/shared/common/hooks/useToast'
import { getWishlistAction } from '../actions/getWishlist'
import { updateProductStatusAction } from '../actions/updateProductStatus'
import { updateVisibilityAction } from '../actions/updateVisibility'
import { removeFromWishlistAction } from '../actions/updateVisibility'
import type {
  WishlistItemWithDetails,
  WishlistFilters,
  WishlistStatus,
  WishlistVisibility,
} from '../types/wishlist.types'
import { filterByStatus, isProductExpired } from '../lib/wishlist-utils'

interface UseWishlistOptions {
  initialFilters?: WishlistFilters
  autoLoad?: boolean
}

interface UseWishlistReturn {
  // Data
  items: WishlistItemWithDetails[]
  filteredItems: WishlistItemWithDetails[]

  // Loading states
  isLoading: boolean
  isUpdating: boolean

  // Error state
  error: string | null

  // Filters
  filters: WishlistFilters
  setFilters: (filters: WishlistFilters) => void

  // Actions
  loadWishlist: () => Promise<void>
  updateStatus: (itemId: string, newStatus: WishlistStatus) => Promise<void>
  updateVisibility: (itemId: string, newVisibility: WishlistVisibility) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * Hook for managing wishlist
 *
 * Handles fetching, filtering, and updating wishlist items with optimistic updates
 *
 * @param options - Hook options
 * @returns Wishlist state and actions
 *
 * @example
 * ```tsx
 * function WishlistPage() {
 *   const {
 *     items,
 *     isLoading,
 *     updateStatus,
 *     filters,
 *     setFilters,
 *   } = useWishlist()
 *
 *   return (
 *     <div>
 *       <FilterBar filters={filters} onChange={setFilters} />
 *       {isLoading ? <Spinner /> : <WishlistGrid items={items} onStatusChange={updateStatus} />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useWishlist(options: UseWishlistOptions = {}): UseWishlistReturn {
  const { initialFilters = {}, autoLoad = true } = options

  const [items, setItems] = useState<WishlistItemWithDetails[]>([])
  const [filters, setFilters] = useState<WishlistFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toast = useToast()

  /**
   * Load wishlist from server
   */
  const loadWishlist = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getWishlistAction(filters)
      setItems(response.items)
    } catch (err) {
      console.error('[useWishlist] Error loading wishlist:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la wishlist'
      setError(errorMessage)
      toast.error('Error', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  /**
   * Update product status with optimistic update
   */
  const updateStatus = useCallback(
    async (itemId: string, newStatus: WishlistStatus) => {
      setIsUpdating(true)

      // Optimistic update
      const previousItems = [...items]
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      )

      try {
        await updateProductStatusAction(itemId, newStatus)
        toast.success('Estado actualizado', 'El estado del producto ha sido actualizado')

        // Reload to ensure consistency
        await loadWishlist()
      } catch (err) {
        console.error('[useWishlist] Error updating status:', err)
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado'

        // Rollback on error
        setItems(previousItems)
        toast.error('Error', errorMessage)
      } finally {
        setIsUpdating(false)
      }
    },
    [items, loadWishlist, toast]
  )

  /**
   * Update product visibility with optimistic update
   */
  const updateVisibility = useCallback(
    async (itemId: string, newVisibility: WishlistVisibility) => {
      setIsUpdating(true)

      // Optimistic update
      const previousItems = [...items]
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, visibility: newVisibility } : item
        )
      )

      try {
        await updateVisibilityAction(itemId, newVisibility)
        toast.success('Visibilidad actualizada', 'La visibilidad del producto ha sido actualizada')

        // Reload to ensure consistency
        await loadWishlist()
      } catch (err) {
        console.error('[useWishlist] Error updating visibility:', err)
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la visibilidad'

        // Rollback on error
        setItems(previousItems)
        toast.error('Error', errorMessage)
      } finally {
        setIsUpdating(false)
      }
    },
    [items, loadWishlist, toast]
  )

  /**
   * Remove item from wishlist with optimistic update
   */
  const removeItem = useCallback(
    async (itemId: string) => {
      setIsUpdating(true)

      // Optimistic update
      const previousItems = [...items]
      setItems((current) => current.filter((item) => item.id !== itemId))

      try {
        await removeFromWishlistAction(itemId)
        toast.success('Producto eliminado', 'El producto ha sido eliminado de tu wishlist')
      } catch (err) {
        console.error('[useWishlist] Error removing item:', err)
        const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el producto'

        // Rollback on error
        setItems(previousItems)
        toast.error('Error', errorMessage)
      } finally {
        setIsUpdating(false)
      }
    },
    [items, toast]
  )

  /**
   * Refresh wishlist (alias for loadWishlist)
   */
  const refresh = useCallback(async () => {
    await loadWishlist()
  }, [loadWishlist])

  /**
   * Client-side filtered items
   */
  const filteredItems = useMemo(() => {
    let filtered = [...items]

    // Filter by status
    if (filters.status) {
      filtered = filterByStatus(filtered, filters.status)
    }

    // Filter expired items
    if (filters.includeExpired === false) {
      filtered = filtered.filter((item) => {
        if (!item.reservation) return true
        return !isProductExpired(item.reservation.expires_at)
      })
    }

    // Filter by priority range
    if (filters.minPriority !== undefined || filters.maxPriority !== undefined) {
      filtered = filtered.filter((item) => {
        const priority = item.priority || 0
        if (filters.minPriority !== undefined && priority < filters.minPriority) {
          return false
        }
        if (filters.maxPriority !== undefined && priority > filters.maxPriority) {
          return false
        }
        return true
      })
    }

    return filtered
  }, [items, filters])

  /**
   * Auto-load on mount
   */
  useEffect(() => {
    if (autoLoad) {
      loadWishlist()
    }
  }, []) // Only run on mount

  /**
   * Reload when filters change
   */
  useEffect(() => {
    if (!autoLoad) return

    // Only reload if server-side filters changed
    const hasServerFilters = filters.status || filters.visibility
    if (hasServerFilters) {
      loadWishlist()
    }
  }, [filters.status, filters.visibility]) // Only server-side filters

  return {
    items,
    filteredItems,
    isLoading,
    isUpdating,
    error,
    filters,
    setFilters,
    loadWishlist,
    updateStatus,
    updateVisibility,
    removeItem,
    refresh,
  }
}
