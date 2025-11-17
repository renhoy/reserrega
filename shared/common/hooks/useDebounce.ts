'use client'

/**
 * =====================================================
 * USE DEBOUNCE HOOK
 * =====================================================
 * Hook for debouncing values
 * =====================================================
 */

import { useState, useEffect } from 'react'

/**
 * Hook for debouncing a value
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [search, setSearch] = useState('')
 *   const debouncedSearch = useDebounce(search, 500)
 *
 *   useEffect(() => {
 *     // This will only run 500ms after the user stops typing
 *     if (debouncedSearch) {
 *       performSearch(debouncedSearch)
 *     }
 *   }, [debouncedSearch])
 *
 *   return (
 *     <input
 *       value={search}
 *       onChange={(e) => setSearch(e.target.value)}
 *       placeholder="Buscar..."
 *     />
 *   )
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
