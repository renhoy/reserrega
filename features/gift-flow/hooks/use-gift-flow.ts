/**
 * =====================================================
 * GIFT-FLOW MODULE - Custom Hooks
 * =====================================================
 * React hooks for gift flow management
 * =====================================================
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/shared/common/hooks/useToast'
import {
  viewFriendWishlist,
  lockGiftItem,
  processGiftPayment,
  confirmGiftDelivery,
  getGiftHistory,
  releaseLock,
} from '../actions/gift-flow.actions'
import type {
  FriendWishlist,
  GiftCheckoutSession,
  GiftPaymentFormData,
  GiftWithDetails,
  GiftSummary,
  ReceivedGift,
  GiftFlowStage,
} from '../types/gift.types'

// =====================================================
// USE FRIEND WISHLIST
// =====================================================

/**
 * Hook for viewing friend's wishlist
 *
 * @param friendId - Friend's user ID
 * @returns Friend wishlist data and loading state
 */
export function useFriendWishlist(friendId: string | null) {
  const [wishlist, setWishlist] = useState<FriendWishlist | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadWishlist = useCallback(async () => {
    if (!friendId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await viewFriendWishlist(friendId)

      if (response.success && response.data) {
        setWishlist(response.data)
      } else {
        setError(response.error || 'Error al cargar wishlist')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'No se pudo cargar la wishlist',
        })
      }
    } catch (err) {
      setError('Error inesperado')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado',
      })
    } finally {
      setIsLoading(false)
    }
  }, [friendId, toast])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  return {
    wishlist,
    isLoading,
    error,
    reload: loadWishlist,
  }
}

// =====================================================
// USE GIFT CHECKOUT
// =====================================================

/**
 * Hook for managing gift checkout flow
 *
 * @returns Checkout session, lock/pay functions, and states
 */
export function useGiftCheckout() {
  const [checkoutSession, setCheckoutSession] = useState<GiftCheckoutSession | null>(null)
  const [isLocking, setIsLocking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedGift, setCompletedGift] = useState<GiftWithDetails | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  /**
   * Lock an item for gifting
   */
  const lockItem = useCallback(
    async (wishlistItemId: string) => {
      setIsLocking(true)

      try {
        const response = await lockGiftItem(wishlistItemId)

        if (response.success && response.data) {
          setCheckoutSession(response.data.checkoutSession)
          toast({
            title: 'Producto Bloqueado',
            description: 'Tienes 15 minutos para completar el pago',
          })
          return response.data.checkoutSession
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.error || 'No se pudo bloquear el producto',
          })
          return null
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Ocurrió un error inesperado',
        })
        return null
      } finally {
        setIsLocking(false)
      }
    },
    [toast]
  )

  /**
   * Release lock (cancel checkout)
   */
  const cancelCheckout = useCallback(
    async (wishlistItemId: string) => {
      try {
        const response = await releaseLock(wishlistItemId)

        if (response.success) {
          setCheckoutSession(null)
          toast({
            title: 'Bloqueo Cancelado',
            description: 'El producto está disponible nuevamente',
          })
          return true
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.error || 'No se pudo cancelar',
          })
          return false
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Ocurrió un error inesperado',
        })
        return false
      }
    },
    [toast]
  )

  /**
   * Process payment
   */
  const processPayment = useCallback(
    async (formData: GiftPaymentFormData) => {
      setIsProcessing(true)

      try {
        const response = await processGiftPayment(formData)

        if (response.success && response.data) {
          setCompletedGift(response.data.gift)
          setOrderNumber(response.data.orderNumber)
          setCheckoutSession(null)

          toast({
            title: '¡Regalo Confirmado!',
            description: `Pedido ${response.data.orderNumber} completado`,
          })

          return response.data
        } else {
          toast({
            variant: 'destructive',
            title: 'Error en el Pago',
            description: response.error || 'No se pudo procesar el pago',
          })
          return null
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Ocurrió un error inesperado',
        })
        return null
      } finally {
        setIsProcessing(false)
      }
    },
    [toast]
  )

  return {
    checkoutSession,
    isLocking,
    isProcessing,
    completedGift,
    orderNumber,
    lockItem,
    cancelCheckout,
    processPayment,
  }
}

