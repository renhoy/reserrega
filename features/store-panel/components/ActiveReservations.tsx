'use client'

/**
 * =====================================================
 * STORE-PANEL - ActiveReservations Component
 * =====================================================
 * Lista de reservas activas de la tienda
 * =====================================================
 */

import { Calendar, Package, User, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Badge } from '@/shared/common/components/ui/badge'
import { ScrollArea } from '@/shared/common/components/ui/scroll-area'
import { Button } from '@/shared/common/components/ui/button'
import type { StoreReservation } from '../types/store.types'
import {
  formatDate,
  formatPrice,
  getDeliveryStatusColor,
  getDeliveryStatusLabel,
  getExpirationWarning,
} from '../lib/store-utils'

interface ActiveReservationsProps {
  reservations: StoreReservation[]
  onReservationClick?: (reservation: StoreReservation) => void
  isLoading?: boolean
}

export function ActiveReservations({
  reservations,
  onReservationClick,
  isLoading = false,
}: ActiveReservationsProps) {
  const getExpirationBadge = (reservation: StoreReservation) => {
    const warning = getExpirationWarning(reservation.daysUntilExpiration)

    switch (warning) {
      case 'expired':
        return (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expirado
          </Badge>
        )
      case 'critical':
        return (
          <Badge variant="destructive" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {reservation.daysUntilExpiration}d
          </Badge>
        )
      case 'warning':
        return (
          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {reservation.daysUntilExpiration}d
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {reservation.daysUntilExpiration}d restantes
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Reservas Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Reservas Activas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No hay reservas activas</p>
            <p className="text-xs mt-1">
              Las nuevas reservas aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Reservas Activas
          </CardTitle>
          <Badge variant="secondary">{reservations.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {reservations.map((reservation) => {
              const statusColors = getDeliveryStatusColor(reservation.deliveryStatus)

              return (
                <Card
                  key={reservation.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    reservation.isExpired ? 'opacity-60' : ''
                  }`}
                  onClick={() => onReservationClick?.(reservation)}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <p className="font-medium text-sm truncate">
                            {reservation.user?.name || 'Usuario desconocido'}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {reservation.user?.email || 'Sin email'}
                        </p>
                      </div>

                      {getExpirationBadge(reservation)}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-sm">
                          {reservation.product?.name || 'Producto sin nombre'}
                        </p>
                      </div>
                      {reservation.product?.barcode && (
                        <p className="text-xs text-muted-foreground font-mono ml-6">
                          {reservation.product.barcode}
                        </p>
                      )}
                    </div>

                    {/* Status and Price */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Badge
                        variant="outline"
                        className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        {getDeliveryStatusLabel(reservation.deliveryStatus)}
                      </Badge>

                      <p className="font-semibold text-sm">
                        {formatPrice(reservation.product?.price || 0)}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t text-xs text-muted-foreground">
                      <div>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Creada
                        </p>
                        <p className="font-medium text-foreground">
                          {formatDate(reservation.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expira
                        </p>
                        <p className="font-medium text-foreground">
                          {formatDate(reservation.expires_at)}
                        </p>
                      </div>
                    </div>

                    {/* Delivered Info */}
                    {reservation.deliveryStatus === 'delivered' && reservation.deliveredAt && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          <span>Entregado el {formatDate(reservation.deliveredAt)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
