'use client'

/**
 * =====================================================
 * LOGOUT BUTTON
 * =====================================================
 * Button component for logging out
 * =====================================================
 */

import { useState } from 'react'
import { logout } from '../actions/logout'

interface LogoutButtonProps {
  children?: React.ReactNode
  className?: string
  onLogout?: () => void
}

/**
 * Logout button component
 *
 * @example
 * ```tsx
 * import { LogoutButton } from '@/shared/auth'
 *
 * function Header() {
 *   return (
 *     <header>
 *       <LogoutButton>
 *         Cerrar sesión
 *       </LogoutButton>
 *     </header>
 *   )
 * }
 * ```
 */
export function LogoutButton({ children, className, onLogout }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      if (onLogout) {
        onLogout()
      }

      await logout()
    } catch (error) {
      console.error('[LogoutButton] Error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={className}
    >
      {loading ? 'Cerrando sesión...' : children || 'Cerrar sesión'}
    </button>
  )
}
