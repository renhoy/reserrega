/**
 * =====================================================
 * NEXT.JS MIDDLEWARE
 * =====================================================
 * Global middleware for route protection
 * =====================================================
 */

export { authMiddleware as default } from '@/shared/auth/middleware'

/**
 * Configure which routes the middleware runs on
 * Runs on all routes except:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico
 * - public files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
