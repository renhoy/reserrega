/**
 * =====================================================
 * FRIEND REQUESTS PAGE
 * =====================================================
 * Manage received and sent friend requests
 * =====================================================
 */

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/shared/auth/server'
import { getFriendRequests } from '@/features/friends-network/actions/friends.actions'
import { FriendRequestsPageClient } from './FriendRequestsPageClient'
import { Button } from '@/shared/common/components/ui/button'
import { ArrowLeft, UserPlus } from 'lucide-react'

// =====================================================
// METADATA
// =====================================================

export const metadata: Metadata = {
  title: 'Solicitudes de Amistad | Reserva y Regala',
  description: 'Gestiona tus solicitudes de amistad pendientes',
}

// =====================================================
// PAGE
// =====================================================

export default async function FriendRequestsPage() {
  // Verify authentication
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  // Load friend requests
  const { received, sent } = await getFriendRequests()

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/friends">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Amistad</h1>
            <p className="text-gray-500 mt-1">
              Gestiona tus solicitudes pendientes
            </p>
          </div>
        </div>

        <Link href="/friends/invite">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30">
            <UserPlus className="h-4 w-4 mr-2" />
            Invitar amigos
          </Button>
        </Link>
      </div>

      {/* Client Component with Requests */}
      <FriendRequestsPageClient
        initialReceived={received}
        initialSent={sent}
        currentUserId={user.id}
      />
    </div>
  )
}
