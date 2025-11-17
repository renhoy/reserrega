'use client'

/**
 * =====================================================
 * USE AUTH HOOK
 * =====================================================
 * Main authentication hook for client components
 * =====================================================
 */

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { UseAuthReturn, AuthUser, AuthSession, AuthError } from '../types/auth.types'
import type { Tables } from '@/shared/database/types/database.types'

/**
 * Main authentication hook
 *
 * @returns Auth state and methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, signOut } = useAuth()
 *
 *   if (loading) return <div>Loading...</div>
 *   if (!user) return <div>Not authenticated</div>
 *
 *   return (
 *     <div>
 *       <h1>Hello {user.name}</h1>
 *       <button onClick={signOut}>Logout</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[useAuth] Error fetching user:', error)
        setError({
          code: 'user_not_found',
          message: 'User not found in database',
        })
        return null
      }

      const dbUser = data as Tables<'users'>

      // Get auth user from session
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) return null

      const combinedUser: AuthUser = {
        id: authUser.id,
        email: authUser.email!,
        emailConfirmed: !!authUser.email_confirmed_at,
        createdAt: authUser.created_at,
        role: dbUser.role,
        name: dbUser.name,
        lastName: dbUser.last_name,
        companyId: dbUser.company_id,
        status: dbUser.status,
        avatarUrl: dbUser.avatar_url,
        phone: dbUser.phone,
        birthDate: dbUser.birth_date,
      }

      return combinedUser
    } catch (err) {
      console.error('[useAuth] Unexpected error:', err)
      setError({
        code: 'server_error',
        message: 'Failed to fetch user data',
      })
      return null
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      setSession(currentSession)

      if (currentSession?.user) {
        const userData = await fetchUserData(currentSession.user.id)
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('[useAuth] Refresh error:', err)
      setError({
        code: 'server_error',
        message: 'Failed to refresh auth state',
      })
    } finally {
      setLoading(false)
    }
  }, [fetchUserData])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      router.push('/auth/login')
      router.refresh()
    } catch (err) {
      console.error('[useAuth] Sign out error:', err)
      setError({
        code: 'server_error',
        message: 'Failed to sign out',
      })
    }
  }, [router])

  useEffect(() => {
    // Initial session check
    refresh()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (currentSession?.user) {
            const userData = await fetchUserData(currentSession.user.id)
            setUser(userData)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }

        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUserData, refresh])

  return {
    user,
    session,
    loading,
    error,
    signOut,
    refresh,
  }
}
