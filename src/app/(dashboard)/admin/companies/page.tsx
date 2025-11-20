/**
 * =====================================================
 * ADMIN DASHBOARD - Companies Page
 * =====================================================
 * Page for managing companies
 * =====================================================
 */

import { Metadata } from 'next'
import { requireRole } from '@/shared/auth/server'
import { CompanyManager } from '@/features/admin-dashboard/components/CompanyManager'

export const metadata: Metadata = {
  title: 'Gestión de Empresas | Admin',
  description: 'Administrar empresas del sistema',
}

export default async function CompaniesPage() {
  await requireRole('superadmin')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Empresas</h1>
        <p className="text-muted-foreground">
          Crear, editar y gestionar empresas del sistema
        </p>
      </div>

      <CompanyManager />
    </div>
  )
}
