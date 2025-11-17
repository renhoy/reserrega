'use server'

/**
 * =====================================================
 * SIMULATE PAYMENT SERVER ACTION
 * =====================================================
 * Server action for simulating payment (1€ reservation fee)
 * =====================================================
 */

import type { PaymentSimulationResult } from '../types/reservation.types'

/**
 * Simulate payment for reservation
 *
 * In production, this would integrate with Stripe or another payment provider
 * For now, we just simulate a successful payment of 1€
 *
 * @param amount - Amount to pay (should be 1.00)
 * @returns Payment simulation result
 *
 * @example
 * ```tsx
 * const result = await simulatePaymentAction(1.00)
 * if (result.success) {
 *   console.log('Payment successful:', result.transactionId)
 * }
 * ```
 */
export async function simulatePaymentAction(amount: number = 1.00): Promise<PaymentSimulationResult> {
  // Validate amount
  if (amount !== 1.00) {
    throw new Error('El monto de reserva debe ser 1€')
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Simulate successful payment
  const transactionId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`

  return {
    success: true,
    transactionId,
    amountPaid: amount,
    timestamp: Date.now(),
  }
}
