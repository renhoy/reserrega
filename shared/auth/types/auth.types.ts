/**
 * =====================================================
 * RESERREGA - AUTH TYPES
 * =====================================================
 * Type definitions for authentication and authorization
 * =====================================================
 */

import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { Tables } from '@/shared/database/types/database.types'

// =====================================================
// USER TYPES
// =====================================================

/**
 * User from database (reserrega.users table)
 */
export type DatabaseUser = Tables<'users'>

/**
 * User role in the system
 */
export type UserRole = 'superadmin' | 'admin' | 'comercial' | 'usuario'

/**
 * User status
 */
export type UserStatus = 'active' | 'inactive' | 'pending'

/**
 * Combined user type (Supabase Auth + Database)
 */
export interface AuthUser {
  // From auth.users
  id: string
  email: string
  emailConfirmed: boolean
  createdAt: string

  // From reserrega.users
  role: UserRole
  name: string
  lastName: string | null
  companyId: number | null
  status: UserStatus
  avatarUrl: string | null
  phone: string | null
  birthDate: string | null
}

// =====================================================
// SESSION TYPES
// =====================================================

/**
 * Auth session type
 */
export type AuthSession = Session | null

/**
 * Auth state
 */
export interface AuthState {
  user: AuthUser | null
  session: AuthSession
  loading: boolean
  error: AuthError | null
}

// =====================================================
// ERROR TYPES
// =====================================================

/**
 * Auth error codes
 */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_taken'
  | 'weak_password'
  | 'invalid_email'
  | 'session_expired'
  | 'unauthorized'
  | 'forbidden'
  | 'server_error'
  | 'unknown_error'

/**
 * Auth error
 */
export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: unknown
}

// =====================================================
// FORM TYPES
// =====================================================

/**
 * Login form data
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * Register form data
 */
export interface RegisterFormData {
  email: string
  password: string
  name: string
  lastName?: string
  phone?: string
}

/**
 * Form validation errors
 */
export interface FormErrors {
  email?: string
  password?: string
  name?: string
  lastName?: string
  phone?: string
  general?: string
}

// =====================================================
// PERMISSION TYPES
// =====================================================

/**
 * Resource types in the system
 */
export type Resource =
  | 'users'
  | 'companies'
  | 'stores'
  | 'products'
  | 'reservations'
  | 'wishlists'
  | 'gifts'
  | 'friends'
  | 'config'
  | 'analytics'

/**
 * Action types
 */
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage'

/**
 * Permission check
 */
export interface Permission {
  resource: Resource
  action: Action
  companyId?: number
}

/**
 * Permission result
 */
export interface PermissionResult {
  allowed: boolean
  reason?: string
}

// =====================================================
// MIDDLEWARE TYPES
// =====================================================

/**
 * Route protection config
 */
export interface RouteProtection {
  requireAuth: boolean
  allowedRoles?: UserRole[]
  redirectTo?: string
}

/**
 * Middleware context
 */
export interface MiddlewareContext {
  user: AuthUser | null
  session: AuthSession
  path: string
}

// =====================================================
// HOOK RETURN TYPES
// =====================================================

/**
 * useAuth hook return type
 */
export interface UseAuthReturn {
  user: AuthUser | null
  session: AuthSession
  loading: boolean
  error: AuthError | null
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

/**
 * useUser hook return type
 */
export interface UseUserReturn {
  user: AuthUser | null
  loading: boolean
  error: AuthError | null
  refetch: () => Promise<void>
}

/**
 * useSession hook return type
 */
export interface UseSessionReturn {
  session: AuthSession
  loading: boolean
  error: AuthError | null
}

// =====================================================
// SERVER HELPER TYPES
// =====================================================

/**
 * Server action result (generic)
 */
export interface ServerActionResult<T = void> {
  success: boolean
  data?: T
  error?: AuthError
}

/**
 * Redirect config
 */
export interface RedirectConfig {
  destination: string
  permanent?: boolean
}
