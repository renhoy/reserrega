/**
 * =====================================================
 * AUTH MIDDLEWARE
 * =====================================================
 * Middleware for protecting routes
 * =====================================================
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/shared/database/types/database.types'
import { PUBLIC_ROUTES, ADMIN_ROUTES, SUPERADMIN_ROUTES, COMERCIAL_ROUTES } from '../utils/constants'

/**
 * Auth middleware for Next.js
 *
 * Protects routes based on authentication and roles
 *
 * @example
 * ```ts
 * // src/middleware.ts
 * export { authMiddleware as default } from '@/shared/auth/middleware'
 *
 * export const config = {
 *   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
 * }
 * ```
 */
export async function authMiddleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Allow public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  )

  if (isPublicRoute) {
    // Redirect to dashboard if already authenticated and trying to access auth pages
    if (session && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
    return supabaseResponse
  }

  // Require authentication for protected routes
  if (!session) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Get user data from database
  const { data: user } = await supabase
    .from('users')
    .select('id, role, status')
    .eq('id', session.user.id)
    .single()

  if (!user) {
    // User not found in database, redirect to login
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Check if user is active
  if (user.status !== 'active') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/inactive'
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-based access
  const isSuperadminRoute = SUPERADMIN_ROUTES.some(route => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
  const isComercialRoute = COMERCIAL_ROUTES.some(route => pathname.startsWith(route))

  // Superadmin routes - only superadmin
  if (isSuperadminRoute && user.role !== 'superadmin') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/unauthorized'
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes - admin or superadmin
  if (isAdminRoute && !['admin', 'superadmin'].includes(user.role)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/unauthorized'
    return NextResponse.redirect(redirectUrl)
  }

  // Comercial routes - comercial, admin, or superadmin
  if (isComercialRoute && !['comercial', 'admin', 'superadmin'].includes(user.role)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/unauthorized'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
