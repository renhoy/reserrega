/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Utility Functions
 * =====================================================
 * Helper functions for friends network operations
 * =====================================================
 */

import { addDays, isPast, parseISO } from 'date-fns'
import type {
  FriendRequestStatus,
  InvitationTokenPayload,
  InvitationValidationResult,
  FriendRequestPermissions,
  FriendRequestDirection,
} from '../types/friends.types'

// =====================================================
// CONSTANTS
// =====================================================

/**
 * Invitation token expiration in days
 */
export const INVITATION_EXPIRATION_DAYS = 7

/**
 * Base URL for invitation links (will be replaced with actual domain)
 */
export const getInvitationBaseURL = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/register`
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3434/register'
}

// =====================================================
// STATUS FORMATTING
// =====================================================

/**
 * Format friend request status to human-readable Spanish text
 *
 * @param status - Friend request status
 * @returns Formatted status text
 *
 * @example
 * ```ts
 * formatFriendRequestStatus('pending') // 'Pendiente'
 * formatFriendRequestStatus('accepted') // 'Aceptada'
 * ```
 */
export function formatFriendRequestStatus(status: FriendRequestStatus): string {
  const statusMap: Record<FriendRequestStatus, string> = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    rejected: 'Rechazada',
  }

  return statusMap[status] || status
}

/**
 * Get status color for UI display
 *
 * @param status - Friend request status
 * @returns Tailwind color class
 */
export function getStatusColor(status: FriendRequestStatus): string {
  const colorMap: Record<FriendRequestStatus, string> = {
    pending: 'amber',
    accepted: 'lime',
    rejected: 'gray',
  }

  return colorMap[status] || 'gray'
}

/**
 * Get status icon name
 *
 * @param status - Friend request status
 * @returns Lucide icon name
 */
export function getStatusIcon(status: FriendRequestStatus): string {
  const iconMap: Record<FriendRequestStatus, string> = {
    pending: 'Clock',
    accepted: 'Check',
    rejected: 'X',
  }

  return iconMap[status] || 'HelpCircle'
}

// =====================================================
// INVITATION TOKEN MANAGEMENT
// =====================================================

/**
 * Generate a unique invitation token
 *
 * @param senderId - User ID of the sender
 * @param email - Email address to invite
 * @returns UUID v4 token
 *
 * @example
 * ```ts
 * const token = generateInvitationToken('user-123', 'friend@example.com')
 * ```
 */
export function generateInvitationToken(senderId: string, email: string): string {
  // Use crypto.randomUUID() for secure token generation
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for environments without crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Create invitation token payload
 *
 * @param senderId - User ID of the sender
 * @param email - Email address to invite
 * @returns Token payload object
 */
export function createInvitationPayload(
  senderId: string,
  email: string
): InvitationTokenPayload {
  const now = Date.now()
  const expiresAt = addDays(new Date(now), INVITATION_EXPIRATION_DAYS).getTime()

  return {
    senderId,
    email,
    createdAt: now,
    expiresAt,
  }
}

/**
 * Generate invitation link
 *
 * @param token - Invitation token
 * @returns Full invitation URL
 *
 * @example
 * ```ts
 * const link = generateInvitationLink('abc-123-xyz')
 * // 'https://example.com/register?token=abc-123-xyz'
 * ```
 */
export function generateInvitationLink(token: string): string {
  const baseURL = getInvitationBaseURL()
  return `${baseURL}?token=${token}`
}

/**
 * Validate invitation token
 *
 * @param token - Token to validate
 * @param payload - Token payload from database
 * @returns Validation result
 *
 * @example
 * ```ts
 * const result = validateInvitationToken('abc-123', payload)
 * if (result.valid) {
 *   // Token is valid
 * }
 * ```
 */
export function validateInvitationToken(
  token: string,
  payload: InvitationTokenPayload | null
): InvitationValidationResult {
  if (!token) {
    return { valid: false, reason: 'Token no proporcionado' }
  }

  if (!payload) {
    return { valid: false, reason: 'Token inválido o no encontrado' }
  }

  // Check expiration
  const now = Date.now()
  if (now > payload.expiresAt) {
    return { valid: false, reason: 'Token expirado' }
  }

  return {
    valid: true,
    senderId: payload.senderId,
    email: payload.email,
  }
}

/**
 * Check if invitation is expired
 *
 * @param expiresAt - Expiration timestamp or ISO string
 * @returns True if expired
 */
export function isInvitationExpired(expiresAt: number | string): boolean {
  const expirationDate = typeof expiresAt === 'string' ? parseISO(expiresAt) : new Date(expiresAt)
  return isPast(expirationDate)
}

// =====================================================
// EMAIL VALIDATION
// =====================================================

/**
 * Validate email format
 *
 * @param email - Email address to validate
 * @returns True if valid
 *
 * @example
 * ```ts
 * validateEmail('user@example.com') // true
 * validateEmail('invalid-email') // false
 * ```
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Normalize email (lowercase, trim)
 *
 * @param email - Email to normalize
 * @returns Normalized email
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// =====================================================
// PERMISSIONS
// =====================================================

/**
 * Get permissions for a friend request
 *
 * @param requestId - Friend request ID
 * @param currentUserId - Current user's ID
 * @param senderId - Request sender's ID
 * @param recipientId - Request recipient's ID
 * @param status - Request status
 * @returns Permissions object
 *
 * @example
 * ```ts
 * const perms = getFriendRequestPermissions(
 *   'req-123',
 *   'user-1',
 *   'user-2',
 *   'user-1',
 *   'pending'
 * )
 * if (perms.canAccept) {
 *   // Show accept button
 * }
 * ```
 */
export function getFriendRequestPermissions(
  requestId: string,
  currentUserId: string,
  senderId: string,
  recipientId: string,
  status: FriendRequestStatus
): FriendRequestPermissions {
  const isRecipient = currentUserId === recipientId
  const isSender = currentUserId === senderId
  const isPending = status === 'pending'

  return {
    canAccept: isRecipient && isPending,
    canReject: isRecipient && isPending,
    canCancel: isSender && isPending,
    canResend: isSender && status === 'rejected',
  }
}

// =====================================================
// FRIENDSHIP CHECKS
// =====================================================

/**
 * Check if two users are friends
 *
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @param friendRequests - List of friend requests
 * @returns True if friends
 */
export function areFriends(
  userId1: string,
  userId2: string,
  friendRequests: Array<{ sender_id: string; recipient_id: string; status: FriendRequestStatus }>
): boolean {
  return friendRequests.some(
    (req) =>
      req.status === 'accepted' &&
      ((req.sender_id === userId1 && req.recipient_id === userId2) ||
        (req.sender_id === userId2 && req.recipient_id === userId1))
  )
}

/**
 * Check if there's a pending request between users
 *
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @param friendRequests - List of friend requests
 * @returns Request direction if pending, null otherwise
 */
export function hasPendingRequest(
  userId1: string,
  userId2: string,
  friendRequests: Array<{ sender_id: string; recipient_id: string; status: FriendRequestStatus }>
): FriendRequestDirection | null {
  const pendingRequest = friendRequests.find(
    (req) =>
      req.status === 'pending' &&
      ((req.sender_id === userId1 && req.recipient_id === userId2) ||
        (req.sender_id === userId2 && req.recipient_id === userId1))
  )

  if (!pendingRequest) return null

  return pendingRequest.sender_id === userId1 ? 'sent' : 'received'
}

// =====================================================
// FORMATTING
// =====================================================

/**
 * Format friend count
 *
 * @param count - Number of friends
 * @returns Formatted text
 *
 * @example
 * ```ts
 * formatFriendCount(0) // 'Sin amigos'
 * formatFriendCount(1) // '1 amigo'
 * formatFriendCount(5) // '5 amigos'
 * ```
 */
export function formatFriendCount(count: number): string {
  if (count === 0) return 'Sin amigos'
  if (count === 1) return '1 amigo'
  return `${count} amigos`
}

/**
 * Get user's full name
 *
 * @param name - First name
 * @param lastName - Last name (optional)
 * @returns Full name
 */
export function getFullName(name: string, lastName?: string | null): string {
  if (!lastName) return name
  return `${name} ${lastName}`
}

/**
 * Get user initials
 *
 * @param name - First name
 * @param lastName - Last name (optional)
 * @returns Initials (up to 2 characters)
 *
 * @example
 * ```ts
 * getInitials('John', 'Doe') // 'JD'
 * getInitials('John') // 'J'
 * ```
 */
export function getInitials(name: string, lastName?: string | null): string {
  const firstInitial = name.charAt(0).toUpperCase()
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

// =====================================================
// FILTERING & SORTING
// =====================================================

/**
 * Filter friend requests by status
 *
 * @param requests - Array of friend requests
 * @param status - Status to filter by
 * @returns Filtered requests
 */
export function filterByStatus<T extends { status: FriendRequestStatus }>(
  requests: T[],
  status: FriendRequestStatus | FriendRequestStatus[]
): T[] {
  const statuses = Array.isArray(status) ? status : [status]
  return requests.filter((req) => statuses.includes(req.status))
}

/**
 * Sort friend requests by creation date
 *
 * @param requests - Array of friend requests
 * @param order - Sort order
 * @returns Sorted requests
 */
export function sortByDate<T extends { created_at: string }>(
  requests: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...requests].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return order === 'asc' ? dateA - dateB : dateB - dateA
  })
}

// =====================================================
// SEARCH
// =====================================================

/**
 * Search users by name or email
 *
 * @param users - Array of users
 * @param query - Search query
 * @returns Filtered users
 */
export function searchUsers<T extends { name: string; email: string }>(
  users: T[],
  query: string
): T[] {
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery) return users

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery)
  )
}
