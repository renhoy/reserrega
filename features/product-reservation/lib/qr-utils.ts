/**
 * =====================================================
 * QR CODE UTILITIES
 * =====================================================
 * Utilities for generating and validating QR codes
 * =====================================================
 */

import QRCode from 'qrcode'
import type { QRCodeData, QRValidationResult } from '../types/reservation.types'
import { QR_CODE_EXPIRATION_HOURS } from '@/shared/common/constants/ui'

/**
 * Generate QR code data for a user
 *
 * @param userId - User ID
 * @param username - Optional username
 * @returns QR code data object
 *
 * @example
 * ```ts
 * const qrData = generateQRData('user-123', 'John Doe')
 * // { userId: 'user-123', username: 'John Doe', timestamp: 1234567890, expiresAt: 1234654290 }
 * ```
 */
export function generateQRData(
  userId: string,
  username?: string
): QRCodeData {
  const timestamp = Date.now()
  const expiresAt = timestamp + (QR_CODE_EXPIRATION_HOURS * 60 * 60 * 1000)

  return {
    userId,
    username,
    timestamp,
    expiresAt,
  }
}

/**
 * Generate QR code image as Data URL
 *
 * @param data - QR code data
 * @returns Promise with Data URL of QR code image
 *
 * @example
 * ```ts
 * const qrData = generateQRData('user-123')
 * const qrCodeUrl = await generateQRCodeURL(qrData)
 * // "data:image/png;base64,iVBORw0KGgo..."
 * ```
 */
export async function generateQRCodeURL(data: QRCodeData): Promise<string> {
  try {
    const jsonString = JSON.stringify(data)
    const qrCodeUrl = await QRCode.toDataURL(jsonString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrCodeUrl
  } catch (error) {
    console.error('[generateQRCodeURL] Error:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code image as Buffer (for server-side)
 *
 * @param data - QR code data
 * @returns Promise with Buffer of QR code image
 *
 * @example
 * ```ts
 * const qrData = generateQRData('user-123')
 * const buffer = await generateQRCodeBuffer(qrData)
 * ```
 */
export async function generateQRCodeBuffer(data: QRCodeData): Promise<Buffer> {
  try {
    const jsonString = JSON.stringify(data)
    const buffer = await QRCode.toBuffer(jsonString, {
      width: 300,
      margin: 2,
    })
    return buffer
  } catch (error) {
    console.error('[generateQRCodeBuffer] Error:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}

/**
 * Parse QR code data string
 *
 * @param qrDataString - QR code data as JSON string
 * @returns Parsed QR code data or null if invalid
 *
 * @example
 * ```ts
 * const parsed = parseQRData('{"userId":"123",...}')
 * // { userId: '123', ... }
 * ```
 */
export function parseQRData(qrDataString: string): QRCodeData | null {
  try {
    const data = JSON.parse(qrDataString)

    // Validate required fields
    if (!data.userId || !data.timestamp || !data.expiresAt) {
      console.error('[parseQRData] Missing required fields')
      return null
    }

    return data as QRCodeData
  } catch (error) {
    console.error('[parseQRData] Error parsing QR data:', error)
    return null
  }
}

/**
 * Validate QR code data
 *
 * @param qrDataString - QR code data as JSON string
 * @returns Validation result with user ID if valid
 *
 * @example
 * ```ts
 * const result = validateQRCode('{"userId":"123",...}')
 * if (result.valid) {
 *   console.log('User ID:', result.userId)
 * } else {
 *   console.log('Invalid:', result.reason)
 * }
 * ```
 */
export function validateQRCode(qrDataString: string): QRValidationResult {
  const data = parseQRData(qrDataString)

  if (!data) {
    return {
      valid: false,
      reason: 'QR inválido o corrupto',
    }
  }

  // Check if expired
  const now = Date.now()
  if (now > data.expiresAt) {
    return {
      valid: false,
      userId: data.userId,
      username: data.username,
      reason: 'QR expirado',
      expired: true,
    }
  }

  return {
    valid: true,
    userId: data.userId,
    username: data.username,
  }
}

/**
 * Check if QR code is expired
 *
 * @param data - QR code data
 * @returns true if expired, false otherwise
 *
 * @example
 * ```ts
 * const qrData = generateQRData('user-123')
 * const expired = isQRExpired(qrData)
 * ```
 */
export function isQRExpired(data: QRCodeData): boolean {
  return Date.now() > data.expiresAt
}

/**
 * Get time remaining until QR expiration
 *
 * @param data - QR code data
 * @returns Time remaining in milliseconds
 *
 * @example
 * ```ts
 * const qrData = generateQRData('user-123')
 * const msRemaining = getQRTimeRemaining(qrData)
 * const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60))
 * ```
 */
export function getQRTimeRemaining(data: QRCodeData): number {
  const remaining = data.expiresAt - Date.now()
  return Math.max(0, remaining)
}

/**
 * Format QR time remaining as human-readable string
 *
 * @param data - QR code data
 * @returns Formatted time string
 *
 * @example
 * ```ts
 * const qrData = generateQRData('user-123')
 * const timeStr = formatQRTimeRemaining(qrData)
 * // "23h 45m"
 * ```
 */
export function formatQRTimeRemaining(data: QRCodeData): string {
  const ms = getQRTimeRemaining(data)

  if (ms === 0) {
    return 'Expirado'
  }

  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}
