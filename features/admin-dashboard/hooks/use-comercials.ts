/**
 * =====================================================
 * ADMIN DASHBOARD - useComercials Hook
 * =====================================================
 * Hook for managing comercials CRUD operations
 * =====================================================
 */

'use client'

import { useState, useCallback } from 'react'
import {
  getComercials,
  createComercial,
  updateComercial,
  toggleComercialStatus,
} from '../actions/admin.actions'
import type {
  Comercial,
  ComercialWithDetails,
  CreateComercialData,
  UpdateComercialData,
  ComercialFilters,
  PaginatedResponse,
} from '../types/admin.types'
import { useToast } from '@/shared/common/hooks/useToast'

// =====================================================
// HOOK
// =====================================================

export function useComercials() {
  const { toast } = useToast()
  const [comercials, setComercials] = useState<PaginatedResponse<ComercialWithDetails> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch comercials
  const fetchComercials = useCallback(async (filters?: ComercialFilters) => {
    try {
      setLoading(true)
      setError(null)

      const result = await getComercials(filters)

      if (result.success && result.data) {
        setComercials(result.data)
      } else {
        throw new Error(result.error || 'Error al cargar comerciales')
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

  // Create comercial
  const create = useCallback(async (data: CreateComercialData) => {
    try {
      const result = await createComercial(data)

      if (result.success) {
        toast({
          title: 'Comercial creado',
          description: result.message || 'El comercial se creó correctamente',
        })
        return result.data
      } else {
        throw new Error(result.error || 'Error al crear comercial')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
      throw err
    }
  }, [toast])

  // Update comercial
  const update = useCallback(async (id: string, data: UpdateComercialData) => {
    try {
      const result = await updateComercial(id, data)

      if (result.success) {
        toast({
          title: 'Comercial actualizado',
          description: result.message || 'El comercial se actualizó correctamente',
        })
        return result.data
      } else {
        throw new Error(result.error || 'Error al actualizar comercial')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
      throw err
    }
  }, [toast])

  // Toggle status
  const toggleStatus = useCallback(async (id: string) => {
    try {
      const result = await toggleComercialStatus(id)

      if (result.success) {
        toast({
          title: 'Estado actualizado',
          description: result.message || 'El estado se actualizó correctamente',
        })
        return result.data
      } else {
        throw new Error(result.error || 'Error al cambiar estado')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
      throw err
    }
  }, [toast])

  return {
    comercials,
    loading,
    error,
    fetchComercials,
    create,
    update,
    toggleStatus,
  }
}
