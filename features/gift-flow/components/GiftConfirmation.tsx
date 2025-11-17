'use client'

/**
 * =====================================================
 * GIFT CONFIRMATION COMPONENT
 * =====================================================
 * Success page after completing gift purchase
 * =====================================================
 */

import { CheckCircle, Package, Mail, Truck, Calendar, Receipt, Home, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/common/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/common/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/shared/common/components/ui/alert'
import { Separator } from '@/shared/common/components/ui/separator'
import { Badge } from '@/shared/common/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import { cn } from '@/shared/common/lib/utils'
import { formatGiftAmount, formatGiftDate, generateOrderNumber } from '../lib/gift-utils'
import type { GiftWithDetails } from '../types/gift.types'

interface GiftConfirmationProps {
  gift: GiftWithDetails
  orderNumber?: string
  className?: string
}

/**
 * Gift Confirmation component
 *
 * Displays order confirmation with tracking info
 *
 * @example
 * ```tsx
 * <GiftConfirmation gift={giftDetails} orderNumber="GF-ABC123" />
 * ```
 */
export function GiftConfirmation({ gift, orderNumber, className }: GiftConfirmationProps) {
  const order = orderNumber || generateOrderNumber(gift.id)
  const { product, recipient, store, amount, payment_status, created_at } = gift

  const recipientInitials = recipient.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('space-y-6 max-w-2xl mx-auto', className)}>
      {/* Success Alert */}
      <Alert className="bg-lime-50 dark:bg-lime-950/20 border-lime-200 dark:border-lime-800">
        <CheckCircle className="h-5 w-5 text-lime-600 dark:text-lime-400" />
        <AlertTitle className="text-lime-900 dark:text-lime-100 text-lg font-semibold">
          ¡Regalo Confirmado!
        </AlertTitle>
        <AlertDescription className="text-lime-800 dark:text-lime-300 mt-2">
          Tu regalo ha sido procesado exitosamente. {recipient.name} será notificado cuando el
          producto esté listo para entrega.
        </AlertDescription>
      </Alert>

      {/* Order Number Card */}
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-lime-600 dark:bg-lime-500 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Pedido Confirmado</CardTitle>
          <CardDescription className="text-base mt-2">
            Número de pedido:{' '}
            <span className="font-mono font-bold text-foreground">{order}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Recipient Info */}
          <div className="flex items-center gap-4 p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-3 flex-1">
              <Heart className="h-6 w-6 text-violet-600 dark:text-violet-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regalo para</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={recipient.avatar_url || undefined} alt={recipient.name} />
                    <AvatarFallback className="text-xs bg-violet-600 text-white">
                      {recipientInitials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-lg">{recipient.name}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              DETALLES DEL PRODUCTO
            </h3>
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span>Talla: {product.size}</span>
                  <span>•</span>
                  <span>Color: {product.color}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-lime-600 dark:text-lime-400">
                  {formatGiftAmount(amount)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Store & Delivery Info */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              INFORMACIÓN DE ENTREGA
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Tienda</p>
                  <p className="text-sm text-muted-foreground">{store.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {store.address}, {store.locality}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Fecha de Compra</p>
                  <p className="text-sm text-muted-foreground">{formatGiftDate(created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Estado del Pago</span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                payment_status === 'completed'
                  ? 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/30 dark:text-lime-400'
                  : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400'
              )}
            >
              {payment_status === 'completed' ? '✓ Completado' : 'Pendiente'}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 bg-muted/30">
          <Alert className="w-full">
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Se ha enviado un email de confirmación a tu correo con los detalles del pedido.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/gift/history">
                <Receipt className="mr-2 h-4 w-4" />
                Ver Historial
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-lime-600 hover:bg-lime-700 text-white">
              <Link href="/friends">
                <Home className="mr-2 h-4 w-4" />
                Volver a Amigos
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">¿Qué sigue?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-sm font-semibold text-violet-600 dark:text-violet-400 flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Notificación al Destinatario</p>
                <p className="text-sm text-muted-foreground">
                  {recipient.name} recibirá una notificación de que tiene un regalo esperando
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-sm font-semibold text-violet-600 dark:text-violet-400 flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Preparación del Producto</p>
                <p className="text-sm text-muted-foreground">
                  La tienda preparará el producto para entrega
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-sm font-semibold text-violet-600 dark:text-violet-400 flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Confirmación de Entrega</p>
                <p className="text-sm text-muted-foreground">
                  Recibirás una notificación cuando el producto sea entregado
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
