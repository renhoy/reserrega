'use client'

/**
 * =====================================================
 * COMERCIAL SCAN PAGE
 * =====================================================
 * Page for comercials to scan user QR and products
 * =====================================================
 */

import { useState } from 'react'
import { requireRole } from '@/shared/auth/server'
import { MainLayout } from '@/shared/common/components/layouts'
import { PageHeader } from '@/shared/common/components/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/components/ui/tabs'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { QRScanner } from '@/features/product-reservation/components/QRScanner'
import { ProductScanner } from '@/features/product-reservation/components/ProductScanner'
import { ReservationForm } from '@/features/product-reservation/components/ReservationForm'
import { CheckCircle2, User as UserIcon, Package } from 'lucide-react'
import { useAuth } from '@/shared/auth/hooks/useAuth'
import type { Product } from '@/features/product-reservation/types/reservation.types'

/**
 * Scan Page for Comercials
 *
 * Two-step process:
 * 1. Scan user QR code
 * 2. Scan product barcode
 * 3. Show reservation form
 */
export default function ScanPage() {
  const { user } = useAuth()
  const [scannedUserId, setScannedUserId] = useState<string | null>(null)
  const [scannedUsername, setScannedUsername] = useState<string | null>(null)
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState<'qr' | 'product' | 'confirm'>('qr')

  const handleQRScanSuccess = (userId: string, username?: string) => {
    setScannedUserId(userId)
    setScannedUsername(username || null)
    setActiveTab('product')
  }

  const handleProductScanSuccess = (product: Product) => {
    setScannedProduct(product)
    setActiveTab('confirm')
  }

  const handleReservationSuccess = () => {
    // Reset state
    setScannedUserId(null)
    setScannedUsername(null)
    setScannedProduct(null)
    setActiveTab('qr')
  }

  const handleCancel = () => {
    setScannedProduct(null)
    setActiveTab('product')
  }

  if (!user) {
    return null
  }

  // Mock store data - in production, this would come from the user's store
  const store = {
    id: 1,
    companyId: 1,
    name: 'Empresa Demo',
    address: 'Calle Principal 123',
    phone: '+34 600 000 000',
    email: null,
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8">
        <PageHeader
          title="Escanear Productos"
          description="Ayuda a los clientes a reservar productos"
        />

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="qr" disabled={!!(scannedUserId && (activeTab === 'product' || activeTab === 'confirm'))}>
                <UserIcon className="mr-2 h-4 w-4" />
                1. Usuario
                {scannedUserId && <CheckCircle2 className="ml-2 h-4 w-4 text-lime-600" />}
              </TabsTrigger>
              <TabsTrigger value="product" disabled={!scannedUserId || activeTab === 'confirm'}>
                <Package className="mr-2 h-4 w-4" />
                2. Producto
                {scannedProduct && <CheckCircle2 className="ml-2 h-4 w-4 text-lime-600" />}
              </TabsTrigger>
              <TabsTrigger value="confirm" disabled={!scannedProduct}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                3. Confirmar
              </TabsTrigger>
            </TabsList>

            {/* QR Scanner Tab */}
            <TabsContent value="qr" className="mt-6">
              <div className="flex justify-center">
                <QRScanner onScanSuccess={handleQRScanSuccess} />
              </div>
            </TabsContent>

            {/* Product Scanner Tab */}
            <TabsContent value="product" className="mt-6 space-y-4">
              {scannedUserId && (
                <Alert className="border-lime-500 bg-lime-50 dark:bg-lime-900/20">
                  <CheckCircle2 className="h-4 w-4 text-lime-600" />
                  <AlertDescription>
                    <span className="font-semibold">Usuario identificado:</span>{' '}
                    {scannedUsername || scannedUserId}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center">
                <ProductScanner
                  userId={scannedUserId!}
                  storeId={store.id}
                  onScanSuccess={handleProductScanSuccess}
                />
              </div>
            </TabsContent>

            {/* Confirmation Tab */}
            <TabsContent value="confirm" className="mt-6">
              {scannedProduct && scannedUserId && (
                <div className="flex justify-center">
                  <ReservationForm
                    product={scannedProduct}
                    store={store}
                    onSuccess={handleReservationSuccess}
                    onCancel={handleCancel}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
            <CardDescription>Cómo ayudar a los clientes a reservar productos</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-lime-500 text-white text-xs font-bold">
                  1
                </span>
                <div>
                  <p className="font-semibold">Escanear código QR del cliente</p>
                  <p className="text-muted-foreground">
                    Pide al cliente que te muestre su código QR desde la app de Reserrega
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-lime-500 text-white text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="font-semibold">Escanear código de barras del producto</p>
                  <p className="text-muted-foreground">
                    Escanea el código de barras del producto que el cliente quiere reservar
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-lime-500 text-white text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="font-semibold">Confirmar reserva</p>
                  <p className="text-muted-foreground">
                    El cliente completará el pago de 1€ desde su móvil para confirmar la reserva
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
