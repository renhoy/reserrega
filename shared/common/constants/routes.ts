/**
 * =====================================================
 * ROUTES CONSTANTS
 * =====================================================
 * Centralized route definitions for the application
 * =====================================================
 */

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  AUTH_CALLBACK: '/auth/callback',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CONTACT: '/contact',
} as const

/**
 * Protected routes (authentication required)
 */
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

/**
 * User routes
 */
export const USER_ROUTES = {
  WISHLIST: '/wishlist',
  WISHLIST_DETAIL: (id: string) => `/wishlist/${id}`,
  RESERVATIONS: '/reservations',
  RESERVATION_DETAIL: (id: string) => `/reservations/${id}`,
  FRIENDS: '/friends',
  FRIEND_PROFILE: (id: string) => `/friends/${id}`,
  FRIEND_WISHLIST: (id: string) => `/friends/${id}/wishlist`,
  GIFTS: '/gifts',
  GIFT_DETAIL: (id: string) => `/gifts/${id}`,
} as const

/**
 * Comercial routes
 */
export const COMERCIAL_ROUTES = {
  STORE: '/store',
  STORE_SCAN: '/store/scan',
  STORE_RESERVATIONS: '/store/reservations',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  PRODUCT_CREATE: '/products/create',
  PRODUCT_EDIT: (id: string) => `/products/${id}/edit`,
} as const

/**
 * Admin routes
 */
export const ADMIN_ROUTES = {
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_CREATE: '/users/create',
  USER_EDIT: (id: string) => `/users/${id}/edit`,
  STORES: '/stores',
  STORE_DETAIL: (id: string) => `/stores/${id}`,
  STORE_CREATE: '/stores/create',
  STORE_EDIT: (id: string) => `/stores/${id}/edit`,
  REPORTS: '/reports',
} as const

/**
 * Superadmin routes
 */
export const SUPERADMIN_ROUTES = {
  COMPANIES: '/companies',
  COMPANY_DETAIL: (id: string) => `/companies/${id}`,
  COMPANY_CREATE: '/companies/create',
  COMPANY_EDIT: (id: string) => `/companies/${id}/edit`,
  SYSTEM: '/system',
  SYSTEM_LOGS: '/system/logs',
  SYSTEM_CONFIG: '/system/config',
} as const

/**
 * All routes combined
 */
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...USER_ROUTES,
  ...COMERCIAL_ROUTES,
  ...ADMIN_ROUTES,
  ...SUPERADMIN_ROUTES,
} as const

/**
 * API routes
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id: string) => `/api/users/${id}`,
    CREATE: '/api/users',
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },
  RESERVATIONS: {
    LIST: '/api/reservations',
    DETAIL: (id: string) => `/api/reservations/${id}`,
    CREATE: '/api/reservations',
    UPDATE: (id: string) => `/api/reservations/${id}`,
    DELETE: (id: string) => `/api/reservations/${id}`,
  },
  WISHLISTS: {
    LIST: '/api/wishlists',
    DETAIL: (id: string) => `/api/wishlists/${id}`,
    CREATE: '/api/wishlists',
    UPDATE: (id: string) => `/api/wishlists/${id}`,
    DELETE: (id: string) => `/api/wishlists/${id}`,
  },
  GIFTS: {
    LIST: '/api/gifts',
    DETAIL: (id: string) => `/api/gifts/${id}`,
    CREATE: '/api/gifts',
    UPDATE: (id: string) => `/api/gifts/${id}`,
    DELETE: (id: string) => `/api/gifts/${id}`,
  },
  FRIENDS: {
    LIST: '/api/friends',
    REQUESTS: '/api/friends/requests',
    SEND_REQUEST: '/api/friends/send-request',
    ACCEPT_REQUEST: (id: string) => `/api/friends/requests/${id}/accept`,
    REJECT_REQUEST: (id: string) => `/api/friends/requests/${id}/reject`,
    REMOVE: (id: string) => `/api/friends/${id}`,
  },
} as const

/**
 * Helper to check if route is public
 */
export function isPublicRoute(path: string): boolean {
  return Object.values(PUBLIC_ROUTES).some(route => {
    if (typeof route === 'string') {
      return path === route || path.startsWith(route + '/')
    }
    return false
  })
}

/**
 * Helper to get default route by user role
 */
export function getDefaultRouteByRole(role: string): string {
  switch (role) {
    case 'superadmin':
      return ROUTES.COMPANIES
    case 'admin':
      return ROUTES.USERS
    case 'comercial':
      return ROUTES.STORE
    case 'usuario':
    default:
      return ROUTES.WISHLIST
  }
}
