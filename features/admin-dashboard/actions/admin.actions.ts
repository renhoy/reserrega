/**
 * =====================================================
 * ADMIN DASHBOARD - Server Actions
 * =====================================================
 * Server actions for admin functionality
 * Only accessible by superadmin role
 * =====================================================
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createServerComponentClient } from '@/lib/supabase/helpers'
import { requireRole } from '@/shared/auth/server'
import type {
  Company,
  CompanyWithStats,
  CreateCompanyData,
  UpdateCompanyData,
  Comercial,
  ComercialWithDetails,
  CreateComercialData,
  UpdateComercialData,
  GlobalStats,
  SystemConfig,
  UpdateSystemConfigData,
  ActionResult,
  CompanyFilters,
  ComercialFilters,
  PaginatedResponse,
} from '../types/admin.types'

// =====================================================
// COMPANY ACTIONS
// =====================================================

/**
 * Get companies with optional filters
 */
export async function getCompanies(
  filters?: CompanyFilters
): Promise<ActionResult<PaginatedResponse<CompanyWithStats>>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    let query = supabase
      .from('companies')
      .select('*, stores(count)', { count: 'exact' })

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,nif.ilike.%${filters.search}%`)
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters?.province) {
      query = query.eq('province', filters.province)
    }

    // Pagination
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: companies, error, count } = await query

    if (error) throw error

    // Get stats for each company
    const companiesWithStats: CompanyWithStats[] = await Promise.all(
      (companies || []).map(async (company) => {
        const [stores, comercials, users, reservations] = await Promise.all([
          supabase.from('stores').select('id', { count: 'exact', head: true }).eq('company_id', company.id),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('company_id', company.id).eq('role', 'comercial'),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('company_id', company.id),
          supabase.from('reservations').select('total_price', { count: 'exact' }).eq('company_id', company.id),
        ])

        const total_revenue = reservations.data?.reduce((sum, r) => sum + (r.total_price || 0), 0) || 0

        return {
          ...company,
          stats: {
            total_stores: stores.count || 0,
            total_comercials: comercials.count || 0,
            total_users: users.count || 0,
            total_reservations: reservations.count || 0,
            total_revenue,
          },
        }
      })
    )

    return {
      success: true,
      data: {
        data: companiesWithStats,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener empresas',
    }
  }
}

/**
 * Create a new company
 */
export async function createCompany(data: CreateCompanyData): Promise<ActionResult<Company>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    const { data: company, error } = await supabase
      .from('companies')
      .insert([
        {
          ...data,
          status: 'active',
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/companies')
    return { success: true, data: company, message: 'Empresa creada correctamente' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear empresa',
    }
  }
}

/**
 * Update an existing company
 */
export async function updateCompany(
  id: number,
  data: UpdateCompanyData
): Promise<ActionResult<Company>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    const { data: company, error } = await supabase
      .from('companies')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/companies')
    return { success: true, data: company, message: 'Empresa actualizada correctamente' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar empresa',
    }
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(id: number): Promise<ActionResult> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    // Check if company has associated data
    const [stores, users] = await Promise.all([
      supabase.from('stores').select('id', { count: 'exact', head: true }).eq('company_id', id),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('company_id', id),
    ])

    if ((stores.count || 0) > 0 || (users.count || 0) > 0) {
      return {
        success: false,
        error: 'No se puede eliminar la empresa porque tiene tiendas o usuarios asociados',
      }
    }

    const { error } = await supabase.from('companies').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/admin/companies')
    return { success: true, message: 'Empresa eliminada correctamente' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar empresa',
    }
  }
}

// =====================================================
// COMERCIAL ACTIONS
// =====================================================

/**
 * Get comercials with optional filters
 */
export async function getComercials(
  filters?: ComercialFilters
): Promise<ActionResult<PaginatedResponse<ComercialWithDetails>>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    let query = supabase
      .from('users')
      .select(`
        *,
        company:companies(id, name),
        store:stores(id, name)
      `, { count: 'exact' })
      .eq('role', 'comercial')

    // Apply filters
    if (filters?.search) {
      query = query.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`)
    }

    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id)
    }

    if (filters?.store_id) {
      query = query.eq('store_id', filters.store_id)
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    // Pagination
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: comercials, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data: {
        data: (comercials || []) as ComercialWithDetails[],
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener comerciales',
    }
  }
}

/**
 * Create a new comercial
 */
export async function createComercial(data: CreateComercialData): Promise<ActionResult<Comercial>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    // Create user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        name: data.name,
        last_name: data.last_name,
        phone: data.phone,
        role: 'comercial',
        company_id: data.company_id,
        store_id: data.store_id,
      },
    })

    if (authError) throw authError

    // Update user record
    const { data: comercial, error } = await supabase
      .from('users')
      .update({
        name: data.name,
        last_name: data.last_name,
        phone: data.phone,
        company_id: data.company_id,
        store_id: data.store_id,
        role: 'comercial',
        status: 'active',
      })
      .eq('id', authData.user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/comercials')
    return { success: true, data: comercial, message: 'Comercial creado correctamente' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear comercial',
    }
  }
}

/**
 * Update an existing comercial
 */
export async function updateComercial(
  id: string,
  data: UpdateComercialData
): Promise<ActionResult<Comercial>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    const { data: comercial, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .eq('role', 'comercial')
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/comercials')
    return { success: true, data: comercial, message: 'Comercial actualizado correctamente' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar comercial',
    }
  }
}

