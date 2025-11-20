'use client'

/**
 * =====================================================
 * ADMIN DASHBOARD - Company Manager Component
 * =====================================================
 * Gestión de empresas con tabla, búsqueda y filtros
 * =====================================================
 */

import { useState } from 'react'
import { Search, Plus, Building2, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
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
import { CompanyDialog } from './CompanyDialog'
import { DeleteConfirmDialog } from '@/shared/common/components/shared/DeleteConfirmDialog'
import { LoadingSpinner } from '@/shared/common/components/shared/LoadingSpinner'
import { EmptyState } from '@/shared/common/components/shared/EmptyState'
import {
  formatDate,
  filterCompaniesBySearch,
  getStatusColor,
  getStatusLabel,
} from '../lib/admin-utils'
import type { Company, CompanyFilters } from '../types/admin.types'

interface CompanyManagerProps {
  initialCompanies?: Company[]
  onRefresh?: () => Promise<void>
  className?: string
}

export function CompanyManager({
  initialCompanies = [],
  onRefresh,
  className,
}: CompanyManagerProps) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(initialCompanies)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  // Apply filters
  const applyFilters = () => {
    let filtered = [...companies]

    // Search filter
    if (searchTerm) {
      filtered = filterCompaniesBySearch(filtered, searchTerm)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((company) => company.status === statusFilter)
    }

    setFilteredCompanies(filtered)
  }

  // Update filters when search or status changes
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

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setShowEditDialog(true)
  }

  const handleDelete = (company: Company) => {
    setSelectedCompany(company)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return

    try {
      setLoading(true)
      // TODO: Call delete company action
      // await deleteCompanyAction(selectedCompany.id)

      // Remove from local state
      setCompanies((prev) => prev.filter((c) => c.id !== selectedCompany.id))
      applyFilters()

      setShowDeleteDialog(false)
      setSelectedCompany(null)
    } catch (error) {
      console.error('Error deleting company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyCreated = (company: Company) => {
    setCompanies((prev) => [...prev, company])
    applyFilters()
    setShowCreateDialog(false)
  }

  const handleCompanyUpdated = (company: Company) => {
    setCompanies((prev) => prev.map((c) => (c.id === company.id ? company : c)))
    applyFilters()
    setShowEditDialog(false)
    setSelectedCompany(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Gestión de Empresas
            </CardTitle>
            <CardDescription>
              Administra las empresas del sistema
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
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
              placeholder="Buscar por nombre, NIF, localidad..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 mb-4">
          {filteredCompanies.length} {filteredCompanies.length === 1 ? 'empresa' : 'empresas'}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Cargando empresas..." />
          </div>
        ) : filteredCompanies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No se encontraron empresas"
            description={searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea la primera empresa del sistema'}
            action={
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Empresa
              </Button>
            }
          />
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>NIF</TableHead>
                  <TableHead>Localidad</TableHead>
                  <TableHead>Provincia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Alta</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell>{company.nif}</TableCell>
                    <TableCell>{company.locality}</TableCell>
                    <TableCell>{company.province}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>
                        {getStatusLabel(company.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(company.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(company)}
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
      <CompanyDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCompanyCreated}
        mode="create"
      />

      {selectedCompany && (
        <>
          <CompanyDialog
            open={showEditDialog}
            onClose={() => {
              setShowEditDialog(false)
              setSelectedCompany(null)
            }}
            onSuccess={handleCompanyUpdated}
            mode="edit"
            company={selectedCompany}
          />

          <DeleteConfirmDialog
            open={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false)
              setSelectedCompany(null)
            }}
            onConfirm={handleConfirmDelete}
            title="Eliminar empresa"
            description={`¿Estás seguro de que quieres eliminar la empresa "${selectedCompany.name}"? Esta acción no se puede deshacer.`}
            loading={loading}
          />
        </>
      )}
    </Card>
  )
}
