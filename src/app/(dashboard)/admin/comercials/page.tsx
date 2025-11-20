/**
 * =====================================================
 * ADMIN DASHBOARD - Comercials Page
 * =====================================================
 * Page for managing comercial users
 * =====================================================
 */

import { Metadata } from 'next'
import { requireRole } from '@/shared/auth/server'
import { ComercialManager } from '@/features/admin-dashboard/components/ComercialManager'

export const metadata: Metadata = {
  title: 'Gestión de Comerciales | Admin',
  description: 'Administrar usuarios comerciales',
}

export default async function ComercialsPage() {
  await requireRole('superadmin')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Comerciales</h1>
        <p className="text-muted-foreground">
          Crear, editar y gestionar usuarios comerciales
        </p>
      </div>

      <ComercialManager />
    </div>
  )
}
