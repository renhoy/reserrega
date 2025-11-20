'use client'

/**
 * =====================================================
 * STORE-PANEL - ProductLinker Component
 * =====================================================
 * Escanea códigos de barras y vincula productos a sesión
 * =====================================================
 */

import { useState } from 'react'
import { Barcode, Package, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import { ScrollArea } from '@/shared/common/components/ui/scroll-area'
import { Badge } from '@/shared/common/components/ui/badge'
import type { SessionProduct } from '../types/store.types'
import { formatPrice } from '../lib/store-utils'

interface ProductLinkerProps {
  sessionId: string
  userId: string
  userName: string
  products: SessionProduct[]
  onProductAdd: (barcode: string) => void
  onProductRemove: (barcode: string) => void
  isLoading?: boolean
}

export function ProductLinker({
  sessionId,
  userId,
  userName,
  products,
  onProductAdd,
  onProductRemove,
  isLoading = false,
}: ProductLinkerProps) {
  const [barcode, setBarcode] = useState('')
  const [scanMode, setScanMode] = useState<'scanner' | 'manual'>('scanner')
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (scannedBarcode: string) => {
    try {
      setError(null)

      // Validate barcode
      if (!scannedBarcode || scannedBarcode.trim().length < 6) {
        setError('Código de barras inválido (mínimo 6 caracteres)')
        return
      }

      // Check if already added
      if (products.some((p) => p.barcode === scannedBarcode.trim())) {
        setError('Este producto ya fue escaneado')
        return
      }

      onProductAdd(scannedBarcode.trim())
      setBarcode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar código')
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleScan(barcode)
  }

  const handleRemove = (productBarcode: string) => {
    onProductRemove(productBarcode)
  }

  const totalValue = products.reduce((sum, p) => sum + p.price, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Escaneados
            </CardTitle>
            <CardDescription>
              Usuario: <span className="font-medium">{userName}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={scanMode === 'scanner' ? 'default' : 'outline'}
            onClick={() => setScanMode('scanner')}
            className="flex-1"
            size="sm"
          >
            <Barcode className="h-4 w-4 mr-2" />
            Escáner
          </Button>
          <Button
            type="button"
            variant={scanMode === 'manual' ? 'default' : 'outline'}
            onClick={() => setScanMode('manual')}
            className="flex-1"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Manual
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scanner Mode */}
        {scanMode === 'scanner' && (
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-6">
              <Barcode className="h-16 w-16 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground text-center">
                Escanea el código de barras del producto
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                La cámara se activará automáticamente
              </p>
            </div>

            {/* Barcode scanner will be integrated here */}
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setScanMode('manual')}
                disabled={isLoading}
              >
                ¿Problemas con el escáner? Ingresar manualmente
              </Button>
            </div>
          </div>
        )}

        {/* Manual Input Mode */}
        {scanMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  type="text"
                  placeholder="Ej: 7501234567890"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  disabled={isLoading}
                  autoComplete="off"
                  className="font-mono"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !barcode.trim()}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Products List */}
        {products.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Productos en esta sesión:</span>
              <span className="text-lg">{formatPrice(totalValue)}</span>
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div
                    key={product.barcode}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          #{index + 1}
                        </Badge>
                        <p className="font-medium text-sm truncate">
                          {product.name || 'Producto sin nombre'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-muted-foreground font-mono">
                          {product.barcode}
                        </p>
                        <p className="text-sm font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(product.barcode)}
                      disabled={isLoading}
                      className="ml-2 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay productos escaneados aún</p>
            <p className="text-xs mt-1">
              Escanea el primer producto para comenzar
            </p>
          </div>
        )}

        {/* Session Info */}
        <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
          <p>
            Sesión ID: <span className="font-mono">{sessionId}</span>
          </p>
          <p>
            Usuario ID: <span className="font-mono">{userId}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
