'use client'

/**
 * =====================================================
 * USE USER HOOK
 * =====================================================
 * Hook for getting user data from database
 * =====================================================
 */

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UseUserReturn, AuthUser, AuthError } from '../types/auth.types'
import type { Tables } from '@/shared/database/types/database.types'

/**
 * Get user data from database
 *
 * @returns User data and methods
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, loading, refetch } = useUser()
 *
 *   if (loading) return <div>Loading...</div>
 *   if (!user) return <div>Not found</div>
 *
 *   return <div>{user.name}</div>
 * }
 * ```
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Get auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        setUser(null)
        setLoading(false)
        return
      }

      // Get database user
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (dbError) {
        console.error('[useUser] Database error:', dbError)
        setError({
          code: 'user_not_found',
          message: 'User not found in database',
        })
        setUser(null)
        return
      }

      const dbUser = data as Tables<'users'>

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

      setUser(combinedUser)
    } catch (err) {
      console.error('[useUser] Unexpected error:', err)
      setError({
        code: 'server_error',
        message: 'Failed to fetch user',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  useEffect(() => {
    fetchUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    refetch,
  }
}
