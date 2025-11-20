'use client'

/**
 * =====================================================
 * WISHLIST ITEM COMPONENT
 * =====================================================
 * Card component to display a wishlist product
 * =====================================================
 */

import { useState } from 'react'
import Link from 'next/link'
import { MoreVertical, Eye, Edit, Trash2, AlertTriangle, MapPin, Calendar, Euro } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/shared/common/components/ui/card'
import { Button } from '@/shared/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/common/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Badge } from '@/shared/common/components/ui/badge'
import { cn } from '@/shared/common/lib/utils'
import { ProductStatusBadge } from './ProductStatusBadge'
import type { WishlistItemWithDetails } from '../types/wishlist.types'
import { isProductExpired, formatDaysRemaining, getExpirationInfo, formatVisibility } from '../lib/wishlist-utils'

interface WishlistItemProps {
  item: WishlistItemWithDetails
  onStatusChange?: (itemId: string, newStatus: string) => void
  onVisibilityChange?: (itemId: string, newVisibility: string) => void
  onDelete?: (itemId: string) => void
  showActions?: boolean
  className?: string
}

/**
 * Wishlist Item component
 *
 * Displays a product card with details, status, and actions
 *
 * @example
 * ```tsx
 * <WishlistItem
 *   item={wishlistItem}
 *   onStatusChange={(id, status) => updateStatus(id, status)}
 *   showActions
 * />
 * ```
 */
export function WishlistItem({
  item,
  onStatusChange,
  onVisibilityChange,
  onDelete,
  showActions = true,
  className,
}: WishlistItemProps) {
  const [imageError, setImageError] = useState(false)

  // Check expiration
  const isExpired = item.reservation ? isProductExpired(item.reservation.expires_at) : false
  const expirationInfo = item.reservation ? getExpirationInfo(item.reservation.expires_at) : null

  // Product details
  const { product, store, status, visibility, priority } = item

  // Placeholder image
  const placeholderImage = `https://placehold.co/400x400/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`
  const productImage = imageError || !product.image_url ? placeholderImage : product.image_url

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
          <ProductStatusBadge status={status} isExpired={isExpired} />
        </div>

        {/* Visibility Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 dark:bg-black/90">
            {formatVisibility(visibility)}
          </Badge>
        </div>

        {/* Priority Indicator */}
        {priority && priority >= 4 && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="default" className="bg-rose-500 text-white">
              Prioridad Alta
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name & Brand */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          )}
        </div>

        {/* Product Details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Talla: <span className="font-medium text-foreground">{product.size}</span></span>
          <span>•</span>
          <span>Color: <span className="font-medium text-foreground">{product.color}</span></span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-2xl font-bold text-pink-600 dark:text-pink-400">
          <Euro className="h-5 w-5" />
          <span>{product.price.toFixed(2)}</span>
        </div>

        {/* Store Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{store.name}</span>
        </div>

        {/* Expiration Warning */}
        {expirationInfo && expirationInfo.expirationWarning && !isExpired && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {formatDaysRemaining(expirationInfo.daysRemaining)}
            </AlertDescription>
          </Alert>
        )}

        {/* Expired Alert */}
        {isExpired && (
          <Alert variant="destructive">
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              Reserva expirada. Este producto ya no está disponible para regalar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        {/* View Details Button */}
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/wishlist/${item.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </Link>
        </Button>

        {/* Actions Menu */}
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/wishlist/${item.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>

              {onStatusChange && !isExpired && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusChange(item.id, 'available')}>
                    Marcar disponible
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(item.id, 'in_process')}>
                    Marcar en proceso
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(item.id, 'gifted')}>
                    Marcar como regalado
                  </DropdownMenuItem>
                </>
              )}

              {onVisibilityChange && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onVisibilityChange(item.id, 'private')}>
                    Cambiar a Privado
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onVisibilityChange(item.id, 'friends')}>
                    Cambiar a Solo Amigos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onVisibilityChange(item.id, 'public')}>
                    Cambiar a Público
                  </DropdownMenuItem>
                </>
              )}

              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(item.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  )
}
