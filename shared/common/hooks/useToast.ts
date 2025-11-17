'use client'

/**
 * =====================================================
 * USE TOAST HOOK
 * =====================================================
 * Wrapper hook for showing toast notifications
 * =====================================================
 */

import { toast as sonnerToast } from 'sonner'

/**
 * Hook for showing toast notifications
 *
 * @returns Toast notification functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast()
 *
 *   const handleSave = () => {
 *     try {
 *       // Save logic...
 *       toast.success('Guardado exitosamente')
 *     } catch (error) {
 *       toast.error('Error al guardar')
 *     }
 *   }
 *
 *   return <Button onClick={handleSave}>Guardar</Button>
 * }
 * ```
 */
export function useToast() {
  return {
    success: (message: string, description?: string) => {
      sonnerToast.success(message, {
        description,
      })
    },
    error: (message: string, description?: string) => {
      sonnerToast.error(message, {
        description,
      })
    },
    info: (message: string, description?: string) => {
      sonnerToast.info(message, {
        description,
      })
    },
    warning: (message: string, description?: string) => {
      sonnerToast.warning(message, {
        description,
      })
    },
    loading: (message: string) => {
      return sonnerToast.loading(message)
    },
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: any) => string)
      }
    ) => {
      return sonnerToast.promise(promise, messages)
    },
    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId)
    },
  }
}
