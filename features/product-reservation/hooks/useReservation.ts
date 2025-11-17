'use client'

/**
 * =====================================================
 * USE RESERVATION HOOK
 * =====================================================
 * Hook for managing reservation creation
 * =====================================================
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createReservationAction } from '../actions/createReservation'
import { useToast } from '@/shared/common/hooks/useToast'
import type { CreateReservationRequest } from '../types/reservation.types'

interface UseReservationReturn {
  createReservation: (request: CreateReservationRequest) => Promise<string | null>
  isCreating: boolean
  error: string | null
}

/**
 * Hook for creating reservations
 *
 * @returns Reservation creation state and actions
 *
 * @example
 * ```tsx
 * function ReservationForm() {
 *   const { createReservation, isCreating } = useReservation()
 *
 *   const handleSubmit = async () => {
 *     const reservationId = await createReservation({
 *       userId: user.id,
 *       productId: product.id,
 *       storeId: store.id,
 *     })
 *
 *     if (reservationId) {
 *       router.push(`/reservations/${reservationId}`)
 *     }
 *   }
 *
 *   return <Button onClick={handleSubmit} disabled={isCreating}>Reservar</Button>
 * }
 * ```
 */
export function useReservation(): UseReservationReturn {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const router = useRouter()

  const createReservation = async (
    request: CreateReservationRequest
  ): Promise<string | null> => {
    setIsCreating(true)
    setError(null)

    try {
      const response = await createReservationAction(request)

      toast.success(
        'Reserva creada',
        'Tu producto ha sido reservado por 15 días'
      )

      return response.reservationId
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear la reserva'
      setError(errorMessage)
      toast.error('Error', errorMessage)
      return null
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createReservation,
    isCreating,
    error,
  }
}
