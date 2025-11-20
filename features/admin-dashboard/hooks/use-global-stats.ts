/**
 * =====================================================
 * ADMIN DASHBOARD - useGlobalStats Hook
 * =====================================================
 * Hook for managing global system statistics
 * =====================================================
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { getGlobalStats } from '../actions/admin.actions'
import { GlobalStats } from '../types/admin.types'
import { useToast } from '@/shared/common/hooks/useToast'

// =====================================================
// TYPES
// =====================================================

interface UseGlobalStatsOptions {
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

interface UseGlobalStatsReturn {
  stats: GlobalStats | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => Promise<void>
}

// =====================================================
// HOOK
// =====================================================

export function useGlobalStats(
  options: UseGlobalStatsOptions = {}
): UseGlobalStatsReturn {
  const { autoRefresh = false, refreshInterval = 60000 } = options // Default 1 minute
  const { toast } = useToast()

  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getGlobalStats()

      if (result.success && result.data) {
        setStats(result.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Error al obtener estadísticas')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const refresh = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Initial load
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchStats()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchStats])

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refresh,
  }
}
