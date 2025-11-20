/**
 * =====================================================
 * STORE-PANEL MODULE - Types
 * =====================================================
 * Type definitions for store panel operations
 * =====================================================
 */

import type { Database } from '@/shared/database/types/database.types'

// Database types
type Store = Database['reserrega']['Tables']['stores']['Row']
type Reservation = Database['reserrega']['Tables']['reservations']['Row']
type Product = Database['reserrega']['Tables']['products']['Row']
type User = Database['reserrega']['Tables']['users']['Row']

/**
 * Session states for store operations
 */
export type SessionState = 'idle' | 'scanning' | 'active' | 'ending' | 'error'

/**
 * Delivery status for reservations
 */
export type DeliveryStatus = 'pending' | 'ready' | 'delivered' | 'cancelled'

/**
 * Store session - Temporary session while comercial assists a customer
 */
export interface StoreSession {
  /** Unique session ID */
  id: string
  /** Store ID */
  storeId: string
  /** User being assisted */
  userId: string
  /** User details */
  user: {
    id: string
    name: string
    email: string
  }
  /** Comercial ID */
  comercialId: string
  /** Products scanned in this session */
  products: SessionProduct[]
  /** Session start timestamp */
  startedAt: Date
  /** Session state */
  state: SessionState
  /** Total products scanned */
  totalProducts: number
  /** Total estimated value (€) */
  totalValue: number
}

/**
 * Product scanned during a session
 */
export interface SessionProduct {
  /** Product barcode */
  barcode: string
  /** Product name */
  name: string
  /** Product description */
  description?: string
  /** Price in euros */
  price: number
  /** Store ID */
  storeId: string
  /** Store name */
  storeName: string
  /** Timestamp when scanned */
  scannedAt: Date
  /** Optional product image URL */
  imageUrl?: string
}

/**
 * Store reservation - Extended reservation with delivery info
 */
export interface StoreReservation extends Reservation {
  /** Product details */
  product: Product | null
  /** User who reserved */
  user: {
    id: string
    name: string
    email: string
  } | null
  /** Store details */
  store: Store | null
  /** Delivery status */
  deliveryStatus: DeliveryStatus
  /** When marked as delivered */
  deliveredAt?: Date | null
  /** Who marked as delivered */
  deliveredBy?: string | null
  /** Days until expiration */
  daysUntilExpiration: number
  /** Is expired */
  isExpired: boolean
}

/**
 * Store statistics
 */
export interface StoreStats {
  /** Store ID */
  storeId: string
  /** Store name */
  storeName: string
  /** Total reservations for this store */
  totalReservations: number
  /** Pending deliveries */
  pendingDeliveries: number
  /** Delivered today */
  deliveredToday: number
  /** Total revenue this month (€) */
  monthlyRevenue: number
  /** Active reservations (not expired) */
  activeReservations: number
  /** Expired reservations */
  expiredReservations: number
  /** Average products per session */
  avgProductsPerSession: number
  /** Total products scanned */
  totalProductsScanned: number
}

/**
 * Reservation filter options
 */
export interface ReservationFilters {
  /** Filter by delivery status */
  status?: DeliveryStatus | 'all'
  /** Filter by user name or email */
  search?: string
  /** Filter by date range (from) */
  dateFrom?: Date
  /** Filter by date range (to) */
  dateTo?: Date
  /** Only show expired */
  onlyExpired?: boolean
  /** Only show active */
  onlyActive?: boolean
  /** Sort by field */
  sortBy?: 'created_at' | 'expires_at' | 'user_name' | 'product_name'
  /** Sort order */
  sortOrder?: 'asc' | 'desc'
}

/**
 * Store session creation params
 */
export interface CreateSessionParams {
  /** Store ID */
  storeId: string
  /** User ID (from QR code) */
  userId: string
  /** Comercial ID */
  comercialId: string
}

/**
 * Product link params
 */
export interface LinkProductParams {
  /** Session ID */
  sessionId: string
  /** Product barcode */
  barcode: string
}

/**
 * End session params
 */
export interface EndSessionParams {
  /** Session ID */
  sessionId: string
  /** Products to create reservations for */
  productBarcodes: string[]
}

/**
 * Mark as delivered params
 */
export interface MarkDeliveredParams {
  /** Reservation ID */
  reservationId: string
  /** Comercial ID who delivers */
  comercialId: string
}

/**
 * Server action response
 */
export interface ActionResponse<T = any> {
  /** Success flag */
  success: boolean
  /** Response data */
  data?: T
  /** Error message if failed */
  error?: string
}

/**
 * Get reservations response
 */
export interface GetReservationsResponse extends ActionResponse {
  data?: {
    reservations: StoreReservation[]
    total: number
    page: number
    pageSize: number
  }
}

/**
 * Get stats response
 */
export interface GetStatsResponse extends ActionResponse {
  data?: StoreStats
}

/**
 * Session response
 */
export interface SessionResponse extends ActionResponse {
  data?: StoreSession
}

/**
 * Product response
 */
export interface ProductResponse extends ActionResponse {
  data?: SessionProduct
}

/**
 * Delivery response
 */
export interface DeliveryResponse extends ActionResponse {
  data?: {
    reservation: StoreReservation
    deliveredAt: Date
  }
}
