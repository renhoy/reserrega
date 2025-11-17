/**
 * =====================================================
 * FORMATTERS
 * =====================================================
 * Utility functions for formatting data
 * =====================================================
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Format a date to a readable string
 *
 * @param date - Date to format
 * @param formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDate(new Date()) // "17/11/2025"
 * formatDate(new Date(), 'dd MMM yyyy') // "17 nov 2025"
 * ```
 */
export function formatDate(
  date: Date | string,
  formatStr: string = 'dd/MM/yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

/**
 * Format a date as relative time
 *
 * @param date - Date to format
 * @returns Relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date()) // "hace unos segundos"
 * formatRelativeTime('2025-11-16') // "hace 1 día"
 * ```
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es })
}

/**
 * Format a date and time
 *
 * @param date - Date to format
 * @returns Formatted date and time string
 *
 * @example
 * ```ts
 * formatDateTime(new Date()) // "17/11/2025 14:30"
 * ```
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

/**
 * Format a number as currency
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'EUR')
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(1234.56) // "1.234,56 €"
 * formatCurrency(1234.56, 'USD') // "1.234,56 US$"
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR'
): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format a number
 *
 * @param num - Number to format
 * @param decimals - Number of decimals (default: 0)
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1234567) // "1.234.567"
 * formatNumber(1234.567, 2) // "1.234,57"
 * ```
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Format a percentage
 *
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimals (default: 0)
 * @param isDecimal - Whether the value is a decimal (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercentage(0.1234) // "12%"
 * formatPercentage(0.1234, 2) // "12,34%"
 * formatPercentage(12.34, 1, false) // "12,3%"
 * ```
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  isDecimal: boolean = true
): string {
  const percentage = isDecimal ? value * 100 : value
  return `${formatNumber(percentage, decimals)}%`
}

/**
 * Format file size
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size
 *
 * @example
 * ```ts
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${formatNumber(size, unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

/**
 * Format phone number
 *
 * @param phone - Phone number to format
 * @returns Formatted phone number
 *
 * @example
 * ```ts
 * formatPhone('611234567') // "+34 611 23 45 67"
 * formatPhone('+34611234567') // "+34 611 23 45 67"
 * ```
 */
export function formatPhone(phone: string): string {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Spanish mobile format
  if (cleaned.startsWith('+34')) {
    const number = cleaned.slice(3)
    return `+34 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`
  }

  // Add +34 if just 9 digits
  if (cleaned.length === 9) {
    return `+34 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`
  }

  return phone
}
