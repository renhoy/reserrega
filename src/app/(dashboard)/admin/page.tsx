/**
 * =====================================================
 * ADMIN DASHBOARD - Main Page
 * =====================================================
 * Admin dashboard with global statistics summary
 * =====================================================
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, Users, Settings, ChevronRight } from 'lucide-react'
import { requireRole } from '@/shared/auth/server'
import { getGlobalStats } from '@/features/admin-dashboard/actions/admin.actions'
import { GlobalStatsSummary } from '@/features/admin-dashboard/components/GlobalStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Button } from '@/shared/common/components/ui/button'

export const metadata: Metadata = {
  title: 'Panel de Administración | Reserrega',
  description: 'Panel de administración del sistema',
}

// =====================================================
// SERVER COMPONENT
// =====================================================

export default async function AdminDashboard Page() {
  await requireRole('superadmin')

  const statsResult = await getGlobalStats()
  const stats = statsResult.success ? statsResult.data : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Gestiona empresas, comerciales y configuración del sistema
        </p>
      </div>

      {/* Global Stats Summary */}
      <Suspense fallback={<div>Cargando estadísticas...</div>}>
        <GlobalStatsSummary stats={stats} />
      </Suspense>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/companies">
            <Card className="transition-colors hover:bg-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gestionar Empresas
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Crear, editar y eliminar empresas del sistema
                </CardDescription>
                <Button variant="ghost" size="sm" className="mt-2 p-0">
                  Ver empresas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/comercials">
            <Card className="transition-colors hover:bg-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gestionar Comerciales
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Crear y gestionar usuarios comerciales
                </CardDescription>
                <Button variant="ghost" size="sm" className="mt-2 p-0">
                  Ver comerciales
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/config">
            <Card className="transition-colors hover:bg-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Configuración
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ajustar configuración global del sistema
                </CardDescription>
                <Button variant="ghost" size="sm" className="mt-2 p-0">
                  Ver configuración
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
