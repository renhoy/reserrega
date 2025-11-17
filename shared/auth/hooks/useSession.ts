'use client'

/**
 * =====================================================
 * USE SESSION HOOK
 * =====================================================
 * Hook for getting current session
 * =====================================================
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UseSessionReturn, AuthSession, AuthError } from '../types/auth.types'

/**
 * Get current auth session
 *
 * @returns Session data
 *
 * @example
 * ```tsx
 * function SessionInfo() {
 *   const { session, loading } = useSession()
 *
 *   if (loading) return <div>Loading...</div>
 *   if (!session) return <div>No session</div>
 *
 *   return <div>Expires: {session.expires_at}</div>
 * }
 * ```
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<AuthSession>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error: sessionError }) => {
      if (sessionError) {
        console.error('[useSession] Session error:', sessionError)
        setError({
          code: 'session_expired',
          message: 'Failed to get session',
        })
      }
      setSession(currentSession)
      setLoading(false)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    loading,
    error,
  }
}
