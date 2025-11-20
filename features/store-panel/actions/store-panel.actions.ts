'use server'

/**
 * =====================================================
 * STORE-PANEL MODULE - Server Actions
 * =====================================================
 * Actions para gestión de sesiones y reservas de tienda
 * =====================================================
 */

import { revalidatePath } from 'next/cache'
import { createServerActionClient } from '@/lib/supabase/helpers'
import type {
  StartSessionParams,
  StartSessionResponse,
  AddProductParams,
  AddProductResponse,
  RemoveProductParams,
  RemoveProductResponse,
  EndSessionResponse,
  GetReservationsParams,
  GetReservationsResponse,
  UpdateDeliveryParams,
  UpdateDeliveryResponse,
  DeliveryStatus,
  SessionProduct,
} from '../types/store.types'
import { generateSessionId, validateQRCode, validateBarcode } from '../lib/store-utils'

/**
 * Start a new store session for a user
 */
export async function startStoreSession(params: StartSessionParams): Promise<StartSessionResponse> {
  try {
    const supabase = await createServerActionClient()

    // Validate user
    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser.user) {
      return { success: false, error: 'No autenticado' }
    }

    // Validate QR code
    if (!validateQRCode(params.userQR)) {
      return { success: false, error: 'Código QR inválido' }
    }

    // Parse QR to get user ID
    let targetUserId: string
    try {
      const parsed = JSON.parse(params.userQR)
      targetUserId = parsed.userId || parsed.id || params.userQR
    } catch {
      targetUserId = params.userQR
    }

    // Verify target user exists
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', targetUserId)
      .single()

    if (userError || !targetUser) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    // Verify store exists and belongs to comercial's company
    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', authUser.user.id)
      .single()

    if (!currentUser || currentUser.role !== 'comercial') {
      return { success: false, error: 'No tienes permisos de comercial' }
    }

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', params.storeId)
      .eq('company_id', currentUser.company_id)
      .eq('status', 'active')
      .single()

    if (storeError || !store) {
      return { success: false, error: 'Tienda no encontrada o inactiva' }
    }

    // Create session (stored in memory/state, not in DB)
    const sessionId = generateSessionId()
    const session = {
      id: sessionId,
      storeId: params.storeId,
      userId: targetUserId,
      user: targetUser,
      comercialId: authUser.user.id,
      products: [],
      startedAt: new Date(),
      state: 'scanning' as const,
      totalProducts: 0,
      totalValue: 0,
    }

    return {
      success: true,
      session,
    }
  } catch (error) {
    console.error('Error starting store session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al iniciar sesión',
    }
  }
}

/**
 * Add product to current session
 */
export async function addProductToSession(params: AddProductParams): Promise<AddProductResponse> {
  try {
    const supabase = await createServerActionClient()

    // Validate barcode
    if (!validateBarcode(params.barcode)) {
      return { success: false, error: 'Código de barras inválido' }
    }

    // Find product by barcode in this store
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', params.barcode)
      .eq('store_id', params.storeId)
      .single()

    if (productError || !product) {
      return { success: false, error: 'Producto no encontrado en esta tienda' }
    }

    // Create session product
    const sessionProduct: SessionProduct = {
      barcode: product.barcode,
      name: product.name,
      price: parseFloat(product.price.toString()),
      scannedAt: new Date(),
      productId: product.id,
    }

    return {
      success: true,
      product: sessionProduct,
    }
  } catch (error) {
    console.error('Error adding product to session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al agregar producto',
    }
  }
}

/**
 * Remove product from current session
 */
export async function removeProductFromSession(params: RemoveProductParams): Promise<RemoveProductResponse> {
  try {
    // Simple validation
    if (!params.barcode) {
      return { success: false, error: 'Código de barras requerido' }
    }

    // This action is handled client-side in the session state
    // No database operations needed
    return {
      success: true,
      barcode: params.barcode,
    }
  } catch (error) {
    console.error('Error removing product from session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al quitar producto',
    }
  }
}

/**
 * End store session and create reservations
 */
