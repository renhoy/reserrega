/**
 * =====================================================
 * HEALTH CHECK API ENDPOINT
 * =====================================================
 * Simple health check for monitoring and Docker
 * =====================================================
 */

import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase/helpers'

// =====================================================
// GET - Health Check
// =====================================================

export async function GET() {
  try {
    // Check database connection
    const supabase = createServerComponentClient()
    const { error: dbError } = await supabase.from('companies').select('count').limit(1).single()

    // If database check fails, return unhealthy
    if (dbError && dbError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (OK, just means empty table)
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: dbError.message,
        },
        { status: 503 }
      )
    }

    // All checks passed
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    )
  } catch (error) {
    // Unexpected error
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

// =====================================================
// HEAD - Lightweight Health Check
// =====================================================

export async function HEAD() {
  // Simple check without database connection
  return new NextResponse(null, { status: 200 })
}
