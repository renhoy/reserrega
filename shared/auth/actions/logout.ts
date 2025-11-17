'use server'

/**
 * =====================================================
 * LOGOUT ACTION
 * =====================================================
 * Server action for logging out
 * =====================================================
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/shared/database/types/database.types'
import type { ServerActionResult } from '../types/auth.types'

/**
 * Logout server action
 *
 * @returns Success result
 *
 * @example
 * ```tsx
 * 'use client'
 * import { logout } from '@/shared/auth/actions/logout'
 *
 * function LogoutButton() {
 *   const handleLogout = async () => {
 *     await logout()
 *   }
 *
 *   return <button onClick={handleLogout}>Logout</button>
 * }
 * ```
 */
export async function logout(): Promise<ServerActionResult> {
  try {
    const cookieStore = await cookies()

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
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // The `setAll` method was called from a Server Component
            }
          },
        },
      }
    )

    await supabase.auth.signOut()

    // Redirect to login
    redirect('/auth/login')
  } catch (error) {
    console.error('[logout] Error:', error)
    return {
      success: false,
      error: {
        code: 'server_error',
        message: 'Failed to logout',
      },
    }
  }
}
