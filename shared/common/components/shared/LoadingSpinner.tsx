/**
 * =====================================================
 * LOADING SPINNER COMPONENT
 * =====================================================
 * Reusable loading indicator with different sizes
 * =====================================================
 */

import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/common/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

/**
 * Loading spinner component
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" text="Cargando..." />
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2
        className={cn(
          'animate-spin text-pink-500',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}

/**
 * Full page loading spinner
 *
 * @example
 * ```tsx
 * <LoadingPage text="Cargando datos..." />
 * ```
 */
export function LoadingPage({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}
