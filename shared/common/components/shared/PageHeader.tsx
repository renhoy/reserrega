/**
 * =====================================================
 * PAGE HEADER COMPONENT
 * =====================================================
 * Consistent page header with title, description, and actions
 * =====================================================
 */

import { ReactNode } from 'react'
import { cn } from '@/shared/common/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

/**
 * Page header component
 *
 * Provides a consistent header for pages with optional actions
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Mi Wishlist"
 *   description="Todos los productos que has reservado"
 *   actions={
 *     <Button>
 *       <Plus className="mr-2 h-4 w-4" />
 *       Nueva reserva
 *     </Button>
 *   }
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
