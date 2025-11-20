'use client'

/**
 * =====================================================
 * ADMIN DASHBOARD - Company Dialog Component
 * =====================================================
 * Dialog para crear/editar empresa
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
import { validateCompanyData } from '../lib/admin-utils'
import type { Company, CreateCompanyData, UpdateCompanyData } from '../types/admin.types'

interface CompanyDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: (company: Company) => void
  mode: 'create' | 'edit'
  company?: Company
}

const PROVINCIAS = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
  'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León',
  'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia',
  'Pontevedra', 'Salamanca', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Santa Cruz de Tenerife',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
]

export function CompanyDialog({
  open,
  onClose,
  onSuccess,
  mode,
  company,
}: CompanyDialogProps) {
  // Form state
  const [formData, setFormData] = useState<CreateCompanyData | UpdateCompanyData>(
    mode === 'edit' && company
      ? {
          name: company.name,
          nif: company.nif,
          address: company.address,
          locality: company.locality,
          province: company.province,
          postal_code: company.postal_code,
          phone: company.phone,
          email: company.email || '',
        }
      : {
          name: '',
          nif: '',
          address: '',
          locality: '',
          province: '',
          postal_code: '',
          phone: '',
          email: '',
        }
  )

  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Handlers
  const handleChange = (field: keyof CreateCompanyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors([]) // Clear errors on change
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const validationErrors = validateCompanyData(formData as CreateCompanyData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      setErrors([])

      if (mode === 'create') {
        // TODO: Call create company action
        // const result = await createCompanyAction(formData as CreateCompanyData)
        // if (!result.success) throw new Error(result.error)
        // onSuccess(result.data!)

        // Mock success
        const mockCompany: Company = {
          id: Date.now(),
          ...(formData as CreateCompanyData),
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        onSuccess(mockCompany)
      } else {
        // TODO: Call update company action
        // const result = await updateCompanyAction(company!.id, formData as UpdateCompanyData)
        // if (!result.success) throw new Error(result.error)
        // onSuccess(result.data!)

        // Mock success
        const mockCompany: Company = {
          ...company!,
          ...(formData as UpdateCompanyData),
          updated_at: new Date().toISOString(),
        }
        onSuccess(mockCompany)
      }

      // Reset form
      onClose()
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Error al guardar la empresa'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nueva Empresa' : 'Editar Empresa'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa los datos para crear una nueva empresa'
              : 'Actualiza los datos de la empresa'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Errors */}
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

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Supermercados ABC"
              required
            />
          </div>

          {/* NIF */}
          <div className="space-y-2">
            <Label htmlFor="nif">NIF *</Label>
            <Input
              id="nif"
              value={formData.nif}
              onChange={(e) => handleChange('nif', e.target.value)}
              placeholder="Ej: 12345678Z"
              required
              maxLength={9}
            />
            <p className="text-xs text-gray-500">
              8 dígitos + letra (ej: 12345678Z)
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Calle Principal 123"
              required
            />
          </div>

          {/* Locality and Province */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locality">Localidad *</Label>
              <Input
                id="locality"
                value={formData.locality}
                onChange={(e) => handleChange('locality', e.target.value)}
                placeholder="Madrid"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia *</Label>
              <Select
                value={formData.province}
                onValueChange={(value) => handleChange('province', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona provincia" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCIAS.map((provincia) => (
                    <SelectItem key={provincia} value={provincia}>
                      {provincia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postal_code">Código Postal *</Label>
            <Input
              id="postal_code"
              value={formData.postal_code}
              onChange={(e) => handleChange('postal_code', e.target.value)}
              placeholder="28001"
              required
              maxLength={5}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="600123456"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contacto@empresa.com"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === 'create' ? 'Crear Empresa' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
