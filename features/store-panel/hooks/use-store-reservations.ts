'use client'

/**
 * =====================================================
 * STORE-PANEL - useStoreReservations Hook
 * =====================================================
 * Hook para cargar y filtrar reservas de tienda
 * =====================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { StoreReservation, ReservationFilters, DeliveryStatus } from '../types/store.types'
import { getStoreReservations, updateDeliveryStatus } from '../actions/store-panel.actions'
import { filterReservations, sortReservationsByPriority } from '../lib/store-utils'

const DEFAULT_FILTERS: ReservationFilters = {
  status: 'all',
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
}

export function useStoreReservations(storeId: number) {
  const [reservations, setReservations] = useState<StoreReservation[]>([])
  const [filters, setFilters] = useState<ReservationFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  /**
   * Load reservations from server
   */
  const loadReservations = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await getStoreReservations({
        storeId,
        status: filters.status,
      })

      if (!result.success || !result.reservations) {
        toast.error(result.error || 'Error al cargar reservas')
        setReservations([])
        return
      }

      setReservations(result.reservations)
    } catch (error) {
      console.error('Error loading reservations:', error)
      toast.error('Error al cargar reservas')
      setReservations([])
    } finally {
      setIsLoading(false)
    }
  }, [storeId, filters.status])

  /**
   * Update delivery status of a reservation
   */
  const handleUpdateStatus = useCallback(
    async (reservationId: string, status: DeliveryStatus) => {
      try {
        setIsUpdating(true)

        const result = await updateDeliveryStatus({
          reservationId,
          status,
        })

        if (!result.success) {
          toast.error(result.error || 'Error al actualizar estado')
          return
        }

        toast.success('Estado actualizado correctamente')

        // Reload reservations
        await loadReservations()
      } catch (error) {
        console.error('Error updating status:', error)
        toast.error('Error al actualizar estado de entrega')
      } finally {
        setIsUpdating(false)
      }
    },
    [loadReservations]
  )

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  /**
   * Apply filters to reservations
   */
  const filteredReservations = useMemo(() => {
    return filterReservations(reservations, filters)
  }, [reservations, filters])

  /**
   * Get priority sorted reservations (expired first, then by expiration date)
   */
  const priorityReservations = useMemo(() => {
    return sortReservationsByPriority(filteredReservations)
  }, [filteredReservations])

  /**
   * Statistics
   */
  const stats = useMemo(() => {
    return {
      total: reservations.length,
      filtered: filteredReservations.length,
      active: reservations.filter((r) => !r.isExpired).length,
      expired: reservations.filter((r) => r.isExpired).length,
      pending: reservations.filter((r) => r.deliveryStatus === 'pending').length,
      ready: reservations.filter((r) => r.deliveryStatus === 'ready').length,
      delivered: reservations.filter((r) => r.deliveryStatus === 'delivered').length,
      cancelled: reservations.filter((r) => r.deliveryStatus === 'cancelled').length,
    }
  }, [reservations, filteredReservations])

  /**
   * Load reservations on mount and when filters change
   */
  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  return {
    reservations: filteredReservations,
    priorityReservations,
    filters,
    setFilters,
    clearFilters,
    stats,
    isLoading,
    isUpdating,
    updateStatus: handleUpdateStatus,
    reload: loadReservations,
  }
}
