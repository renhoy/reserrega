/**
 * =====================================================
 * STORE-PANEL MODULE - Utilities
 * =====================================================
 * Utility functions for store panel operations
 * =====================================================
 */

import { differenceInDays, formatDistanceToNow, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import type {
  StoreSession,
  SessionProduct,
  StoreReservation,
  StoreStats,
  DeliveryStatus,
  SessionState,
  ReservationFilters,
} from '../types/store.types'

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calculate total value of products in session
 */
export function calculateSessionTotal(products: SessionProduct[]): number {
  return products.reduce((total, product) => total + product.price, 0)
}

/**
 * Calculate days until expiration
 */
export function calculateDaysUntilExpiration(expiresAt: Date | string): number {
  const expiration = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  const now = new Date()
  return differenceInDays(expiration, now)
}

/**
 * Check if reservation is expired
 */
export function isReservationExpired(expiresAt: Date | string): boolean {
  const expiration = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return isAfter(new Date(), expiration)
}

/**
 * Validate session state transition
 */
export function canTransitionTo(currentState: SessionState, newState: SessionState): boolean {
  const validTransitions: Record<SessionState, SessionState[]> = {
    idle: ['scanning'],
    scanning: ['active', 'error'],
    active: ['ending', 'error'],
    ending: ['idle'],
    error: ['idle'],
  }

  return validTransitions[currentState]?.includes(newState) ?? false
}

/**
 * Format session duration
 */
export function formatSessionDuration(startedAt: Date): string {
  return formatDistanceToNow(startedAt, { locale: es, addSuffix: false })
}

/**
 * Get delivery status badge color
 */
export function getDeliveryStatusColor(status: DeliveryStatus): {
  bg: string
  text: string
  border: string
} {
  const colors = {
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    ready: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    delivered: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    cancelled: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
  }

  return colors[status]
}

/**
 * Get delivery status label in Spanish
 */
export function getDeliveryStatusLabel(status: DeliveryStatus): string {
  const labels: Record<DeliveryStatus, string> = {
    pending: 'Pendiente',
    ready: 'Listo para entregar',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }

  return labels[status]
}

/**
 * Filter reservations based on criteria
 */
export function filterReservations(
  reservations: StoreReservation[],
  filters: ReservationFilters
): StoreReservation[] {
  let filtered = [...reservations]

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((r) => r.deliveryStatus === filters.status)
  }

  // Filter by search (user name or email)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.user?.name.toLowerCase().includes(searchLower) ||
        r.user?.email.toLowerCase().includes(searchLower) ||
        r.product?.name.toLowerCase().includes(searchLower)
    )
  }

  // Filter by date range
  if (filters.dateFrom) {
    const from = startOfDay(filters.dateFrom)
    filtered = filtered.filter((r) => isAfter(new Date(r.created_at), from))
  }

  if (filters.dateTo) {
    const to = endOfDay(filters.dateTo)
    filtered = filtered.filter((r) => isBefore(new Date(r.created_at), to))
  }

  // Filter by expired
  if (filters.onlyExpired) {
    filtered = filtered.filter((r) => r.isExpired)
  }

  // Filter by active
  if (filters.onlyActive) {
    filtered = filtered.filter((r) => !r.isExpired)
  }

  // Sort
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case 'expires_at':
          aValue = new Date(a.expires_at).getTime()
          bValue = new Date(b.expires_at).getTime()
          break
        case 'user_name':
          aValue = a.user?.name || ''
          bValue = b.user?.name || ''
          break
        case 'product_name':
          aValue = a.product?.name || ''
          bValue = b.product?.name || ''
          break
        default:
          return 0
      }

      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })
  }

  return filtered
}

/**
 * Sort reservations by priority (expired first, then by expiration date)
 */
export function sortReservationsByPriority(reservations: StoreReservation[]): StoreReservation[] {
  return [...reservations].sort((a, b) => {
    // Expired ones first
    if (a.isExpired !== b.isExpired) {
      return a.isExpired ? -1 : 1
    }

    // Then by days until expiration (soonest first)
    return a.daysUntilExpiration - b.daysUntilExpiration
  })
}

/**
 * Calculate store statistics from reservations
 */
export function calculateStoreStats(
  reservations: StoreReservation[],
  storeId: string,
  storeName: string
): StoreStats {
  const now = new Date()
  const today = startOfDay(now)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Basic counts
  const totalReservations = reservations.length
  const activeReservations = reservations.filter((r) => !r.isExpired).length
  const expiredReservations = reservations.filter((r) => r.isExpired).length
  const pendingDeliveries = reservations.filter((r) => r.deliveryStatus === 'pending').length

  // Delivered today
  const deliveredToday = reservations.filter(
    (r) => r.deliveryStatus === 'delivered' && r.deliveredAt && isAfter(new Date(r.deliveredAt), today)
  ).length

  // Monthly revenue (1€ per reservation)
  const monthlyRevenue = reservations.filter((r) => isAfter(new Date(r.created_at), monthStart)).length

  // Average products per session (mock - would need session data)
  const avgProductsPerSession = totalReservations > 0 ? totalReservations / Math.max(1, totalReservations / 3) : 0

  return {
    storeId,
    storeName,
    totalReservations,
    pendingDeliveries,
    deliveredToday,
    monthlyRevenue,
    activeReservations,
    expiredReservations,
    avgProductsPerSession: Math.round(avgProductsPerSession * 10) / 10,
    totalProductsScanned: totalReservations, // Simplified
  }
}

/**
 * Validate QR code format (basic validation)
 */
export function validateQRCode(qrCode: string): boolean {
  // QR codes should be UUIDs or specific format
  // Basic validation: non-empty string, minimum length
  return qrCode.trim().length >= 10
}

/**
 * Validate barcode format (basic validation)
 */
export function validateBarcode(barcode: string): boolean {
  // Barcodes should be numeric or alphanumeric
  // Basic validation: non-empty, minimum length
  return /^[A-Za-z0-9]{6,}$/.test(barcode.trim())
}

/**
 * Format price in euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Get expiration warning level
 */
export function getExpirationWarning(daysUntilExpiration: number): 'none' | 'warning' | 'critical' | 'expired' {
  if (daysUntilExpiration < 0) return 'expired'
  if (daysUntilExpiration <= 2) return 'critical'
  if (daysUntilExpiration <= 5) return 'warning'
  return 'none'
}

/**
 * Parse QR code to extract user ID
 * Assumes QR contains user ID or encoded data
 */
export function parseQRCode(qrCode: string): { userId: string } | null {
  try {
    // Try parsing as JSON first
    const parsed = JSON.parse(qrCode)
    if (parsed.userId) {
      return { userId: parsed.userId }
    }
  } catch {
    // Not JSON, treat as direct user ID
    if (validateQRCode(qrCode)) {
      return { userId: qrCode }
    }
  }

  return null
}

/**
 * Sanitize session data for storage
 */
export function sanitizeSession(session: StoreSession): Omit<StoreSession, 'products'> & {
  products: string[]
} {
  return {
    ...session,
    products: session.products.map((p) => p.barcode),
  }
}
