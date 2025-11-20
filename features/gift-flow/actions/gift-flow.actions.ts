/**
 * =====================================================
 * GIFT-FLOW MODULE - Server Actions
 * =====================================================
 * Server-side actions for gift operations
 * =====================================================
 */

'use server'

import { getUser } from '@/shared/auth/server'
import { createServerActionClient as createClient } from '@/lib/supabase/helpers'
import { calculateLockExpiration, createLockStatus, generateOrderNumber } from '../lib/gift-utils'
import type {
  ViewFriendWishlistResponse,
  LockGiftItemResponse,
  ProcessGiftPaymentResponse,
  ConfirmDeliveryResponse,
  GetGiftHistoryResponse,
  ReleaseExpiredLocksResponse,
  GiftableWishlistItem,
  FriendWishlist,
  GiftSummary,
  ReceivedGift,
  GiftPaymentFormData,
} from '../types/gift.types'

// =====================================================
// VIEW FRIEND WISHLIST
// =====================================================

/**
 * Get friend's wishlist with giftable items
 *
 * Verifies friendship before returning items
 *
 * @param friendId - Friend's user ID
 * @returns Friend's wishlist with giftable items
 */
export async function viewFriendWishlist(
  friendId: string
): Promise<ViewFriendWishlistResponse> {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    if (friendId === user.id) {
      return { success: false, error: 'No puedes ver tu propia wishlist aquí' }
    }

    const supabase = await createClient()

    // 1. Verify friendship exists (bidirectional check)
    const { data: friendship, error: friendshipError } = await supabase
      .from('friendships')
      .select('id')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`
      )
      .single()

    if (friendshipError || !friendship) {
      return { success: false, error: 'No sois amigos' }
    }

    // 2. Get friend info
    const { data: friendData, error: friendError } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('id', friendId)
      .single()

    if (friendError || !friendData) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    // 3. Get friend's wishlist items with products and stores
    // Only items with visibility 'friends' or 'public' and status 'available' or 'in_process'
    const { data: wishlistItems, error: wishlistError } = await supabase
      .from('wishlists')
      .select(
        `
        id,
        product_id,
        status,
        visibility,
        priority,
        notes,
        created_at,
        product:products(id, name, brand, size, color, price, image_url, category, store_id),
        reservation:reservations(expires_at)
      `
      )
      .eq('user_id', friendId)
      .in('visibility', ['friends', 'public'])
      .in('status', ['available', 'in_process'])
      .order('created_at', { ascending: false })

    if (wishlistError) {
      console.error('Error fetching wishlist:', wishlistError)
      return { success: false, error: 'Error al cargar wishlist' }
    }

    if (!wishlistItems || wishlistItems.length === 0) {
      // Return empty wishlist (not an error)
      const emptyWishlist: FriendWishlist = {
        owner: {
          id: friendData.id,
          name: friendData.name,
          avatar_url: friendData.avatar_url,
        },
        items: [],
        totalCount: 0,
      }
      return { success: true, data: emptyWishlist }
    }

    // 4. Get store info for each product
    const storeIds = [...new Set(wishlistItems.map((item: any) => item.product.store_id))]
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name, address, locality')
      .in('id', storeIds)

    if (storesError) {
      console.error('Error fetching stores:', storesError)
      return { success: false, error: 'Error al cargar tiendas' }
    }

    const storeMap = new Map(stores?.map((s) => [s.id, s]) || [])

    // 5. Get active gift locks for these items
    const wishlistItemIds = wishlistItems.map((item: any) => item.id)
    const { data: activeLocks } = await supabase
      .from('gifts')
      .select('wishlist_item_id, buyer_id, locked_until')
      .in('wishlist_item_id', wishlistItemIds)
      .not('locked_until', 'is', null)
      .gte('locked_until', new Date().toISOString())

    const lockMap = new Map(
      activeLocks?.map((lock) => [lock.wishlist_item_id, lock]) || []
    )

    // 6. Transform to GiftableWishlistItem format
    const giftableItems: GiftableWishlistItem[] = wishlistItems.map((item: any) => {
      const store = storeMap.get(item.product.store_id)
      const activeLock = lockMap.get(item.id)

      return {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          size: item.product.size,
          color: item.product.color,
          price: item.product.price,
          image_url: item.product.image_url,
          category: item.product.category,
        },
        store: {
          id: store?.id || 0,
          name: store?.name || 'Tienda desconocida',
          address: store?.address || '',
          locality: store?.locality || '',
        },
        status: item.status,
        priority: item.priority,
        notes: item.notes,
        lockStatus: createLockStatus(
          activeLock?.locked_until || null,
          activeLock?.buyer_id || null,
          user.id
        ),
      }
    })

    const wishlist: FriendWishlist = {
      owner: {
        id: friendData.id,
        name: friendData.name,
        avatar_url: friendData.avatar_url,
      },
      items: giftableItems,
      totalCount: giftableItems.length,
    }

    return { success: true, data: wishlist }
  } catch (error) {
    console.error('Error in viewFriendWishlist:', error)
    return { success: false, error: 'Error al cargar wishlist del amigo' }
  }
}

// =====================================================
// LOCK GIFT ITEM
// =====================================================

/**
 * Lock a gift item temporarily (15 minutes)
 *
 * Prevents other users from selecting the same item
 *
 * @param wishlistItemId - Wishlist item to lock
 * @returns Lock expiration and checkout session
 */
export async function lockGiftItem(wishlistItemId: string): Promise<LockGiftItemResponse> {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const supabase = await createClient()

    // 1. Get wishlist item with product and store
    const { data: wishlistItem, error: wishlistError } = await supabase
      .from('wishlists')
      .select(
        `
        id,
        user_id,
        product_id,
        status,
        product:products(id, name, brand, size, color, price, image_url, category, store_id),
        reservation:reservations(expires_at)
      `
      )
      .eq('id', wishlistItemId)
      .single()

    if (wishlistError || !wishlistItem) {
      return { success: false, error: 'Producto no encontrado' }
    }

    // 2. Verify item is available
    if (wishlistItem.status !== 'available') {
      return { success: false, error: 'Este producto ya no está disponible' }
    }

    // 3. Verify user is friends with owner
    const { data: friendship } = await supabase
      .from('friendships')
      .select('id')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${wishlistItem.user_id}),and(user_id.eq.${wishlistItem.user_id},friend_id.eq.${user.id})`
      )
      .single()

    if (!friendship) {
      return { success: false, error: 'No tienes permiso para regalar este producto' }
    }

    // 4. Check for existing locks
    const now = new Date().toISOString()
    const { data: existingLocks } = await supabase
      .from('gifts')
      .select('buyer_id, locked_until')
      .eq('wishlist_item_id', wishlistItemId)
      .not('locked_until', 'is', null)
      .gte('locked_until', now)

    if (existingLocks && existingLocks.length > 0) {
      const existingLock = existingLocks[0]
      if (existingLock.buyer_id !== user.id) {
        return { success: false, error: 'Otro usuario está comprando este regalo' }
      }
      // User already has the lock - return existing lock
      const lockExpiresAt = new Date(existingLock.locked_until)

      // Get store and recipient info
      const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('id', wishlistItem.product.store_id)
        .single()

      const { data: recipient } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .eq('id', wishlistItem.user_id)
        .single()

      return {
        success: true,
        data: {
          lockExpiresAt,
          checkoutSession: {
            wishlistItemId: wishlistItem.id,
            product: wishlistItem.product,
            recipient: recipient!,
            store: store!,
            lockExpiresAt,
            amount: wishlistItem.product.price,
          },
        },
      }
    }

    // 5. Get store info
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', wishlistItem.product.store_id)
      .single()

    if (storeError || !store) {
      return { success: false, error: 'Tienda no encontrada' }
    }

    // 6. Get recipient info
    const { data: recipient, error: recipientError } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('id', wishlistItem.user_id)
      .single()

    if (recipientError || !recipient) {
      return { success: false, error: 'Destinatario no encontrado' }
    }

    // 7. Create lock (insert gift record with locked_until)
    const lockExpiresAt = calculateLockExpiration(15)
    const { error: insertError } = await supabase.from('gifts').insert({
      wishlist_item_id: wishlistItemId,
      buyer_id: user.id,
      recipient_id: wishlistItem.user_id,
      product_id: wishlistItem.product_id,
      store_id: store.id,
      amount: wishlistItem.product.price,
      payment_status: 'pending',
      payment_method: '',
      shipping_status: 'pending',
      locked_until: lockExpiresAt.toISOString(),
    })

    if (insertError) {
      console.error('Error creating lock:', insertError)
      return { success: false, error: 'Error al bloquear el producto' }
    }

    return {
      success: true,
      data: {
        lockExpiresAt,
        checkoutSession: {
          wishlistItemId: wishlistItem.id,
          product: wishlistItem.product,
          recipient,
          store,
          lockExpiresAt,
          amount: wishlistItem.product.price,
        },
      },
    }
  } catch (error) {
    console.error('Error in lockGiftItem:', error)
    return { success: false, error: 'Error al bloquear producto' }
  }
}