export async function endStoreSession(
  sessionId: string,
  products: SessionProduct[],
  userId: string,
  storeId: number
): Promise<EndSessionResponse> {
  try {
    const supabase = await createServerActionClient()

    if (products.length === 0) {
      return { success: false, error: 'No hay productos para reservar' }
    }

    // Get current user
    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser.user) {
      return { success: false, error: 'No autenticado' }
    }

    // Create reservations for each product
    const reservationPromises = products.map(async (product) => {
      // Create reservation
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          user_id: userId,
          product_id: product.productId,
          store_id: storeId,
          amount_paid: 1.0, // €1 por reserva
          store_share: 0.5, // 50% para tienda
          platform_share: 0.5, // 50% para plataforma
          status: 'active',
          reserved_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días
        })
        .select()
        .single()

      if (reservationError) {
        console.error('Error creating reservation:', reservationError)
        throw new Error(`Error al crear reserva para ${product.name}`)
      }

      // Add to wishlist
      const { error: wishlistError } = await supabase
        .from('wishlists')
        .insert({
          user_id: userId,
          product_id: product.productId,
          reservation_id: reservation.id,
          visibility: 'friends', // Default visibility
          status: 'available',
          priority: 3,
        })

      if (wishlistError) {
        console.error('Error adding to wishlist:', wishlistError)
        // Continue even if wishlist fails
      }

      return reservation
    })

    const reservations = await Promise.all(reservationPromises)

    revalidatePath('/store')
    revalidatePath('/wishlist')

    return {
      success: true,
      reservationIds: reservations.map((r) => r.id),
      totalReserved: reservations.length,
    }
  } catch (error) {
    console.error('Error ending store session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al finalizar sesión',
    }
  }
}

/**
 * Get store reservations with filters
 */
export async function getStoreReservations(params: GetReservationsParams): Promise<GetReservationsResponse> {
  try {
    const supabase = await createServerActionClient()

    // Verify user has access to this store
    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser.user) {
      return { success: false, error: 'No autenticado' }
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', authUser.user.id)
      .single()

    if (!currentUser || currentUser.role !== 'comercial') {
      return { success: false, error: 'No tienes permisos de comercial' }
    }

    // Verify store belongs to user's company
    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('id', params.storeId)
      .eq('company_id', currentUser.company_id)
      .single()

    if (!store) {
      return { success: false, error: 'Tienda no encontrada' }
    }

    // Build query
    let query = supabase
      .from('reservations')
      .select(`
        *,
        product:products(*),
        user:users(id, name, email)
      `)
      .eq('store_id', params.storeId)

    // Apply status filter (if provided)
    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status)
    }

    // Execute query
    const { data: reservations, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reservations:', error)
      return { success: false, error: 'Error al obtener reservas' }
    }

    // Transform to StoreReservation format with delivery status
    const storeReservations = reservations.map((r) => {
      const now = new Date()
      const expiresAt = new Date(r.expires_at)
      const daysUntilExpiration = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const isExpired = r.status === 'expired' || daysUntilExpiration < 0

      // Map reservation status to delivery status
      let deliveryStatus: DeliveryStatus = 'pending'
      if (r.status === 'completed') {
        deliveryStatus = 'delivered'
      } else if (r.status === 'cancelled') {
        deliveryStatus = 'cancelled'
      } else if (r.status === 'active' && !isExpired) {
        deliveryStatus = 'pending'
      }

      return {
        ...r,
        deliveryStatus,
        deliveredAt: r.status === 'completed' ? r.updated_at : null,
        isExpired,
        daysUntilExpiration,
      }
    })

    return {
      success: true,
      reservations: storeReservations,
      total: storeReservations.length,
    }
  } catch (error) {
    console.error('Error getting store reservations:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener reservas',
    }
  }
}

/**
 * Update delivery status of a reservation
 */
export async function updateDeliveryStatus(params: UpdateDeliveryParams): Promise<UpdateDeliveryResponse> {
  try {
    const supabase = await createServerActionClient()

    // Verify user
    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser.user) {
      return { success: false, error: 'No autenticado' }
    }

    // Map delivery status to reservation status
    let reservationStatus: string
    let updateData: any = {}

    switch (params.status) {
      case 'delivered':
        reservationStatus = 'completed'
        updateData.status = reservationStatus
        // Note: We can't add delivered_at to reservations table without schema change
        // This would require a migration
        break
      case 'cancelled':
        reservationStatus = 'cancelled'
        updateData.status = reservationStatus
        break
      case 'pending':
      case 'ready':
        reservationStatus = 'active'
        updateData.status = reservationStatus
        break
      default:
        return { success: false, error: 'Estado de entrega inválido' }
    }

    // Update reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', params.reservationId)
      .select()
      .single()

    if (error) {
      console.error('Error updating reservation:', error)
      return { success: false, error: 'Error al actualizar estado de entrega' }
    }

    // If delivered, also update wishlist status
    if (params.status === 'delivered') {
      await supabase
        .from('wishlists')
        .update({ status: 'gifted' })
        .eq('reservation_id', params.reservationId)
    }

    revalidatePath('/store')
    revalidatePath('/wishlist')

    return {
      success: true,
      reservation,
    }
  } catch (error) {
    console.error('Error updating delivery status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar estado',
    }
  }
}
