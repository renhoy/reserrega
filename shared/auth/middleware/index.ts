/**
 * =====================================================
 * MIDDLEWARE - Exports
 * =====================================================
 * Middleware for route protection
 * =====================================================
 */

export { authMiddleware } from './authMiddleware'
export {
  isRoleAllowed,
  isSuperadminRole,
  isAdminRole,
  isComercialRole,
  hasRoleHierarchy,
} from './roleGuard'
