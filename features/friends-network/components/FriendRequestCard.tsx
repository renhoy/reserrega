/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Friend Request Card
 * =====================================================
 * Card component for displaying friend requests
 * =====================================================
 */

'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, X, UserX, Clock, Mail } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import type { FriendRequestWithUsers } from '../types/friends.types'
import {
  formatFriendRequestStatus,
  getStatusColor,
  getFullName,
  getInitials,
  getFriendRequestPermissions,
} from '../lib/friends-utils'

// =====================================================
// TYPES
// =====================================================

interface FriendRequestCardProps {
  request: FriendRequestWithUsers
  currentUserId: string
  direction: 'sent' | 'received'
  onAccept?: (requestId: string) => Promise<void>
  onReject?: (requestId: string) => Promise<void>
  onCancel?: (requestId: string) => Promise<void>
  isLoading?: boolean
}

// =====================================================
// COMPONENT
// =====================================================

export function FriendRequestCard({
  request,
  currentUserId,
  direction,
  onAccept,
  onReject,
  onCancel,
  isLoading = false,
}: FriendRequestCardProps) {
  const [actionLoading, setActionLoading] = useState<'accept' | 'reject' | 'cancel' | null>(null)

  // Determine which user to display
  const displayUser = direction === 'received' ? request.sender : request.recipient

  // Get permissions
  const permissions = getFriendRequestPermissions(
    request.id,
    currentUserId,
    request.sender_id,
    request.recipient_id,
    request.status
  )

  // Format status
  const statusText = formatFriendRequestStatus(request.status)
  const statusColor = getStatusColor(request.status)

  // Format date
  const timeAgo = formatDistanceToNow(new Date(request.created_at), {
    addSuffix: true,
    locale: es,
  })

  // Handle actions
  const handleAccept = async () => {
    if (!onAccept) return
    setActionLoading('accept')
    try {
      await onAccept(request.id)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!onReject) return
    setActionLoading('reject')
    try {
      await onReject(request.id)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async () => {
    if (!onCancel) return
    setActionLoading('cancel')
    try {
      await onCancel(request.id)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="h-14 w-14 border-2 border-pink-100">
          <AvatarImage src={displayUser.avatar_url || undefined} alt={displayUser.name} />
          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-semibold">
            {getInitials(displayUser.name, displayUser.last_name)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Status */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate">
                {getFullName(displayUser.name, displayUser.last_name)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-sm text-gray-500 truncate">{displayUser.email}</p>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant={request.status === 'accepted' ? 'default' : 'secondary'}
              className={
                request.status === 'accepted'
                  ? 'bg-pink-100 text-pink-700 hover:bg-pink-100'
                  : request.status === 'pending'
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
              }
            >
              {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
              {request.status === 'accepted' && <Check className="h-3 w-3 mr-1" />}
              {request.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
              {statusText}
            </Badge>
          </div>

          {/* Direction and Time */}
          <div className="text-sm text-gray-500 mb-4">
            {direction === 'received' ? (
              <span>Te envió una solicitud de amistad {timeAgo}</span>
            ) : (
              <span>Enviaste una solicitud de amistad {timeAgo}</span>
            )}
          </div>

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="flex flex-wrap gap-2">
              {/* Accept Button (for received requests) */}
              {permissions.canAccept && onAccept && (
                <Button
                  onClick={handleAccept}
                  disabled={isLoading || actionLoading !== null}
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                >
                  {actionLoading === 'accept' ? (
                    <>Aceptando...</>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1.5" />
                      Aceptar
                    </>
                  )}
                </Button>
              )}

              {/* Reject Button (for received requests) */}
              {permissions.canReject && onReject && (
                <Button
                  onClick={handleReject}
                  disabled={isLoading || actionLoading !== null}
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  {actionLoading === 'reject' ? (
                    <>Rechazando...</>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1.5" />
                      Rechazar
                    </>
                  )}
                </Button>
              )}

              {/* Cancel Button (for sent requests) */}
              {permissions.canCancel && onCancel && (
                <Button
                  onClick={handleCancel}
                  disabled={isLoading || actionLoading !== null}
                  size="sm"
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  {actionLoading === 'cancel' ? (
                    <>Cancelando...</>
                  ) : (
                    <>
                      <UserX className="h-4 w-4 mr-1.5" />
                      Cancelar solicitud
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Accepted Message */}
          {request.status === 'accepted' && (
            <div className="flex items-center gap-2 text-sm text-pink-600 bg-pink-50 px-3 py-2 rounded-lg">
              <Check className="h-4 w-4" />
              <span className="font-medium">
                {direction === 'received'
                  ? 'Aceptaste la solicitud'
                  : `${displayUser.name} aceptó tu solicitud`}
              </span>
            </div>
          )}

          {/* Rejected Message */}
          {request.status === 'rejected' && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <X className="h-4 w-4" />
              <span>
                {direction === 'received'
                  ? 'Rechazaste la solicitud'
                  : 'La solicitud fue rechazada'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
