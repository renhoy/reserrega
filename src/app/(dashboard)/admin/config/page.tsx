/**
 * =====================================================
 * ADMIN DASHBOARD - Config Page
 * =====================================================
 * Page for system configuration
 * =====================================================
 */

'use client'

import { useEffect, useState } from 'react'
import { Metadata } from 'next'
import { SystemConfig } from '@/features/admin-dashboard/components/SystemConfig'
import { getSystemConfig, updateSystemConfig } from '@/features/admin-dashboard/actions/admin.actions'
import { SystemConfig as SystemConfigType, UpdateSystemConfigData } from '@/features/admin-dashboard/types/admin.types'
import { Loader2 } from 'lucide-react'

export default function ConfigPage() {
  const [config, setConfig] = useState<SystemConfigType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadConfig() {
      const result = await getSystemConfig()
      if (result.success && result.data) {
        setConfig(result.data)
      }
      setLoading(false)
    }
    loadConfig()
  }, [])

  const handleUpdate = async (data: UpdateSystemConfigData) => {
    const result = await updateSystemConfig(data)
    if (result.success && result.data) {
      setConfig(result.data)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Ajustar parámetros globales del sistema
        </p>
      </div>

      <SystemConfig config={config} onUpdate={handleUpdate} />
    </div>
  )
}
