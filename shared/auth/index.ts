/**
 * =====================================================
 * RESERREGA - AUTH MODULE
 * =====================================================
 * Main exports for auth module
 * =====================================================
 */

// Types
export type * from './types/auth.types'

// Components (client-side)
export { LoginForm } from './components/LoginForm'
export { RegisterForm } from './components/RegisterForm'
export { AuthProvider } from './components/AuthProvider'
export { LogoutButton } from './components/LogoutButton'

// Hooks (client-side)
export { useAuth } from './hooks/useAuth'
export { useUser } from './hooks/useUser'
export { useSession } from './hooks/useSession'

// Server helpers (server-side only)
export { getUser } from './server/getUser'
export { requireAuth } from './server/requireAuth'
export { requireRole } from './server/requireRole'

// Middleware
export { authMiddleware } from './middleware/authMiddleware'
export { roleGuard } from './middleware/roleGuard'

// Utils
export {
  canAccess,
  hasPermission,
  checkCompanyAccess,
} from './utils/permissions'

export {
  ROLES,
  USER_ROLES,
  ROLE_PERMISSIONS,
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
} from './utils/constants'

export {
  getSessionFromCookie,
  setSessionCookie,
  clearSessionCookie,
} from './utils/session'

// Actions
export { logout } from './actions/logout'
