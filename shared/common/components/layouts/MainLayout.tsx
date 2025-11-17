'use client'

/**
 * =====================================================
 * MAIN LAYOUT COMPONENT
 * =====================================================
 * Main application layout combining Header, Sidebar, and Footer
 * Responsive design with mobile sidebar support
 * =====================================================
 */

import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { Sheet, SheetContent } from '@/shared/common/components/ui/sheet'
import type { AuthUser } from '@/shared/auth/types/auth.types'
import { cn } from '@/shared/common/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  user: AuthUser | null
  showSidebar?: boolean
  showFooter?: boolean
  className?: string
}

/**
 * Main layout component
 *
 * Combines Header, Sidebar (optional), and Footer (optional)
 * Includes responsive mobile sidebar
 *
 * @example
 * ```tsx
 * import { MainLayout } from '@/shared/common/components/layouts'
 *
 * export default function DashboardPage() {
 *   const user = await requireAuth()
 *
 *   return (
 *     <MainLayout user={user}>
 *       <h1>Dashboard</h1>
 *     </MainLayout>
 *   )
 * }
 * ```
 */
export function MainLayout({
  children,
  user,
  showSidebar = true,
  showFooter = true,
  className,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <Header
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        {showSidebar && user && (
          <aside className="hidden md:block w-64 flex-shrink-0">
            <Sidebar user={user} />
          </aside>
        )}

        {/* Mobile Sidebar (Sheet) */}
        {showSidebar && user && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar user={user} />
            </SheetContent>
          </Sheet>
        )}

        {/* Page Content */}
        <main className={cn('flex-1 overflow-x-hidden', className)}>
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}
