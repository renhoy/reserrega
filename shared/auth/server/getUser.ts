/**
 * =====================================================
 * GET USER (Server-side)
 * =====================================================
 * Get current authenticated user from server context
 * Returns null if not authenticated
 * =====================================================
 */

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { AuthUser, AuthError } from '../types/auth.types'
import type { Database } from '@/shared/database/types/database.types'

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
    const cookieStore = await cookies()

    // Create Supabase client with cookies
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Get session from Supabase Auth
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return null
    }

    const authUser = session.user

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
