'use client'

/**
 * =====================================================
 * STORE-PANEL - StoreStats Component
 * =====================================================
 * Dashboard con estadísticas de la tienda
 * =====================================================
 */

import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Euro,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import type { StoreStats } from '../types/store.types'
import { formatPrice } from '../lib/store-utils'

interface StoreStatsProps {
  stats: StoreStats
  isLoading?: boolean
}

export function StoreStats({ stats, isLoading = false }: StoreStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Reservas',
      value: stats.totalReservations.toString(),
      icon: Package,
      description: 'Todas las reservas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Reservas Activas',
      value: stats.activeReservations.toString(),
      icon: Clock,
      description: 'Sin expirar',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Entregas Pendientes',
      value: stats.pendingDeliveries.toString(),
      icon: AlertCircle,
      description: 'Por preparar',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Entregadas Hoy',
      value: stats.deliveredToday.toString(),
      icon: CheckCircle,
      description: 'Completadas hoy',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Ingresos Mes',
      value: formatPrice(stats.monthlyRevenue),
      icon: Euro,
      description: 'Este mes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Reservas Expiradas',
      value: stats.expiredReservations.toString(),
      icon: AlertCircle,
      description: 'Caducadas',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Productos Escaneados',
      value: stats.totalProductsScanned.toString(),
      icon: ShoppingBag,
      description: 'Total histórico',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Promedio / Sesión',
      value: stats.avgProductsPerSession.toString(),
      icon: BarChart3,
      description: 'Productos por sesión',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Store Name */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{stats.storeName}</h2>
          <p className="text-sm text-muted-foreground">
            ID: <span className="font-mono">{stats.storeId}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Estadísticas</p>
          <p className="text-xs text-muted-foreground">Actualizado ahora</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasa de Actividad</span>
              <span className="font-semibold">
                {stats.totalReservations > 0
                  ? Math.round((stats.activeReservations / stats.totalReservations) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasa de Expiración</span>
              <span className="font-semibold">
                {stats.totalReservations > 0
                  ? Math.round((stats.expiredReservations / stats.totalReservations) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pendientes de Entrega</span>
              <span className="font-semibold">{stats.pendingDeliveries}</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rendimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Productos</span>
              <span className="font-semibold">{stats.totalProductsScanned}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Promedio/Sesión</span>
              <span className="font-semibold">{stats.avgProductsPerSession}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ingresos del Mes</span>
              <span className="font-semibold text-green-600">
                {formatPrice(stats.monthlyRevenue)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