// =====================================================
// PROCESS GIFT PAYMENT
// =====================================================

/**
 * Process gift payment (simulated for MVP)
 *
 * Updates wishlist status from available to in_process
 *
 * @param formData - Payment form data
 * @returns Gift details with order number
 */
export async function processGiftPayment(
  formData: GiftPaymentFormData
): Promise<ProcessGiftPaymentResponse> {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const supabase = await createClient()

    // 1. Find the gift record (lock) for this wishlist item
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .select('*')
      .eq('wishlist_item_id', formData.wishlistItemId)
      .eq('buyer_id', user.id)
      .single()

    if (giftError || !gift) {
      return { success: false, error: 'Bloqueo no encontrado' }
    }

    // 2. Verify lock hasn't expired
    if (gift.locked_until && new Date(gift.locked_until) < new Date()) {
      return { success: false, error: 'El bloqueo ha expirado' }
    }

    // 3. Update gift record - complete payment
    const { error: updateGiftError } = await supabase
      .from('gifts')
      .update({
        payment_status: 'completed',
        payment_method: formData.paymentMethod,
        locked_until: null, // Clear lock
      })
      .eq('id', gift.id)

    if (updateGiftError) {
      console.error('Error updating gift:', updateGiftError)
      return { success: false, error: 'Error al procesar pago' }
    }

    // 4. Update wishlist item status to in_process
    const { error: updateWishlistError } = await supabase
      .from('wishlists')
      .update({ status: 'in_process' })
      .eq('id', formData.wishlistItemId)

    if (updateWishlistError) {
      console.error('Error updating wishlist status:', updateWishlistError)
      return { success: false, error: 'Error al actualizar estado' }
    }

    // 5. Get complete gift details for response
    const { data: giftWithDetails, error: detailsError } = await supabase
      .from('gifts')
      .select(
        `
        id,
        wishlist_item_id,
        buyer_id,
        recipient_id,
        product_id,
        store_id,
        amount,
        payment_status,
        payment_method,
        shipping_status,
        tracking_number,
        locked_until,
        created_at,
        updated_at,
        delivered_at,
        product:products(*),
        buyer:users!gifts_buyer_id_fkey(id, name, email, avatar_url),
        recipient:users!gifts_recipient_id_fkey(id, name, email, avatar_url),
        store:stores(*),
        wishlist_item:wishlists(*)
      `
      )
      .eq('id', gift.id)
      .single()

    if (detailsError || !giftWithDetails) {
      console.error('Error fetching gift details:', detailsError)
      return { success: false, error: 'Error al cargar detalles del regalo' }
    }

    const orderNumber = generateOrderNumber(gift.id)

    return {
      success: true,
      data: {
        giftId: gift.id,
        orderNumber,
        gift: giftWithDetails as any,
      },
    }
  } catch (error) {
    console.error('Error in processGiftPayment:', error)
    return { success: false, error: 'Error al procesar el pago' }
  }
}

