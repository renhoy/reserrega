'use client'

/**
 * =====================================================
 * ADMIN DASHBOARD - Comercial Dialog Component
 * =====================================================
 * Dialog para crear/editar comercial
 * =====================================================
 */

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/common/components/ui/dialog'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/components/ui/select'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { validateComercialData } from '../lib/admin-utils'
import type { ComercialWithDetails, Company, CreateComercialData, UpdateComercialData } from '../types/admin.types'

interface ComercialDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: (comercial: ComercialWithDetails) => void
  mode: 'create' | 'edit'
  comercial?: ComercialWithDetails
  companies: Company[]
}

export function ComercialDialog({
  open,
  onClose,
  onSuccess,
  mode,
  comercial,
  companies,
}: ComercialDialogProps) {
  // Form state
  const [formData, setFormData] = useState<CreateComercialData | UpdateComercialData>(
    mode === 'edit' && comercial
      ? {
          name: comercial.name,
          last_name: comercial.last_name,
          phone: comercial.phone || '',
          store_id: comercial.store_id || undefined,
          status: comercial.status,
        }
      : {
          email: '',
          name: '',
          last_name: '',
          phone: '',
          company_id: 0,
          store_id: undefined,
          password: '',
        }
  )

  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof CreateComercialData, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'create') {
      const validationErrors = validateComercialData(formData as CreateComercialData)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    try {
      setLoading(true)
      setErrors([])

      // Mock success
      const mockComercial: ComercialWithDetails = {
        id: mode === 'create' ? Date.now().toString() : comercial!.id,
        email: mode === 'create' ? (formData as CreateComercialData).email : comercial!.email,
        name: formData.name!,
        last_name: formData.last_name!,
        phone: formData.phone || null,
        company_id: mode === 'create' ? (formData as CreateComercialData).company_id : comercial!.company_id,
        store_id: formData.store_id || null,
        status: mode === 'edit' ? (formData as UpdateComercialData).status || 'active' : 'active',
        created_at: mode === 'create' ? new Date().toISOString() : comercial!.created_at,
        updated_at: new Date().toISOString(),
        company: {
          id: mode === 'create' ? (formData as CreateComercialData).company_id : comercial!.company_id,
          name: companies.find(c => c.id === (mode === 'create' ? (formData as CreateComercialData).company_id : comercial!.company_id))?.name || '',
        },
        store: formData.store_id ? { id: formData.store_id, name: 'Tienda Mock' } : null,
      }
      onSuccess(mockComercial)
      onClose()
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Error al guardar el comercial'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nuevo Comercial' : 'Editar Comercial'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa los datos para crear un nuevo comercial'
              : 'Actualiza los datos del comercial'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {mode === 'create' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={(formData as CreateComercialData).email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="comercial@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={(formData as CreateComercialData).password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Juan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Apellidos *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="García Pérez"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="600123456"
            />
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="company_id">Empresa *</Label>
              <Select
                value={(formData as CreateComercialData).company_id?.toString() || ''}
                onValueChange={(value) => handleChange('company_id', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Crear Comercial' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