// =====================================================
// USE GIFT HISTORY
// =====================================================

/**
 * Hook for fetching gift history
 *
 * @returns Gift history (sent and received)
 */
export function useGiftHistory() {
  const [sentGifts, setSentGifts] = useState<GiftSummary[]>([])
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGift[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getGiftHistory()

      if (response.success && response.data) {
        setSentGifts(response.data.sent)
        setReceivedGifts(response.data.received)
      } else {
        setError(response.error || 'Error al cargar historial')
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'No se pudo cargar el historial',
        })
      }
    } catch (err) {
      setError('Error inesperado')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return {
    sentGifts,
    receivedGifts,
    totalSent: sentGifts.length,
    totalReceived: receivedGifts.length,
    isLoading,
    error,
    reload: loadHistory,
  }
}

// =====================================================
// USE DELIVERY CONFIRMATION
// =====================================================

/**
 * Hook for confirming gift delivery
 *
 * @returns Confirm function and loading state
 */
export function useDeliveryConfirmation() {
  const [isConfirming, setIsConfirming] = useState(false)
  const { toast } = useToast()

  const confirmDelivery = useCallback(
    async (giftId: string) => {
      setIsConfirming(true)

      try {
        const response = await confirmGiftDelivery(giftId)

        if (response.success) {
          toast({
            title: 'Entrega Confirmada',
            description: 'El regalo ha sido marcado como entregado',
          })
          return response.data?.gift || null
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: response.error || 'No se pudo confirmar la entrega',
          })
          return null
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Ocurrió un error inesperado',
        })
        return null
      } finally {
        setIsConfirming(false)
      }
    },
    [toast]
  )

  return {
    confirmDelivery,
    isConfirming,
  }
}

// =====================================================
// USE GIFT FLOW (COMPLETE)
// =====================================================

/**
 * Complete hook for managing entire gift flow
 *
 * Combines all sub-hooks into a unified interface
 *
 * @param friendId - Friend ID for wishlist viewing
 * @returns Complete gift flow state and functions
 */
export function useGiftFlow(friendId?: string | null) {
  const [stage, setStage] = useState<GiftFlowStage>('viewing')
  const wishlistHook = useFriendWishlist(friendId || null)
  const checkoutHook = useGiftCheckout()
  const router = useRouter()

  const selectItemForGift = useCallback(
    async (wishlistItemId: string) => {
      setStage('selecting')
      const session = await checkoutHook.lockItem(wishlistItemId)
      if (session) {
        setStage('checkout')
        return session
      } else {
        setStage('viewing')
        return null
      }
    },
    [checkoutHook]
  )

  const cancelSelection = useCallback(
    async (wishlistItemId: string) => {
      const success = await checkoutHook.cancelCheckout(wishlistItemId)
      if (success) {
        setStage('viewing')
        wishlistHook.reload()
      }
      return success
    },
    [checkoutHook, wishlistHook]
  )

  const completePayment = useCallback(
    async (formData: GiftPaymentFormData) => {
      setStage('processing')
      const result = await checkoutHook.processPayment(formData)
      if (result) {
        setStage('confirmed')
        return result
      } else {
        setStage('checkout')
        return null
      }
    },
    [checkoutHook]
  )

  return {
    stage,
    wishlist: wishlistHook.wishlist,
    isLoadingWishlist: wishlistHook.isLoading,
    checkoutSession: checkoutHook.checkoutSession,
    isLocking: checkoutHook.isLocking,
    isProcessing: checkoutHook.isProcessing,
    completedGift: checkoutHook.completedGift,
    orderNumber: checkoutHook.orderNumber,
    selectItemForGift,
    cancelSelection,
    completePayment,
    reloadWishlist: wishlistHook.reload,
  }
}
