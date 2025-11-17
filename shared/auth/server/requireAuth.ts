/**
 * =====================================================
 * REQUIRE AUTH (Server-side)
 * =====================================================
 * Require authentication in Server Components
 * Redirects to login if not authenticated
 * =====================================================
 */

import { redirect } from 'next/navigation'
import { getUser } from './getUser'
import type { AuthUser } from '../types/auth.types'

/**
 * Require authentication (server-side)
 * Redirects to /auth/login if not authenticated
 *
 * @param redirectTo - Optional redirect destination after login
 * @returns Authenticated user
 * @throws Redirect if not authenticated
 *
 * @example
 * ```ts
 * // In Server Component
 * import { requireAuth } from '@/shared/auth/server'
 *
 * export default async function DashboardPage() {
 *   const user = await requireAuth()
 *
 *   // User is guaranteed to be authenticated here
 *   return <div>Welcome {user.name}</div>
 * }
 * ```
 */
export async function requireAuth(
  redirectTo?: string
): Promise<AuthUser> {
  const user = await getUser()

  if (!user) {
    // Build redirect URL with return path
    const loginUrl = redirectTo
      ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
      : '/auth/login'

    redirect(loginUrl)
  }

  // Check if user is active
  if (user.status !== 'active') {
    redirect('/auth/inactive')
  }

  return user
}

/**
 * Require authentication with custom redirect
 *
 * @param options - Options for redirect
 * @returns Authenticated user
 * @throws Redirect if not authenticated
 *
 * @example
 * ```ts
 * const user = await requireAuthWithRedirect({
 *   redirectTo: '/auth/login',
 *   returnTo: '/dashboard/settings'
 * })
 * ```
 */
export async function requireAuthWithRedirect(options: {
  redirectTo?: string
  returnTo?: string
  checkStatus?: boolean
}): Promise<AuthUser> {
  const user = await getUser()

  if (!user) {
    const { redirectTo = '/auth/login', returnTo } = options
    const redirectUrl = returnTo
      ? `${redirectTo}?redirect=${encodeURIComponent(returnTo)}`
      : redirectTo

    redirect(redirectUrl)
  }

  // Check status if required
  if (options.checkStatus !== false && user.status !== 'active') {
    redirect('/auth/inactive')
  }

  return user
}

/**
 * Check if user is authenticated (doesn't redirect)
 *
 * @returns true if authenticated, false otherwise
 *
 * @example
 * ```ts
 * const isAuth = await isAuthenticated()
 * if (!isAuth) {
 *   // Show login prompt
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser()
  return user !== null && user.status === 'active'
}
