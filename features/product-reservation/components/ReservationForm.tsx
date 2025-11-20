'use client'

/**
 * =====================================================
 * RESERVATION FORM COMPONENT
 * =====================================================
 * Component for confirming reservation and payment
 * =====================================================
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Package, Store as StoreIcon, Calendar, Euro } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Separator } from '@/shared/common/components/ui/separator'
import { useReservation } from '../hooks/useReservation'
import { useAuth } from '@/shared/auth/hooks/useAuth'
import { formatCurrency, formatDate } from '@/shared/common/lib/formatters'
import { calculateExpiration, formatProductName } from '../lib/product-utils'
import { cn } from '@/shared/common/lib/utils'
import type { Product, Store } from '../types/reservation.types'

interface ReservationFormProps {
  product: Product
  store: Store
  onSuccess?: (reservationId: string) => void
  onCancel?: () => void
  className?: string
}

/**
 * Reservation Form component
 *
 * Displays product details and handles payment confirmation
 *
 * @example
 * ```tsx
 * <ReservationForm
 *   product={product}
 *   store={store}
 *   onSuccess={(id) => router.push(`/reservations/${id}`)}
 * />
 * ```
 */
export function ReservationForm({
  product,
  store,
  onSuccess,
  onCancel,
  className,
}: ReservationFormProps) {
  const { user } = useAuth()
  const { createReservation, isCreating, error } = useReservation()
  const router = useRouter()
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const reservationAmount = 1.00
  const expirationDate = calculateExpiration()

  const handleConfirmReservation = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setPaymentConfirmed(true)

    const reservationId = await createReservation({
      userId: user.id,
      productId: product.id,
      storeId: store.id,
      amountPaid: reservationAmount,
    })

    if (reservationId) {
      onSuccess?.(reservationId)
      router.push(`/reservations/${reservationId}`)
    } else {
      setPaymentConfirmed(false)
    }
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>Confirmar Reserva</CardTitle>
        <CardDescription>
          Revisa los detalles y confirma tu reserva
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{formatProductName(product)}</p>
              {product.description && (
                <p className="text-sm text-muted-foreground">{product.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Código: <span className="font-mono">{product.barcode}</span>
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <StoreIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{store.name}</p>
              {store.address && (
                <p className="text-sm text-muted-foreground">{store.address}</p>
              )}
              {store.phone && (
                <p className="text-sm text-muted-foreground">{store.phone}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Válido hasta</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(expirationDate, 'dd MMMM yyyy')} (15 días)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                La reserva expirará automáticamente si no la completas antes de esta fecha
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Euro className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Pago de Reserva</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(reservationAmount)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Este pago reserva el producto para ti. El pago completo se realiza al recogerlo.
              </p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Precio del producto:</span>
            <span className="font-semibold">{formatCurrency(product.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Pago de reserva:</span>
            <span className="font-semibold text-pink-600">
              {formatCurrency(reservationAmount)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Pendiente al recoger:</span>
            <span className="font-bold">
              {formatCurrency(product.price - reservationAmount)}
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Important Notes */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• La reserva es válida por 15 días</p>
          <p>• El pago de reserva (1€) no es reembolsable</p>
          <p>• Debes completar el pago en tienda antes de la expiración</p>
          <p>• Recibirás una notificación cuando tu reserva esté próxima a expirar</p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isCreating}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}

        <Button
          onClick={handleConfirmReservation}
          disabled={isCreating || paymentConfirmed}
          className="flex-1"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isCreating ? 'Procesando...' : `Pagar ${formatCurrency(reservationAmount)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
