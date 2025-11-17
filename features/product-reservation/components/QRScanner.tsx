'use client'

/**
 * =====================================================
 * QR SCANNER COMPONENT
 * =====================================================
 * Component for scanning user QR codes with camera
 * =====================================================
 */

import { useState, useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import { Camera, CameraOff, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { scanQRAction } from '../actions/scanProduct'
import { cn } from '@/shared/common/lib/utils'

interface QRScannerProps {
  onScanSuccess: (userId: string, username?: string) => void
  onScanError?: (error: string) => void
  className?: string
}

/**
 * QR Scanner component
 *
 * Uses device camera to scan user QR codes
 *
 * @example
 * ```tsx
 * <QRScanner
 *   onScanSuccess={(userId, username) => {
 *     console.log('User scanned:', userId, username)
 *   }}
 * />
 * ```
 */
export function QRScanner({
  onScanSuccess,
  onScanError,
  className,
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scannedData, setScannedData] = useState<{ userId: string; username?: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  const startScanning = async () => {
    setError(null)
    setScannedData(null)

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Initialize code reader
      const codeReader = new BrowserMultiFormatReader()
      codeReaderRef.current = codeReader

      setIsScanning(true)

      // Start decoding from video
      codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        async (result, err) => {
          if (result) {
            const qrData = result.getText()

            try {
              // Validate QR with server
              const response = await scanQRAction({ qrData })

              if (response.valid && response.userId) {
                setScannedData({
                  userId: response.userId,
                  username: response.username,
                })
                onScanSuccess(response.userId, response.username)
                stopScanning()
              } else {
                setError(response.reason || 'QR inválido')
                onScanError?.(response.reason || 'QR inválido')
              }
            } catch (error) {
              console.error('[QRScanner] Validation error:', error)
              setError('Error al validar el código QR')
              onScanError?.('Error al validar el código QR')
            }
          }

          if (err && err.name !== 'NotFoundException') {
            console.error('[QRScanner] Scan error:', err)
          }
        }
      )
    } catch (err) {
      console.error('[QRScanner] Camera error:', err)
      setError('No se pudo acceder a la cámara. Por favor, permite el acceso.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
      codeReaderRef.current = null
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    setIsScanning(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>Escanear QR del Usuario</CardTitle>
        <CardDescription>
          Escanea el código QR del usuario para iniciar la reserva
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Video Preview */}
        <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />

          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Presiona iniciar para escanear</p>
              </div>
            </div>
          )}

          {/* Scanning indicator */}
          {isScanning && !scannedData && (
            <div className="absolute inset-0 border-4 border-lime-500 animate-pulse" />
          )}
        </div>

        {/* Success State */}
        {scannedData && (
          <Alert className="border-lime-500 bg-lime-50 dark:bg-lime-900/20">
            <CheckCircle2 className="h-4 w-4 text-lime-600" />
            <AlertDescription>
              <p className="font-semibold">QR escaneado correctamente</p>
              {scannedData.username && (
                <p className="text-sm">Usuario: {scannedData.username}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isScanning ? (
            <Button
              onClick={startScanning}
              className="flex-1"
              disabled={!!scannedData}
            >
              <Camera className="mr-2 h-4 w-4" />
              Iniciar Escaneo
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="outline"
              className="flex-1"
            >
              <CameraOff className="mr-2 h-4 w-4" />
              Detener
            </Button>
          )}

          {scannedData && (
            <Button
              onClick={() => {
                setScannedData(null)
                setError(null)
              }}
              variant="outline"
            >
              Escanear Otro
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
