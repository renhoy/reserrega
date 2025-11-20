'use client'

/**
 * =====================================================
 * STORE-PANEL - useStoreStats Hook
 * =====================================================
 * Hook para estadísticas de tienda
 * =====================================================
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import type { StoreStats, StoreReservation } from '../types/store.types'
import { getStoreReservations } from '../actions/store-panel.actions'
import { calculateStoreStats } from '../lib/store-utils'

interface UseStoreStatsOptions {
  storeId: number
  storeName: string
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

export function useStoreStats({
  storeId,
  storeName,
  autoRefresh = false,
  refreshInterval = 60000, // 1 minute
}: UseStoreStatsOptions) {
  const [reservations, setReservations] = useState<StoreReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  /**
   * Load all reservations for stats calculation
   */
  const loadReservations = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await getStoreReservations({
        storeId,
        status: 'all', // Get all to calculate stats
      })

      if (!result.success || !result.reservations) {
        toast.error(result.error || 'Error al cargar estadísticas')
        setReservations([])
        return
      }

      setReservations(result.reservations)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('Error al cargar estadísticas')
      setReservations([])
    } finally {
      setIsLoading(false)
    }
  }, [storeId])

  /**
   * Calculate stats from reservations
   */
  const stats: StoreStats = useMemo(() => {
    return calculateStoreStats(reservations, storeId.toString(), storeName)
  }, [reservations, storeId, storeName])

  /**
   * Reload stats manually
   */
  const refresh = useCallback(async () => {
    await loadReservations()
  }, [loadReservations])

  /**
   * Load stats on mount
   */
  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  /**
   * Auto-refresh if enabled
   */
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadReservations()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, loadReservations])

  return {
    stats,
    isLoading,
    lastUpdated,
    refresh,
  }
}
