'use server'

/**
 * =====================================================
 * UPDATE PRODUCT STATUS ACTION
 * =====================================================
 * Server action to update wishlist product status
 * =====================================================
 */

import { revalidatePath } from 'next/cache'
import { createClient } from '@/shared/database/supabase/server'
import { requireAuth } from '@/shared/auth/server'
import type { WishlistStatus, UpdateStatusResponse } from '../types/wishlist.types'
import { isValidWishlistStatus } from '../lib/wishlist-utils'

/**
 * Update wishlist product status
 *
 * @param wishlistId - Wishlist item ID
 * @param newStatus - New status to set
 * @returns Updated wishlist item
 *
 * @example
 * ```ts
 * await updateProductStatusAction('uuid-123', 'gifted')
 * ```
 */
export async function updateProductStatusAction(
  wishlistId: string,
  newStatus: WishlistStatus
): Promise<UpdateStatusResponse> {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    // Validate status
    if (!isValidWishlistStatus(newStatus)) {
      throw new Error('Estado inválido')
    }

    // Check ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from('wishlists')
      .select('user_id, status')
      .eq('id', wishlistId)
      .single()

    if (fetchError || !existingItem) {
      throw new Error('Producto no encontrado')
    }

    if (existingItem.user_id !== user.id) {
      throw new Error('No tienes permiso para modificar este producto')
    }

    // Prevent changing from/to expired manually
    if (newStatus === 'expired' || existingItem.status === 'expired') {
      throw new Error('El estado "expirado" no puede ser modificado manualmente')
    }

    // Update status
    const { data, error } = await supabase
      .from('wishlists')
      .update({ status: newStatus })
      .eq('id', wishlistId)
      .select(`
        *,
        product:products(*),
        reservation:reservations(*),
        store:stores(*)
      `)
      .single()

    if (error) {
      console.error('[updateProductStatusAction] Database error:', error)
      throw new Error('Error al actualizar el estado')
    }

    // Revalidate paths
    revalidatePath('/wishlist')
    revalidatePath(`/wishlist/${wishlistId}`)

    return {
      wishlistItem: data,
      message: 'Estado actualizado correctamente',
    }
  } catch (error) {
    console.error('[updateProductStatusAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al actualizar el estado')
  }
}

/**
 * Bulk update status for multiple items
 *
 * @param wishlistIds - Array of wishlist item IDs
 * @param newStatus - New status to set
 * @returns Number of updated items
 *
 * @example
 * ```ts
 * await bulkUpdateStatusAction(['uuid-1', 'uuid-2'], 'available')
 * ```
 */
export async function bulkUpdateStatusAction(
  wishlistIds: string[],
  newStatus: WishlistStatus
) {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    // Validate status
    if (!isValidWishlistStatus(newStatus)) {
      throw new Error('Estado inválido')
    }

    if (newStatus === 'expired') {
      throw new Error('El estado "expirado" no puede ser establecido manualmente')
    }

    // Update all items (ownership check via RLS)
    const { data, error } = await supabase
      .from('wishlists')
      .update({ status: newStatus })
      .in('id', wishlistIds)
      .eq('user_id', user.id)
      .select('id')

    if (error) {
      console.error('[bulkUpdateStatusAction] Database error:', error)
      throw new Error('Error al actualizar los productos')
    }

    // Revalidate paths
    revalidatePath('/wishlist')

    return {
      updatedCount: data?.length || 0,
      message: `${data?.length || 0} producto(s) actualizado(s)`,
    }
  } catch (error) {
    console.error('[bulkUpdateStatusAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al actualizar los productos')
  }
}
