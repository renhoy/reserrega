/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Type Definitions
 * =====================================================
 * Complete type system for Friends Network functionality
 * =====================================================
 */

import type {
  FriendRequest,
  FriendRequestInsert,
  FriendRequestUpdate,
  FriendRequestStatus,
  User,
} from '@/shared/database/types/database.types'

// =====================================================
// EXTENDED TYPES (with relations)
// =====================================================

/**
 * Friend request with sender and recipient details
 */
export interface FriendRequestWithUsers extends FriendRequest {
  sender: Pick<User, 'id' | 'name' | 'email' | 'avatar_url' | 'last_name'>
  recipient: Pick<User, 'id' | 'name' | 'email' | 'avatar_url' | 'last_name'>
}

/**
 * Minimal friend info for display
 */
export interface FriendInfo {
  id: string
  name: string
  email: string
  avatar_url: string | null
  last_name: string | null
  friendsSince: string
}

/**
 * User search result
 */
export interface UserSearchResult {
  id: string
  name: string
  email: string
  avatar_url: string | null
  last_name: string | null
  isFriend: boolean
  hasPendingRequest: boolean
  requestDirection: 'sent' | 'received' | null
}

// =====================================================
// INVITATION TYPES
// =====================================================

/**
 * Email invitation data
 */
export interface EmailInvitation {
  email: string
  invitationToken: string
  invitationLink: string
  expiresAt: Date
}

/**
 * Invitation token payload
 */
export interface InvitationTokenPayload {
  senderId: string
  email: string
  createdAt: number
  expiresAt: number
}

/**
 * Invitation validation result
 */
export interface InvitationValidationResult {
  valid: boolean
  reason?: string
  senderId?: string
  email?: string
}

// =====================================================
// FILTER & QUERY TYPES
// =====================================================

/**
 * Filter for friend requests
 */
export interface FriendRequestFilters {
  status?: FriendRequestStatus | FriendRequestStatus[]
  direction?: 'sent' | 'received' | 'both'
}

/**
 * Search filters
 */
export interface UserSearchFilters {
  query: string
  excludeCurrentUser?: boolean
  excludeFriends?: boolean
  limit?: number
}

// =====================================================
// FORM & INPUT TYPES
// =====================================================

/**
 * Form data for sending friend request
 */
export interface SendFriendRequestFormData {
  recipientId: string
}

/**
 * Form data for email invitation
 */
export interface SendInvitationFormData {
  email: string
  message?: string
}

/**
 * Form data for managing friend request
 */
export interface ManageFriendRequestFormData {
  requestId: string
  action: 'accept' | 'reject' | 'cancel'
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

/**
 * Response for getFriends action
 */
export interface GetFriendsResponse {
  friends: FriendInfo[]
  totalCount: number
}

/**
 * Response for getFriendRequests action
 */
export interface GetFriendRequestsResponse {
  received: FriendRequestWithUsers[]
  sent: FriendRequestWithUsers[]
  totalCount: number
}

/**
 * Response for sendFriendRequest action
 */
export interface SendFriendRequestResponse {
  requestId: string
  status: FriendRequestStatus
  message: string
}

/**
 * Response for manageFriendRequest action
 */
export interface ManageFriendRequestResponse {
  success: boolean
  action: 'accept' | 'reject' | 'cancel'
  message: string
}

/**
 * Response for searchUsers action
 */
export interface SearchUsersResponse {
  results: UserSearchResult[]
  totalCount: number
}

/**
 * Response for sendInvitation action
 */
export interface SendInvitationResponse {
  invitation: EmailInvitation
  message: string
}

// =====================================================
// VIEW TYPES
// =====================================================

/**
 * Friend request status badge props
 */
export interface FriendRequestStatusBadgeProps {
  status: FriendRequestStatus
  className?: string
}

/**
 * Friend statistics
 */
export interface FriendshipStats {
  totalFriends: number
  pendingReceived: number
  pendingSent: number
}

/**
 * Friend request direction
 */
export type FriendRequestDirection = 'sent' | 'received'

// =====================================================
// PERMISSION TYPES
// =====================================================

/**
 * Friend request permissions
 */
export interface FriendRequestPermissions {
  canAccept: boolean
  canReject: boolean
  canCancel: boolean
  canResend: boolean
}

// =====================================================
// NOTIFICATION TYPES
// =====================================================

/**
 * Friend notification type
 */
export type FriendNotificationType =
  | 'request_received'
  | 'request_accepted'
  | 'request_rejected'
  | 'friend_joined'

/**
 * Friend notification
 */
export interface FriendNotification {
  id: string
  type: FriendNotificationType
  fromUser: Pick<User, 'id' | 'name' | 'avatar_url'>
  message: string
  createdAt: string
  read: boolean
}

// =====================================================
// RE-EXPORTS
// =====================================================

export type {
  FriendRequest,
  FriendRequestInsert,
  FriendRequestUpdate,
  FriendRequestStatus,
}
