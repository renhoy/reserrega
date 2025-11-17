/**
 * =====================================================
 * RESERREGA - AUTH CONSTANTS
 * =====================================================
 * Constants for roles, routes, and permissions
 * =====================================================
 */

import type { UserRole } from '../types/auth.types'

// =====================================================
// ROLES
// =====================================================

/**
 * User roles in the system
 */
export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  COMERCIAL: 'comercial',
  USUARIO: 'usuario',
} as const

/**
 * Array of all user roles
 */
export const USER_ROLES: UserRole[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.COMERCIAL,
  ROLES.USUARIO,
]

/**
 * Default role for new users
 */
export const DEFAULT_ROLE: UserRole = ROLES.USUARIO

// =====================================================
// ROUTES
// =====================================================

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/reset-password',
  '/auth/verify-email',
] as const

/**
 * Protected routes (authentication required)
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/wishlists',
  '/friends',
  '/reservations',
  '/gifts',
] as const

/**
 * Admin routes (admin or superadmin role required)
 */
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/companies',
  '/admin/analytics',
] as const

/**
 * Superadmin routes (superadmin role only)
 */
export const SUPERADMIN_ROUTES = [
  '/admin/superadmin',
  '/admin/config',
  '/admin/all-companies',
] as const

/**
 * Comercial routes
 */
export const COMERCIAL_ROUTES = [
  '/comercial',
  '/comercial/stores',
  '/comercial/products',
  '/comercial/scanner',
] as const

/**
 * Default redirect after login by role
 */
export const DEFAULT_REDIRECT_BY_ROLE: Record<UserRole, string> = {
  [ROLES.SUPERADMIN]: '/admin/superadmin',
  [ROLES.ADMIN]: '/admin',
  [ROLES.COMERCIAL]: '/comercial',
  [ROLES.USUARIO]: '/dashboard',
}

/**
 * Default redirect after logout
 */
export const LOGOUT_REDIRECT = '/auth/login'

/**
 * Default redirect when unauthorized
 */
export const UNAUTHORIZED_REDIRECT = '/unauthorized'

// =====================================================
// PERMISSIONS MATRIX
// =====================================================

/**
 * Permissions by role
 * true = full access, false = no access, 'own' = only own resources
 */
export const ROLE_PERMISSIONS = {
  [ROLES.SUPERADMIN]: {
    users: { create: true, read: true, update: true, delete: true, manage: true },
    companies: { create: true, read: true, update: true, delete: true, manage: true },
    stores: { create: true, read: true, update: true, delete: true, manage: true },
    products: { create: true, read: true, update: true, delete: true, manage: true },
    reservations: { create: true, read: true, update: true, delete: true, manage: true },
    wishlists: { create: true, read: true, update: true, delete: true, manage: true },
    gifts: { create: true, read: true, update: true, delete: true, manage: true },
    friends: { create: true, read: true, update: true, delete: true, manage: true },
    config: { create: true, read: true, update: true, delete: true, manage: true },
    analytics: { create: false, read: true, update: false, delete: false, manage: true },
  },
  [ROLES.ADMIN]: {
    users: { create: 'own_company', read: 'own_company', update: 'own_company', delete: 'own_company', manage: 'own_company' },
    companies: { create: false, read: 'own', update: 'own', delete: false, manage: 'own' },
    stores: { create: 'own_company', read: 'own_company', update: 'own_company', delete: 'own_company', manage: 'own_company' },
    products: { create: 'own_company', read: 'own_company', update: 'own_company', delete: 'own_company', manage: 'own_company' },
    reservations: { create: false, read: 'own_company', update: 'own_company', delete: false, manage: 'own_company' },
    wishlists: { create: false, read: false, update: false, delete: false, manage: false },
    gifts: { create: false, read: 'own_company', update: 'own_company', delete: false, manage: 'own_company' },
    friends: { create: false, read: false, update: false, delete: false, manage: false },
    config: { create: false, read: 'own_company', update: 'own_company', delete: false, manage: false },
    analytics: { create: false, read: 'own_company', update: false, delete: false, manage: false },
  },
  [ROLES.COMERCIAL]: {
    users: { create: false, read: false, update: false, delete: false, manage: false },
    companies: { create: false, read: 'own', update: false, delete: false, manage: false },
    stores: { create: false, read: 'own_company', update: 'own_company', delete: false, manage: 'own_company' },
    products: { create: 'own_company', read: 'own_company', update: 'own_company', delete: 'own_company', manage: 'own_company' },
    reservations: { create: 'own_company', read: 'own_company', update: 'own_company', delete: false, manage: 'own_company' },
    wishlists: { create: false, read: false, update: false, delete: false, manage: false },
    gifts: { create: false, read: 'own_company', update: 'own_company', delete: false, manage: 'own_company' },
    friends: { create: false, read: false, update: false, delete: false, manage: false },
    config: { create: false, read: false, update: false, delete: false, manage: false },
    analytics: { create: false, read: false, update: false, delete: false, manage: false },
  },
  [ROLES.USUARIO]: {
    users: { create: false, read: 'own', update: 'own', delete: false, manage: false },
    companies: { create: false, read: true, update: false, delete: false, manage: false },
    stores: { create: false, read: true, update: false, delete: false, manage: false },
    products: { create: false, read: true, update: false, delete: false, manage: false },
    reservations: { create: 'own', read: 'own', update: 'own', delete: 'own', manage: 'own' },
    wishlists: { create: 'own', read: 'own_and_friends', update: 'own', delete: 'own', manage: 'own' },
    gifts: { create: true, read: 'own', update: 'own', delete: false, manage: 'own' },
    friends: { create: 'own', read: 'own', update: 'own', delete: 'own', manage: 'own' },
    config: { create: false, read: false, update: false, delete: false, manage: false },
    analytics: { create: false, read: false, update: false, delete: false, manage: false },
  },
} as const

// =====================================================
// SESSION
// =====================================================

/**
 * Session cookie name
 */
export const SESSION_COOKIE_NAME = 'sb-auth-token'

/**
 * Session expiry time (in seconds) - 7 days
 */
export const SESSION_EXPIRY = 60 * 60 * 24 * 7

/**
 * Refresh session threshold (in seconds) - 1 hour
 * Refresh session if it expires in less than 1 hour
 */
export const REFRESH_SESSION_THRESHOLD = 60 * 60
