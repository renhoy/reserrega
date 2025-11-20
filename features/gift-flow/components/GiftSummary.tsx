'use client'

/**
 * =====================================================
 * GIFT SUMMARY COMPONENT
 * =====================================================
 * Summary card showing gift product details
 * =====================================================
 */

import { Package, MapPin, Store as StoreIcon, User, Euro, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Separator } from '@/shared/common/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import { Badge } from '@/shared/common/components/ui/badge'
import { cn } from '@/shared/common/lib/utils'
import { formatGiftAmount } from '../lib/gift-utils'
import type { GiftCheckoutSession } from '../types/gift.types'

interface GiftSummaryProps {
  session: GiftCheckoutSession
  className?: string
  showRecipient?: boolean
}

/**
 * Gift Summary component
 *
 * Displays a summary of the gift being purchased
 *
 * @example
 * ```tsx
 * <GiftSummary session={checkoutSession} showRecipient />
 * ```
 */
export function GiftSummary({
  session,
  className,
  showRecipient = true,
}: GiftSummaryProps) {
  const { product, recipient, store, amount } = session

  const recipientInitials = recipient.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">Resumen del Regalo</CardTitle>
        <CardDescription>Detalles del producto que vas a regalar</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recipient Info */}
        {showRecipient && (
          <>
            <div className="flex items-center gap-3 p-3 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
              <User className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Regalo para</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={recipient.avatar_url || undefined} alt={recipient.name} />
                    <AvatarFallback className="text-xs bg-violet-600 text-white">
                      {recipientInitials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{recipient.name}</p>
                </div>
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Product Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold line-clamp-2">{product.name}</p>
              {product.brand && (
                <p className="text-sm text-muted-foreground">{product.brand}</p>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                <span>Talla: <span className="font-medium text-foreground">{product.size}</span></span>
                <span>•</span>
                <span>Color: <span className="font-medium text-foreground">{product.color}</span></span>
              </div>
              {product.category && (
                <Badge variant="outline" className="mt-2">
                  {product.category}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Store Info */}
          <div className="flex items-start gap-3">
            <StoreIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{store.name}</p>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {store.address}, {store.postal_code} {store.locality}
                </p>
              </div>
              {store.phone && (
                <p className="text-sm text-muted-foreground mt-1">Tel: {store.phone}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              <span className="font-medium">Total a pagar</span>
            </div>
            <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {formatGiftAmount(amount)}
            </span>
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex items-start gap-2 p-3 bg-sky-50 dark:bg-sky-950/20 rounded-lg border border-sky-200 dark:border-sky-800">
          <AlertCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-sky-800 dark:text-sky-300">
            El producto será enviado directamente al destinatario. Recibirás una confirmación por email una vez completada la compra.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Compact Gift Summary for checkout pages
 */
export function GiftSummaryCompact({
  session,
  className,
}: {
  session: GiftCheckoutSession
  className?: string
}) {
  const { product, recipient, amount } = session

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-semibold line-clamp-1">{product.name}</p>
          <p className="text-sm text-muted-foreground">Para {recipient.name}</p>
        </div>
        <p className="text-lg font-bold text-pink-600 dark:text-pink-400 ml-4">
          {formatGiftAmount(amount)}
        </p>
      </div>
      <Separator />
    </div>
  )
}
