import Link from 'next/link'
import { Clock, Package, MapPin } from 'lucide-react'
import { requireAuth } from '@/shared/auth/server'
import { MainLayout } from '@/shared/common/components/layouts'
import { PageHeader, EmptyState } from '@/shared/common/components/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Badge } from '@/shared/common/components/ui/badge'
import { Button } from '@/shared/common/components/ui/button'
import { getUserReservationsAction } from '@/features/product-reservation/actions/createReservation'
import { formatCurrency, formatDate, formatRelativeTime } from '@/shared/common/lib/formatters'
import { getExpirationInfo, formatProductName } from '@/features/product-reservation/lib/product-utils'

export const metadata = {
  title: 'Mis Reservas',
  description: 'Gestiona tus productos reservados',
}

const statusLabels = {
  active: { label: 'Activa', variant: 'default' as const },
  expired: { label: 'Expirada', variant: 'destructive' as const },
  completed: { label: 'Completada', variant: 'outline' as const },
  cancelled: { label: 'Cancelada', variant: 'outline' as const },
}

/**
 * Reservations Page
 *
 * Shows user's product reservations
 */
export default async function ReservationsPage() {
  const user = await requireAuth()

  const reservations = await getUserReservationsAction(user.id)

  return (
    <MainLayout user={user}>
      <PageHeader
        title="Mis Reservas"
        description={`${reservations.length} reserva${reservations.length !== 1 ? 's' : ''}`}
        actions={
          <Button asChild>
            <Link href="/qr">Hacer nueva reserva</Link>
          </Button>
        }
      />

      <div className="mt-8">
        {reservations.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No tienes reservas"
            description="Empieza reservando productos en tienda usando tu código QR"
            action={{
              label: "Ver mi código QR",
              onClick: () => window.location.href = '/qr',
            }}
          />
        ) : (
          <div className="grid gap-4">
            {reservations.map((reservation: any) => {
              const product = reservation.products
              const store = reservation.stores
              const statusInfo = statusLabels[reservation.status as keyof typeof statusLabels]
              const expirationInfo = getExpirationInfo(reservation.expires_at)

              return (
                <Link key={reservation.id} href={`/reservations/${reservation.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {formatProductName(product)}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {store.name}
                          </CardDescription>
                        </div>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{store.address || 'Sin dirección'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {expirationInfo.isExpired ? (
                          <span className="text-destructive">
                            Expiró {formatRelativeTime(reservation.expires_at)}
                          </span>
                        ) : (
                          <span>
                            Expira en {expirationInfo.daysUntilExpiration} día{expirationInfo.daysUntilExpiration !== 1 ? 's' : ''} ({formatDate(reservation.expires_at, 'dd MMM yyyy')})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Precio total</p>
                          <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Pagado</p>
                          <p className="text-sm font-semibold text-pink-600">
                            {formatCurrency(reservation.amount_paid)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