// =====================================================
// CONFIRM GIFT DELIVERY
// =====================================================

/**
 * Confirm gift delivery
 *
 * Updates status to delivered and wishlist to gifted
 *
 * @param giftId - Gift ID to confirm
 * @returns Updated gift details
 */
export async function confirmGiftDelivery(giftId: string): Promise<ConfirmDeliveryResponse> {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const supabase = await createClient()

    // 1. Get gift and verify permissions
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .select('*, wishlist_item:wishlists(user_id)')
      .eq('id', giftId)
      .single()

    if (giftError || !gift) {
      return { success: false, error: 'Regalo no encontrado' }
    }

    // Only buyer or recipient can confirm delivery
    if (gift.buyer_id !== user.id && gift.wishlist_item.user_id !== user.id) {
      return { success: false, error: 'No tienes permiso para confirmar esta entrega' }
    }

    // 2. Verify payment is completed
    if (gift.payment_status !== 'completed') {
      return { success: false, error: 'El pago debe estar completado' }
    }

    // 3. Update gift shipping status
    const { error: updateGiftError } = await supabase
      .from('gifts')
      .update({
        shipping_status: 'delivered',
        delivered_at: new Date().toISOString(),
      })
      .eq('id', giftId)

    if (updateGiftError) {
      console.error('Error updating gift:', updateGiftError)
      return { success: false, error: 'Error al confirmar entrega' }
    }

    // 4. Update wishlist item to gifted
    const { error: updateWishlistError } = await supabase
      .from('wishlists')
      .update({ status: 'gifted' })
      .eq('id', gift.wishlist_item_id)

    if (updateWishlistError) {
      console.error('Error updating wishlist:', updateWishlistError)
      return { success: false, error: 'Error al actualizar wishlist' }
    }

    // 5. Get updated gift details
    const { data: updatedGift, error: detailsError } = await supabase
      .from('gifts')
      .select(
        `
        *,
        product:products(*),
        buyer:users!gifts_buyer_id_fkey(id, name, email, avatar_url),
        recipient:users!gifts_recipient_id_fkey(id, name, email, avatar_url),
        store:stores(*),
        wishlist_item:wishlists(*)
      `
      )
      .eq('id', giftId)
      .single()

    if (detailsError || !updatedGift) {
      return { success: false, error: 'Error al cargar detalles' }
    }

    return {
      success: true,
      data: { gift: updatedGift as any },
    }
  } catch (error) {
    console.error('Error in confirmGiftDelivery:', error)
    return { success: false, error: 'Error al confirmar entrega' }
  }
}

