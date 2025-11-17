'use client'

/**
 * =====================================================
 * USE QR CODE HOOK
 * =====================================================
 * Hook for managing QR code generation and state
 * =====================================================
 */

import { useState, useEffect, useCallback } from 'react'
import { generateQRAction } from '../actions/generateQR'
import { parseQRData, getQRTimeRemaining, formatQRTimeRemaining } from '../lib/qr-utils'
import type { QRCodeData } from '../types/reservation.types'

interface UseQRCodeReturn {
  qrCodeUrl: string | null
  qrData: QRCodeData | null
  isExpired: boolean
  timeRemaining: string
  isLoading: boolean
  error: string | null
  generateQR: () => Promise<void>
  refreshQR: () => Promise<void>
}

/**
 * Hook for managing QR code
 *
 * Auto-generates QR on mount and auto-refreshes when expired
 *
 * @returns QR code state and actions
 *
 * @example
 * ```tsx
 * function QRDisplay() {
 *   const { qrCodeUrl, timeRemaining, isExpired, refreshQR } = useQRCode()
 *
 *   if (isExpired) {
 *     return <Button onClick={refreshQR}>Generar nuevo QR</Button>
 *   }
 *
 *   return (
 *     <div>
 *       <img src={qrCodeUrl} alt="QR Code" />
 *       <p>Expira en: {timeRemaining}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useQRCode(): UseQRCodeReturn {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateQR = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await generateQRAction()

      const parsedData = parseQRData(response.qrData)

      if (!parsedData) {
        throw new Error('Failed to parse QR data')
      }

      setQrCodeUrl(response.qrCodeUrl)
      setQrData(parsedData)
      setIsExpired(false)
    } catch (err) {
      console.error('[useQRCode] Error generating QR:', err)
      setError('Error al generar código QR. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshQR = useCallback(async () => {
    await generateQR()
  }, [generateQR])

  // Update time remaining every second
  useEffect(() => {
    if (!qrData) return

    const updateTime = () => {
      const remaining = getQRTimeRemaining(qrData)

      if (remaining === 0) {
        setIsExpired(true)
        setTimeRemaining('Expirado')
      } else {
        setIsExpired(false)
        setTimeRemaining(formatQRTimeRemaining(qrData))
      }
    }

    // Update immediately
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [qrData])

  // Generate QR on mount
  useEffect(() => {
    generateQR()
  }, [generateQR])

  return {
    qrCodeUrl,
    qrData,
    isExpired,
    timeRemaining,
    isLoading,
    error,
    generateQR,
    refreshQR,
  }
}
