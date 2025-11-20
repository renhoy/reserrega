/**
 * =====================================================
 * GET USER (Server-side)
 * =====================================================
 * Get current authenticated user from server context
 * Returns null if not authenticated
 * =====================================================
 */

import { createServerComponentClient } from '@/lib/supabase/helpers'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { AuthUser, AuthError } from '../types/auth.types'

/**
 * Get current authenticated user (server-side)
 *
 * @returns AuthUser if authenticated, null otherwise
 *
 * @example
 * ```ts
 * // In Server Component
 * import { getUser } from '@/shared/auth/server'
 *
 * export default async function Page() {
 *   const user = await getUser()
 *
 *   if (!user) {
 *     return <div>Not authenticated</div>
 *   }
 *
 *   return <div>Hello {user.name}</div>
 * }
 * ```
 */
export async function getUser(): Promise<AuthUser | null> {
  try {
    // Create Supabase client with proper session restoration
    const supabase = await createServerComponentClient()

    // Get user from Supabase Auth (validates token)
    const {
      data: { user: authUser },
      error: sessionError,
    } = await supabase.auth.getUser()

    if (sessionError || !authUser) {
      return null
    }

    // Get user data from reserrega.users
    const { data: dbUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (dbError || !dbUser) {
      console.error('[getUser] Error fetching user from database:', dbError)
      return null
    }

    // Check if user is inactive
    if (dbUser.status === 'inactive') {
      console.warn('[getUser] User is inactive:', dbUser.email)
      return null
    }

    // Combine auth user + database user
    const user: AuthUser = {
      // From auth.users
      id: authUser.id,
      email: authUser.email!,
      emailConfirmed: !!authUser.email_confirmed_at,
      createdAt: authUser.created_at,

      // From reserrega.users
      role: dbUser.role,
      name: dbUser.name,
      lastName: dbUser.last_name,
      companyId: dbUser.company_id,
      status: dbUser.status,
      avatarUrl: dbUser.avatar_url,
      phone: dbUser.phone,
      birthDate: dbUser.birth_date,
    }

    return user
  } catch (error) {
    console.error('[getUser] Unexpected error:', error)
    return null
  }
}

/**
 * Get user with error handling
 *
 * @returns Result with user or error
 */
export async function getUserWithError(): Promise<{
  user: AuthUser | null
  error: AuthError | null
}> {
  try {
    const user = await getUser()
    return { user, error: null }
  } catch (error) {
    return {
      user: null,
      error: {
        code: 'server_error',
        message: 'Failed to get user',
        details: error,
      },
    }
  }
}
