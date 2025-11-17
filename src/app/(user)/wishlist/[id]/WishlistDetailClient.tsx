'use client'

/**
 * =====================================================
 * WISHLIST DETAIL CLIENT COMPONENT
 * =====================================================
 * Client-side interactivity for wishlist detail page
 * =====================================================
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { VisibilityToggle } from '@/features/wishlist/components/VisibilityToggle'
import { useToast } from '@/shared/common/hooks/useToast'
import { updateVisibilityAction } from '@/features/wishlist/actions/updateVisibility'
import { removeFromWishlistAction } from '@/features/wishlist/actions/updateVisibility'
import type { WishlistVisibility } from '@/features/wishlist/types/wishlist.types'

interface WishlistDetailClientProps {
  wishlistId: string
  initialVisibility: WishlistVisibility
}

export function WishlistDetailClient({
  wishlistId,
  initialVisibility,
}: WishlistDetailClientProps) {
  const [visibility, setVisibility] = useState<WishlistVisibility>(initialVisibility)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const handleVisibilityChange = async (newVisibility: WishlistVisibility) => {
    setIsUpdating(true)
    const previousVisibility = visibility

    // Optimistic update
    setVisibility(newVisibility)

    try {
      await updateVisibilityAction(wishlistId, newVisibility)
      toast.success('Visibilidad actualizada', 'La visibilidad ha sido actualizada correctamente')
    } catch (error) {
      console.error('[WishlistDetailClient] Error updating visibility:', error)
      // Rollback
      setVisibility(previousVisibility)
      toast.error('Error', 'No se pudo actualizar la visibilidad')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto de tu wishlist?')) {
      return
    }

    setIsDeleting(true)

    try {
      await removeFromWishlistAction(wishlistId)
      toast.success('Producto eliminado', 'El producto ha sido eliminado de tu wishlist')
      router.push('/wishlist')
      router.refresh()
    } catch (error) {
      console.error('[WishlistDetailClient] Error deleting item:', error)
      toast.error('Error', 'No se pudo eliminar el producto')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <VisibilityToggle
        value={visibility}
        onChange={handleVisibilityChange}
        disabled={isUpdating}
        showLabel={false}
        showDescription
      />

      <Button
        variant="destructive"
        className="w-full"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? 'Eliminando...' : 'Eliminar de la Wishlist'}
      </Button>
    </div>
  )
}
