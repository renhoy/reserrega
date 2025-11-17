/**
 * =====================================================
 * UI CONSTANTS
 * =====================================================
 * UI-related constants (breakpoints, sizes, etc.)
 * =====================================================
 */

/**
 * Breakpoints for responsive design
 * Matches Tailwind CSS default breakpoints
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

/**
 * Media queries for responsive design
 */
export const MEDIA_QUERIES = {
  MOBILE: `(max-width: ${BREAKPOINTS.MD - 1}px)`,
  TABLET: `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.LG}px)`,
  MOBILE_ONLY: `(max-width: ${BREAKPOINTS.SM - 1}px)`,
  TABLET_UP: `(min-width: ${BREAKPOINTS.MD}px)`,
  DESKTOP_UP: `(min-width: ${BREAKPOINTS.LG}px)`,
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

/**
 * Common sizes
 */
export const SIZES = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 256,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  MAX_CONTENT_WIDTH: 1280,
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

/**
 * Toast notification defaults
 */
export const TOAST = {
  DURATION: 3000,
  POSITION: 'top-right',
} as const

/**
 * Debounce delays (in milliseconds)
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150,
} as const

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_LONG: 'dd MMMM yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'yyyy-MM-dd',
  ISO_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const

/**
 * Product reservation expiration (in days)
 */
export const RESERVATION_EXPIRATION_DAYS = 15

/**
 * Gift block duration (in minutes)
 */
export const GIFT_BLOCK_DURATION_MINUTES = 15

/**
 * QR code expiration (in hours)
 */
export const QR_CODE_EXPIRATION_HOURS = 24

/**
 * Minimum password length
 */
export const MIN_PASSWORD_LENGTH = 8

/**
 * Maximum upload sizes by type
 */
export const MAX_UPLOAD_SIZES = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  PRODUCT_IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const
