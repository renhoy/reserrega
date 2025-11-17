'use client'

/**
 * =====================================================
 * USE MEDIA QUERY HOOK
 * =====================================================
 * Hook for responsive design with media queries
 * =====================================================
 */

import { useState, useEffect } from 'react'

/**
 * Hook for checking media queries
 *
 * @param query - Media query string
 * @returns Whether the media query matches
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *   const isDesktop = useMediaQuery('(min-width: 1024px)')
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    media.addEventListener('change', listener)

    // Cleanup
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

/**
 * Predefined breakpoint hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)')
}
