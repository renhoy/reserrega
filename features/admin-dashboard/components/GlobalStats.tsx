/**
 * =====================================================
 * ADMIN DASHBOARD - GlobalStats Component
 * =====================================================
 * Dashboard with global system statistics
 * =====================================================
 */

'use client'

import { useMemo } from 'react'
import {
  Building2,
  Users,
  Store,
  PackageCheck,
  Euro,
  Gift,
  TrendingUp,
  UserPlus,
} from 'lucide-react'
import { StatsCard, StatsCardSkeleton } from './StatsCard'
import { GlobalStats as GlobalStatsType } from '../types/admin.types'

// =====================================================
// TYPES
// =====================================================

interface GlobalStatsProps {
  stats: GlobalStatsType | null
  loading?: boolean
}

// =====================================================
// COMPONENT
// =====================================================

export function GlobalStats({ stats, loading = false }: GlobalStatsProps) {
  // Calculate trends
  const trends = useMemo(() => {
    if (!stats) return {}

    return {
      companies: stats.new_companies_this_month > 0 ? 'up' : 'stable',
      users: stats.new_users_this_month > 0 ? 'up' : 'stable',
      revenue: stats.revenue_this_month > 0 ? 'up' : 'stable',
      gifts: stats.gifts_this_month > 0 ? 'up' : 'stable',
    } as const
  }, [stats])

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Métricas Principales
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Empresas Activas"
            value={stats.active_companies}
            change={stats.new_companies_this_month}
            trend={trends.companies}
            icon={Building2}
            color="pink"
            description={`${stats.total_companies} total, ${stats.inactive_companies} inactivas`}
          />
          <StatsCard
            title="Usuarios Totales"
            value={stats.total_users}
            change={stats.new_users_this_month}
            trend={trends.users}
            icon={Users}
            color="purple"
            description={`${stats.new_users_this_month} nuevos este mes`}
          />
          <StatsCard
            title="Tiendas Activas"
            value={stats.active_stores}
            icon={Store}
            color="blue"
            description={`${stats.total_stores} total`}
          />
          <StatsCard
            title="Reservas Activas"
            value={stats.active_reservations}
            icon={PackageCheck}
            color="green"
            description={`${stats.total_reservations} total, ${stats.completed_reservations} completadas`}
          />
        </div>
      </div>

      {/* Financial Stats */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Métricas Financieras
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Ingresos Totales"
            value={stats.total_revenue}
            icon={Euro}
            color="yellow"
            format="currency"
            description="Histórico"
          />
          <StatsCard
            title="Ingresos Este Mes"
            value={stats.revenue_this_month}
            trend={trends.revenue}
            icon={TrendingUp}
            color="green"
            format="currency"
          />
          <StatsCard
            title="Ingresos Este Año"
            value={stats.revenue_this_year}
            icon={Euro}
            color="pink"
            format="currency"
          />
          <StatsCard
            title="Tasa de Crecimiento"
            value={stats.growth_rate}
            trend={stats.growth_rate > 0 ? 'up' : stats.growth_rate < 0 ? 'down' : 'stable'}
            icon={TrendingUp}
            color="purple"
            format="percentage"
            description="vs mes anterior"
          />
        </div>
      </div>

      {/* Activity Stats */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Actividad y Usuarios
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Regalos Totales"
            value={stats.total_gifts}
            change={stats.gifts_this_month}
            trend={trends.gifts}
            icon={Gift}
            color="pink"
            description={`${stats.gifts_this_month} este mes`}
          />
          <StatsCard
            title="Nuevos Usuarios"
            value={stats.new_users_this_month}
            icon={UserPlus}
            color="blue"
            description="Este mes"
          />
          <StatsCard
            title="Superadmins"
            value={stats.users_by_role.superadmin}
            icon={Users}
            color="red"
            description="Rol: Superadmin"
          />
          <StatsCard
            title="Comerciales"
            value={stats.users_by_role.comercial}
            icon={Users}
            color="purple"
            description="Rol: Comercial"
          />
        </div>
      </div>

      {/* User Distribution */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Distribución de Usuarios por Rol
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Usuarios"
            value={stats.users_by_role.usuario}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Admins"
            value={stats.users_by_role.admin}
            icon={Users}
            color="yellow"
          />
          <StatsCard
            title="Reservas Canceladas"
            value={stats.cancelled_reservations}
            icon={PackageCheck}
            color="red"
          />
          <StatsCard
            title="Reservas Completadas"
            value={stats.completed_reservations}
            icon={PackageCheck}
            color="green"
          />
        </div>
      </div>
    </div>
  )
}

// =====================================================
// SUMMARY VARIANT
// =====================================================

interface GlobalStatsSummaryProps {
  stats: GlobalStatsType | null
  loading?: boolean
}

export function GlobalStatsSummary({ stats, loading = false }: GlobalStatsSummaryProps) {
  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Empresas"
        value={stats.active_companies}
        icon={Building2}
        color="pink"
        description={`${stats.total_companies} total`}
      />
      <StatsCard
        title="Usuarios"
        value={stats.total_users}
        icon={Users}
        color="purple"
        description={`${stats.new_users_this_month} nuevos este mes`}
      />
      <StatsCard
        title="Ingresos Este Mes"
        value={stats.revenue_this_month}
        icon={Euro}
        color="green"
        format="currency"
      />
      <StatsCard
        title="Reservas Activas"
        value={stats.active_reservations}
        icon={PackageCheck}
        color="blue"
        description={`${stats.completed_reservations} completadas`}
      />
    </div>
  )
}
