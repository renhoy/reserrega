/**
 * =====================================================
 * ADMIN DASHBOARD - Types
 * =====================================================
 * Types para gestión administrativa del sistema
 * =====================================================
 */

// =====================================================
// COMPANY TYPES
// =====================================================

/**
 * Company data from database
 */
export interface Company {
  id: number
  name: string
  nif: string
  address: string
  locality: string
  province: string
  postal_code: string
  phone: string
  email: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

/**
 * Company with additional stats
 */
export interface CompanyWithStats extends Company {
  stats: {
    total_stores: number
    total_comercials: number
    total_users: number
    total_reservations: number
    total_revenue: number
  }
}

/**
 * Form data for creating company
 */
export interface CreateCompanyData {
  name: string
  nif: string
  address: string
  locality: string
  province: string
  postal_code: string
  phone: string
  email?: string
}

/**
 * Form data for updating company
 */
export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  status?: 'active' | 'inactive'
}

// =====================================================
// COMERCIAL TYPES
// =====================================================

/**
 * Comercial user data
 */
export interface Comercial {
  id: string
  email: string
  name: string
  last_name: string
  phone: string | null
  company_id: number
  store_id: number | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

/**
 * Comercial with company and store details
 */
export interface ComercialWithDetails extends Comercial {
  company: {
    id: number
    name: string
  }
  store: {
    id: number
    name: string
  } | null
}

/**
 * Form data for creating comercial
 */
export interface CreateComercialData {
  email: string
  name: string
  last_name: string
  phone?: string
  company_id: number
  store_id?: number
  password: string
}

/**
 * Form data for updating comercial
 */
export interface UpdateComercialData {
  name?: string
  last_name?: string
  phone?: string
  store_id?: number
  status?: 'active' | 'inactive'
}

// =====================================================
// STATS TYPES
// =====================================================

/**
 * Global system statistics
 */
export interface GlobalStats {
  // Companies
  total_companies: number
  active_companies: number
  inactive_companies: number

  // Users
  total_users: number
  users_by_role: {
    superadmin: number
    admin: number
    comercial: number
    usuario: number
  }

  // Stores
  total_stores: number
  active_stores: number

  // Reservations
  total_reservations: number
  active_reservations: number
  completed_reservations: number
  cancelled_reservations: number

  // Revenue
  total_revenue: number
  revenue_this_month: number
  revenue_this_year: number

  // Gifts
  total_gifts: number
  gifts_this_month: number

  // Growth metrics
  new_users_this_month: number
  new_companies_this_month: number
  growth_rate: number
}

/**
 * Company-specific statistics
 */
export interface CompanyStats {
  company_id: number
  company_name: string
  total_stores: number
  total_comercials: number
  total_users: number
  total_reservations: number
  total_revenue: number
  active_reservations: number
  completed_reservations: number
}

/**
 * Date range for filtering stats
 */
export interface DateRange {
  start_date: string
  end_date: string
}

// =====================================================
// SYSTEM CONFIG TYPES
// =====================================================

/**
 * System configuration settings
 */
export interface SystemConfig {
  // Reservation settings
  reservation_fee: number // € amount
  reservation_validity_days: number

  // Gift settings
  gift_lock_minutes: number // Temporary lock duration

  // Email settings
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_from_name: string
  smtp_from_email: string

  // Feature flags
  enable_subscriptions: boolean
  enable_multiempresa: boolean
  enable_testing_mode: boolean

  // Business rules
  max_reservations_per_user: number
  max_wishlist_items: number

  // Updated at
  updated_at: string
  updated_by: string
}

/**
 * Form data for updating system config
 */
export interface UpdateSystemConfigData extends Partial<SystemConfig> {
  // All fields optional for partial updates
}

// =====================================================
// ACTIVITY LOG TYPES
// =====================================================

/**
 * Activity log entry
 */
export interface ActivityLog {
  id: string
  user_id: string
  user_email: string
  action: 'create' | 'update' | 'delete'
  entity: 'company' | 'comercial' | 'user' | 'config' | 'store'
  entity_id: string
  details: Record<string, any>
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// =====================================================
// REQUEST/RESPONSE TYPES
// =====================================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

/**
 * Filter options for companies
 */
export interface CompanyFilters {
  search?: string
  status?: 'active' | 'inactive' | 'all'
  province?: string
  page?: number
  limit?: number
}

/**
 * Filter options for comercials
 */
export interface ComercialFilters {
  search?: string
  company_id?: number
  store_id?: number
  status?: 'active' | 'inactive' | 'all'
  page?: number
  limit?: number
}

/**
 * Action result with success/error
 */
export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

/**
 * Dashboard widget data
 */
export interface DashboardWidget {
  id: string
  title: string
  value: number | string
  change?: number // Percentage change
  trend?: 'up' | 'down' | 'stable'
  icon: string
  color: 'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'red'
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area'
  data: ChartDataPoint[]
  title: string
  color: string
}
