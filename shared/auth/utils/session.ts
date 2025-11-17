/**
 * =====================================================
 * SESSION UTILITIES
 * =====================================================
 * Session management utilities
 * =====================================================
 */

import { cookies } from 'next/headers'
import type { AuthSession } from '../types/auth.types'
import { SESSION_COOKIE_NAME, REFRESH_SESSION_THRESHOLD } from './constants'

/**
 * Get session from cookie (server-side)
 *
 * @returns Session data or null
 */
export async function getSessionFromCookie(): Promise<AuthSession> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie) {
      return null
    }

    // Parse session from cookie
    const session = JSON.parse(sessionCookie.value) as AuthSession
    return session
  } catch (error) {
    console.error('[getSessionFromCookie] Error:', error)
    return null
  }
}

/**
 * Set session cookie (server-side)
 *
 * @param session - Session to set
 */
export async function setSessionCookie(session: AuthSession): Promise<void> {
  try {
    if (!session) return

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.expires_in || 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  } catch (error) {
    console.error('[setSessionCookie] Error:', error)
  }
}

/**
 * Clear session cookie (server-side)
 */
export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
  } catch (error) {
    console.error('[clearSessionCookie] Error:', error)
  }
}

/**
 * Check if session needs refresh
 *
 * @param session - Session to check
 * @returns true if needs refresh, false otherwise
 */
export function needsRefresh(session: AuthSession): boolean {
  if (!session) return false

  const expiresAt = session.expires_at
  if (!expiresAt) return false

  const expiresAtTime = new Date(expiresAt).getTime()
  const now = Date.now()
  const timeUntilExpiry = expiresAtTime - now

  // Refresh if expires in less than threshold
  return timeUntilExpiry < REFRESH_SESSION_THRESHOLD * 1000
}

/**
 * Check if session is expired
 *
 * @param session - Session to check
 * @returns true if expired, false otherwise
 */
export function isExpired(session: AuthSession): boolean {
  if (!session) return true

  const expiresAt = session.expires_at
  if (!expiresAt) return true

  const expiresAtTime = new Date(expiresAt).getTime()
  const now = Date.now()

  return now >= expiresAtTime
}

/**
 * Get time until session expires (in seconds)
 *
 * @param session - Session to check
 * @returns Seconds until expiry, or 0 if expired
 */
export function getTimeUntilExpiry(session: AuthSession): number {
  if (!session) return 0

  const expiresAt = session.expires_at
  if (!expiresAt) return 0

  const expiresAtTime = new Date(expiresAt).getTime()
  const now = Date.now()
  const timeUntilExpiry = expiresAtTime - now

  return Math.max(0, Math.floor(timeUntilExpiry / 1000))
}
