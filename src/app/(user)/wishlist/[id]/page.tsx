/**
 * =====================================================
 * WISHLIST DETAIL PAGE
 * =====================================================
 * Detail page for a single wishlist product
 * =====================================================
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Euro, AlertTriangle, Package, Clock, Trash2 } from 'lucide-react'
import { requireAuth } from '@/shared/auth/server'
import { getWishlistItemAction } from '@/features/wishlist/actions/getWishlist'
import { ProductStatusBadge } from '@/features/wishlist/components/ProductStatusBadge'
import { VisibilityToggle } from '@/features/wishlist/components/VisibilityToggle'
import { Button } from '@/shared/common/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Separator } from '@/shared/common/components/ui/separator'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Badge } from '@/shared/common/components/ui/badge'
import { isProductExpired, getExpirationInfo, formatDaysRemaining } from '@/features/wishlist/lib/wishlist-utils'
import { WishlistDetailClient } from './WishlistDetailClient'

interface WishlistDetailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * Wishlist Detail Page
 *
 * Server component that displays full details of a wishlist product
 */
export default async function WishlistDetailPage({ params }: WishlistDetailPageProps) {
  await requireAuth()

  const { id } = await params;

  // Fetch wishlist item
  let item
  try {
    const response = await getWishlistItemAction(id)
    item = response.item
  } catch (error) {
    console.error('[WishlistDetailPage] Error:', error)
    notFound()
  }

  if (!item) {
    notFound()
  }

  // Check expiration
  const isExpired = item.reservation ? isProductExpired(item.reservation.expires_at) : false
  const expirationInfo = item.reservation ? getExpirationInfo(item.reservation.expires_at) : null

  // Product details
  const { product, store, reservation, status, visibility, priority, notes } = item

  // Placeholder image
  const placeholderImage = `https://placehold.co/600x600/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`
  const productImage = product.image_url || placeholderImage

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/wishlist">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Wishlist
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image & Info */}
        <div className="space-y-4">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <ProductStatusBadge status={status} isExpired={isExpired} />
            </div>

            {/* Priority Badge */}
            {priority && priority >= 4 && (
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-rose-500 text-white">
                  Prioridad Alta
                </Badge>
              </div>
            )}
          </div>

          {/* Product Name & Brand */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.brand && (
              <p className="text-xl text-muted-foreground mt-1">{product.brand}</p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Talla</p>
              <p className="text-lg font-medium">{product.size}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="text-lg font-medium">{product.color}</p>
            </div>
            {product.category && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Categoría</p>
                <p className="text-lg font-medium">{product.category}</p>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-4xl font-bold text-pink-600 dark:text-pink-400">
            <Euro className="h-8 w-8" />
            <span>{product.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="space-y-6">
          {/* Expiration Warning */}
          {expirationInfo && expirationInfo.expirationWarning && !isExpired && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>¡Atención!</strong> {formatDaysRemaining(expirationInfo.daysRemaining)}
              </AlertDescription>
            </Alert>
          )}

          {/* Expired Alert */}
          {isExpired && (
            <Alert variant="destructive">
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Reserva expirada.</strong> Este producto ya no está disponible para regalar.
              </AlertDescription>
            </Alert>
          )}

          {/* Visibility Card */}
          <Card>
            <CardHeader>
              <CardTitle>Visibilidad</CardTitle>
              <CardDescription>
                Controla quién puede ver este producto en tu wishlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WishlistDetailClient
                wishlistId={item.id}
                initialVisibility={visibility}
              />
            </CardContent>
          </Card>

          {/* Store Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Tienda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{store.name}</p>
              {store.address && (
                <p className="text-sm text-muted-foreground">{store.address}</p>
              )}
              {store.phone && (
                <p className="text-sm text-muted-foreground">Tel: {store.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Reservation Info */}
          {reservation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información de Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Reservado el</p>
                  <p className="font-medium">
                    {new Date(reservation.reserved_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Expira el</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <p className="font-medium">
                      {new Date(reservation.expires_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Monto pagado</p>
                  <p className="font-medium">{reservation.amount_paid.toFixed(2)} €</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Estado de reserva</p>
                  <Badge variant={reservation.status === 'active' ? 'default' : 'secondary'}>
                    {reservation.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/qr">
                Ver mi QR
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/reservations">
                Ver mis reservas
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
