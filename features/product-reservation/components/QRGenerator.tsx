'use client'

/**
 * =====================================================
 * QR GENERATOR COMPONENT
 * =====================================================
 * Component for generating and displaying user QR codes
 * =====================================================
 */

import { RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { LoadingSpinner } from '@/shared/common/components/shared/LoadingSpinner'
import { useQRCode } from '../hooks/useQRCode'
import { cn } from '@/shared/common/lib/utils'

interface QRGeneratorProps {
  className?: string
  showInstructions?: boolean
}

/**
 * QR Generator component
 *
 * Displays QR code for user with auto-refresh when expired
 *
 * @example
 * ```tsx
 * <QRGenerator showInstructions />
 * ```
 */
export function QRGenerator({
  className,
  showInstructions = true,
}: QRGeneratorProps) {
  const {
    qrCodeUrl,
    isExpired,
    timeRemaining,
    isLoading,
    error,
    refreshQR,
  } = useQRCode()

  if (isLoading && !qrCodeUrl) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-12">
          <LoadingSpinner size="lg" text="Generando código QR..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={refreshQR}
            className="mt-4 w-full"
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <CardTitle>Tu Código QR</CardTitle>
        <CardDescription>
          Muestra este código al personal de la tienda para reservar productos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex items-center justify-center bg-white p-6 rounded-lg">
          {qrCodeUrl && !isExpired ? (
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-64 h-64"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {isExpired ? 'Código expirado' : 'Generando...'}
              </p>
            </div>
          )}
        </div>

        {/* Time Remaining */}
        {!isExpired && timeRemaining && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Válido por:</p>
            <p className="text-2xl font-bold text-pink-600">{timeRemaining}</p>
          </div>
        )}

        {/* Expired State */}
        {isExpired && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu código QR ha expirado. Genera uno nuevo para continuar.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        {showInstructions && !isExpired && (
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Instrucciones:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Muestra este código al personal de la tienda</li>
              <li>Ellos escanearán tu código y el producto que desees</li>
              <li>Completa el formulario de reserva en tu móvil</li>
              <li>Paga 1€ para confirmar la reserva</li>
            </ol>
          </div>
        )}
      </CardContent>

      {/* Footer with Refresh Button */}
      <CardFooter>
        <Button
          onClick={refreshQR}
          className="w-full"
          variant={isExpired ? 'default' : 'outline'}
          disabled={isLoading}
        >
          <RefreshCw className={cn('mr-2 h-4 w-4', isLoading && 'animate-spin')} />
          {isExpired ? 'Generar Nuevo Código' : 'Actualizar Código'}
        </Button>
      </CardFooter>
    </Card>
  )
}
