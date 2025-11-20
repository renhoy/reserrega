'use client'

/**
 * =====================================================
 * ADMIN DASHBOARD - Comercial Manager Component
 * =====================================================
 * Gestión de usuarios comerciales
 * =====================================================
 */

import { useState } from 'react'
import { Search, Plus, UserCircle, MoreVertical, Edit, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Input } from '@/shared/common/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/common/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/common/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/common/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/components/ui/select'
import { Badge } from '@/shared/common/components/ui/badge'
import { ComercialDialog } from './ComercialDialog'
import { DeleteConfirmDialog } from '@/shared/common/components/shared/DeleteConfirmDialog'
import { LoadingSpinner } from '@/shared/common/components/shared/LoadingSpinner'
import { EmptyState } from '@/shared/common/components/shared/EmptyState'
import {
  formatDate,
  filterComercialsBySearch,
  getStatusColor,
  getStatusLabel,
} from '../lib/admin-utils'
import type { ComercialWithDetails, Company } from '../types/admin.types'

interface ComercialManagerProps {
  initialComercials?: ComercialWithDetails[]
  companies?: Company[]
  onRefresh?: () => Promise<void>
  className?: string
}

export function ComercialManager({
  initialComercials = [],
  companies = [],
  onRefresh,
  className,
}: ComercialManagerProps) {
  const [comercials, setComercials] = useState<ComercialWithDetails[]>(initialComercials)
  const [filteredComercials, setFilteredComercials] = useState<ComercialWithDetails[]>(initialComercials)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [companyFilter, setCompanyFilter] = useState<'all' | number>('all')

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedComercial, setSelectedComercial] = useState<ComercialWithDetails | null>(null)

  // Apply filters
  const applyFilters = () => {
    let filtered = [...comercials]

    // Search filter
    if (searchTerm) {
      filtered = filterComercialsBySearch(filtered, searchTerm)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((comercial) => comercial.status === statusFilter)
    }

    // Company filter
    if (companyFilter !== 'all') {
      filtered = filtered.filter((comercial) => comercial.company_id === companyFilter)
    }

    setFilteredComercials(filtered)
  }

  // Update filters
  useState(() => {
    applyFilters()
  })

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setTimeout(applyFilters, 0)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as 'all' | 'active' | 'inactive')
    setTimeout(applyFilters, 0)
  }

  const handleCompanyFilter = (value: string) => {
    setCompanyFilter(value === 'all' ? 'all' : parseInt(value))
    setTimeout(applyFilters, 0)
  }

  const handleEdit = (comercial: ComercialWithDetails) => {
    setSelectedComercial(comercial)
    setShowEditDialog(true)
  }

  const handleDelete = (comercial: ComercialWithDetails) => {
    setSelectedComercial(comercial)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedComercial) return

    try {
      setLoading(true)
      // TODO: Call delete comercial action
      // await deleteComercialAction(selectedComercial.id)

      // Remove from local state
      setComercials((prev) => prev.filter((c) => c.id !== selectedComercial.id))
      applyFilters()

      setShowDeleteDialog(false)
      setSelectedComercial(null)
    } catch (error) {
      console.error('Error deleting comercial:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComercialCreated = (comercial: ComercialWithDetails) => {
    setComercials((prev) => [...prev, comercial])
    applyFilters()
    setShowCreateDialog(false)
  }

  const handleComercialUpdated = (comercial: ComercialWithDetails) => {
    setComercials((prev) => prev.map((c) => (c.id === comercial.id ? comercial : c)))
    applyFilters()
    setShowEditDialog(false)
    setSelectedComercial(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Gestión de Comerciales
            </CardTitle>
            <CardDescription>
              Administra los usuarios comerciales del sistema
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Comercial
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Company Filter */}
          <Select value={companyFilter.toString()} onValueChange={handleCompanyFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empresas</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 mb-4">
          {filteredComercials.length} {filteredComercials.length === 1 ? 'comercial' : 'comerciales'}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Cargando comerciales..." />
          </div>
        ) : filteredComercials.length === 0 ? (
          <EmptyState
            icon={UserCircle}
            title="No se encontraron comerciales"
            description={searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea el primer comercial del sistema'}
            action={
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Comercial
              </Button>
            }
          />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comercial</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tienda</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Alta</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComercials.map((comercial) => (
                  <TableRow key={comercial.id}>
                    <TableCell className="font-medium">
                      {comercial.name} {comercial.last_name}
                    </TableCell>
                    <TableCell>{comercial.email}</TableCell>
                    <TableCell>{comercial.company.name}</TableCell>
                    <TableCell>
                      {comercial.store ? (
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          {comercial.store.name}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(comercial.status)}>
                        {getStatusLabel(comercial.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(comercial.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(comercial)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(comercial)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Dialogs */}
      <ComercialDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleComercialCreated}
        mode="create"
        companies={companies}
      />

      {selectedComercial && (
        <>
          <ComercialDialog
            open={showEditDialog}
            onClose={() => {
              setShowEditDialog(false)
              setSelectedComercial(null)
            }}
            onSuccess={handleComercialUpdated}
            mode="edit"
            comercial={selectedComercial}
            companies={companies}
          />

          <DeleteConfirmDialog
            open={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false)
              setSelectedComercial(null)
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar comercial"
            description={`¿Estás seguro de que quieres eliminar al comercial "${selectedComercial.name} ${selectedComercial.last_name}"? Esta acción no se puede deshacer.`}
            loading={loading}
          />
        </>
      )}
    </Card>
  )
}
