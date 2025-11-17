/**
 * =====================================================
 * PRODUCT-RESERVATION MODULE - Main Exports
 * =====================================================
 * Central export point for Product-Reservation module
 * =====================================================
 */

// Components
export { QRGenerator } from './components/QRGenerator'
export { QRScanner } from './components/QRScanner'
export { ProductScanner } from './components/ProductScanner'
export { ReservationForm } from './components/ReservationForm'

// Hooks
export { useQRCode } from './hooks/useQRCode'
export { useReservation } from './hooks/useReservation'

// Actions
export { generateQRAction } from './actions/generateQR'
export {
  scanQRAction,
  scanProductAction,
  createProductAction,
  linkProductToUserAction,
} from './actions/scanProduct'
export {
  createReservationAction,
  getUserReservationsAction,
  getReservationByIdAction,
} from './actions/createReservation'
export { simulatePaymentAction } from './actions/simulatePayment'

// Utilities
export * from './lib/qr-utils'
export * from './lib/product-utils'

// Types
export * from './types/reservation.types'
