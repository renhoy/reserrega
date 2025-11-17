'use client'

/**
 * =====================================================
 * SIDEBAR COMPONENT
 * =====================================================
 * Navigation sidebar with role-based menu items
 * =====================================================
 */

import {
  Home,
  Package,
  Heart,
  Users,
  Store,
  Building,
  Settings,
  ShoppingBag,
  Gift,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/common/lib/utils'
import { Button } from '@/shared/common/components/ui/button'
import { ScrollArea } from '@/shared/common/components/ui/scroll-area'
import type { AuthUser, UserRole } from '@/shared/auth/types/auth.types'

interface SidebarProps {
  user: AuthUser | null
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['superadmin', 'admin', 'comercial', 'usuario'],
  },
  {
    title: 'Mi Wishlist',
    href: '/wishlist',
    icon: Heart,
    roles: ['usuario'],
  },
  {
    title: 'Reservas',
    href: '/reservations',
    icon: ShoppingBag,
    roles: ['usuario'],
  },
  {
    title: 'Amigos',
    href: '/friends',
    icon: UserPlus,
    roles: ['usuario'],
  },
  {
    title: 'Regalos',
    href: '/gifts',
    icon: Gift,
    roles: ['usuario'],
  },
  {
    title: 'Panel Tienda',
    href: '/store',
    icon: Store,
    roles: ['comercial'],
  },
  {
    title: 'Productos',
    href: '/products',
    icon: Package,
    roles: ['admin', 'comercial'],
  },
  {
    title: 'Usuarios',
    href: '/users',
    icon: Users,
    roles: ['admin', 'superadmin'],
  },
  {
    title: 'Empresas',
    href: '/companies',
    icon: Building,
    roles: ['superadmin'],
  },
  {
    title: 'Configuración',
    href: '/settings',
    icon: Settings,
    roles: ['superadmin', 'admin', 'comercial', 'usuario'],
  },
]

/**
 * Sidebar navigation component
 *
 * @example
 * ```tsx
 * <Sidebar user={user} />
 * ```
 */
export function Sidebar({ user, className }: SidebarProps) {
  const pathname = usePathname()

  // Filter nav items based on user role
  const filteredNavItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : []

  return (
    <div className={cn('pb-12 min-h-screen border-r bg-background', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navegación
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)] px-1">
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-lime-100 text-lime-900 hover:bg-lime-200 dark:bg-lime-900 dark:text-lime-100'
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
