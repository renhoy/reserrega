'use client'

/**
 * =====================================================
 * STORE-PANEL - ActiveSessionIndicator Component
 * =====================================================
 * Indicador visual de sesión de compra activa
 * =====================================================
 */

import { useEffect, useState } from 'react'
import { ShoppingBag, Clock, User, Package, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/common/components/ui/card'
import { Button } from '@/shared/common/components/ui/button'
import { Badge } from '@/shared/common/components/ui/badge'
import type { StoreSession } from '../types/store.types'
import { formatSessionDuration, formatPrice } from '../lib/store-utils'

interface ActiveSessionIndicatorProps {
  session: StoreSession | null
  onEndSession?: () => void
  isEnding?: boolean
}

export function ActiveSessionIndicator({
  session,
  onEndSession,
  isEnding = false,
}: ActiveSessionIndicatorProps) {
  const [duration, setDuration] = useState('')

  // Update duration every minute
  useEffect(() => {
    if (!session) return

    const updateDuration = () => {
      setDuration(formatSessionDuration(session.startedAt))
    }

    updateDuration()
    const interval = setInterval(updateDuration, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [session])

  if (!session) {
    return null
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          {/* Session Info */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <h3 className="font-semibold text-lg">Sesión Activa</h3>
              <Badge variant="secondary" className="ml-auto">
                {session.state === 'active' ? 'En curso' : 'Escaneando'}
              </Badge>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{session.user.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-xs font-mono">
                {session.user.email}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {/* Duration */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">Duración</span>
                </div>
                <p className="text-sm font-medium">{duration}</p>
              </div>

              {/* Products Count */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span className="text-xs">Productos</span>
                </div>
                <p className="text-sm font-medium">
                  {session.totalProducts} {session.totalProducts === 1 ? 'item' : 'items'}
                </p>
              </div>

              {/* Total Value */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ShoppingBag className="h-3 w-3" />
                  <span className="text-xs">Total</span>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(session.totalValue)}
                </p>
              </div>
            </div>

            {/* Session ID */}
            <p className="text-xs text-muted-foreground pt-2 border-t">
              ID: <span className="font-mono">{session.id}</span>
            </p>
          </div>

          {/* End Session Button */}
          {onEndSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEndSession}
              disabled={isEnding}
              className="flex-shrink-0"
            >
              {isEnding ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Finalizar
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
