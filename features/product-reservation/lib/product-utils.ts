/**
 * =====================================================
 * PRODUCT UTILITIES
 * =====================================================
 * Utilities for handling products, barcodes, and reservations
 * =====================================================
 */

import { addDays } from 'date-fns'
import type { ExpirationResult } from '../types/reservation.types'
import { RESERVATION_EXPIRATION_DAYS } from '@/shared/common/constants/ui'

/**
 * Validate barcode format
 *
 * Supports EAN-13, EAN-8, UPC-A, UPC-E
 *
 * @param barcode - Barcode string to validate
 * @returns true if valid format, false otherwise
 *
 * @example
 * ```ts
 * validateBarcode('1234567890123') // true (EAN-13)
 * validateBarcode('12345678') // true (EAN-8)
 * validateBarcode('abc') // false
 * ```
 */
export function validateBarcode(barcode: string): boolean {
  if (!barcode || typeof barcode !== 'string') {
    return false
  }

  // Remove whitespace
  const cleaned = barcode.trim()

  // Check common barcode formats
  const ean13Regex = /^\d{13}$/  // EAN-13
  const ean8Regex = /^\d{8}$/    // EAN-8
  const upcARegex = /^\d{12}$/   // UPC-A
  const upcERegex = /^\d{6,8}$/  // UPC-E

  return (
    ean13Regex.test(cleaned) ||
    ean8Regex.test(cleaned) ||
    upcARegex.test(cleaned) ||
    upcERegex.test(cleaned)
  )
}

/**
 * Normalize barcode (remove spaces, validate)
 *
 * @param barcode - Barcode to normalize
 * @returns Normalized barcode or null if invalid
 *
 * @example
 * ```ts
 * normalizeBarcode(' 123 456 789 012 3 ') // '1234567890123'
 * normalizeBarcode('invalid') // null
 * ```
 */
export function normalizeBarcode(barcode: string): string | null {
  if (!barcode) return null

  const cleaned = barcode.replace(/\s/g, '').trim()

  if (!validateBarcode(cleaned)) {
    return null
  }

  return cleaned
}

/**
 * Calculate reservation expiration date
 *
 * @param startDate - Start date (defaults to now)
 * @param days - Number of days until expiration (defaults to RESERVATION_EXPIRATION_DAYS)
 * @returns Expiration date
 *
 * @example
 * ```ts
 * const expiresAt = calculateExpiration()
 * // Date 15 days from now
 * ```
 */
export function calculateExpiration(
  startDate: Date = new Date(),
  days: number = RESERVATION_EXPIRATION_DAYS
): Date {
  return addDays(startDate, days)
}

/**
 * Get expiration info for a reservation
 *
 * @param expiresAt - Expiration date
 * @returns Expiration result with days remaining and expired status
 *
 * @example
 * ```ts
 * const result = getExpirationInfo(reservation.expiresAt)
 * if (result.isExpired) {
 *   console.log('Reservation expired')
 * } else {
 *   console.log(`${result.daysUntilExpiration} days remaining`)
 * }
 * ```
 */
export function getExpirationInfo(expiresAt: Date | string): ExpirationResult {
  const expirationDate = typeof expiresAt === 'string'
    ? new Date(expiresAt)
    : expiresAt

  const now = new Date()
  const msUntilExpiration = expirationDate.getTime() - now.getTime()
  const daysUntilExpiration = Math.ceil(msUntilExpiration / (1000 * 60 * 60 * 24))

  return {
    expiresAt: expirationDate,
    daysUntilExpiration: Math.max(0, daysUntilExpiration),
    isExpired: msUntilExpiration <= 0,
  }
}

/**
 * Check if a reservation is expired
 *
 * @param expiresAt - Expiration date
 * @returns true if expired, false otherwise
 *
 * @example
 * ```ts
 * if (isReservationExpired(reservation.expiresAt)) {
 *   console.log('Reservation has expired')
 * }
 * ```
 */
export function isReservationExpired(expiresAt: Date | string): boolean {
  const info = getExpirationInfo(expiresAt)
  return info.isExpired
}

/**
 * Calculate payment splits
 *
 * @param totalAmount - Total payment amount
 * @param platformPercentage - Platform percentage (0-1, default 0.5)
 * @returns Split amounts
 *
 * @example
 * ```ts
 * const { storeShare, platformShare } = calculatePaymentSplit(1.00, 0.5)
 * // { storeShare: 0.50, platformShare: 0.50 }
 * ```
 */
export function calculatePaymentSplit(
  totalAmount: number,
  platformPercentage: number = 0.5
): { storeShare: number; platformShare: number } {
  const platformShare = totalAmount * platformPercentage
  const storeShare = totalAmount - platformShare

  return {
    storeShare: Math.round(storeShare * 100) / 100,
    platformShare: Math.round(platformShare * 100) / 100,
  }
}

/**
 * Generate product SKU
 *
 * Creates a SKU from barcode, size, and color
 *
 * @param barcode - Product barcode
 * @param size - Product size
 * @param color - Product color
 * @returns SKU string
 *
 * @example
 * ```ts
 * const sku = generateProductSKU('1234567890123', 'M', 'Blue')
 * // "1234567890123-M-BLUE"
 * ```
 */
export function generateProductSKU(
  barcode: string,
  size: string,
  color: string
): string {
  const normalizedColor = color.toUpperCase().replace(/\s/g, '-')
  const normalizedSize = size.toUpperCase().replace(/\s/g, '-')

  return `${barcode}-${normalizedSize}-${normalizedColor}`
}

/**
 * Parse barcode from scanner input
 *
 * Handles various scanner formats and cleans up the input
 *
 * @param scannerInput - Raw input from barcode scanner
 * @returns Parsed barcode or null if invalid
 *
 * @example
 * ```ts
 * const barcode = parseBarcodeInput('SCAN:1234567890123')
 * // "1234567890123"
 * ```
 */
export function parseBarcodeInput(scannerInput: string): string | null {
  if (!scannerInput) return null

  // Remove common prefixes from scanners
  let cleaned = scannerInput
    .replace(/^(SCAN:|BARCODE:|CODE:)/i, '')
    .trim()

  return normalizeBarcode(cleaned)
}

/**
 * Validate product data
 *
 * @param data - Product data to validate
 * @returns Validation result
 *
 * @example
 * ```ts
 * const result = validateProductData({
 *   barcode: '1234567890123',
 *   name: 'T-Shirt',
 *   size: 'M',
 *   color: 'Blue',
 *   price: 29.99
 * })
 * ```
 */
export function validateProductData(data: {
  barcode: string
  name: string
  size: string
  color: string
  price: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.barcode || !validateBarcode(data.barcode)) {
    errors.push('Código de barras inválido')
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Nombre del producto requerido')
  }

  if (!data.size || data.size.trim().length === 0) {
    errors.push('Talla requerida')
  }

  if (!data.color || data.color.trim().length === 0) {
    errors.push('Color requerido')
  }

  if (!data.price || data.price <= 0) {
    errors.push('Precio debe ser mayor a 0')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format product name for display
 *
 * @param product - Product data
 * @returns Formatted product name
 *
 * @example
 * ```ts
 * formatProductName({
 *   name: 'T-Shirt',
 *   brand: 'Nike',
 *   size: 'M',
 *   color: 'Blue'
 * })
 * // "Nike T-Shirt (M, Blue)"
 * ```
 */
export function formatProductName(product: {
  name: string
  brand?: string | null
  size: string
  color: string
}): string {
  const brandPrefix = product.brand ? `${product.brand} ` : ''
  return `${brandPrefix}${product.name} (${product.size}, ${product.color})`
}