// =====================================================
// GET GIFT HISTORY
// =====================================================

/**
 * Get gift history for current user (sent and received)
 *
 * @returns Gifts sent and received by user
 */
export async function getGiftHistory(): Promise<GetGiftHistoryResponse> {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const supabase = await createClient()

    // Get all gifts involving user (as buyer or recipient)
    // Exclude pending payments (only show completed gifts)
    const { data: gifts, error: giftsError } = await supabase
      .from('gifts')
      .select(
        `
        id,
        buyer_id,
        recipient_id,
        product_id,
        store_id,
        amount,
        payment_status,
        shipping_status,
        tracking_number,
        created_at,
        delivered_at,
        product:products(id, name, brand, size, color, price, image_url),
        buyer:users!gifts_buyer_id_fkey(id, name, avatar_url),
        recipient:users!gifts_recipient_id_fkey(id, name, avatar_url),
        store:stores(name, address)
      `
      )
      .or(`buyer_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .eq('payment_status', 'completed')
      .is('locked_until', null)
      .order('created_at', { ascending: false })

    if (giftsError) {
      console.error('Error fetching gifts:', giftsError)
      return { success: false, error: 'Error al cargar historial' }
    }

    // Separate into sent and received
    const sent: GiftSummary[] = []
    const received: ReceivedGift[] = []

    ;(gifts || []).forEach((gift: any) => {
      if (gift.buyer_id === user.id) {
        // Gift sent by user
        sent.push({
          id: gift.id,
          product: {
            id: gift.product.id,
            name: gift.product.name,
            brand: gift.product.brand,
            size: gift.product.size,
            color: gift.product.color,
            price: gift.product.price,
            image_url: gift.product.image_url,
          },
          recipient: {
            id: gift.recipient.id,
            name: gift.recipient.name,
            avatar_url: gift.recipient.avatar_url,
          },
          amount: gift.amount,
          payment_status: gift.payment_status,
          shipping_status: gift.shipping_status,
          created_at: gift.created_at,
          delivered_at: gift.delivered_at,
        })
      } else {
        // Gift received by user
        received.push({
          id: gift.id,
          product: {
            name: gift.product.name,
            brand: gift.product.brand,
            size: gift.product.size,
            color: gift.product.color,
            image_url: gift.product.image_url,
          },
          buyer: {
            name: gift.buyer.name,
            avatar_url: gift.buyer.avatar_url,
          },
          store: {
            name: gift.store.name,
            address: gift.store.address,
          },
          shipping_status: gift.shipping_status,
          tracking_number: gift.tracking_number,
          created_at: gift.created_at,
          delivered_at: gift.delivered_at,
        })
      }
    })

    return {
      success: true,
      data: {
        sent,
        received,
        totalSent: sent.length,
        totalReceived: received.length,
      },
    }
  } catch (error) {
    console.error('Error in getGiftHistory:', error)
    return { success: false, error: 'Error al cargar historial de regalos' }
  }
}

// =====================================================
// RELEASE EXPIRED LOCKS
// =====================================================

/**
 * Release expired gift locks
 *
 * Cleans up locks older than 15 minutes
 *
 * @returns Number of locks released
 */
export async function releaseExpiredLocks(): Promise<ReleaseExpiredLocksResponse> {
  try {
    const supabase = await createClient()

    const now = new Date().toISOString()

    // Delete gift records that have expired locks and pending payment
    const { data: expiredGifts, error } = await supabase
      .from('gifts')
      .delete()
      .lt('locked_until', now)
      .eq('payment_status', 'pending')
      .select('id')

    if (error) {
      console.error('Error releasing locks:', error)
      return { success: false, error: 'Error al liberar bloqueos' }
    }

    return {
      success: true,
      data: { releasedCount: expiredGifts?.length || 0 },
    }
  } catch (error) {
    console.error('Error in releaseExpiredLocks:', error)
    return { success: false, error: 'Error al liberar bloqueos expirados' }
  }
}

/**
 * Release a specific lock (user cancels checkout)
 *
 * @param wishlistItemId - Wishlist item to unlock
 */
export async function releaseLock(wishlistItemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser()
    if (!user) {
      return { success: false, error: 'No autenticado' }
    }

    const supabase = await createClient()

    // Delete the pending gift (lock) for this item by this user
    const { error } = await supabase
      .from('gifts')
      .delete()
      .eq('wishlist_item_id', wishlistItemId)
      .eq('buyer_id', user.id)
      .eq('payment_status', 'pending')

    if (error) {
      console.error('Error releasing lock:', error)
      return { success: false, error: 'Error al cancelar bloqueo' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in releaseLock:', error)
    return { success: false, error: 'Error al liberar bloqueo' }
  }
}
