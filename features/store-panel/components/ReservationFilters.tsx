'use client'

/**
 * =====================================================
 * STORE-PANEL - ReservationFilters Component
 * =====================================================
 * Filtros para lista de reservas
 * =====================================================
 */

import { useState } from 'react'
import { Filter, X, Search, Calendar, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/common/components/ui/popover'
import { Calendar as CalendarComponent } from '@/shared/common/components/ui/calendar'
import { Badge } from '@/shared/common/components/ui/badge'
import type { ReservationFilters as Filters, DeliveryStatus } from '../types/store.types'

interface ReservationFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onClearFilters: () => void
}

export function ReservationFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: ReservationFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const activeFiltersCount = [
    filters.status && filters.status !== 'all',
    filters.search,
    filters.dateFrom,
    filters.dateTo,
    filters.onlyExpired,
    filters.onlyActive,
  ].filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre, email o producto..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) =>
          handleFilterChange('status', value as DeliveryStatus | 'all')
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="pending">Pendiente</SelectItem>
          <SelectItem value="ready">Listo</SelectItem>
          <SelectItem value="delivered">Entregado</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Más filtros
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filtros Avanzados</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                disabled={activeFiltersCount === 0}
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Fecha desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {filters.dateFrom
                      ? filters.dateFrom.toLocaleDateString('es-ES')
                      : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange('dateFrom', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Fecha hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {filters.dateTo
                      ? filters.dateTo.toLocaleDateString('es-ES')
                      : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange('dateTo', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <Select
                value={filters.sortBy || 'created_at'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'sortBy',
                    value as 'created_at' | 'expires_at' | 'user_name' | 'product_name'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Fecha de creación</SelectItem>
                  <SelectItem value="expires_at">Fecha de expiración</SelectItem>
                  <SelectItem value="user_name">Nombre de usuario</SelectItem>
                  <SelectItem value="product_name">Nombre de producto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Orden</Label>
              <Select
                value={filters.sortOrder || 'desc'}
                onValueChange={(value) =>
                  handleFilterChange('sortOrder', value as 'asc' | 'desc')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascendente</SelectItem>
                  <SelectItem value="desc">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Filters */}
            <div className="space-y-2 pt-2 border-t">
              <Label>Filtros rápidos</Label>
              <div className="space-y-2">
                <Button
                  variant={filters.onlyActive ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    handleFilterChange('onlyActive', !filters.onlyActive)
                    if (!filters.onlyActive) {
                      handleFilterChange('onlyExpired', false)
                    }
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Solo activas (no expiradas)
                </Button>

                <Button
                  variant={filters.onlyExpired ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    handleFilterChange('onlyExpired', !filters.onlyExpired)
                    if (!filters.onlyExpired) {
                      handleFilterChange('onlyActive', false)
                    }
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Solo expiradas
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
