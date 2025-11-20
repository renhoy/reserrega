/**
 * =====================================================
 * ADMIN DASHBOARD - useCompanies Hook
 * =====================================================
 * Hook for managing companies CRUD operations
 * =====================================================
 */

'use client'

import { useState, useCallback } from 'react'
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../actions/admin.actions'
import type {
  Company,
  CompanyWithStats,
  CreateCompanyData,
  UpdateCompanyData,
  CompanyFilters,
  PaginatedResponse,
} from '../types/admin.types'
import { useToast } from '@/shared/common/hooks/useToast'

// =====================================================
// HOOK
// =====================================================

export function useCompanies() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<PaginatedResponse<CompanyWithStats> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch companies
  const fetchCompanies = useCallback(async (filters?: CompanyFilters) => {
    try {
      setLoading(true)
      setError(null)

      const result = await getCompanies(filters)

      if (result.success && result.data) {
        setCompanies(result.data)
      } else {
        throw new Error(result.error || 'Error al cargar empresas')
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

  // Create company
  const create = useCallback(async (data: CreateCompanyData) => {
    try {
      const result = await createCompany(data)

      if (result.success) {
        toast({
          title: 'Empresa creada',
          description: result.message || 'La empresa se creó correctamente',
        })
        return result.data
      } else {
        throw new Error(result.error || 'Error al crear empresa')
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

  // Update company
  const update = useCallback(async (id: number, data: UpdateCompanyData) => {
    try {
      const result = await updateCompany(id, data)

      if (result.success) {
        toast({
          title: 'Empresa actualizada',
          description: result.message || 'La empresa se actualizó correctamente',
        })
        return result.data
      } else {
        throw new Error(result.error || 'Error al actualizar empresa')
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

  // Delete company
  const remove = useCallback(async (id: number) => {
    try {
      const result = await deleteCompany(id)

      if (result.success) {
        toast({
          title: 'Empresa eliminada',
          description: result.message || 'La empresa se eliminó correctamente',
        })
        return true
      } else {
        throw new Error(result.error || 'Error al eliminar empresa')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
      return false
    }
  }, [toast])

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    create,
    update,
    remove,
  }
}
