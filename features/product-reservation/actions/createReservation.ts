'use server'

/**
 * =====================================================
 * CREATE RESERVATION SERVER ACTION
 * =====================================================
 * Server action for creating product reservations
 * =====================================================
 */

import { requireAuth } from '@/shared/auth/server'
import { createClient } from '@/shared/database/server'
import { calculateExpiration, calculatePaymentSplit } from '../lib/product-utils'
import { simulatePaymentAction } from './simulatePayment'
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '../types/reservation.types'

/**
 * Create reservation with payment
 *
 * @param request - Reservation data
 * @returns Created reservation details
 *
 * @example
 * ```tsx
 * const result = await createReservationAction({
 *   userId: 'user-123',
 *   productId: 'prod-456',
 *   storeId: 1,
 *   amountPaid: 1.00
 * })
 * ```
 */
export async function createReservationAction(
  request: CreateReservationRequest
): Promise<CreateReservationResponse> {
  // Require authentication
  const user = await requireAuth()

  // Verify user is creating reservation for themselves
  if (user.id !== request.userId) {
    throw new Error('No puedes crear reservas para otros usuarios')
  }

  const amountPaid = request.amountPaid || 1.00

  // Simulate payment
  const paymentResult = await simulatePaymentAction(amountPaid)

  if (!paymentResult.success) {
    throw new Error('Error al procesar el pago')
  }

  // Calculate payment split
  const { storeShare, platformShare } = calculatePaymentSplit(amountPaid)

  // Calculate expiration (15 days from now)
  const expiresAt = calculateExpiration()

  const supabase = await createClient()

  // Create reservation
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      user_id: request.userId,
      product_id: request.productId,
      store_id: request.storeId,
      amount_paid: amountPaid,
      store_share: storeShare,
      platform_share: platformShare,
      status: 'active',
      reserved_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('[createReservationAction] Error creating reservation:', error)
    throw new Error('Error al crear la reserva')
  }

  return {
    reservationId: reservation.id,
    reservation: {
      id: reservation.id,
      userId: reservation.user_id,
      productId: reservation.product_id,
      storeId: reservation.store_id,
      amountPaid: parseFloat(reservation.amount_paid),
      storeShare: parseFloat(reservation.store_share),
      platformShare: parseFloat(reservation.platform_share),
      status: reservation.status as any,
      reservedAt: reservation.reserved_at,
      expiresAt: reservation.expires_at,
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at,
    },
    paymentSimulated: true,
  }
}

/**
 * Get user reservations
 *
 * @param userId - User ID
 * @param status - Filter by status (optional)
 * @returns List of reservations
 */
export async function getUserReservationsAction(
  userId?: string,
  status?: 'active' | 'expired' | 'completed' | 'cancelled'
) {
  const user = await requireAuth()

  const targetUserId = userId || user.id

  // Only allow users to see their own reservations (unless admin/superadmin)
  if (targetUserId !== user.id && !['admin', 'superadmin'].includes(user.role)) {
    throw new Error('No tienes permisos para ver estas reservas')
  }

  const supabase = await createClient()

  let query = supabase
    .from('reservations')
    .select(`
      *,
      products (
        id,
        barcode,
        name,
        brand,
        size,
        color,
        price,
        image_url,
        category
      ),
      stores (
        id,
        name,
        address,
        phone
      )
    `)
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: reservations, error } = await query

  if (error) {
    console.error('[getUserReservationsAction] Error fetching reservations:', error)
    throw new Error('Error al obtener las reservas')
  }

  return reservations
}

/**
 * Get reservation by ID
 *
 * @param reservationId - Reservation ID
 * @returns Reservation with details
 */
export async function getReservationByIdAction(reservationId: string) {
  const user = await requireAuth()

  const supabase = await createClient()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select(`
      *,
      products (
        id,
        barcode,
        name,
        brand,
        size,
        color,
        price,
        image_url,
        category,
        description
      ),
      stores (
        id,
        name,
        address,
        phone,
        email
      )
    `)
    .eq('id', reservationId)
    .single()

  if (error) {
    console.error('[getReservationByIdAction] Error fetching reservation:', error)
    throw new Error('Reserva no encontrada')
  }

  // Verify user owns this reservation (unless admin/superadmin)
  if (reservation.user_id !== user.id && !['admin', 'superadmin'].includes(user.role)) {
    throw new Error('No tienes permisos para ver esta reserva')
  }

  return reservation
}
