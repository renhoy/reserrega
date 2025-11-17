'use client'

/**
 * =====================================================
 * ERROR BOUNDARY COMPONENT
 * =====================================================
 * React Error Boundary for catching and displaying errors
 * =====================================================
 */

import { Component, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/common/components/ui/alert'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Algo salió mal</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Detalles del error (solo en desarrollo)
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-32 bg-destructive/10 p-2 rounded">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Recargar página
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}