/**
 * Toggle comercial status
 */
export async function toggleComercialStatus(id: string): Promise<ActionResult<Comercial>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    // Get current status
    const { data: current, error: fetchError } = await supabase
      .from('users')
      .select('status')
      .eq('id', id)
      .eq('role', 'comercial')
      .single()

    if (fetchError) throw fetchError

    const newStatus = current.status === 'active' ? 'inactive' : 'active'

    const { data: comercial, error } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', id)
      .eq('role', 'comercial')
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/comercials')
    return {
      success: true,
      data: comercial,
      message: `Comercial ${newStatus === 'active' ? 'activado' : 'desactivado'} correctamente`
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar estado',
    }
  }
}

// =====================================================
// STATISTICS ACTIONS
// =====================================================

/**
 * Get global system statistics
 */
export async function getGlobalStats(): Promise<ActionResult<GlobalStats>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

    // Companies
    const [companies, activeCompanies, inactiveCompanies, newCompaniesThisMonth] = await Promise.all([
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('companies').select('id', { count: 'exact', head: true }).eq('status', 'inactive'),
      supabase.from('companies').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
    ])

    // Users
    const [users, superadmins, admins, comercials, usuarios, newUsersThisMonth] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'superadmin'),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'admin'),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'comercial'),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'usuario'),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
    ])

    // Stores
    const [stores, activeStores] = await Promise.all([
      supabase.from('stores').select('id', { count: 'exact', head: true }),
      supabase.from('stores').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ])

    // Reservations
    const [reservations, activeReservations, completedReservations, cancelledReservations, allReservations] = await Promise.all([
      supabase.from('reservations').select('id', { count: 'exact', head: true }),
      supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
      supabase.from('reservations').select('total_price'),
    ])

    // Revenue
    const totalRevenue = allReservations.data?.reduce((sum, r) => sum + (r.total_price || 0), 0) || 0

    const { data: revenueThisMonth } = await supabase
      .from('reservations')
      .select('total_price')
      .gte('created_at', firstDayOfMonth)

    const { data: revenueThisYear } = await supabase
      .from('reservations')
      .select('total_price')
      .gte('created_at', firstDayOfYear)

    const { data: revenueLastMonth } = await supabase
      .from('reservations')
      .select('total_price')
      .gte('created_at', lastMonth)
      .lt('created_at', lastMonthEnd)

    const revenue_this_month = revenueThisMonth?.reduce((sum, r) => sum + (r.total_price || 0), 0) || 0
    const revenue_this_year = revenueThisYear?.reduce((sum, r) => sum + (r.total_price || 0), 0) || 0
    const revenue_last_month = revenueLastMonth?.reduce((sum, r) => sum + (r.total_price || 0), 0) || 0

    // Calculate growth rate
    const growth_rate = revenue_last_month > 0
      ? ((revenue_this_month - revenue_last_month) / revenue_last_month) * 100
      : 0

    // Gifts
    const [gifts, giftsThisMonth] = await Promise.all([
      supabase.from('gifts').select('id', { count: 'exact', head: true }),
      supabase.from('gifts').select('id', { count: 'exact', head: true }).gte('created_at', firstDayOfMonth),
    ])

    const stats: GlobalStats = {
      total_companies: companies.count || 0,
      active_companies: activeCompanies.count || 0,
      inactive_companies: inactiveCompanies.count || 0,

      total_users: users.count || 0,
      users_by_role: {
        superadmin: superadmins.count || 0,
        admin: admins.count || 0,
        comercial: comercials.count || 0,
        usuario: usuarios.count || 0,
      },

      total_stores: stores.count || 0,
      active_stores: activeStores.count || 0,

      total_reservations: reservations.count || 0,
      active_reservations: activeReservations.count || 0,
      completed_reservations: completedReservations.count || 0,
      cancelled_reservations: cancelledReservations.count || 0,

      total_revenue: totalRevenue,
      revenue_this_month,
      revenue_this_year,

      total_gifts: gifts.count || 0,
      gifts_this_month: giftsThisMonth.count || 0,

      new_users_this_month: newUsersThisMonth.count || 0,
      new_companies_this_month: newCompaniesThisMonth.count || 0,
      growth_rate,
    }

    return { success: true, data: stats }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener estadísticas',
    }
  }
}

// =====================================================
// SYSTEM CONFIG ACTIONS
// =====================================================

/**
 * Get system configuration
 */
export async function getSystemConfig(): Promise<ActionResult<SystemConfig>> {
  try {
    await requireRole('superadmin')
    const supabase = createServerComponentClient()

    const { data, error } = await supabase
      .from('config')
      .select('*')
      .single()

    if (error) throw error

    return { success: true, data: data as SystemConfig }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener configuración',
    }
  }
}

/**
 * Update system configuration
 */
export async function updateSystemConfig(
  data: UpdateSystemConfigData
): Promise<ActionResult<SystemConfig>> {
  try {
    const user = await requireRole('superadmin')
    const supabase = createServerComponentClient()

    const { data: config, error } = await supabase
      .from('config')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/config')
    return { success: true, data: config as SystemConfig, message: 'Configuración actualizada correctamente' }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar configuración',
    }
  }
}
