/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Friends List
 * =====================================================
 * List component for displaying all friends
 * =====================================================
 */

'use client'

import { useState, useMemo } from 'react'
import { Users, Search, UserPlus, Filter } from 'lucide-react'
import { FriendCard } from './FriendCard'
import { Input } from '@/shared/common/components/ui/input'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import type { FriendInfo } from '../types/friends.types'
import { searchUsers, formatFriendCount } from '../lib/friends-utils'

// =====================================================
// TYPES
// =====================================================

interface FriendsListProps {
  friends: FriendInfo[]
  onViewWishlist?: (friendId: string) => void
  onRemoveFriend?: (friendId: string) => Promise<void>
  onAddFriend?: () => void
  isLoading?: boolean
}

type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'oldest'

// =====================================================
// COMPONENT
// =====================================================

export function FriendsList({
  friends,
  onViewWishlist,
  onRemoveFriend,
  onAddFriend,
  isLoading = false,
}: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')

  // Filter and sort friends
  const filteredAndSortedFriends = useMemo(() => {
    // First, filter by search query
    let result = searchQuery
      ? searchUsers(friends, searchQuery)
      : friends

    // Then, sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'es')
        case 'name-desc':
          return b.name.localeCompare(a.name, 'es')
        case 'recent':
          return new Date(b.friendsSince).getTime() - new Date(a.friendsSince).getTime()
        case 'oldest':
          return new Date(a.friendsSince).getTime() - new Date(b.friendsSince).getTime()
        default:
          return 0
      }
    })

    return result
  }, [friends, searchQuery, sortBy])

  const handleSortChange = () => {
    const sortOptions: SortOption[] = ['name-asc', 'name-desc', 'recent', 'oldest']
    const currentIndex = sortOptions.indexOf(sortBy)
    const nextIndex = (currentIndex + 1) % sortOptions.length
    setSortBy(sortOptions[nextIndex])
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Nombre A-Z'
      case 'name-desc':
        return 'Nombre Z-A'
      case 'recent':
        return 'Más recientes'
      case 'oldest':
        return 'Más antiguos'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Amigos</h2>
            <p className="text-gray-500">{formatFriendCount(friends.length)}</p>
          </div>
        </div>

        {onAddFriend && (
          <Button
            onClick={onAddFriend}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar amigos
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      {friends.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar amigos por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort Button */}
          <Button
            onClick={handleSortChange}
            variant="outline"
            className="sm:w-auto border-gray-300"
          >
            <Filter className="h-4 w-4 mr-2" />
            {getSortLabel()}
          </Button>
        </div>
      )}

      {/* Results Count */}
      {searchQuery && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredAndSortedFriends.length} resultado{filteredAndSortedFriends.length !== 1 ? 's' : ''}
          </Badge>
          {filteredAndSortedFriends.length < friends.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-pink-600 hover:text-pink-700"
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}

      {/* Friends Grid */}
      {friends.length === 0 ? (
        <EmptyState onAddFriend={onAddFriend} />
      ) : filteredAndSortedFriends.length === 0 ? (
        <NoResultsState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onViewWishlist={onViewWishlist}
              onRemoveFriend={onRemoveFriend}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span>Cargando amigos...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// EMPTY STATE COMPONENT
// =====================================================

interface EmptyStateProps {
  onAddFriend?: () => void
}

function EmptyState({ onAddFriend }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border-2 border-dashed border-pink-200">
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/10">
        <Users className="h-10 w-10 text-pink-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes amigos</h3>
      <p className="text-gray-600 max-w-sm mx-auto mb-6">
        Empieza a construir tu red de amigos para compartir wishlists y recibir los regalos
        perfectos.
      </p>
      {onAddFriend && (
        <Button
          onClick={onAddFriend}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar mi primer amigo
        </Button>
      )}
    </div>
  )
}

// =====================================================
// NO RESULTS STATE COMPONENT
// =====================================================

interface NoResultsStateProps {
  searchQuery: string
  onClear: () => void
}

function NoResultsState({ searchQuery, onClear }: NoResultsStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-4">
        No hay amigos que coincidan con "<span className="font-medium">{searchQuery}</span>"
      </p>
      <Button onClick={onClear} variant="outline">
        Limpiar búsqueda
      </Button>
    </div>
  )
}
