'use server'

/**
 * =====================================================
 * GENERATE QR SERVER ACTION
 * =====================================================
 * Server action for generating user QR codes
 * =====================================================
 */

import { requireAuth } from '@/shared/auth/server'
import {
  generateQRData,
  generateQRCodeURL,
} from '../lib/qr-utils'
import type { GenerateQRResponse } from '../types/reservation.types'

/**
 * Generate QR code for current user
 *
 * @returns QR code data and image URL
 *
 * @example
 * ```tsx
 * const { qrData, qrCodeUrl, expiresAt } = await generateQRAction()
 * ```
 */
export async function generateQRAction(): Promise<GenerateQRResponse> {
  // Require authentication
  const user = await requireAuth()

  // Generate QR data
  const qrData = generateQRData(user.id, user.name)

  // Generate QR code image
  const qrCodeUrl = await generateQRCodeURL(qrData)

  return {
    qrData: JSON.stringify(qrData),
    qrCodeUrl,
    expiresAt: qrData.expiresAt,
  }
}
