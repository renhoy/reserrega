/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - User Search Bar
 * =====================================================
 * Component for searching and adding users as friends
 * =====================================================
 */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, UserPlus, Check, Clock, Loader2, X } from 'lucide-react'
import { Input } from '@/shared/common/components/ui/input'
import { Button } from '@/shared/common/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import { Badge } from '@/shared/common/components/ui/badge'
import type { UserSearchResult } from '../types/friends.types'
import { getFullName, getInitials } from '../lib/friends-utils'

// =====================================================
// UTILITY: Custom Debounce
// =====================================================

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// =====================================================
// TYPES
// =====================================================

interface UserSearchBarProps {
  onSearch: (query: string) => Promise<UserSearchResult[]>
  onSendRequest: (userId: string) => Promise<void>
  placeholder?: string
  minSearchLength?: number
  debounceMs?: number
}

// =====================================================
// COMPONENT
// =====================================================

export function UserSearchBar({
  onSearch,
  onSendRequest,
  placeholder = 'Buscar usuarios por nombre o email...',
  minSearchLength = 2,
  debounceMs = 300,
}: UserSearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [sendingRequestTo, setSendingRequestTo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < minSearchLength) {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      setError(null)

      try {
        const searchResults = await onSearch(searchQuery)
        setResults(searchResults)
        setShowResults(true)
      } catch (err) {
        setError('Error al buscar usuarios. Intenta de nuevo.')
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, debounceMs),
    [onSearch, minSearchLength, debounceMs]
  )

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value)

    if (value.length === 0) {
      setResults([])
      setShowResults(false)
      setError(null)
      return
    }

    if (value.length < minSearchLength) {
      setShowResults(false)
      return
    }

    debouncedSearch(value)
  }

  // Handle send friend request
  const handleSendRequest = async (userId: string) => {
    setSendingRequestTo(userId)
    setError(null)

    try {
      await onSendRequest(userId)
      // Update the result to show as request sent
      setResults((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, hasPendingRequest: true, requestDirection: 'sent' as const }
            : user
        )
      )
    } catch (err) {
      setError('Error al enviar la solicitud. Intenta de nuevo.')
    } finally {
      setSendingRequestTo(null)
    }
  }

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false)
    }

    if (showResults) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showResults])

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= minSearchLength && results.length > 0 && setShowResults(true)}
          className="pl-11 pr-10 h-12 text-base"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-500 animate-spin" />
        )}
        {!isSearching && query && (
          <button
            onClick={() => handleInputChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Hint */}
      {query.length > 0 && query.length < minSearchLength && (
        <p className="text-sm text-gray-500 mt-2 ml-1">
          Escribe al menos {minSearchLength} caracteres para buscar
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-1">
              {results.map((user) => (
                <UserResultItem
                  key={user.id}
                  user={user}
                  onSendRequest={handleSendRequest}
                  isSending={sendingRequestTo === user.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && !isSearching && query.length >= minSearchLength && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-8 z-50">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No se encontraron usuarios</p>
            <p className="text-sm text-gray-500">
              Intenta con otro nombre o email
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// USER RESULT ITEM COMPONENT
// =====================================================

interface UserResultItemProps {
  user: UserSearchResult
  onSendRequest: (userId: string) => Promise<void>
  isSending: boolean
}

function UserResultItem({ user, onSendRequest, isSending }: UserResultItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <Avatar className="h-10 w-10 border border-pink-100">
        <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-sm font-semibold">
          {getInitials(user.name, user.last_name)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {getFullName(user.name, user.last_name)}
        </p>
        <p className="text-sm text-gray-500 truncate">{user.email}</p>
      </div>

      {/* Action/Status */}
      <div>
        {user.isFriend ? (
          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">
            <Check className="h-3 w-3 mr-1" />
            Amigo
          </Badge>
        ) : user.hasPendingRequest ? (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            {user.requestDirection === 'sent' ? 'Enviada' : 'Recibida'}
          </Badge>
        ) : (
          <Button
            onClick={() => onSendRequest(user.id)}
            disabled={isSending}
            size="sm"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1.5" />
                Agregar
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
