/**
 * =====================================================
 * EMPTY STATE COMPONENT
 * =====================================================
 * Display when there's no data to show
 * =====================================================
 */

import { LucideIcon } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { cn } from '@/shared/common/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * Empty state component
 *
 * Shows a friendly message when there's no data
 *
 * @example
 * ```tsx
 * import { Heart } from 'lucide-react'
 *
 * <EmptyState
 *   icon={Heart}
 *   title="No tienes productos en tu wishlist"
 *   description="Empieza a reservar productos en tienda para crear tu wishlist"
 *   action={{
 *     label: "Explorar productos",
 *     onClick: () => router.push('/products')
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-pink-100 p-3 dark:bg-pink-900">
          <Icon className="h-8 w-8 text-pink-600 dark:text-pink-400" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
