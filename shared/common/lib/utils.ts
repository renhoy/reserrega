/**
 * =====================================================
 * UTILITIES - Common
 * =====================================================
 * Utility functions for component styling and helpers
 * =====================================================
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 *
 * This is the standard cn() utility from shadcn/ui.
 * It combines clsx for conditional classes and tailwind-merge
 * to properly merge Tailwind classes without conflicts.
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * import { cn } from '@/shared/common/lib/utils'
 *
 * <div className={cn(
 *   'base-class',
 *   isActive && 'active-class',
 *   className
 * )} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
