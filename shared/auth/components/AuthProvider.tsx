'use client'

/**
 * =====================================================
 * AUTH PROVIDER
 * =====================================================
 * Context provider for global auth state
 * =====================================================
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { UseAuthReturn } from '../types/auth.types'

const AuthContext = createContext<UseAuthReturn | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Auth Provider component
 *
 * Provides auth state to all children components
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { AuthProvider } from '@/shared/auth'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Use auth context
 *
 * @returns Auth state from context
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading } = useAuthContext()
 *
 *   if (loading) return <div>Loading...</div>
 *   if (!user) return <div>Not authenticated</div>
 *
 *   return <div>Hello {user.name}</div>
 * }
 * ```
 */
export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
