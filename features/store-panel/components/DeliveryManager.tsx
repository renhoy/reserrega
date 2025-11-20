'use client'

/**
 * =====================================================
 * STORE-PANEL - DeliveryManager Component
 * =====================================================
 * Gestión de entregas y cambios de estado
 * =====================================================
 */

import { useState } from 'react'
import { Package, CheckCircle, XCircle, Loader2, User, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/common/components/ui/dialog'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import { Label } from '@/shared/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/shared/common/components/ui/radio-group'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import type { StoreReservation, DeliveryStatus } from '../types/store.types'
import {
  formatDate,
  formatPrice,
  getDeliveryStatusColor,
  getDeliveryStatusLabel,
} from '../lib/store-utils'

interface DeliveryManagerProps {
  reservation: StoreReservation | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (reservationId: string, status: DeliveryStatus) => Promise<void>
  isUpdating?: boolean
}

export function DeliveryManager({
  reservation,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating = false,
}: DeliveryManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>('pending')
  const [error, setError] = useState<string | null>(null)

  // Reset state when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && reservation) {
      setSelectedStatus(reservation.deliveryStatus)
      setError(null)
    } else {
      onClose()
    }
  }

  const handleSubmit = async () => {
    if (!reservation) return

    try {
      setError(null)
      await onUpdateStatus(reservation.id, selectedStatus)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado')
    }
  }

  if (!reservation) return null

  const currentStatusColors = getDeliveryStatusColor(reservation.deliveryStatus)
  const hasChanges = selectedStatus !== reservation.deliveryStatus

  const statusOptions: { value: DeliveryStatus; label: string; description: string }[] = [
    {
      value: 'pending',
      label: 'Pendiente',
      description: 'El producto aún no está listo para entregar',
    },
    {
      value: 'ready',
      label: 'Listo para entregar',
      description: 'El producto está preparado y esperando al cliente',
    },
    {
      value: 'delivered',
      label: 'Entregado',
      description: 'El producto ha sido entregado al cliente',
    },
    {
      value: 'cancelled',
      label: 'Cancelado',
      description: 'La reserva ha sido cancelada',
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestionar Entrega
          </DialogTitle>
          <DialogDescription>
            Actualiza el estado de entrega de esta reserva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reservation Info */}
          <div className="rounded-lg border p-4 space-y-3">
            {/* User */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-sm">{reservation.user?.name}</p>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                {reservation.user?.email}
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-sm">{reservation.product?.name}</p>
              </div>
              <div className="flex items-center justify-between ml-6">
                <p className="text-xs text-muted-foreground font-mono">
                  {reservation.product?.barcode}
                </p>
                <p className="font-semibold text-sm">
                  {formatPrice(reservation.product?.price || 0)}
                </p>
              </div>
            </div>

            {/* Current Status */}
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">Estado actual:</p>
              <Badge
                variant="outline"
                className={`${currentStatusColors.bg} ${currentStatusColors.text} ${currentStatusColors.border}`}
              >
                {getDeliveryStatusLabel(reservation.deliveryStatus)}
              </Badge>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t text-xs">
              <div>
                <p className="text-muted-foreground mb-1">Creada</p>
                <p className="font-medium">{formatDate(reservation.created_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Expira</p>
                <p className="font-medium">{formatDate(reservation.expires_at)}</p>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Nuevo estado de entrega:</Label>
            <RadioGroup value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as DeliveryStatus)}>
              <div className="space-y-2">
                {statusOptions.map((option) => {
                  const optionColors = getDeliveryStatusColor(option.value)

                  return (
                    <div
                      key={option.value}
                      className={`flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedStatus === option.value
                          ? `${optionColors.bg} ${optionColors.border} border-2`
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedStatus(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.value}
                          className="font-medium cursor-pointer"
                        >
                          {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Warning for delivered status */}
          {selectedStatus === 'delivered' && reservation.deliveryStatus !== 'delivered' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Al marcar como entregado, se registrará la fecha y hora actual de entrega.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating || !hasChanges}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Actualizar Estado
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
