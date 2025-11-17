/**
 * =====================================================
 * FRIEND REQUESTS PAGE CLIENT - Client Component
 * =====================================================
 * Client-side functionality for friend requests management
 * =====================================================
 */

'use client'

import { FriendRequestsList } from '@/features/friends-network/components/FriendRequestsList'
import { useFriendRequests } from '@/features/friends-network/hooks/use-friends'
import type { FriendRequestWithUsers } from '@/features/friends-network/types/friends.types'

// =====================================================
// TYPES
// =====================================================

interface FriendRequestsPageClientProps {
  initialReceived: FriendRequestWithUsers[]
  initialSent: FriendRequestWithUsers[]
  currentUserId: string
}

// =====================================================
// COMPONENT
// =====================================================

export function FriendRequestsPageClient({
  initialReceived,
  initialSent,
  currentUserId,
}: FriendRequestsPageClientProps) {
  const { accept, reject, cancel, isPending } = useFriendRequests()

  return (
    <FriendRequestsList
      currentUserId={currentUserId}
      receivedRequests={initialReceived}
      sentRequests={initialSent}
      onAccept={accept}
      onReject={reject}
      onCancel={cancel}
      isLoading={isPending}
    />
  )
}
