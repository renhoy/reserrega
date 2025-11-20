/**
 * =====================================================
 * ADMIN DASHBOARD MODULE - Main Exports
 * =====================================================
 * Módulo para gestión administrativa del sistema
 * =====================================================
 */

// Types
export * from './types/admin.types'

// Utils
export * from './lib/admin-utils'

// Components
export * from './components/CompanyManager'
export * from './components/ComercialManager'
export * from './components/GlobalStats'
export * from './components/StatsCard'
export * from './components/SystemConfig'

// Hooks
export * from './hooks/use-companies'
export * from './hooks/use-comercials'
export * from './hooks/use-global-stats'

// Actions
export * from './actions/admin.actions'
