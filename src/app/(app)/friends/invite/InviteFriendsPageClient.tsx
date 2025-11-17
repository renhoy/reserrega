/**
 * =====================================================
 * INVITE FRIENDS PAGE CLIENT - Client Component
 * =====================================================
 * Client-side functionality for inviting friends
 * =====================================================
 */

'use client'

import { UserSearchBar } from '@/features/friends-network/components/UserSearchBar'
import { InviteFriendForm } from '@/features/friends-network/components/InviteFriendForm'
import { useUserSearch, useInvitation } from '@/features/friends-network/hooks/use-friends'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/components/ui/tabs'
import { Search, Mail } from 'lucide-react'

// =====================================================
// COMPONENT
// =====================================================

export function InviteFriendsPageClient() {
  const { search, sendRequestToUser, isSearching } = useUserSearch()
  const { sendInvitation, isSending } = useInvitation()

  return (
    <div className="space-y-6">
      {/* Tabs for Search vs Email Invitation */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar usuarios
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invitar por email
          </TabsTrigger>
        </TabsList>

        {/* Search Users Tab */}
        <TabsContent value="search" className="mt-6">
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Busca usuarios registrados
              </h3>
              <p className="text-gray-600">
                Encuentra amigos que ya están en Reserrega buscando por nombre o email.
                Envíales una solicitud de amistad para empezar a compartir wishlists.
              </p>
            </div>

            {/* Search Bar */}
            <UserSearchBar
              onSearch={search}
              onSendRequest={sendRequestToUser}
              placeholder="Buscar por nombre o email..."
            />

            {/* Search Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Consejos de búsqueda</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Busca por nombre completo o parcial</li>
                <li>• Usa el email para resultados exactos</li>
                <li>• Mínimo 2 caracteres para iniciar la búsqueda</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Email Invitation Tab */}
        <TabsContent value="email" className="mt-6">
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Invita amigos por email
              </h3>
              <p className="text-gray-600">
                Envía una invitación a amigos que aún no están en Reserrega. Cuando se
                registren con el link de invitación, automáticamente serán tus amigos.
              </p>
            </div>

            {/* Invitation Form */}
            <InviteFriendForm onSendInvitation={sendInvitation} isLoading={isSending} />

            {/* Invitation Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-900 mb-2">⚠️ Importante</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• El link de invitación expira en 7 días</li>
                <li>• Tu amigo debe registrarse con el email invitado</li>
                <li>• Serán amigos automáticamente al registrarse</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
