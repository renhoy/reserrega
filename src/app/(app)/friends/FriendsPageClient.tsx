/**
 * =====================================================
 * FRIENDS PAGE CLIENT - Client Component
 * =====================================================
 * Client-side functionality for friends management
 * =====================================================
 */

'use client'

import { useRouter } from 'next/navigation'
import { FriendsList } from '@/features/friends-network/components/FriendsList'
import type { FriendInfo } from '@/features/friends-network/types/friends.types'

// =====================================================
// TYPES
// =====================================================

interface FriendsPageClientProps {
  initialFriends: FriendInfo[]
}

// =====================================================
// COMPONENT
// =====================================================

export function FriendsPageClient({ initialFriends }: FriendsPageClientProps) {
  const router = useRouter()

  /**
   * Navigate to friend's wishlist
   */
  const handleViewWishlist = (friendId: string) => {
    router.push(`/wishlist/${friendId}`)
  }

  /**
   * Navigate to add friends page
   */
  const handleAddFriend = () => {
    router.push('/friends/invite')
  }

  /**
   * Remove a friend
   */
  const handleRemoveFriend = async (friendId: string) => {
    // TODO: Implement remove friend functionality
    // For now, just refresh
    router.refresh()
  }

  return (
    <FriendsList
      friends={initialFriends}
      onViewWishlist={handleViewWishlist}
      onRemoveFriend={handleRemoveFriend}
      onAddFriend={handleAddFriend}
    />
  )
}
