/**
 * =====================================================
 * ROLE GUARD
 * =====================================================
 * Role-based access control for middleware
 * =====================================================
 */

import type { UserRole } from '../types/auth.types'

/**
 * Check if user role is allowed for a route
 *
 * @param userRole - User's role
 * @param allowedRoles - Array of allowed roles
 * @returns true if allowed, false otherwise
 */
export function isRoleAllowed(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole)
}

/**
 * Check if user has superadmin role
 *
 * @param userRole - User's role
 * @returns true if superadmin, false otherwise
 */
export function isSuperadminRole(userRole: UserRole): boolean {
  return userRole === 'superadmin'
}

/**
 * Check if user has admin role (admin or superadmin)
 *
 * @param userRole - User's role
 * @returns true if admin or superadmin, false otherwise
 */
export function isAdminRole(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'superadmin'
}

/**
 * Check if user has comercial role (comercial, admin, or superadmin)
 *
 * @param userRole - User's role
 * @returns true if comercial, admin, or superadmin, false otherwise
 */
export function isComercialRole(userRole: UserRole): boolean {
  return ['comercial', 'admin', 'superadmin'].includes(userRole)
}

/**
 * Role hierarchy - higher number = more permissions
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  usuario: 1,
  comercial: 2,
  admin: 3,
  superadmin: 4,
}

/**
 * Check if user role has higher or equal hierarchy level
 *
 * @param userRole - User's role
 * @param requiredRole - Required role
 * @returns true if user role is higher or equal, false otherwise
 *
 * @example
 * ```ts
 * hasRoleHierarchy('admin', 'comercial') // true
 * hasRoleHierarchy('usuario', 'admin') // false
 * ```
 */
export function hasRoleHierarchy(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}
