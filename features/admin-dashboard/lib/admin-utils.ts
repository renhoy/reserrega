/**
 * =====================================================
 * ADMIN DASHBOARD - Utilities
 * =====================================================
 * Helper functions for admin operations
 * =====================================================
 */

import type {
  Company,
  Comercial,
  GlobalStats,
  CompanyStats,
  SystemConfig,
  CreateCompanyData,
  CreateComercialData,
  DashboardWidget,
} from '../types/admin.types'

// =====================================================
// FORMATTING UTILITIES
// =====================================================

/**
 * Format currency amount
 *
 * @example
 * formatCurrency(1234.56) // "1.234,56 €"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Format large number with abbreviations
 *
 * @example
 * formatNumber(1234567) // "1,23M"
 * formatNumber(1234) // "1,23K"
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`
  }
  return num.toString()
}

/**
 * Format percentage with sign
 *
 * @example
 * formatPercentage(12.5) // "+12,5%"
 * formatPercentage(-5.3) // "-5,3%"
 */
export function formatPercentage(percent: number): string {
  const sign = percent > 0 ? '+' : ''
  return `${sign}${percent.toFixed(1)}%`
}

/**
 * Format date to Spanish locale
 *
 * @example
 * formatDate('2024-01-15') // "15 de enero de 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format date to short format
 *
 * @example
 * formatDateShort('2024-01-15') // "15/01/2024"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

/**
 * Format datetime with time
 *
 * @example
 * formatDateTime('2024-01-15T10:30:00') // "15/01/2024 10:30"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get relative time (e.g., "hace 2 horas")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'Justo ahora'
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  return formatDateShort(dateString)
}

// =====================================================
// VALIDATION UTILITIES
// =====================================================

/**
 * Validate Spanish NIF format
 */
export function validateNIF(nif: string): boolean {
  const nifRegex = /^[0-9]{8}[A-Z]$/
  if (!nifRegex.test(nif)) return false

  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const number = parseInt(nif.substring(0, 8), 10)
  const letter = nif.charAt(8)

  return letters.charAt(number % 23) === letter
}

/**
 * Validate Spanish phone number
 */
export function validatePhone(phone: string): boolean {
  // Remove spaces and special characters
  const cleanPhone = phone.replace(/[\s-]/g, '')

  // Spanish phone: 9 digits starting with 6, 7, 8, 9
  const phoneRegex = /^[6-9][0-9]{8}$/

  // International format
  const intlRegex = /^\+34[6-9][0-9]{8}$/

  return phoneRegex.test(cleanPhone) || intlRegex.test(cleanPhone)
}

/**
 * Validate postal code
 */
export function validatePostalCode(code: string): boolean {
  const postalCodeRegex = /^[0-9]{5}$/
  return postalCodeRegex.test(code)
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate company data
 */
export function validateCompanyData(data: CreateCompanyData): string[] {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 3) {
    errors.push('El nombre de la empresa debe tener al menos 3 caracteres')
  }

  if (!validateNIF(data.nif)) {
    errors.push('NIF inválido')
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.push('La dirección debe tener al menos 5 caracteres')
  }

  if (!validatePostalCode(data.postal_code)) {
    errors.push('Código postal inválido')
  }

  if (!validatePhone(data.phone)) {
    errors.push('Teléfono inválido')
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push('Email inválido')
  }

  return errors
}

/**
 * Validate comercial data
 */
export function validateComercialData(data: CreateComercialData): string[] {
  const errors: string[] = []

  if (!validateEmail(data.email)) {
    errors.push('Email inválido')
  }

  if (!data.name || data.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }

  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.push('El apellido debe tener al menos 2 caracteres')
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Teléfono inválido')
  }

  if (!data.password || data.password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!data.company_id || data.company_id < 1) {
    errors.push('Debe seleccionar una empresa')
  }

  return errors
}

// =====================================================
// PERMISSION UTILITIES
// =====================================================

/**
 * Check if user is superadmin
 */
export function isSuperadmin(userRole: string): boolean {
  return userRole === 'superadmin'
}

/**
 * Check if user can manage companies
 */
export function canManageCompanies(userRole: string): boolean {
  return userRole === 'superadmin'
}

/**
 * Check if user can manage comercials
 */
export function canManageComercials(userRole: string): boolean {
  return userRole === 'superadmin' || userRole === 'admin'
}

/**
 * Check if user can view global stats
 */
export function canViewGlobalStats(userRole: string): boolean {
  return userRole === 'superadmin'
}

/**
 * Check if user can edit system config
 */
export function canEditSystemConfig(userRole: string): boolean {
  return userRole === 'superadmin'
}

/**
 * Check if user can manage specific company
 */
export function canManageCompany(userRole: string, userCompanyId: number, targetCompanyId: number): boolean {
  if (userRole === 'superadmin') return true
  if (userRole === 'admin') return userCompanyId === targetCompanyId
  return false
}

// =====================================================
// CALCULATION UTILITIES
// =====================================================

/**
 * Calculate growth rate percentage
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Calculate average
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((acc, val) => acc + val, 0)
  return sum / values.length
}

/**
 * Calculate total from company stats
 */
export function calculateTotalRevenue(companies: CompanyStats[]): number {
  return companies.reduce((total, company) => total + company.total_revenue, 0)
}

/**
 * Get trend from growth rate
 */
export function getTrend(growthRate: number): 'up' | 'down' | 'stable' {
  if (growthRate > 5) return 'up'
  if (growthRate < -5) return 'down'
  return 'stable'
}

/**
 * Get color from metric type
 */
export function getMetricColor(metricType: string): DashboardWidget['color'] {
  const colorMap: Record<string, DashboardWidget['color']> = {
    companies: 'purple',
    users: 'blue',
    reservations: 'pink',
    revenue: 'green',
    gifts: 'yellow',
    growth: 'pink',
  }
  return colorMap[metricType] || 'pink'
}

// =====================================================
// FILTER UTILITIES
// =====================================================

/**
 * Filter companies by search term
 */
export function filterCompaniesBySearch(companies: Company[], search: string): Company[] {
  if (!search) return companies

  const searchLower = search.toLowerCase()
  return companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchLower) ||
      company.nif.toLowerCase().includes(searchLower) ||
      company.locality.toLowerCase().includes(searchLower) ||
      company.province.toLowerCase().includes(searchLower)
  )
}

/**
 * Filter comercials by search term
 */
export function filterComercialsBySearch(comercials: Comercial[], search: string): Comercial[] {
  if (!search) return comercials

  const searchLower = search.toLowerCase()
  return comercials.filter(
    (comercial) =>
      comercial.name.toLowerCase().includes(searchLower) ||
      comercial.last_name.toLowerCase().includes(searchLower) ||
      comercial.email.toLowerCase().includes(searchLower)
  )
}

// =====================================================
// SORT UTILITIES
// =====================================================

/**
 * Sort companies by field
 */
export function sortCompanies<T extends Company>(
  companies: T[],
  field: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...companies].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]

    if (aValue === bValue) return 0

    const comparison = aValue < bValue ? -1 : 1
    return direction === 'asc' ? comparison : -comparison
  })
}

/**
 * Get status badge color
 */
export function getStatusColor(status: 'active' | 'inactive'): string {
  return status === 'active'
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800'
}

/**
 * Get status label
 */
export function getStatusLabel(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'Activa' : 'Inactiva'
}
