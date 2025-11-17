/**
 * =====================================================
 * INVITE FRIENDS PAGE
 * =====================================================
 * Search users and send invitations
 * =====================================================
 */

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/shared/auth/server'
import { InviteFriendsPageClient } from './InviteFriendsPageClient'
import { Button } from '@/shared/common/components/ui/button'
import { ArrowLeft } from 'lucide-react'

// =====================================================
// METADATA
// =====================================================

export const metadata: Metadata = {
  title: 'Invitar Amigos | Reserva y Regala',
  description: 'Busca usuarios y envía invitaciones para agregar amigos',
}

// =====================================================
// PAGE
// =====================================================

export default async function InviteFriendsPage() {
  // Verify authentication
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Header with Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/friends">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invitar Amigos</h1>
          <p className="text-gray-500 mt-1">
            Busca usuarios registrados o invita amigos por email
          </p>
        </div>
      </div>

      {/* Client Component */}
      <InviteFriendsPageClient />
    </div>
  )
}
