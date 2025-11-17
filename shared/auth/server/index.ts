/**
 * =====================================================
 * SERVER HELPERS - Exports
 * =====================================================
 * Server-side authentication helpers
 * Use in Server Components, Server Actions, and API Routes
 * =====================================================
 */

// Get User
export { getUser, getUserWithError } from './getUser'

// Require Auth
export {
  requireAuth,
  requireAuthWithRedirect,
  isAuthenticated,
} from './requireAuth'

// Require Role
export {
  requireRole,
  requireSuperadmin,
  requireAdmin,
  requireComercial,
  hasRole,
  belongsToCompany,
  requireCompany,
} from './requireRole'
