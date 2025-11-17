/**
 * =====================================================
 * VALIDATORS
 * =====================================================
 * Common validation functions
 * =====================================================
 */

/**
 * Validate email format
 *
 * @param email - Email to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid-email') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate Spanish phone number
 *
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidPhone('611234567') // true
 * isValidPhone('+34611234567') // true
 * isValidPhone('12345') // false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Spanish mobile: +34 followed by 9 digits OR just 9 digits
  const phoneRegex = /^(\+34)?[6-7]\d{8}$/

  return phoneRegex.test(cleaned)
}

/**
 * Validate Spanish DNI/NIE
 *
 * @param dni - DNI/NIE to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidDNI('12345678Z') // true
 * isValidDNI('X1234567L') // true (NIE)
 * isValidDNI('12345678A') // false (wrong letter)
 * ```
 */
export function isValidDNI(dni: string): boolean {
  const dniRegex = /^[XYZ]?\d{7,8}[A-Z]$/i
  if (!dniRegex.test(dni)) return false

  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const dniUpper = dni.toUpperCase()

  // Replace X, Y, Z with 0, 1, 2
  let number = dniUpper.replace('X', '0').replace('Y', '1').replace('Z', '2')
  number = number.slice(0, -1) // Remove letter

  const letter = dniUpper.slice(-1)
  const expectedLetter = letters[parseInt(number) % 23]

  return letter === expectedLetter
}

/**
 * Validate Spanish CIF (Company Tax ID)
 *
 * @param cif - CIF to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidCIF('A12345678') // true
 * isValidCIF('B87654321') // true
 * ```
 */
export function isValidCIF(cif: string): boolean {
  const cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/i
  return cifRegex.test(cif.toUpperCase())
}

/**
 * Validate password strength
 *
 * @param password - Password to validate
 * @param minLength - Minimum length (default: 8)
 * @returns Object with validation result and reasons
 *
 * @example
 * ```ts
 * isStrongPassword('Pass123!') // { valid: true, reasons: [] }
 * isStrongPassword('weak') // { valid: false, reasons: ['...'] }
 * ```
 */
export function isStrongPassword(
  password: string,
  minLength: number = 8
): { valid: boolean; reasons: string[] } {
  const reasons: string[] = []

  if (password.length < minLength) {
    reasons.push(`Debe tener al menos ${minLength} caracteres`)
  }

  if (!/[a-z]/.test(password)) {
    reasons.push('Debe contener al menos una minúscula')
  }

  if (!/[A-Z]/.test(password)) {
    reasons.push('Debe contener al menos una mayúscula')
  }

  if (!/\d/.test(password)) {
    reasons.push('Debe contener al menos un número')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    reasons.push('Debe contener al menos un carácter especial')
  }

  return {
    valid: reasons.length === 0,
    reasons,
  }
}

/**
 * Validate URL format
 *
 * @param url - URL to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidURL('https://example.com') // true
 * isValidURL('not-a-url') // false
 * ```
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate postal code (Spain)
 *
 * @param postalCode - Postal code to validate
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidPostalCode('28001') // true
 * isValidPostalCode('1234') // false
 * ```
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/
  return postalCodeRegex.test(postalCode)
}

/**
 * Check if string is empty or only whitespace
 *
 * @param str - String to check
 * @returns true if empty, false otherwise
 *
 * @example
 * ```ts
 * isEmpty('   ') // true
 * isEmpty('hello') // false
 * ```
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0
}

/**
 * Validate credit card number using Luhn algorithm
 *
 * @param cardNumber - Credit card number
 * @returns true if valid, false otherwise
 *
 * @example
 * ```ts
 * isValidCardNumber('4532015112830366') // true (Visa test card)
 * ```
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')

  if (!/^\d+$/.test(cleaned)) return false

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i))

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}
