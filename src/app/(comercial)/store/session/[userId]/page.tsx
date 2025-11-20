/**
 * =====================================================
 * STORE PANEL - Session Detail Page
 * =====================================================
 * Página de sesión específica por usuario (redirect to main)
 * =====================================================
 */

import { redirect } from 'next/navigation'

interface SessionPageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  // This page is not needed as sessions are handled in the main store page
  // Redirect to main store panel
  redirect('/store')
}
