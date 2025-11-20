'use client'

/**
 * =====================================================
 * STORE-PANEL - SessionScanner Component
 * =====================================================
 * Escanea QR de usuario para iniciar sesión de compra
 * =====================================================
 */

import { useState } from 'react'
import { QrCode, UserPlus, Loader2 } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'

interface SessionScannerProps {
  onSessionStart: (userId: string) => void
  isLoading?: boolean
  storeId: string
}

export function SessionScanner({ onSessionStart, isLoading = false, storeId }: SessionScannerProps) {
  const [manualUserId, setManualUserId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr')

  const handleScan = async (data: string) => {
    try {
      setError(null)

      // Validate QR code data
      if (!data || data.trim().length < 10) {
        setError('Código QR inválido')
        return
      }

      // Try to parse QR code (could be JSON or direct user ID)
      let userId: string
      try {
        const parsed = JSON.parse(data)
        userId = parsed.userId || parsed.id
      } catch {
        // Not JSON, use as direct user ID
        userId = data.trim()
      }

      onSessionStart(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar QR')
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualUserId.trim()) {
      setError('Por favor ingresa un ID de usuario')
      return
    }

    handleScan(manualUserId.trim())
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Iniciar Sesión de Compra
        </CardTitle>
        <CardDescription>
          Escanea el código QR del usuario o ingresa su ID manualmente
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={scanMode === 'qr' ? 'default' : 'outline'}
            onClick={() => setScanMode('qr')}
            className="flex-1"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Escanear QR
          </Button>
          <Button
            type="button"
            variant={scanMode === 'manual' ? 'default' : 'outline'}
            onClick={() => setScanMode('manual')}
            className="flex-1"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ingreso Manual
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* QR Scanner Mode */}
        {scanMode === 'qr' && (
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-8">
              <QrCode className="h-24 w-24 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                Posiciona el código QR del usuario frente a la cámara
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                La cámara se activará automáticamente
              </p>
            </div>

            {/* QR Scanner will be integrated here with actual camera component */}
            {/* For now, we show a placeholder */}
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setScanMode('manual')}
                disabled={isLoading}
              >
                ¿Problemas con la cámara? Usar ingreso manual
              </Button>
            </div>
          </div>
        )}

        {/* Manual Input Mode */}
        {scanMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">ID de Usuario</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Ej: user_abc123xyz..."
                value={manualUserId}
                onChange={(e) => setManualUserId(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                El usuario puede encontrar su ID en su app
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !manualUserId.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>
        )}

        {/* Store Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Tienda ID: <span className="font-mono">{storeId}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
