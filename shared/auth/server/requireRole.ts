/**
 * =====================================================
 * REQUIRE ROLE (Server-side)
 * =====================================================
 * Require specific role(s) in Server Components
 * Redirects if not authenticated or lacks required role
 * =====================================================
 */

import { redirect } from 'next/navigation'
import { getUser } from './getUser'
import type { AuthUser, UserRole } from '../types/auth.types'

/**
 * Require specific role(s) (server-side)
 * Redirects to /auth/login if not authenticated
 * Redirects to /unauthorized if lacks required role
 *
 * @param allowedRoles - Array of allowed roles
 * @param redirectTo - Optional custom redirect
 * @returns Authenticated user with required role
 * @throws Redirect if not authenticated or unauthorized
 *
 * @example
 * ```ts
 * // In Server Component
 * import { requireRole } from '@/shared/auth/server'
 *
 * export default async function AdminPage() {
 *   const user = await requireRole(['admin', 'superadmin'])
 *
 *   // User is guaranteed to have admin or superadmin role
 *   return <div>Admin Panel</div>
 * }
 * ```
 */
export async function requireRole(
  allowedRoles: UserRole | UserRole[],
  redirectTo?: string
): Promise<AuthUser> {
  const user = await getUser()

  // Not authenticated
  if (!user) {
    const loginUrl = redirectTo
      ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
      : '/auth/login'

    redirect(loginUrl)
  }

  // Check status
  if (user.status !== 'active') {
    redirect('/auth/inactive')
  }

  // Normalize allowedRoles to array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  // Check if user has required role
  if (!rolesArray.includes(user.role)) {
    redirect('/unauthorized')
  }

  return user
}

/**
 * Require superadmin role
 *
 * @returns Authenticated superadmin user
 * @throws Redirect if not superadmin
 *
 * @example
 * ```ts
 * const user = await requireSuperadmin()
 * ```
 */
export async function requireSuperadmin(): Promise<AuthUser> {
  return requireRole('superadmin')
}

/**
 * Require admin role (admin or superadmin)
 *
 * @returns Authenticated admin user
 * @throws Redirect if not admin or superadmin
 *
 * @example
 * ```ts
 * const user = await requireAdmin()
 * ```
 */
export async function requireAdmin(): Promise<AuthUser> {
  return requireRole(['admin', 'superadmin'])
}

/**
 * Require comercial role (comercial, admin, or superadmin)
 *
 * @returns Authenticated comercial user
 * @throws Redirect if not comercial, admin, or superadmin
 *
 * @example
 * ```ts
 * const user = await requireComercial()
 * ```
 */
export async function requireComercial(): Promise<AuthUser> {
  return requireRole(['comercial', 'admin', 'superadmin'])
}

/**
 * Check if user has specific role (doesn't redirect)
 *
 * @param role - Role to check
 * @returns true if user has role, false otherwise
 *
 * @example
 * ```ts
 * const isAdmin = await hasRole('admin')
 * if (isAdmin) {
 *   // Show admin features
 * }
 * ```
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getUser()

  if (!user || user.status !== 'active') {
    return false
  }

  const rolesArray = Array.isArray(role) ? role : [role]
  return rolesArray.includes(user.role)
}

/**
 * Check if user belongs to specific company
 *
 * @param companyId - Company ID to check
 * @returns true if user belongs to company, false otherwise
 *
 * @example
 * ```ts
 * const belongsToCompany = await belongsToCompany(1)
 * ```
 */
export async function belongsToCompany(companyId: number): Promise<boolean> {
  const user = await getUser()

  if (!user || user.status !== 'active') {
    return false
  }

  // Superadmin has access to all companies
  if (user.role === 'superadmin') {
    return true
  }

  return user.companyId === companyId
}

/**
 * Require user to belong to specific company
 *
 * @param companyId - Company ID to check
 * @returns Authenticated user
 * @throws Redirect if doesn't belong to company
 *
 * @example
 * ```ts
 * const user = await requireCompany(1)
 * ```
 */
export async function requireCompany(companyId: number): Promise<AuthUser> {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (user.status !== 'active') {
    redirect('/auth/inactive')
  }

  // Superadmin bypasses company check
  if (user.role === 'superadmin') {
    return user
  }

  // Check if user belongs to company
  if (user.companyId !== companyId) {
    redirect('/unauthorized')
  }

  return user
}
