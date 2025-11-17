/**
 * =====================================================
 * AUTH UTILS - Exports
 * =====================================================
 * Utilities for authentication and authorization
 * =====================================================
 */

// Constants
export * from './constants'

// Permissions
export {
  canAccess,
  hasPermission,
  canManageCompany,
  checkCompanyAccess,
  isSuperadmin,
  isAdmin,
  isComercial,
  getPermissionLevel,
} from './permissions'

// Session
export {
  getSessionFromCookie,
  setSessionCookie,
  clearSessionCookie,
  needsRefresh,
  isExpired,
  getTimeUntilExpiry,
} from './session'
