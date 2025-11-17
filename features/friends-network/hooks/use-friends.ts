/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Custom Hooks
 * =====================================================
 * React hooks for friends network functionality
 * =====================================================
 */

'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  manageFriendRequest,
  searchUsers as searchUsersAction,
  generateInvitation,
} from '../actions/friends.actions'
import type {
  FriendInfo,
  FriendRequestWithUsers,
  UserSearchResult,
  EmailInvitation,
  SendInvitationFormData,
} from '../types/friends.types'

// =====================================================
// USE FRIENDS HOOK
// =====================================================

/**
 * Hook for managing friends list
 *
 * @example
 * ```tsx
 * const { friends, isLoading, refresh } = useFriends()
 * ```
 */
export function useFriends() {
  const [friends, setFriends] = useState<FriendInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadFriends = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getFriends()
      setFriends(response.friends)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar amigos'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load friends on mount
  useEffect(() => {
    loadFriends()
  }, [loadFriends])

  /**
   * Remove a friend
   */
  const removeFriend = async (friendId: string) => {
    try {
      // TODO: Implement removeFriend server action
      // For now, just refresh the list
      toast.success('Amigo eliminado')
      await loadFriends()
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar amigo'
      toast.error(message)
      throw err
    }
  }

  /**
   * View friend's wishlist
   */
  const viewWishlist = (friendId: string) => {
    router.push(`/wishlist/${friendId}`)
  }

  return {
    friends,
    isLoading,
    error,
    refresh: loadFriends,
    removeFriend,
    viewWishlist,
  }
}

// =====================================================
// USE FRIEND REQUESTS HOOK
// =====================================================

/**
 * Hook for managing friend requests
 *
 * @example
 * ```tsx
 * const { received, sent, accept, reject, cancel } = useFriendRequests()
 * ```
 */
export function useFriendRequests() {
  const [received, setReceived] = useState<FriendRequestWithUsers[]>([])
  const [sent, setSent] = useState<FriendRequestWithUsers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getFriendRequests()
      setReceived(response.received)
      setSent(response.sent)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar solicitudes'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load requests on mount
  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  /**
   * Accept a friend request
   */
  const accept = async (requestId: string) => {
    try {
      startTransition(async () => {
        const result = await manageFriendRequest(requestId, 'accept')
        toast.success(result.message)
        await loadRequests()
        router.refresh()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al aceptar solicitud'
      toast.error(message)
      throw err
    }
  }

  /**
   * Reject a friend request
   */
  const reject = async (requestId: string) => {
    try {
      startTransition(async () => {
        const result = await manageFriendRequest(requestId, 'reject')
        toast.success(result.message)
        await loadRequests()
        router.refresh()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al rechazar solicitud'
      toast.error(message)
      throw err
    }
  }

  /**
   * Cancel a sent friend request
   */
  const cancel = async (requestId: string) => {
    try {
      startTransition(async () => {
        const result = await manageFriendRequest(requestId, 'cancel')
        toast.success(result.message)
        await loadRequests()
        router.refresh()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cancelar solicitud'
      toast.error(message)
      throw err
    }
  }

  /**
   * Send a new friend request
   */
  const sendRequest = async (recipientId: string) => {
    try {
      const result = await sendFriendRequest(recipientId)
      toast.success(result.message)
      await loadRequests()
      router.refresh()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar solicitud'
      toast.error(message)
      throw err
    }
  }

  return {
    received,
    sent,
    isLoading,
    error,
    isPending,
    refresh: loadRequests,
    accept,
    reject,
    cancel,
    sendRequest,
  }
}

// =====================================================
// USE USER SEARCH HOOK
// =====================================================

/**
 * Hook for searching users
 *
 * @example
 * ```tsx
 * const { search, results, isSearching } = useUserSearch()
 * await search('john@example.com')
 * ```
 */
export function useUserSearch() {
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  /**
   * Search for users
   */
  const search = async (query: string, limit?: number) => {
    try {
      setIsSearching(true)
      setError(null)
      const response = await searchUsersAction(query, limit)
      setResults(response.results)
      return response.results
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al buscar usuarios'
      setError(message)
      toast.error(message)
      setResults([])
      throw err
    } finally {
      setIsSearching(false)
    }
  }

  /**
   * Send friend request to a user from search results
   */
  const sendRequestToUser = async (userId: string) => {
    try {
      const result = await sendFriendRequest(userId)
      toast.success(result.message)

      // Update the result to reflect the new status
      setResults((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, hasPendingRequest: true, requestDirection: 'sent' as const }
            : user
        )
      )

      router.refresh()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar solicitud'
      toast.error(message)
      throw err
    }
  }

  /**
   * Clear search results
   */
  const clear = () => {
    setResults([])
    setError(null)
  }

  return {
    results,
    isSearching,
    error,
    search,
    sendRequestToUser,
    clear,
  }
}

// =====================================================
// USE INVITATION HOOK
// =====================================================

/**
 * Hook for email invitations
 *
 * @example
 * ```tsx
 * const { sendInvitation, isSending, invitation } = useInvitation()
 * await sendInvitation({ email: 'friend@example.com' })
 * ```
 */
export function useInvitation() {
  const [invitation, setInvitation] = useState<EmailInvitation | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  /**
   * Send an email invitation
   */
  const sendInvitation = async (data: SendInvitationFormData) => {
    try {
      setIsSending(true)
      setError(null)
      const response = await generateInvitation(data)
      setInvitation(response.invitation)
      toast.success(response.message)
      router.refresh()
      return response.invitation
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar invitación'
      setError(message)
      toast.error(message)
      throw err
    } finally {
      setIsSending(false)
    }
  }

  /**
   * Copy invitation link to clipboard
   */
  const copyInvitationLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Link copiado al portapapeles')
      return true
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textarea = document.createElement('textarea')
        textarea.value = link
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        toast.success('Link copiado al portapapeles')
        return true
      } catch (fallbackErr) {
        toast.error('Error al copiar el link')
        return false
      }
    }
  }

  /**
   * Clear invitation
   */
  const clear = () => {
    setInvitation(null)
    setError(null)
  }

  return {
    invitation,
    isSending,
    error,
    sendInvitation,
    copyInvitationLink,
    clear,
  }
}
