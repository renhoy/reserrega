/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Server Actions
 * =====================================================
 * Server-side actions for friends network operations
 * =====================================================
 */

'use server'

import { getUser } from '@/shared/auth/server'
import { createServerActionClient as createClient } from '@/lib/supabase/helpers'
import type {
  GetFriendsResponse,
  GetFriendRequestsResponse,
  SendFriendRequestResponse,
  ManageFriendRequestResponse,
  SearchUsersResponse,
  SendInvitationResponse,
  UserSearchResult,
  FriendInfo,
  FriendRequestWithUsers,
  EmailInvitation,
  SendInvitationFormData,
} from '../types/friends.types'
import {
  generateInvitationToken,
  createInvitationPayload,
  generateInvitationLink,
  normalizeEmail,
  validateEmail,
} from '../lib/friends-utils'
import { addDays } from 'date-fns'

// =====================================================
// GET FRIENDS
// =====================================================

/**
 * Get all friends of the current user
 *
 * @returns List of friends with basic info
 */
export async function getFriends(): Promise<GetFriendsResponse> {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('No autenticado')
    }

    const supabase = await createClient()

    // Get friendships where current user is involved
    const { data: friendships, error: friendshipsError } = await supabase
      .from('friendships')
      .select(
        `
        id,
        user_id,
        friend_id,
        created_at,
        user:users!friendships_user_id_fkey(id, name, email, avatar_url, last_name),
        friend:users!friendships_friend_id_fkey(id, name, email, avatar_url, last_name)
      `
      )
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (friendshipsError) throw friendshipsError

    // Transform to FriendInfo format
    const friends: FriendInfo[] = (friendships || []).map((friendship: any) => {
      // Determine which user is the friend (not current user)
      const isFriend = friendship.user_id === user.id ? friendship.friend : friendship.user

      return {
        id: isFriend.id,
        name: isFriend.name,
        email: isFriend.email,
        avatar_url: isFriend.avatar_url,
        last_name: isFriend.last_name,
        friendsSince: friendship.created_at,
      }
    })

    return {
      friends,
      totalCount: friends.length,
    }
  } catch (error) {
    console.error('Error getting friends:', error)
    throw new Error('Error al obtener amigos')
  }
}

// =====================================================
// GET FRIEND REQUESTS
// =====================================================

/**
 * Get all friend requests (received and sent)
 *
 * @returns Friend requests grouped by received and sent
 */
export async function getFriendRequests(): Promise<GetFriendRequestsResponse> {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('No autenticado')
    }

    const supabase = await createClient()

    // Get all friend requests involving the current user
    const { data: requests, error: requestsError } = await supabase
      .from('friend_requests')
      .select(
        `
        id,
        sender_id,
        recipient_id,
        status,
        created_at,
        updated_at,
        sender:users!friend_requests_sender_id_fkey(id, name, email, avatar_url, last_name),
        recipient:users!friend_requests_recipient_id_fkey(id, name, email, avatar_url, last_name)
      `
      )
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (requestsError) throw requestsError

    // Separate into received and sent
    const received: FriendRequestWithUsers[] = []
    const sent: FriendRequestWithUsers[] = []

    ;(requests || []).forEach((request: any) => {
      const formattedRequest: FriendRequestWithUsers = {
        id: request.id,
        sender_id: request.sender_id,
        recipient_id: request.recipient_id,
        status: request.status,
        invitation_token: request.invitation_token,
        invitation_email: request.invitation_email,
        created_at: request.created_at,
        updated_at: request.updated_at,
        sender: {
          id: request.sender.id,
          name: request.sender.name,
          email: request.sender.email,
          avatar_url: request.sender.avatar_url,
          last_name: request.sender.last_name,
        },
        recipient: {
          id: request.recipient.id,
          name: request.recipient.name,
          email: request.recipient.email,
          avatar_url: request.recipient.avatar_url,
          last_name: request.recipient.last_name,
        },
      }

      if (request.recipient_id === user.id) {
        received.push(formattedRequest)
      } else {
        sent.push(formattedRequest)
      }
    })

    return {
      received,
      sent,
      totalCount: received.length + sent.length,
    }
  } catch (error) {
    console.error('Error getting friend requests:', error)
    throw new Error('Error al obtener solicitudes de amistad')
  }
}

