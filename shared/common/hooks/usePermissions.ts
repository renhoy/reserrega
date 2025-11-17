'use client'

/**
 * =====================================================
 * USE PERMISSIONS HOOK
 * =====================================================
 * Wrapper hook for checking user permissions
 * =====================================================
 */

import { useAuth } from '@/shared/auth/hooks/useAuth'
import { hasPermission, hasRole } from '@/shared/auth/utils/permissions'
import type { Permission, UserRole } from '@/shared/auth/types/auth.types'

/**
 * Hook for checking user permissions
 *
 * @returns Permission checking functions and user data
 *
 * @example
 * ```tsx
 * function ProductList() {
 *   const { can, isRole, user } = usePermissions()
 *
 *   const canCreate = can({ resource: 'products', action: 'create' })
 *   const isAdmin = isRole('admin')
 *
 *   return (
 *     <div>
 *       {canCreate && <Button>Crear producto</Button>}
 *       {isAdmin && <AdminPanel />}
 *     </div>
 *   )
 * }
 * ```
 */
export function usePermissions() {
  const { user } = useAuth()

  const can = (permission: Permission) => {
    if (!user) return { allowed: false, reason: 'User not authenticated' }
    return hasPermission(user, permission)
  }

  const isRole = (role: UserRole | UserRole[]) => {
    if (!user) return false
    return hasRole(user, role)
  }

  const isSuperadmin = () => isRole('superadmin')
  const isAdmin = () => isRole('admin')
  const isComercial = () => isRole('comercial')
  const isUsuario = () => isRole('usuario')

  return {
    user,
    can,
    isRole,
    isSuperadmin,
    isAdmin,
    isComercial,
    isUsuario,
  }
}
