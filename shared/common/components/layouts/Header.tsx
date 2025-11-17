'use client'

/**
 * =====================================================
 * HEADER COMPONENT
 * =====================================================
 * Main header with navigation and user menu
 * =====================================================
 */

import { Menu, User, LogOut, Settings, Gift } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/common/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/common/components/ui/avatar'
import { LogoutButton } from '@/shared/auth/components/LogoutButton'
import { useAppName } from '@/hooks/useAppName'
import type { AuthUser } from '@/shared/auth/types/auth.types'

interface HeaderProps {
  user: AuthUser | null
  onMenuClick?: () => void
}

/**
 * Header component with navigation and user menu
 *
 * @example
 * ```tsx
 * <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
 * ```
 */
export function Header({ user, onMenuClick }: HeaderProps) {
  const initials = user
    ? `${user.name.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U'
  const appName = useAppName()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block">
              {appName}
            </span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                  <AvatarFallback className="bg-lime-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutButton className="w-full cursor-pointer flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </LogoutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