// =====================================================
// SEND FRIEND REQUEST
// =====================================================

/**
 * Send a friend request to another user
 *
 * @param recipientId - User ID to send request to
 * @returns Request status and message
 */
export async function sendFriendRequest(
  recipientId: string
): Promise<SendFriendRequestResponse> {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('No autenticado')
    }

    if (user.id === recipientId) {
      throw new Error('No puedes enviarte una solicitud a ti mismo')
    }

    const supabase = await createClient()

    // Check if recipient exists
    const { data: recipient, error: recipientError } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', recipientId)
      .single()

    if (recipientError || !recipient) {
      throw new Error('Usuario no encontrado')
    }

    // Check if already friends
    const { data: existingFriendship } = await supabase
      .from('friendships')
      .select('id')
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${recipientId}),and(user_id.eq.${recipientId},friend_id.eq.${user.id})`
      )
      .maybeSingle()

    if (existingFriendship) {
      throw new Error('Ya son amigos')
    }

    // Check if there's already a pending request
    const { data: existingRequest } = await supabase
      .from('friend_requests')
      .select('id, status, sender_id')
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`
      )
      .eq('status', 'pending')
      .maybeSingle()

    if (existingRequest) {
      if (existingRequest.sender_id === user.id) {
        throw new Error('Ya enviaste una solicitud a este usuario')
      } else {
        throw new Error('Este usuario ya te envió una solicitud')
      }
    }

    // Create friend request
    const { data: newRequest, error: insertError } = await supabase
      .from('friend_requests')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) throw insertError

    return {
      requestId: newRequest.id,
      status: 'pending',
      message: 'Solicitud enviada correctamente',
    }
  } catch (error) {
    console.error('Error sending friend request:', error)
    throw error instanceof Error ? error : new Error('Error al enviar solicitud')
  }
}

// =====================================================
// MANAGE FRIEND REQUEST
// =====================================================

/**
 * Accept, reject, or cancel a friend request
 *
 * @param requestId - Friend request ID
 * @param action - Action to perform
 * @returns Action result
 */
export async function manageFriendRequest(
  requestId: string,
  action: 'accept' | 'reject' | 'cancel'
): Promise<ManageFriendRequestResponse> {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('No autenticado')
    }

    const supabase = await createClient()

    // Get the friend request
    const { data: request, error: requestError } = await supabase
      .from('friend_requests')
      .select('id, sender_id, recipient_id, status')
      .eq('id', requestId)
      .single()

    if (requestError || !request) {
      throw new Error('Solicitud no encontrada')
    }

    // Verify permissions
    if (action === 'accept' || action === 'reject') {
      if (request.recipient_id !== user.id) {
        throw new Error('No tienes permiso para realizar esta acción')
      }
    } else if (action === 'cancel') {
      if (request.sender_id !== user.id) {
        throw new Error('No tienes permiso para cancelar esta solicitud')
      }
    }

    // Check if request is pending
    if (request.status !== 'pending') {
      throw new Error('Esta solicitud ya fue procesada')
    }

    // Perform action
    if (action === 'accept') {
      // Update request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Create friendship (bidirectional)
      const { error: friendshipError } = await supabase.from('friendships').insert([
        {
          user_id: request.sender_id,
          friend_id: request.recipient_id,
        },
        {
          user_id: request.recipient_id,
          friend_id: request.sender_id,
        },
      ])

      if (friendshipError) throw friendshipError

      return {
        success: true,
        action: 'accept',
        message: 'Solicitud aceptada. Ahora son amigos',
      }
    } else if (action === 'reject') {
      // Update request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)

      if (updateError) throw updateError

      return {
        success: true,
        action: 'reject',
        message: 'Solicitud rechazada',
      }
    } else {
      // Cancel (delete request)
      const { error: deleteError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId)

      if (deleteError) throw deleteError

      return {
        success: true,
        action: 'cancel',
        message: 'Solicitud cancelada',
      }
    }
  } catch (error) {
    console.error('Error managing friend request:', error)
    throw error instanceof Error ? error : new Error('Error al procesar solicitud')
  }
}

// =====================================================
// SEARCH USERS
// =====================================================

/**
 * Search for users to add as friends
 *
 * @param query - Search query (name or email)
 * @param limit - Maximum results
 * @returns List of user search results
 */
