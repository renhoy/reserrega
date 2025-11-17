/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Friend Requests List
 * =====================================================
 * List component for displaying friend requests
 * =====================================================
 */

'use client'

import { UserPlus, Inbox, Send, Users } from 'lucide-react'
import { FriendRequestCard } from './FriendRequestCard'
import type { FriendRequestWithUsers } from '../types/friends.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/components/ui/tabs'
import { Badge } from '@/shared/common/components/ui/badge'

// =====================================================
// TYPES
// =====================================================

interface FriendRequestsListProps {
  currentUserId: string
  receivedRequests: FriendRequestWithUsers[]
  sentRequests: FriendRequestWithUsers[]
  onAccept?: (requestId: string) => Promise<void>
  onReject?: (requestId: string) => Promise<void>
  onCancel?: (requestId: string) => Promise<void>
  isLoading?: boolean
}

// =====================================================
// COMPONENT
// =====================================================

export function FriendRequestsList({
  currentUserId,
  receivedRequests,
  sentRequests,
  onAccept,
  onReject,
  onCancel,
  isLoading = false,
}: FriendRequestsListProps) {
  // Filter pending requests for counts
  const pendingReceived = receivedRequests.filter((r) => r.status === 'pending')
  const pendingSent = sentRequests.filter((r) => r.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Amistad</h2>
          <p className="text-gray-500">Gestiona tus solicitudes pendientes</p>
        </div>
      </div>

      {/* Tabs for Received/Sent */}
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Recibidas
            {pendingReceived.length > 0 && (
              <Badge className="ml-1 bg-pink-500 hover:bg-pink-600">
                {pendingReceived.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviadas
            {pendingSent.length > 0 && (
              <Badge className="ml-1 bg-purple-500 hover:bg-purple-600">
                {pendingSent.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Received Requests Tab */}
        <TabsContent value="received" className="mt-6">
          {receivedRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No tienes solicitudes recibidas"
              description="Cuando alguien te envíe una solicitud de amistad, aparecerá aquí."
            />
          ) : (
            <div className="space-y-4">
              {/* Pending Requests First */}
              {pendingReceived.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {pendingReceived.length} pendiente{pendingReceived.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {pendingReceived.map((request) => (
                    <FriendRequestCard
                      key={request.id}
                      request={request}
                      currentUserId={currentUserId}
                      direction="received"
                      onAccept={onAccept}
                      onReject={onReject}
                      isLoading={isLoading}
                    />
                  ))}
                </>
              )}

              {/* Processed Requests */}
              {receivedRequests.filter((r) => r.status !== 'pending').length > 0 && (
                <>
                  {pendingReceived.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-4">Procesadas</h3>
                    </div>
                  )}
                  {receivedRequests
                    .filter((r) => r.status !== 'pending')
                    .map((request) => (
                      <FriendRequestCard
                        key={request.id}
                        request={request}
                        currentUserId={currentUserId}
                        direction="received"
                        isLoading={isLoading}
                      />
                    ))}
                </>
              )}
            </div>
          )}
        </TabsContent>

        {/* Sent Requests Tab */}
        <TabsContent value="sent" className="mt-6">
          {sentRequests.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No has enviado solicitudes"
              description="Busca usuarios y envíales una solicitud de amistad para empezar."
            />
          ) : (
            <div className="space-y-4">
              {/* Pending Requests First */}
              {pendingSent.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {pendingSent.length} pendiente{pendingSent.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {pendingSent.map((request) => (
                    <FriendRequestCard
                      key={request.id}
                      request={request}
                      currentUserId={currentUserId}
                      direction="sent"
                      onCancel={onCancel}
                      isLoading={isLoading}
                    />
                  ))}
                </>
              )}

              {/* Processed Requests */}
              {sentRequests.filter((r) => r.status !== 'pending').length > 0 && (
                <>
                  {pendingSent.length > 0 && (
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-4">Procesadas</h3>
                    </div>
                  )}
                  {sentRequests
                    .filter((r) => r.status !== 'pending')
                    .map((request) => (
                      <FriendRequestCard
                        key={request.id}
                        request={request}
                        currentUserId={currentUserId}
                        direction="sent"
                        isLoading={isLoading}
                      />
                    ))}
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      {(receivedRequests.length > 0 || sentRequests.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <StatCard
            icon={Inbox}
            label="Recibidas"
            value={receivedRequests.length}
            color="pink"
          />
          <StatCard icon={Send} label="Enviadas" value={sentRequests.length} color="purple" />
          <StatCard
            icon={Users}
            label="Total Pendientes"
            value={pendingReceived.length + pendingSent.length}
            color="amber"
          />
        </div>
      )}
    </div>
  )
}

// =====================================================
// EMPTY STATE COMPONENT
// =====================================================

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto">{description}</p>
    </div>
  )
}

// =====================================================
// STAT CARD COMPONENT
// =====================================================

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number
  color: 'pink' | 'purple' | 'amber'
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    pink: 'bg-pink-50 text-pink-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
