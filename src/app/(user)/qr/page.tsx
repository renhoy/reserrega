import { requireAuth } from '@/shared/auth/server'
import { MainLayout } from '@/shared/common/components/layouts'
import { PageHeader } from '@/shared/common/components/shared'
import { QRGenerator } from '@/features/product-reservation/components/QRGenerator'

export const metadata = {
  title: 'Mi Código QR',
  description: 'Muestra tu código QR para reservar productos en tienda',
}

/**
 * QR Page
 *
 * Shows user's QR code for in-store product reservations
 */
export default async function QRPage() {
  const user = await requireAuth()

  return (
    <MainLayout user={user}>
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Mi Código QR"
          description="Muestra este código en tienda para reservar productos"
        />

        <div className="mt-8 flex justify-center">
          <QRGenerator showInstructions />
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="font-semibold mb-3">¿Cómo funciona?</h2>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Ve a una tienda física adherida a Reserva y Regala</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>Muestra tu código QR al personal de la tienda</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Ellos escanearán tu código y el producto que quieras reservar</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Completa el pago de reserva de 1€ desde tu móvil</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">5.</span>
              <span>El producto quedará reservado para ti por 15 días</span>
            </li>
          </ol>
        </div>
      </div>
    </MainLayout>
  )
}
