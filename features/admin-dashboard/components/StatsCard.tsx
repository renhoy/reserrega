/**
 * =====================================================
 * ADMIN DASHBOARD - StatsCard Component
 * =====================================================
 * Card component for displaying individual statistics
 * =====================================================
 */

'use client'

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { cn } from '@/shared/common/lib/utils'

// =====================================================
// TYPES
// =====================================================

interface StatsCardProps {
  title: string
  value: number | string
  change?: number // Percentage change
  trend?: 'up' | 'down' | 'stable'
  icon: LucideIcon
  color?: 'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'red'
  format?: 'number' | 'currency' | 'percentage'
  description?: string
  loading?: boolean
}

// =====================================================
// CONSTANTS
// =====================================================

const COLOR_VARIANTS = {
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
}

const TREND_COLORS = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-600 dark:text-red-400',
  stable: 'text-gray-600 dark:text-gray-400',
}

// =====================================================
// HELPERS
// =====================================================

function formatValue(value: number | string, format?: 'number' | 'currency' | 'percentage'): string {
  if (typeof value === 'string') return value

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
      }).format(value)
    case 'percentage':
      return `${value.toFixed(1)}%`
    case 'number':
    default:
      return new Intl.NumberFormat('es-ES').format(value)
  }
}

function getTrendIcon(trend?: 'up' | 'down' | 'stable') {
  switch (trend) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    default:
      return Minus
  }
}

// =====================================================
// COMPONENT
// =====================================================

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = 'pink',
  format = 'number',
  description,
  loading = false,
}: StatsCardProps) {
  const TrendIcon = getTrendIcon(trend)
  const formattedValue = formatValue(value, format)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('rounded-lg p-2', COLOR_VARIANTS[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            {change !== undefined && (
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            )}
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedValue}</div>
            {change !== undefined && trend && (
              <div className={cn('flex items-center text-xs', TREND_COLORS[trend])}>
                <TrendIcon className="mr-1 h-3 w-3" />
                <span>{Math.abs(change).toFixed(1)}% vs mes anterior</span>
              </div>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// =====================================================
// SKELETON VARIANT
// =====================================================

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
