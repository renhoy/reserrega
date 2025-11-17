'use client'

/**
 * =====================================================
 * VISIBILITY TOGGLE COMPONENT
 * =====================================================
 * Toggle component for changing product visibility
 * =====================================================
 */

import { Lock, Users, Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/common/components/ui/select'
import { Label } from '@/shared/common/components/ui/label'
import { cn } from '@/shared/common/lib/utils'
import type { WishlistVisibility } from '../types/wishlist.types'
import { formatVisibility, getVisibilityDescription } from '../lib/wishlist-utils'

interface VisibilityToggleProps {
  value: WishlistVisibility
  onChange: (visibility: WishlistVisibility) => void
  disabled?: boolean
  showLabel?: boolean
  showDescription?: boolean
  className?: string
}

/**
 * Visibility Toggle component
 *
 * Allows user to change product visibility setting
 *
 * @example
 * ```tsx
 * <VisibilityToggle
 *   value={visibility}
 *   onChange={(newVisibility) => updateVisibility(newVisibility)}
 *   showLabel
 * />
 * ```
 */
export function VisibilityToggle({
  value,
  onChange,
  disabled = false,
  showLabel = true,
  showDescription = false,
  className,
}: VisibilityToggleProps) {
  const options: Array<{
    value: WishlistVisibility
    label: string
    icon: typeof Lock
    description: string
  }> = [
    {
      value: 'private',
      label: 'Privado',
      icon: Lock,
      description: 'Solo tú puedes ver este producto',
    },
    {
      value: 'friends',
      label: 'Solo Amigos',
      icon: Users,
      description: 'Tus amigos pueden ver este producto',
    },
    {
      value: 'public',
      label: 'Público',
      icon: Globe,
      description: 'Cualquiera puede ver este producto',
    },
  ]

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <Label htmlFor="visibility-select">Visibilidad del producto</Label>
      )}

      <Select
        value={value}
        onValueChange={(newValue) => onChange(newValue as WishlistVisibility)}
        disabled={disabled}
      >
        <SelectTrigger id="visibility-select" className="w-full">
          <SelectValue>
            {selectedOption && (
              <div className="flex items-center gap-2">
                <selectedOption.icon className="h-4 w-4" />
                <span>{selectedOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-start gap-3">
                <option.icon className="h-4 w-4 mt-0.5" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  {showDescription && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showDescription && selectedOption && (
        <p className="text-sm text-muted-foreground">
          {selectedOption.description}
        </p>
      )}
    </div>
  )
}
