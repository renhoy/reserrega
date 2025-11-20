'use client'

/**
 * =====================================================
 * PRODUCT SCANNER COMPONENT
 * =====================================================
 * Component for scanning product barcodes with camera
 * =====================================================
 */

import { useState, useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import { Barcode, Camera, CameraOff, CheckCircle2, XCircle, Plus } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/common/components/ui/dialog'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import { scanProductAction, createProductAction } from '../actions/scanProduct'
import { useToast } from '@/shared/common/hooks/useToast'
import { cn } from '@/shared/common/lib/utils'
import type { Product, CreateProductData } from '../types/reservation.types'

interface ProductScannerProps {
  userId: string
  storeId: number
  onScanSuccess: (product: Product) => void
  onScanError?: (error: string) => void
  className?: string
}

/**
 * Product Scanner component
 *
 * Uses device camera to scan product barcodes
 *
 * @example
 * ```tsx
 * <ProductScanner
 *   userId="user-123"
 *   storeId={1}
 *   onScanSuccess={(product) => {
 *     console.log('Product scanned:', product)
 *   }}
 * />
 * ```
 */
export function ProductScanner({
  userId,
  storeId,
  onScanSuccess,
  onScanError,
  className,
}: ProductScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const toast = useToast()

  // Form state for creating product
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    description: '',
    size: '',
    color: '',
    price: '',
    category: '',
  })

  const startScanning = async () => {
    setError(null)
    setScannedProduct(null)
    setScannedBarcode(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const codeReader = new BrowserMultiFormatReader()
      codeReaderRef.current = codeReader

      setIsScanning(true)

      codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        async (result, err) => {
          if (result) {
            const barcode = result.getText()
            setScannedBarcode(barcode)

            try {
              const response = await scanProductAction({
                barcode,
                userId,
                storeId,
              })

              setScannedProduct(response.product)
              onScanSuccess(response.product)
              stopScanning()
              toast.success('Producto encontrado', response.product.name)
            } catch (error: any) {
              if (error.message === 'PRODUCT_NOT_FOUND') {
                // Product doesn't exist, show create dialog
                setShowCreateDialog(true)
                stopScanning()
              } else {
                setError(error.message || 'Error al escanear producto')
                onScanError?.(error.message || 'Error al escanear producto')
              }
            }
          }

          if (err && err.name !== 'NotFoundException') {
            console.error('[ProductScanner] Scan error:', err)
          }
        }
      )
    } catch (err) {
      console.error('[ProductScanner] Camera error:', err)
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

  const handleCreateProduct = async () => {
    if (!scannedBarcode) return

    setIsCreatingProduct(true)

    try {
      const productData: CreateProductData = {
        storeId,
        barcode: scannedBarcode,
        name: productForm.name,
        brand: productForm.brand || undefined,
        description: productForm.description || undefined,
        size: productForm.size,
        color: productForm.color,
        price: parseFloat(productForm.price),
        category: productForm.category || undefined,
      }

      const response = await createProductAction(productData)

      setScannedProduct(response.product)
      onScanSuccess(response.product)
      setShowCreateDialog(false)
      toast.success('Producto creado', response.product.name)

      // Reset form
      setProductForm({
        name: '',
        brand: '',
        description: '',
        size: '',
        color: '',
        price: '',
        category: '',
      })
    } catch (error: any) {
      toast.error('Error al crear producto', error.message)
    } finally {
      setIsCreatingProduct(false)
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <>
      <Card className={cn('w-full max-w-md', className)}>
        <CardHeader>
          <CardTitle>Escanear Producto</CardTitle>
          <CardDescription>
            Escanea el código de barras del producto
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
                  <Barcode className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Presiona iniciar para escanear</p>
                </div>
              </div>
            )}

            {isScanning && !scannedProduct && (
              <div className="absolute inset-0 border-4 border-pink-500 animate-pulse" />
            )}
          </div>

          {/* Scanned Barcode */}
          {scannedBarcode && (
            <div className="text-center text-sm text-muted-foreground">
              Código: <span className="font-mono font-bold">{scannedBarcode}</span>
            </div>
          )}

          {/* Success State */}
          {scannedProduct && (
            <Alert className="border-pink-500 bg-pink-50 dark:bg-pink-900/20">
              <CheckCircle2 className="h-4 w-4 text-pink-600" />
              <AlertDescription>
                <p className="font-semibold">{scannedProduct.name}</p>
                <p className="text-sm">{scannedProduct.brand} - {scannedProduct.size}, {scannedProduct.color}</p>
                <p className="text-sm font-bold">{scannedProduct.price.toFixed(2)} €</p>
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
                disabled={!!scannedProduct}
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

            {scannedProduct && (
              <Button
                onClick={() => {
                  setScannedProduct(null)
                  setScannedBarcode(null)
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

      {/* Create Product Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Producto No Encontrado</DialogTitle>
            <DialogDescription>
              El código de barras <span className="font-mono font-bold">{scannedBarcode}</span> no está registrado.
              Por favor, ingresa los datos del producto.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Ej: Camiseta Deportiva"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                placeholder="Ej: Nike"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="size">Talla *</Label>
                <Input
                  id="size"
                  value={productForm.size}
                  onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                  placeholder="Ej: M"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={productForm.color}
                  onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                  placeholder="Ej: Azul"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Precio (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="Ej: 29.99"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                placeholder="Ej: Ropa Deportiva"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={isCreatingProduct}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateProduct}
              disabled={
                isCreatingProduct ||
                !productForm.name ||
                !productForm.size ||
                !productForm.color ||
                !productForm.price
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              {isCreatingProduct ? 'Creando...' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
