import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, Clock, Euro, Calendar, Barcode } from 'lucide-react'
import { requireAuth } from '@/shared/auth/server'
import { MainLayout } from '@/shared/common/components/layouts'
import { PageHeader } from '@/shared/common/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Badge } from '@/shared/common/components/ui/badge'
import { Button } from '@/shared/common/components/ui/button'
import { Separator } from '@/shared/common/components/ui/separator'
import { getReservationByIdAction } from '@/features/product-reservation/actions/createReservation'
import { formatCurrency, formatDate, formatRelativeTime } from '@/shared/common/lib/formatters'
import { getExpirationInfo } from '@/features/product-reservation/lib/product-utils'

export const metadata = {
  title: 'Detalle de Reserva',
  description: 'Información completa de tu reserva',
}

const statusLabels = {
  active: { label: 'Activa', variant: 'default' as const },
  expired: { label: 'Expirada', variant: 'destructive' as const },
  completed: { label: 'Completada', variant: 'outline' as const },
  cancelled: { label: 'Cancelada', variant: 'outline' as const },
}

/**
 * Reservation Detail Page
 *
 * Shows full details of a specific reservation
 */
export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireAuth()

  try {
    const reservation = await getReservationByIdAction(id)
    const product = reservation.products
    const store = reservation.stores
    const statusInfo = statusLabels[reservation.status as keyof typeof statusLabels]
    const expirationInfo = getExpirationInfo(reservation.expires_at)

    return (
      <MainLayout user={user}>
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/reservations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Mis Reservas
            </Link>
          </Button>

          <PageHeader
            title="Detalle de Reserva"
            description={`Reserva realizada ${formatRelativeTime(reservation.created_at)}`}
          />

          <div className="mt-8 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Estado de la Reserva</CardTitle>
                  <Badge variant={statusInfo.variant} className="text-base px-4 py-1">
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservation.status === 'active' && (
                  expirationInfo.isExpired ? (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className="font-semibold text-destructive">Esta reserva ha expirado</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Expiró {formatRelativeTime(reservation.expires_at)}
                      </p>
                    </div>
                  ) : expirationInfo.daysUntilExpiration <= 3 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                        ⚠️ Tu reserva expira pronto
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quedan {expirationInfo.daysUntilExpiration} día{expirationInfo.daysUntilExpiration !== 1 ? 's' : ''} para completar tu compra
                      </p>
                    </div>
                  ) : (
                    <div className="bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg p-4">
                      <p className="font-semibold text-lime-800 dark:text-lime-200">
                        ✓ Reserva activa
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tienes {expirationInfo.daysUntilExpiration} días para completar tu compra en tienda
                      </p>
                    </div>
                  )
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Creada:</span>
                  <span className="font-medium">{formatDate(reservation.created_at, 'dd MMMM yyyy HH:mm')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Expira:</span>
                  <span className={`font-medium ${expirationInfo.isExpired ? 'text-destructive' : ''}`}>
                    {formatDate(reservation.expires_at, 'dd MMMM yyyy HH:mm')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Producto Reservado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    {product.brand && (
                      <p className="text-muted-foreground">{product.brand}</p>
                    )}
                    {product.description && (
                      <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Talla</p>
                    <p className="font-medium">{product.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Color</p>
                    <p className="font-medium">{product.color}</p>
                  </div>
                  {product.category && (
                    <div>
                      <p className="text-muted-foreground">Categoría</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Barcode className="h-3 w-3" /> Código de barras
                    </p>
                    <p className="font-mono text-xs">{product.barcode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Details */}
            <Card>
              <CardHeader>
                <CardTitle>Tienda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{store.name}</p>
                    {store.address && (
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                    )}
                  </div>
                </div>

                {store.phone && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Teléfono: </span>
                    <a href={`tel:${store.phone}`} className="font-medium hover:underline">
                      {store.phone}
                    </a>
                  </div>
                )}

                {store.email && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email: </span>
                    <a href={`mailto:${store.email}`} className="font-medium hover:underline">
                      {store.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Precio del producto:</span>
                  <span className="font-semibold">{formatCurrency(product.price)}</span>
                </div>

                <div className="flex justify-between items-center text-lime-600">
                  <span>Pagado (reserva):</span>
                  <span className="font-semibold">-{formatCurrency(reservation.amount_paid)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Pendiente de pago:</span>
                  <span className="font-bold">
                    {formatCurrency(product.price - reservation.amount_paid)}
                  </span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">💡 Recuerda</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• El pago de reserva ({formatCurrency(reservation.amount_paid)}) ya está realizado</li>
                    <li>• Debes pagar {formatCurrency(product.price - reservation.amount_paid)} al recoger el producto en tienda</li>
                    <li>• La reserva expira el {formatDate(reservation.expires_at, 'dd/MM/yyyy')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  } catch (error) {
    notFound()
  }
}
