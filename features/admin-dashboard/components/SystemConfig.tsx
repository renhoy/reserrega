/**
 * =====================================================
 * ADMIN DASHBOARD - SystemConfig Component
 * =====================================================
 * System configuration panel for superadmins
 * =====================================================
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/common/components/ui/card'
import { Button } from '@/shared/common/components/ui/button'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import { Switch } from '@/shared/common/components/ui/switch'
import { Separator } from '@/shared/common/components/ui/separator'
import { useToast } from '@/shared/common/hooks/useToast'
import { SystemConfig as SystemConfigType, UpdateSystemConfigData } from '../types/admin.types'

// =====================================================
// TYPES
// =====================================================

interface SystemConfigProps {
  config: SystemConfigType | null
  onUpdate: (data: UpdateSystemConfigData) => Promise<void>
  loading?: boolean
}

interface ConfigFormData {
  // Reservation settings
  reservation_fee: number
  reservation_validity_days: number

  // Gift settings
  gift_lock_minutes: number

  // Email settings
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_from_name: string
  smtp_from_email: string

  // Feature flags
  enable_subscriptions: boolean
  enable_multiempresa: boolean
  enable_testing_mode: boolean

  // Business rules
  max_reservations_per_user: number
  max_wishlist_items: number
}

// =====================================================
// DEFAULT VALUES
// =====================================================

const DEFAULT_CONFIG: Partial<SystemConfigType> = {
  reservation_fee: 1.0,
  reservation_validity_days: 15,
  gift_lock_minutes: 15,
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_user: '',
  smtp_from_name: 'Reserrega',
  smtp_from_email: 'noreply@reserrega.com',
  enable_subscriptions: false,
  enable_multiempresa: true,
  enable_testing_mode: false,
  max_reservations_per_user: 50,
  max_wishlist_items: 100,
}

// =====================================================
// COMPONENT
// =====================================================

export function SystemConfig({ config, onUpdate, loading = false }: SystemConfigProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ConfigFormData>({
    defaultValues: config || DEFAULT_CONFIG,
  })

  // Watch feature flags
  const enableSubscriptions = watch('enable_subscriptions')
  const enableMultiempresa = watch('enable_multiempresa')
  const enableTestingMode = watch('enable_testing_mode')

  // Handle form submission
  const onSubmit = async (data: ConfigFormData) => {
    try {
      setSaving(true)
      await onUpdate(data)
      toast({
        title: 'Configuración actualizada',
        description: 'Los cambios se han guardado correctamente.',
      })
      reset(data) // Reset form with new values
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo actualizar la configuración.',
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle reset to defaults
  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar los valores por defecto?')) {
      reset(DEFAULT_CONFIG)
      toast({
        title: 'Valores restaurados',
        description: 'Se han restaurado los valores por defecto. No olvides guardar los cambios.',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Reservation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Reservas</CardTitle>
          <CardDescription>
            Ajustes relacionados con el sistema de reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reservation_fee">Tarifa de Reserva (€)</Label>
              <Input
                id="reservation_fee"
                type="number"
                step="0.01"
                min="0"
                {...register('reservation_fee', {
                  required: 'La tarifa es requerida',
                  min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                })}
              />
              {errors.reservation_fee && (
                <p className="text-sm text-destructive">{errors.reservation_fee.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation_validity_days">Validez de Reserva (días)</Label>
              <Input
                id="reservation_validity_days"
                type="number"
                min="1"
                {...register('reservation_validity_days', {
                  required: 'La validez es requerida',
                  min: { value: 1, message: 'Debe ser al menos 1 día' },
                })}
              />
              {errors.reservation_validity_days && (
                <p className="text-sm text-destructive">{errors.reservation_validity_days.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Regalos</CardTitle>
          <CardDescription>
            Ajustes relacionados con el sistema de regalos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gift_lock_minutes">Bloqueo Temporal (minutos)</Label>
            <Input
              id="gift_lock_minutes"
              type="number"
              min="5"
              max="60"
              {...register('gift_lock_minutes', {
                required: 'El tiempo de bloqueo es requerido',
                min: { value: 5, message: 'Mínimo 5 minutos' },
                max: { value: 60, message: 'Máximo 60 minutos' },
              })}
            />
            {errors.gift_lock_minutes && (
              <p className="text-sm text-destructive">{errors.gift_lock_minutes.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Tiempo que un producto se bloquea cuando alguien empieza a regalarlo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Email</CardTitle>
          <CardDescription>
            Ajustes del servidor SMTP para envío de correos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">Host SMTP</Label>
              <Input
                id="smtp_host"
                {...register('smtp_host', { required: 'El host es requerido' })}
              />
              {errors.smtp_host && (
                <p className="text-sm text-destructive">{errors.smtp_host.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_port">Puerto SMTP</Label>
              <Input
                id="smtp_port"
                type="number"
                {...register('smtp_port', {
                  required: 'El puerto es requerido',
                  min: { value: 1, message: 'Puerto inválido' },
                  max: { value: 65535, message: 'Puerto inválido' },
                })}
              />
              {errors.smtp_port && (
                <p className="text-sm text-destructive">{errors.smtp_port.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp_user">Usuario SMTP</Label>
              <Input
                id="smtp_user"
                {...register('smtp_user', { required: 'El usuario es requerido' })}
              />
              {errors.smtp_user && (
                <p className="text-sm text-destructive">{errors.smtp_user.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_from_name">Nombre del Remitente</Label>
              <Input
                id="smtp_from_name"
                {...register('smtp_from_name', { required: 'El nombre es requerido' })}
              />
              {errors.smtp_from_name && (
                <p className="text-sm text-destructive">{errors.smtp_from_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_from_email">Email del Remitente</Label>
            <Input
              id="smtp_from_email"
              type="email"
              {...register('smtp_from_email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido',
                },
              })}
            />
            {errors.smtp_from_email && (
              <p className="text-sm text-destructive">{errors.smtp_from_email.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Reglas de Negocio</CardTitle>
          <CardDescription>
            Límites y restricciones del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max_reservations_per_user">Máximo de Reservas por Usuario</Label>
              <Input
                id="max_reservations_per_user"
                type="number"
                min="1"
                {...register('max_reservations_per_user', {
                  required: 'El límite es requerido',
                  min: { value: 1, message: 'Mínimo 1' },
                })}
              />
              {errors.max_reservations_per_user && (
                <p className="text-sm text-destructive">{errors.max_reservations_per_user.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_wishlist_items">Máximo de Items en Wishlist</Label>
              <Input
                id="max_wishlist_items"
                type="number"
                min="1"
                {...register('max_wishlist_items', {
                  required: 'El límite es requerido',
                  min: { value: 1, message: 'Mínimo 1' },
                })}
              />
              {errors.max_wishlist_items && (
                <p className="text-sm text-destructive">{errors.max_wishlist_items.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Features del Sistema</CardTitle>
          <CardDescription>
            Activar o desactivar funcionalidades del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable_subscriptions">Suscripciones</Label>
              <p className="text-sm text-muted-foreground">
                Permitir suscripciones de pago a usuarios
              </p>
            </div>
            <Switch
              id="enable_subscriptions"
              {...register('enable_subscriptions')}
              checked={enableSubscriptions}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable_multiempresa">Multi-empresa</Label>
              <p className="text-sm text-muted-foreground">
                Permitir múltiples empresas en el sistema
              </p>
            </div>
            <Switch
              id="enable_multiempresa"
              {...register('enable_multiempresa')}
              checked={enableMultiempresa}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable_testing_mode">Modo de Pruebas</Label>
              <p className="text-sm text-muted-foreground">
                Activar funciones de prueba (no usar en producción)
              </p>
            </div>
            <Switch
              id="enable_testing_mode"
              {...register('enable_testing_mode')}
              checked={enableTestingMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={saving}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Restaurar Valores por Defecto
        </Button>
        <Button type="submit" disabled={!isDirty || saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
