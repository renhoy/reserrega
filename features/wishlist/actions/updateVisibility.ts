'use server'

/**
 * =====================================================
 * UPDATE VISIBILITY ACTION
 * =====================================================
 * Server action to update wishlist product visibility
 * =====================================================
 */

import { revalidatePath } from 'next/cache'
import { createServerActionClient as createClient } from '@/lib/supabase/helpers'
import { requireAuth } from '@/shared/auth/server'
import type { WishlistVisibility, UpdateVisibilityResponse } from '../types/wishlist.types'
import { isValidVisibility } from '../lib/wishlist-utils'

/**
 * Update wishlist product visibility
 *
 * @param wishlistId - Wishlist item ID
 * @param newVisibility - New visibility setting
 * @returns Updated wishlist item
 *
 * @example
 * ```ts
 * await updateVisibilityAction('uuid-123', 'friends')
 * ```
 */
export async function updateVisibilityAction(
  wishlistId: string,
  newVisibility: WishlistVisibility
): Promise<UpdateVisibilityResponse> {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    // Validate visibility
    if (!isValidVisibility(newVisibility)) {
      throw new Error('Visibilidad inválida')
    }

    // Check ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from('wishlists')
      .select('user_id')
      .eq('id', wishlistId)
      .single()

    if (fetchError || !existingItem) {
      throw new Error('Producto no encontrado')
    }

    if (existingItem.user_id !== user.id) {
      throw new Error('No tienes permiso para modificar este producto')
    }

    // Update visibility
    const { data, error } = await supabase
      .from('wishlists')
      .update({ visibility: newVisibility })
      .eq('id', wishlistId)
      .select(`
        *,
        product:products(*),
        reservation:reservations(*),
        store:stores(*)
      `)
      .single()

    if (error) {
      console.error('[updateVisibilityAction] Database error:', error)
      throw new Error('Error al actualizar la visibilidad')
    }

    // Revalidate paths
    revalidatePath('/wishlist')
    revalidatePath(`/wishlist/${wishlistId}`)

    return {
      wishlistItem: data,
      message: 'Visibilidad actualizada correctamente',
    }
  } catch (error) {
    console.error('[updateVisibilityAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al actualizar la visibilidad')
  }
}

/**
 * Bulk update visibility for multiple items
 *
 * @param wishlistIds - Array of wishlist item IDs
 * @param newVisibility - New visibility setting
 * @returns Number of updated items
 *
 * @example
 * ```ts
 * await bulkUpdateVisibilityAction(['uuid-1', 'uuid-2'], 'public')
 * ```
 */
export async function bulkUpdateVisibilityAction(
  wishlistIds: string[],
  newVisibility: WishlistVisibility
) {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    // Validate visibility
    if (!isValidVisibility(newVisibility)) {
      throw new Error('Visibilidad inválida')
    }

    // Update all items (ownership check via RLS)
    const { data, error } = await supabase
      .from('wishlists')
      .update({ visibility: newVisibility })
      .in('id', wishlistIds)
      .eq('user_id', user.id)
      .select('id')

    if (error) {
      console.error('[bulkUpdateVisibilityAction] Database error:', error)
      throw new Error('Error al actualizar los productos')
    }

    // Revalidate paths
    revalidatePath('/wishlist')

    return {
      updatedCount: data?.length || 0,
      message: `${data?.length || 0} producto(s) actualizado(s)`,
    }
  } catch (error) {
    console.error('[bulkUpdateVisibilityAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al actualizar los productos')
  }
}

/**
 * Remove product from wishlist
 *
 * @param wishlistId - Wishlist item ID
 * @returns Success status
 *
 * @example
 * ```ts
 * await removeFromWishlistAction('uuid-123')
 * ```
 */
export async function removeFromWishlistAction(wishlistId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    // Check ownership before deleting
    const { data: existingItem, error: fetchError } = await supabase
      .from('wishlists')
      .select('user_id')
      .eq('id', wishlistId)
      .single()

    if (fetchError || !existingItem) {
      throw new Error('Producto no encontrado')
    }

    if (existingItem.user_id !== user.id) {
      throw new Error('No tienes permiso para eliminar este producto')
    }

    // Delete item
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', wishlistId)

    if (error) {
      console.error('[removeFromWishlistAction] Database error:', error)
      throw new Error('Error al eliminar el producto')
    }

    // Revalidate paths
    revalidatePath('/wishlist')

    return {
      success: true,
      message: 'Producto eliminado de la wishlist',
    }
  } catch (error) {
    console.error('[removeFromWishlistAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al eliminar el producto')
  }
}
