/**
 * =====================================================
 * FRIEND WISHLIST PAGE
 * =====================================================
 * View friend's wishlist and select gifts
 * =====================================================
 */

'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { FriendWishlistView } from '@/features/gift-flow/components/FriendWishlistView'
import { useFriendWishlist, useGiftCheckout } from '@/features/gift-flow/hooks/use-gift-flow'
import { useAuth } from '@/shared/auth/hooks/useAuth'

interface PageProps {
  params: Promise<{ friendId: string }>
}

export default function FriendWishlistPage({ params }: PageProps) {
  const { friendId } = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const { wishlist, isLoading } = useFriendWishlist(friendId)
  const { lockItem } = useGiftCheckout()

  const handleSelectGift = async (wishlistItemId: string) => {
    const session = await lockItem(wishlistItemId)
    if (session) {
      router.push(`/gift/${friendId}/checkout?item=${wishlistItemId}`)
    }
  }

  const handleReleaseLock = async (wishlistItemId: string) => {
    // Reload wishlist after releasing lock
    window.location.reload()
  }

  const handleContinueCheckout = (wishlistItemId: string) => {
    router.push(`/gift/${friendId}/checkout?item=${wishlistItemId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      {/* Wishlist */}
      <FriendWishlistView
        wishlist={wishlist}
        currentUserId={user?.id || ''}
        isLoading={isLoading}
        onSelectGift={handleSelectGift}
        onReleaseLock={handleReleaseLock}
        onContinueCheckout={handleContinueCheckout}
      />
    </div>
  )
}
