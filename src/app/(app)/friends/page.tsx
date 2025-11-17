/**
 * =====================================================
 * FRIENDS PAGE - Main Friends List
 * =====================================================
 * Display all friends with search and management
 * =====================================================
 */

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/shared/auth/server'
import { getFriends } from '@/features/friends-network/actions/friends.actions'
import { FriendsPageClient } from './FriendsPageClient'
import { Button } from '@/shared/common/components/ui/button'
import { UserPlus, Inbox } from 'lucide-react'

// =====================================================
// METADATA
// =====================================================

export const metadata: Metadata = {
  title: 'Mis Amigos | Reserva y Regala',
  description: 'Gestiona tu red de amigos en Reserva y Regala',
}

// =====================================================
// PAGE
// =====================================================

export default async function FriendsPage() {
  // Verify authentication
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  // Load friends
  const { friends } = await getFriends()

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Amigos</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tu red de amigos y comparte wishlists
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/friends/requests">
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              <Inbox className="h-4 w-4 mr-2" />
              Solicitudes
            </Button>
          </Link>
          <Link href="/friends/invite">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30">
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar amigos
            </Button>
          </Link>
        </div>
      </div>

      {/* Client Component with Friends List */}
      <FriendsPageClient initialFriends={friends} />
    </div>
  )
}
