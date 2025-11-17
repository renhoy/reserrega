/**
 * =====================================================
 * GIFT CHECKOUT PAGE
 * =====================================================
 * Complete gift purchase with payment
 * =====================================================
 */

'use client'

import { use, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { GiftCheckoutForm } from '@/features/gift-flow/components/GiftCheckoutForm'
import { GiftSummary } from '@/features/gift-flow/components/GiftSummary'
import { useGiftCheckout } from '@/features/gift-flow/hooks/use-gift-flow'
import { lockGiftItem, releaseLock } from '@/features/gift-flow/actions/gift-flow.actions'
import type { GiftCheckoutSession, GiftPaymentFormData } from '@/features/gift-flow/types/gift.types'

interface PageProps {
  params: Promise<{ friendId: string }>
}

export default function GiftCheckoutPage({ params }: PageProps) {
  const { friendId } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const wishlistItemId = searchParams.get('item')
  const [session, setSession] = useState<GiftCheckoutSession | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const { processPayment, isProcessing } = useGiftCheckout()

  // Load checkout session on mount
  useEffect(() => {
    if (!wishlistItemId) {
      router.push(`/gift/${friendId}`)
      return
    }

    const loadSession = async () => {
      setIsLoadingSession(true)
      const response = await lockGiftItem(wishlistItemId)

      if (response.success && response.data) {
        setSession(response.data.checkoutSession)
      } else {
        router.push(`/gift/${friendId}`)
      }
      setIsLoadingSession(false)
    }

    loadSession()
  }, [wishlistItemId, friendId, router])

  const handleSubmit = async (formData: GiftPaymentFormData) => {
    const result = await processPayment(formData)
    if (result) {
      router.push(`/gift/confirmation?order=${result.orderNumber}&gift=${result.giftId}`)
    }
  }

  const handleCancel = async () => {
    if (wishlistItemId) {
      await releaseLock(wishlistItemId)
    }
    router.push(`/gift/${friendId}`)
  }

  if (isLoadingSession) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>
            No se pudo cargar la sesión de checkout. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push(`/gift/${friendId}`)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Wishlist
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleCancel}
        className="mb-6"
        disabled={isProcessing}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <GiftCheckoutForm
            session={session}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isProcessing={isProcessing}
          />
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <GiftSummary session={session} showRecipient />
          </div>
        </div>
      </div>
    </div>
  )
}
