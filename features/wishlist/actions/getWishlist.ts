'use server'

/**
 * =====================================================
 * GET WISHLIST ACTION
 * =====================================================
 * Server action to fetch user's wishlist items
 * =====================================================
 */

import { createClient } from '@/shared/database/supabase/server'
import { requireAuth } from '@/shared/auth/helpers/server'
import type { GetWishlistResponse, WishlistFilters } from '../types/wishlist.types'

/**
 * Get user's wishlist with optional filters
 *
 * @param filters - Optional filters for wishlist query
 * @returns Wishlist items with full details
 *
 * @example
 * ```ts
 * const wishlist = await getWishlistAction()
 * const available = await getWishlistAction({ status: 'available' })
 * ```
 */
export async function getWishlistAction(
  filters?: WishlistFilters
): Promise<GetWishlistResponse> {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    // Build query
    let query = supabase
      .from('wishlists')
      .select(`
        *,
        product:products(*),
        reservation:reservations(*),
        store:stores(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply status filter
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status)
      } else {
        query = query.eq('status', filters.status)
      }
    }

    // Apply visibility filter
    if (filters?.visibility) {
      if (Array.isArray(filters.visibility)) {
        query = query.in('visibility', filters.visibility)
      } else {
        query = query.eq('visibility', filters.visibility)
      }
    }

    // Apply priority filter
    if (filters?.minPriority !== undefined) {
      query = query.gte('priority', filters.minPriority)
    }
    if (filters?.maxPriority !== undefined) {
      query = query.lte('priority', filters.maxPriority)
    }

    const { data, error } = await query

    if (error) {
      console.error('[getWishlistAction] Database error:', error)
      throw new Error('Error al obtener la wishlist')
    }

    // Filter out expired items if specified
    let items = data || []
    if (filters?.includeExpired === false) {
      items = items.filter((item) => {
        if (!item.reservation) return true
        const expiresAt = new Date(item.reservation.expires_at)
        return expiresAt > new Date()
      })
    }

    return {
      items,
      totalCount: items.length,
    }
  } catch (error) {
    console.error('[getWishlistAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al obtener la wishlist')
  }
}

/**
 * Get single wishlist item by ID
 *
 * @param wishlistId - Wishlist item ID
 * @returns Wishlist item with full details
 *
 * @example
 * ```ts
 * const item = await getWishlistItemAction('uuid-123')
 * ```
 */
export async function getWishlistItemAction(wishlistId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        product:products(*),
        reservation:reservations(*),
        store:stores(*)
      `)
      .eq('id', wishlistId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('[getWishlistItemAction] Database error:', error)
      throw new Error('Producto no encontrado')
    }

    if (!data) {
      throw new Error('Producto no encontrado')
    }

    return { item: data }
  } catch (error) {
    console.error('[getWishlistItemAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al obtener el producto')
  }
}

/**
 * Get public wishlist for a user (filtered by visibility)
 *
 * @param userId - Target user ID
 * @param requestingUserId - Requesting user ID (for friend check)
 * @returns Public/friend-visible wishlist items
 *
 * @example
 * ```ts
 * const publicWishlist = await getPublicWishlistAction('user-uuid', 'my-uuid')
 * ```
 */
export async function getPublicWishlistAction(
  userId: string,
  requestingUserId?: string
) {
  const supabase = await createClient()

  try {
    // Check if users are friends (if requesting user provided)
    let areFriends = false
    if (requestingUserId && requestingUserId !== userId) {
      const { data: friendData } = await supabase
        .from('friend_requests')
        .select('id')
        .or(`requester_id.eq.${requestingUserId},receiver_id.eq.${requestingUserId}`)
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted')
        .limit(1)
        .single()

      areFriends = !!friendData
    }

    // Build visibility filter
    let visibilityFilter = ['public']
    if (areFriends) {
      visibilityFilter.push('friends')
    }

    // Get wishlist items
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        status,
        priority,
        notes,
        created_at,
        product:products(
          name,
          brand,
          size,
          color,
          price,
          image_url
        ),
        store:stores(
          name,
          address
        ),
        reservation:reservations(
          expires_at
        )
      `)
      .eq('user_id', userId)
      .in('visibility', visibilityFilter)
      .neq('status', 'gifted') // Don't show gifted items
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[getPublicWishlistAction] Database error:', error)
      throw new Error('Error al obtener la wishlist')
    }

    return {
      items: data || [],
      totalCount: data?.length || 0,
      areFriends,
    }
  } catch (error) {
    console.error('[getPublicWishlistAction] Error:', error)
    throw error instanceof Error ? error : new Error('Error al obtener la wishlist')
  }
}
