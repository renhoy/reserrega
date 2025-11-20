'use client'

/**
 * =====================================================
 * STORE PANEL - Main Page
 * =====================================================
 * Panel principal para comerciales/dependientas
 * =====================================================
 */

import { useState, useEffect } from 'react'
import { Store, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/common/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { SessionScanner } from '@/features/store-panel/components/SessionScanner'
import { ProductLinker } from '@/features/store-panel/components/ProductLinker'
import { ActiveSessionIndicator } from '@/features/store-panel/components/ActiveSessionIndicator'
import { ActiveReservations } from '@/features/store-panel/components/ActiveReservations'
import { DeliveryManager } from '@/features/store-panel/components/DeliveryManager'
import { StoreStats } from '@/features/store-panel/components/StoreStats'
import { ReservationFilters } from '@/features/store-panel/components/ReservationFilters'
import { useStoreSession } from '@/features/store-panel/hooks/use-store-session'
import { useStoreReservations } from '@/features/store-panel/hooks/use-store-reservations'
import { useStoreStats } from '@/features/store-panel/hooks/use-store-stats'
import type { StoreReservation } from '@/features/store-panel/types/store.types'

// TODO: Get from user's store assignment
// For now, we'll use a hardcoded store ID
const STORE_ID = 1
const STORE_NAME = 'Tienda Demo'

export default function StorePanelPage() {
  const [activeTab, setActiveTab] = useState<'session' | 'reservations' | 'stats'>('session')
  const [selectedReservation, setSelectedReservation] = useState<StoreReservation | null>(null)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)

  // Session management
  const {
    session,
    isLoading: isSessionLoading,
    isEnding,
    startSession,
    addProduct,
    removeProduct,
    endSession,
  } = useStoreSession(STORE_ID)

  // Reservations management
  const {
    reservations,
    filters,
    setFilters,
    clearFilters,
    stats: reservationStats,
    isLoading: isReservationsLoading,
    isUpdating,
    updateStatus,
    reload: reloadReservations,
  } = useStoreReservations(STORE_ID)

  // Store statistics
  const { stats, isLoading: isStatsLoading, refresh: refreshStats } = useStoreStats({
    storeId: STORE_ID,
    storeName: STORE_NAME,
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
  })

  /**
   * Handle reservation click - open delivery manager
   */
  const handleReservationClick = (reservation: StoreReservation) => {
    setSelectedReservation(reservation)
    setIsDeliveryDialogOpen(true)
  }

  /**
   * Handle delivery status update
   */
  const handleUpdateDelivery = async (reservationId: string, status: any) => {
    await updateStatus(reservationId, status)
    setIsDeliveryDialogOpen(false)
    setSelectedReservation(null)
    await refreshStats()
  }

  /**
   * Reload data after session ends
   */
  useEffect(() => {
    if (!session) {
      reloadReservations()
      refreshStats()
    }
  }, [session, reloadReservations, refreshStats])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Store className="h-8 w-8" />
          Panel de Tienda
        </h1>
        <p className="text-muted-foreground">
          Gestiona sesiones de compra, reservas y entregas de tu tienda
        </p>
      </div>

      {/* Active Session Indicator */}
      {session && (
        <ActiveSessionIndicator session={session} onEndSession={endSession} isEnding={isEnding} />
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="session">Sesión de Compra</TabsTrigger>
          <TabsTrigger value="reservations">
            Reservas ({reservationStats.filtered})
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estadísticas
          </TabsTrigger>
        </TabsList>

        {/* Session Tab */}
        <TabsContent value="session" className="space-y-6">
          {!session ? (
            <SessionScanner
              onSessionStart={startSession}
              isLoading={isSessionLoading}
              storeId={STORE_ID.toString()}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <ProductLinker
                sessionId={session.id}
                userId={session.userId}
                userName={session.user.name}
                products={session.products}
                onProductAdd={addProduct}
                onProductRemove={removeProduct}
                isLoading={isSessionLoading}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Información de Sesión</CardTitle>
                  <CardDescription>Detalles de la compra actual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Usuario</p>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="font-medium capitalize">{session.state}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">ID de Sesión</p>
                    <p className="font-mono text-xs">{session.id}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-6">
          {/* Filters */}
          <ReservationFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />

          {/* Stats Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reservationStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reservationStats.active}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{reservationStats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{reservationStats.delivered}</div>
              </CardContent>
            </Card>
          </div>

          {/* Reservations List */}
          <ActiveReservations
            reservations={reservations}
            onReservationClick={handleReservationClick}
            isLoading={isReservationsLoading}
          />
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <StoreStats stats={stats} isLoading={isStatsLoading} />
        </TabsContent>
      </Tabs>

      {/* Delivery Manager Dialog */}
      <DeliveryManager
        reservation={selectedReservation}
        isOpen={isDeliveryDialogOpen}
        onClose={() => {
          setIsDeliveryDialogOpen(false)
          setSelectedReservation(null)
        }}
        onUpdateStatus={handleUpdateDelivery}
        isUpdating={isUpdating}
      />
    </div>
  )
}
