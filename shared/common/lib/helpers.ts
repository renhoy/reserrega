/**
 * =====================================================
 * HELPERS
 * =====================================================
 * Utility helper functions for strings, arrays, objects
 * =====================================================
 */

// ==================== STRING HELPERS ====================

/**
 * Capitalize first letter of a string
 *
 * @example
 * ```ts
 * capitalize('hello') // "Hello"
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert string to title case
 *
 * @example
 * ```ts
 * titleCase('hello world') // "Hello World"
 * ```
 */
export function titleCase(str: string): string {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Truncate string to specified length
 *
 * @example
 * ```ts
 * truncate('Hello World', 8) // "Hello..."
 * truncate('Short', 10) // "Short"
 * ```
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) return str
  return str.slice(0, length).trim() + suffix
}

/**
 * Generate slug from string
 *
 * @example
 * ```ts
 * slugify('Hello World!') // "hello-world"
 * slugify('Niño español') // "nino-espanol"
 * ```
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
    .replace(/(^-|-$)/g, '') // Remove leading/trailing -
}

/**
 * Get initials from name
 *
 * @example
 * ```ts
 * getInitials('José Ignacio Vela') // "JV"
 * getInitials('John Doe', 3) // "JD"
 * ```
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  if (!name) return ''

  const words = name.trim().split(' ')
  const initials = words
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('')

  return initials
}

/**
 * Remove HTML tags from string
 *
 * @example
 * ```ts
 * stripHtml('<p>Hello <strong>World</strong></p>') // "Hello World"
 * ```
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

// ==================== ARRAY HELPERS ====================

/**
 * Remove duplicates from array
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * unique(['a', 'b', 'a']) // ['a', 'b']
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * Group array items by key
 *
 * @example
 * ```ts
 * const users = [
 *   { name: 'John', role: 'admin' },
 *   { name: 'Jane', role: 'user' },
 *   { name: 'Bob', role: 'admin' }
 * ]
 * groupBy(users, 'role')
 * // { admin: [{...}, {...}], user: [{...}] }
 * ```
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Chunk array into smaller arrays
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/**
 * Shuffle array
 *
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4] (random order)
 * ```
 */
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get random item from array
 *
 * @example
 * ```ts
 * randomItem([1, 2, 3, 4, 5]) // 3 (random)
 * ```
 */
export function randomItem<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Sort array by key
 *
 * @example
 * ```ts
 * const users = [
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 25 },
 *   { name: 'Bob', age: 35 }
 * ]
 * sortBy(users, 'age') // Sorted by age ascending
 * sortBy(users, 'age', 'desc') // Sorted by age descending
 * ```
 */
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1
    return 0
  })
}

// ==================== OBJECT HELPERS ====================

/**
 * Deep clone an object
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 } }
 * const cloned = deepClone(obj)
 * cloned.b.c = 3
 * console.log(obj.b.c) // 2 (original unchanged)
 * ```
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Pick specific keys from object
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * pick(obj, ['a', 'c']) // { a: 1, c: 3 }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

/**
 * Omit specific keys from object
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * omit(obj, ['b']) // { a: 1, c: 3 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

/**
 * Check if object is empty
 *
 * @example
 * ```ts
 * isEmptyObject({}) // true
 * isEmptyObject({ a: 1 }) // false
 * ```
 */
export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Merge objects deeply
 *
 * @example
 * ```ts
 * const obj1 = { a: 1, b: { c: 2 } }
 * const obj2 = { b: { d: 3 }, e: 4 }
 * deepMerge(obj1, obj2) // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target

  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key] as any, source[key] as any)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// ==================== UTILITY HELPERS ====================

/**
 * Sleep/delay for specified milliseconds
 *
 * @example
 * ```ts
 * await sleep(1000) // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate random ID
 *
 * @example
 * ```ts
 * generateId() // "a1b2c3d4"
 * generateId(12) // "a1b2c3d4e5f6"
 * ```
 */
export function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Clamp number between min and max
 *
 * @example
 * ```ts
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Check if value is defined (not null or undefined)
 *
 * @example
 * ```ts
 * isDefined(0) // true
 * isDefined('') // true
 * isDefined(null) // false
 * isDefined(undefined) // false
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
