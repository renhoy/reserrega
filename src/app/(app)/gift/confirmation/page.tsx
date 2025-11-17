/**
 * =====================================================
 * GIFT CONFIRMATION PAGE
 * =====================================================
 * Success page after completing gift purchase
 * =====================================================
 */

'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Button } from '@/shared/common/components/ui/button'
import { GiftConfirmation } from '@/features/gift-flow/components/GiftConfirmation'
import { createClient } from '@/shared/database/supabase/client'
import type { GiftWithDetails } from '@/features/gift-flow/types/gift.types'

export default function GiftConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('order')
  const giftId = searchParams.get('gift')
  const [gift, setGift] = useState<GiftWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!giftId || !orderNumber) {
      router.push('/friends')
      return
    }

    const loadGift = async () => {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
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

      if (error || !data) {
        setError('No se pudo cargar la información del regalo')
      } else {
        setGift(data as any)
      }

      setIsLoading(false)
    }

    loadGift()
  }, [giftId, orderNumber, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || !gift) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Regalo no encontrado'}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/friends')} className="mt-4">
          Volver a Amigos
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GiftConfirmation gift={gift} orderNumber={orderNumber || undefined} />
    </div>
  )
}
