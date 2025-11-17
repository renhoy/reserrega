/**
 * =====================================================
 * RESERVATION TYPES
 * =====================================================
 * TypeScript types for Product-Reservation module
 * =====================================================
 */

// ==================== DATABASE TYPES ====================

/**
 * Reservation status
 */
export type ReservationStatus = 'active' | 'expired' | 'completed' | 'cancelled'

/**
 * Reservation from database
 */
export interface Reservation {
  id: string
  userId: string
  productId: string
  storeId: number
  amountPaid: number
  storeShare: number
  platformShare: number
  status: ReservationStatus
  reservedAt: string
  expiresAt: string
  createdAt: string
  updatedAt: string
}

/**
 * Product from database
 */
export interface Product {
  id: string
  storeId: number
  barcode: string
  name: string
  description: string | null
  brand: string | null
  size: string
  color: string
  price: number
  imageUrl: string | null
  category: string | null
  createdAt: string
  updatedAt: string
}

/**
 * Store from database
 */
export interface Store {
  id: number
  companyId: number
  name: string
  address: string | null
  phone: string | null
  email: string | null
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// ==================== QR TYPES ====================

/**
 * QR Code data structure
 */
export interface QRCodeData {
  userId: string
  username?: string
  timestamp: number
  expiresAt: number
}

/**
 * QR Code validation result
 */
export interface QRValidationResult {
  valid: boolean
  userId?: string
  username?: string
  reason?: string
  expired?: boolean
}

// ==================== FORM TYPES ====================

/**
 * Create reservation form data
 */
export interface CreateReservationFormData {
  productId: string
  storeId: number
  size: string
  color: string
  customNotes?: string
}

/**
 * Product scan data
 */
export interface ProductScanData {
  barcode: string
  userId: string
  storeId: number
  name?: string
  brand?: string
  price?: number
  category?: string
}

/**
 * Create product data
 */
export interface CreateProductData {
  storeId: number
  barcode: string
  name: string
  description?: string
  brand?: string
  size: string
  color: string
  price: number
  imageUrl?: string
  category?: string
}

// ==================== API TYPES ====================

/**
 * Generate QR request
 */
export interface GenerateQRRequest {
  userId: string
  username?: string
}

/**
 * Generate QR response
 */
export interface GenerateQRResponse {
  qrData: string
  qrCodeUrl: string
  expiresAt: number
}

/**
 * Scan QR request
 */
export interface ScanQRRequest {
  qrData: string
}

/**
 * Scan QR response
 */
export interface ScanQRResponse {
  valid: boolean
  userId?: string
  username?: string
  reason?: string
}

/**
 * Scan product request
 */
export interface ScanProductRequest {
  barcode: string
  userId: string
  storeId: number
}

/**
 * Scan product response
 */
export interface ScanProductResponse {
  productId: string
  product: Product
  isNewProduct: boolean
}

/**
 * Create reservation request
 */
export interface CreateReservationRequest {
  userId: string
  productId: string
  storeId: number
  amountPaid?: number
}

/**
 * Create reservation response
 */
export interface CreateReservationResponse {
  reservationId: string
  reservation: Reservation
  paymentSimulated: boolean
}

// ==================== VIEW TYPES ====================

/**
 * Reservation with relations
 */
export interface ReservationWithRelations extends Reservation {
  product?: Product
  store?: Store
  userName?: string
}

/**
 * Reservation list item
 */
export interface ReservationListItem {
  id: string
  productName: string
  productBrand: string | null
  productSize: string
  productColor: string
  productPrice: number
  productImageUrl: string | null
  storeName: string
  status: ReservationStatus
  reservedAt: string
  expiresAt: string
  daysUntilExpiration: number
}

// ==================== UTILITY TYPES ====================

/**
 * Payment simulation result
 */
export interface PaymentSimulationResult {
  success: boolean
  transactionId: string
  amountPaid: number
  timestamp: number
}

/**
 * Expiration calculation result
 */
export interface ExpirationResult {
  expiresAt: Date
  daysUntilExpiration: number
  isExpired: boolean
}