export async function searchUsers(
  query: string,
  limit: number = 20
): Promise<SearchUsersResponse> {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('No autenticado')
    }

    if (!query || query.trim().length < 2) {
      return { results: [], totalCount: 0 }
    }

    const supabase = await createClient()
    const searchTerm = query.trim().toLowerCase()

    // Search users by name or email
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, last_name')
      .neq('id', user.id) // Exclude current user
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(limit)

    if (usersError) throw usersError

    if (!users || users.length === 0) {
      return { results: [], totalCount: 0 }
    }

    // Get existing friendships
    const userIds = users.map((u) => u.id)
    const { data: friendships } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .eq('user_id', user.id)
      .in('friend_id', userIds)

    const friendIds = new Set(friendships?.map((f) => f.friend_id) || [])

    // Get pending friend requests
    const { data: requests } = await supabase
      .from('friend_requests')
      .select('sender_id, recipient_id, status')
      .or(
        userIds
          .map(
            (id) =>
              `and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`
          )
          .join(',')
      )
      .eq('status', 'pending')

    const requestMap = new Map<string, 'sent' | 'received'>()
    requests?.forEach((req) => {
      if (req.sender_id === user.id) {
        requestMap.set(req.recipient_id, 'sent')
      } else {
        requestMap.set(req.sender_id, 'received')
      }
    })

    // Format results
    const results: UserSearchResult[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar_url: u.avatar_url,
      last_name: u.last_name,
      isFriend: friendIds.has(u.id),
      hasPendingRequest: requestMap.has(u.id),
      requestDirection: requestMap.get(u.id) || null,
    }))

    return {
      results,
      totalCount: results.length,
    }
  } catch (error) {
    console.error('Error searching users:', error)
    throw new Error('Error al buscar usuarios')
  }
}

// =====================================================
// GENERATE INVITATION
// =====================================================

/**
 * Generate an email invitation for a friend
 *
 * @param data - Invitation form data
 * @returns Invitation details with link
 */
export async function generateInvitation(
  data: SendInvitationFormData
): Promise<SendInvitationResponse> {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('No autenticado')
    }

    // Validate email
    if (!validateEmail(data.email)) {
      throw new Error('Email inválido')
    }

    const normalizedEmail = normalizeEmail(data.email)

    // Check if email is current user's email
    if (normalizedEmail === user.email.toLowerCase()) {
      throw new Error('No puedes enviarte una invitación a ti mismo')
    }

    const supabase = await createClient()

    // Check if user with this email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (existingUser) {
      throw new Error(
        `Este email ya está registrado. Busca a ${existingUser.name} en la búsqueda de usuarios.`
      )
    }

    // Check if there's already a pending invitation for this email
    const { data: existingInvitation } = await supabase
      .from('friend_requests')
      .select('id, invitation_token')
      .eq('sender_id', user.id)
      .eq('invitation_email', normalizedEmail)
      .eq('status', 'pending')
      .maybeSingle()

    let token: string
    let expiresAt: Date

    if (existingInvitation) {
      // Reuse existing token
      token = existingInvitation.invitation_token || generateInvitationToken(user.id, normalizedEmail)
      expiresAt = addDays(new Date(), 7)
    } else {
      // Generate new token
      token = generateInvitationToken(user.id, normalizedEmail)
      const payload = createInvitationPayload(user.id, normalizedEmail)
      expiresAt = new Date(payload.expiresAt)

      // Create friend request with invitation
      const { error: insertError } = await supabase.from('friend_requests').insert({
        sender_id: user.id,
        recipient_id: user.id, // Placeholder until recipient registers
        status: 'pending',
        invitation_token: token,
        invitation_email: normalizedEmail,
      })

      if (insertError) throw insertError
    }

    const invitation: EmailInvitation = {
      email: normalizedEmail,
      invitationToken: token,
      invitationLink: generateInvitationLink(token),
      expiresAt,
    }

    // TODO: Send email notification (implement with Resend)
    // await sendInvitationEmail(invitation, user.name, data.message)

    return {
      invitation,
      message: 'Invitación generada correctamente',
    }
  } catch (error) {
    console.error('Error generating invitation:', error)
    throw error instanceof Error ? error : new Error('Error al generar invitación')
  }
}
