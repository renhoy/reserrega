/**
 * =====================================================
 * AUTH CALLBACK ROUTE
 * =====================================================
 * Handles Supabase Auth callback
 * Creates user in reserrega.users if doesn't exist
 * =====================================================
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Database } from '@/shared/database/types/database.types'
import { DEFAULT_ROLE } from '@/shared/auth/utils/constants'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
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

    try {
      // Exchange code for session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code)

      if (sessionError) {
        console.error('[auth/callback] Session error:', sessionError)
        return NextResponse.redirect(new URL('/auth/login?error=session_error', request.url))
      }

      const authUser = sessionData.user

      // Check if user exists in reserrega.users
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single()

      // Create user if doesn't exist
      if (!existingUser) {
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
            last_name: authUser.user_metadata?.last_name || null,
            phone: authUser.user_metadata?.phone || null,
            role: DEFAULT_ROLE,
            status: 'active',
            company_id: null,
          })

        if (insertError) {
          console.error('[auth/callback] Insert error:', insertError)
          // Don't block login if insert fails, user might already exist
        }
      }

      // Redirect to next page
      return NextResponse.redirect(new URL(next, request.url))
    } catch (error) {
      console.error('[auth/callback] Unexpected error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=callback_error', request.url))
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
