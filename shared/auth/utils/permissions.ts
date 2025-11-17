/**
 * =====================================================
 * PERMISSIONS UTILITIES
 * =====================================================
 * Permission checking and access control
 * =====================================================
 */

import type { AuthUser, UserRole, Resource, Action, Permission, PermissionResult } from '../types/auth.types'
import { ROLE_PERMISSIONS } from './constants'

/**
 * Check if a role can access a resource with a specific action
 *
 * @param role - User role
 * @param resource - Resource to access
 * @param action - Action to perform (optional, defaults to 'read')
 * @returns true if allowed, false otherwise
 *
 * @example
 * ```ts
 * const allowed = canAccess('admin', 'companies', 'manage')
 * ```
 */
export function canAccess(
  role: UserRole,
  resource: Resource,
  action: Action = 'read'
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role]
  if (!rolePerms) return false

  const resourcePerms = rolePerms[resource]
  if (!resourcePerms) return false

  const permission = resourcePerms[action]

  // true = full access
  if (permission === true) return true

  // false = no access
  if (permission === false) return false

  // 'own', 'own_company', etc. = conditional access
  // Return true here, actual check done in hasPermission
  if (typeof permission === 'string') return true

  return false
}

/**
 * Check if user has permission for a specific action
 *
 * @param user - User object
 * @param permission - Permission to check
 * @returns Permission result
 *
 * @example
 * ```ts
 * const result = hasPermission(user, {
 *   resource: 'products',
 *   action: 'create',
 *   companyId: 1
 * })
 * ```
 */
export function hasPermission(
  user: AuthUser,
  permission: Permission
): PermissionResult {
  const { resource, action, companyId } = permission

  // Inactive users have no permissions
  if (user.status !== 'active') {
    return {
      allowed: false,
      reason: 'User is not active',
    }
  }

  const rolePerms = ROLE_PERMISSIONS[user.role]
  if (!rolePerms) {
    return {
      allowed: false,
      reason: 'Role not found',
    }
  }

  const resourcePerms = rolePerms[resource]
  if (!resourcePerms) {
    return {
      allowed: false,
      reason: 'Resource not found',
    }
  }

  const actionPerm = resourcePerms[action]

  // Full access
  if (actionPerm === true) {
    return { allowed: true }
  }

  // No access
  if (actionPerm === false) {
    return {
      allowed: false,
      reason: 'Action not allowed for this role',
    }
  }

  // Conditional access
  if (typeof actionPerm === 'string') {
    // 'own' - User can only access their own resources
    if (actionPerm === 'own') {
      return { allowed: true }
    }

    // 'own_company' - User can access resources from their company
    if (actionPerm === 'own_company') {
      if (!user.companyId) {
        return {
          allowed: false,
          reason: 'User does not belong to any company',
        }
      }

      if (companyId && companyId !== user.companyId) {
        return {
          allowed: false,
          reason: 'User can only access their own company resources',
        }
      }

      return { allowed: true }
    }

    // 'own_and_friends' - User can access their own and friends' resources
    if (actionPerm === 'own_and_friends') {
      return { allowed: true }
    }
  }

  return {
    allowed: false,
    reason: 'Permission not configured correctly',
  }
}

/**
 * Check if user can manage a company
 *
 * @param user - User object
 * @param companyId - Company ID
 * @returns true if allowed, false otherwise
 *
 * @example
 * ```ts
 * const canManage = canManageCompany(user, 1)
 * ```
 */
export function canManageCompany(user: AuthUser, companyId: number): boolean {
  // Superadmin can manage all companies
  if (user.role === 'superadmin') {
    return true
  }

  // Admin can manage their own company
  if (user.role === 'admin' && user.companyId === companyId) {
    return true
  }

  return false
}

/**
 * Check if user can access company data
 *
 * @param user - User object
 * @param companyId - Company ID
 * @returns true if allowed, false otherwise
 *
 * @example
 * ```ts
 * const canAccess = checkCompanyAccess(user, 1)
 * ```
 */
export function checkCompanyAccess(user: AuthUser, companyId: number): boolean {
  // Superadmin has access to all companies
  if (user.role === 'superadmin') {
    return true
  }

  // Users can only access their own company
  return user.companyId === companyId
}

/**
 * Check if user is superadmin
 *
 * @param user - User object
 * @returns true if superadmin, false otherwise
 */
export function isSuperadmin(user: AuthUser): boolean {
  return user.role === 'superadmin' && user.status === 'active'
}

/**
 * Check if user is admin (admin or superadmin)
 *
 * @param user - User object
 * @returns true if admin or superadmin, false otherwise
 */
export function isAdmin(user: AuthUser): boolean {
  return (
    (user.role === 'admin' || user.role === 'superadmin') &&
    user.status === 'active'
  )
}

/**
 * Check if user is comercial (comercial, admin, or superadmin)
 *
 * @param user - User object
 * @returns true if comercial, admin, or superadmin, false otherwise
 */
export function isComercial(user: AuthUser): boolean {
  return (
    (user.role === 'comercial' || user.role === 'admin' || user.role === 'superadmin') &&
    user.status === 'active'
  )
}

/**
 * Get user's permission level for a resource
 *
 * @param user - User object
 * @param resource - Resource to check
 * @returns Permission level ('full' | 'own' | 'own_company' | 'none')
 */
export function getPermissionLevel(
  user: AuthUser,
  resource: Resource
): 'full' | 'own' | 'own_company' | 'own_and_friends' | 'none' {
  const rolePerms = ROLE_PERMISSIONS[user.role]
  if (!rolePerms) return 'none'

  const resourcePerms = rolePerms[resource]
  if (!resourcePerms) return 'none'

  const readPerm = resourcePerms.read

  if (readPerm === true) return 'full'
  if (readPerm === 'own') return 'own'
  if (readPerm === 'own_company') return 'own_company'
  if (readPerm === 'own_and_friends') return 'own_and_friends'

  return 'none'
}
