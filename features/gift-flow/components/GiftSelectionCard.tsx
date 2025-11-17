'use client'

/**
 * =====================================================
 * GIFT SELECTION CARD COMPONENT
 * =====================================================
 * Card component for selecting a product to gift from friend's wishlist
 * =====================================================
 */

import { useState } from 'react'
import { Gift, Lock, Unlock, Euro, MapPin, AlertCircle, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/shared/common/components/ui/card'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { cn } from '@/shared/common/lib/utils'
import { LockTimerBadge } from './LockTimerBadge'
import { canGiftItem, formatGiftAmount } from '../lib/gift-utils'
import type { GiftableWishlistItem } from '../types/gift.types'

interface GiftSelectionCardProps {
  item: GiftableWishlistItem
  currentUserId: string
  onSelectGift?: (itemId: string) => void
  onReleaseLock?: (itemId: string) => void
  onContinueCheckout?: (itemId: string) => void
  isLoading?: boolean
  className?: string
}

/**
 * Gift Selection Card component
 *
 * Displays a giftable product with lock status and selection actions
 *
 * @example
 * ```tsx
 * <GiftSelectionCard
 *   item={wishlistItem}
 *   currentUserId={user.id}
 *   onSelectGift={(id) => handleSelectGift(id)}
 *   onReleaseLock={(id) => handleReleaseLock(id)}
 * />
 * ```
 */
export function GiftSelectionCard({
  item,
  currentUserId,
  onSelectGift,
  onReleaseLock,
  onContinueCheckout,
  isLoading = false,
  className,
}: GiftSelectionCardProps) {
  const [imageError, setImageError] = useState(false)

  const { product, store, status, lockStatus, priority } = item

  // Check if current user can gift this item
  const canGift = canGiftItem(status, lockStatus.isLocked, lockStatus.canRelease)
  const isLockedByCurrentUser = lockStatus.canRelease
  const isLockedByOther = lockStatus.isLocked && !lockStatus.canRelease

  // Placeholder image
  const placeholderImage = `https://placehold.co/400x400/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`
  const productImage = imageError || !product.image_url ? placeholderImage : product.image_url

  // Status indicator
  const statusText =
    status === 'in_process'
      ? 'Siendo regalado'
      : status === 'gifted'
        ? 'Ya regalado'
        : status === 'expired'
          ? 'Expirado'
          : 'Disponible'

  const statusColor =
    status === 'available' && !lockStatus.isLocked
      ? 'lime'
      : status === 'in_process'
        ? 'amber'
        : status === 'gifted'
          ? 'violet'
          : 'gray'

  const statusColorClasses = {
    lime: 'bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/20 dark:text-lime-400',
    amber: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
    violet: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400',
    gray: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
  }

  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="outline"
            className={cn('font-medium', statusColorClasses[statusColor as keyof typeof statusColorClasses])}
          >
            {statusText}
          </Badge>
        </div>

        {/* Lock Badge */}
        {lockStatus.isLocked && (
          <div className="absolute top-2 right-2">
            {isLockedByCurrentUser ? (
              <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-400">
                <Unlock className="mr-1 h-3 w-3" />
                Tu reserva
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-400">
                <Lock className="mr-1 h-3 w-3" />
                Bloqueado
              </Badge>
            )}
          </div>
        )}

        {/* Priority Indicator */}
        {priority && priority >= 4 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="default" className="bg-rose-500 text-white">
              ⭐ Prioridad Alta
            </Badge>
          </div>
        )}

        {/* Timer Badge */}
        {lockStatus.isLocked && lockStatus.lockedUntil && (
          <div className="absolute bottom-2 right-2">
            <LockTimerBadge lockedUntil={lockStatus.lockedUntil} />
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name & Brand */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
        </div>

        {/* Product Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Talla: <span className="font-medium text-foreground">{product.size}</span>
          </span>
          <span>•</span>
          <span>
            Color: <span className="font-medium text-foreground">{product.color}</span>
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-2xl font-bold text-lime-600 dark:text-lime-400">
          <Euro className="h-5 w-5" />
          <span>{formatGiftAmount(product.price)}</span>
        </div>

        {/* Store Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">
            {store.name} - {store.locality}
          </span>
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-sm text-muted-foreground italic line-clamp-2 pt-2 border-t">
            "{item.notes}"
          </p>
        )}

        {/* Locked by Other User Alert */}
        {isLockedByOther && (
          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-400">
              Alguien está considerando regalar este producto. El bloqueo expira pronto.
            </AlertDescription>
          </Alert>
        )}

        {/* Locked by Current User Alert */}
        {isLockedByCurrentUser && (
          <Alert className="bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800">
            <Lock className="h-4 w-4 text-sky-600" />
            <AlertDescription className="text-sm text-sky-800 dark:text-sky-400">
              Has reservado este producto. Completa el pago antes de que expire el tiempo.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {/* Action Buttons */}
        {status === 'available' && !lockStatus.isLocked && (
          <Button
            onClick={() => onSelectGift?.(item.id)}
            disabled={isLoading}
            className="w-full bg-lime-600 hover:bg-lime-700 text-white"
            size="lg"
          >
            <Gift className="mr-2 h-5 w-5" />
            Seleccionar para Regalar
          </Button>
        )}

        {isLockedByCurrentUser && (
          <div className="w-full flex gap-2">
            <Button
              onClick={() => onContinueCheckout?.(item.id)}
              disabled={isLoading}
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continuar Pago
            </Button>
            <Button
              onClick={() => onReleaseLock?.(item.id)}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <Unlock className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}

        {isLockedByOther && (
          <Button disabled className="w-full" variant="secondary">
            <Lock className="mr-2 h-4 w-4" />
            Bloqueado por otro usuario
          </Button>
        )}

        {status === 'in_process' && (
          <Button disabled className="w-full" variant="secondary">
            <Clock className="mr-2 h-4 w-4" />
            En proceso de entrega
          </Button>
        )}

        {status === 'gifted' && (
          <Button disabled className="w-full" variant="secondary">
            <Gift className="mr-2 h-4 w-4" />
            Ya regalado
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
