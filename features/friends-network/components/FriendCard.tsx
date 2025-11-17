/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Friend Card
 * =====================================================
 * Card component for displaying individual friends
 * =====================================================
 */

'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Calendar, UserMinus, Eye, MoreVertical } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/common/components/ui/dropdown-menu'
import type { FriendInfo } from '../types/friends.types'
import { getFullName, getInitials } from '../lib/friends-utils'

// =====================================================
// TYPES
// =====================================================

interface FriendCardProps {
  friend: FriendInfo
  onViewWishlist?: (friendId: string) => void
  onRemoveFriend?: (friendId: string) => Promise<void>
  showActions?: boolean
}

// =====================================================
// COMPONENT
// =====================================================

export function FriendCard({
  friend,
  onViewWishlist,
  onRemoveFriend,
  showActions = true,
}: FriendCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  // Format friendship duration
  const friendsSince = formatDistanceToNow(new Date(friend.friendsSince), {
    addSuffix: false,
    locale: es,
  })

  // Handle remove friend
  const handleRemove = async () => {
    if (!onRemoveFriend) return

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar a ${friend.name} de tus amigos?`
    )

    if (!confirmed) return

    setIsRemoving(true)
    try {
      await onRemoveFriend(friend.id)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="h-16 w-16 border-2 border-pink-100 ring-2 ring-pink-50">
          <AvatarImage src={friend.avatar_url || undefined} alt={friend.name} />
          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-semibold text-lg">
            {getInitials(friend.name, friend.last_name)}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Actions */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate">
                {getFullName(friend.name, friend.last_name)}
              </h3>
            </div>

            {/* Actions Dropdown */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onViewWishlist && (
                    <DropdownMenuItem
                      onClick={() => onViewWishlist(friend.id)}
                      className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver wishlist
                    </DropdownMenuItem>
                  )}
                  {onRemoveFriend && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        {isRemoving ? 'Eliminando...' : 'Eliminar amigo'}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-500 truncate">{friend.email}</p>
          </div>

          {/* Friendship Duration */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg w-fit">
            <Calendar className="h-4 w-4 text-pink-500" />
            <span>
              Amigos desde hace <span className="font-medium text-gray-700">{friendsSince}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (onViewWishlist || onRemoveFriend) && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          {onViewWishlist && (
            <Button
              onClick={() => onViewWishlist(friend.id)}
              variant="outline"
              size="sm"
              className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Ver wishlist
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
