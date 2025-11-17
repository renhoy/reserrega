/**
 * =====================================================
 * FOOTER COMPONENT
 * =====================================================
 * Simple footer with company info and links
 * =====================================================
 */

import Link from 'next/link'

/**
 * Footer component
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} Reserrega. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Privacidad
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Términos
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  )
}
