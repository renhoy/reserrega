'use client'

/**
 * =====================================================
 * STORE-PANEL - useStoreSession Hook
 * =====================================================
 * Hook para gestionar sesión activa de compra
 * =====================================================
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { StoreSession, SessionProduct } from '../types/store.types'
import {
  startStoreSession,
  addProductToSession,
  endStoreSession,
} from '../actions/store-panel.actions'
import { calculateSessionTotal } from '../lib/store-utils'

export function useStoreSession(storeId: number) {
  const [session, setSession] = useState<StoreSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEnding, setIsEnding] = useState(false)

  /**
   * Start a new session by scanning user QR
   */
  const handleStartSession = useCallback(
    async (userQR: string) => {
      try {
        setIsLoading(true)

        const result = await startStoreSession({
          storeId,
          userQR,
        })

        if (!result.success || !result.session) {
          toast.error(result.error || 'Error al iniciar sesión')
          return
        }

        setSession(result.session)
        toast.success(`Sesión iniciada para ${result.session.user.name}`)
      } catch (error) {
        console.error('Error starting session:', error)
        toast.error('Error al iniciar sesión de compra')
      } finally {
        setIsLoading(false)
      }
    },
    [storeId]
  )

  /**
   * Add product to current session
   */
  const handleAddProduct = useCallback(
    async (barcode: string) => {
      if (!session) {
        toast.error('No hay sesión activa')
        return
      }

      try {
        setIsLoading(true)

        // Check if product already exists
        if (session.products.some((p) => p.barcode === barcode)) {
          toast.error('Este producto ya fue escaneado')
          return
        }

        const result = await addProductToSession({
          sessionId: session.id,
          storeId,
          barcode,
        })

        if (!result.success || !result.product) {
          toast.error(result.error || 'Error al agregar producto')
          return
        }

        // Update session with new product
        const updatedProducts = [...session.products, result.product]
        const updatedSession: StoreSession = {
          ...session,
          products: updatedProducts,
          totalProducts: updatedProducts.length,
          totalValue: calculateSessionTotal(updatedProducts),
          state: 'active',
        }

        setSession(updatedSession)
        toast.success(`Producto agregado: ${result.product.name}`)
      } catch (error) {
        console.error('Error adding product:', error)
        toast.error('Error al agregar producto')
      } finally {
        setIsLoading(false)
      }
    },
    [session, storeId]
  )

  /**
   * Remove product from current session
   */
  const handleRemoveProduct = useCallback(
    (barcode: string) => {
      if (!session) return

      const updatedProducts = session.products.filter((p) => p.barcode !== barcode)
      const updatedSession: StoreSession = {
        ...session,
        products: updatedProducts,
        totalProducts: updatedProducts.length,
        totalValue: calculateSessionTotal(updatedProducts),
        state: updatedProducts.length === 0 ? 'scanning' : 'active',
      }

      setSession(updatedSession)
      toast.success('Producto eliminado')
    },
    [session]
  )

  /**
   * End current session and create reservations
   */
  const handleEndSession = useCallback(async () => {
    if (!session) {
      toast.error('No hay sesión activa')
      return
    }

    if (session.products.length === 0) {
      toast.error('No hay productos para reservar')
      return
    }

    try {
      setIsEnding(true)
      setSession({ ...session, state: 'ending' })

      const result = await endStoreSession(
        session.id,
        session.products,
        session.userId,
        storeId
      )

      if (!result.success) {
        toast.error(result.error || 'Error al finalizar sesión')
        setSession({ ...session, state: 'error' })
        return
      }

      toast.success(
        `Sesión finalizada: ${result.totalReserved} ${
          result.totalReserved === 1 ? 'producto reservado' : 'productos reservados'
        }`
      )

      // Clear session
      setSession(null)
    } catch (error) {
      console.error('Error ending session:', error)
      toast.error('Error al finalizar sesión')
      if (session) {
        setSession({ ...session, state: 'error' })
      }
    } finally {
      setIsEnding(false)
    }
  }, [session, storeId])

  /**
   * Cancel current session without saving
   */
  const handleCancelSession = useCallback(() => {
    if (!session) return

    setSession(null)
    toast.info('Sesión cancelada')
  }, [session])

  return {
    session,
    isLoading,
    isEnding,
    startSession: handleStartSession,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    endSession: handleEndSession,
    cancelSession: handleCancelSession,
  }
}
