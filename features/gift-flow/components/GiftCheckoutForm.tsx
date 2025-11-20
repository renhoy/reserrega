'use client'

/**
 * =====================================================
 * GIFT CHECKOUT FORM COMPONENT
 * =====================================================
 * Checkout form with simulated payment for gifts
 * =====================================================
 */

import { useState } from 'react'
import { CreditCard, Lock, AlertCircle, Loader2, Heart } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/common/components/ui/card'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import { Textarea } from '@/shared/common/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/shared/common/components/ui/radio-group'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import { Separator } from '@/shared/common/components/ui/separator'
import { cn } from '@/shared/common/lib/utils'
import { LockTimerBadge } from './LockTimerBadge'
import { GiftSummaryCompact } from './GiftSummary'
import { formatGiftAmount } from '../lib/gift-utils'
import type { GiftCheckoutSession, GiftPaymentFormData } from '../types/gift.types'

interface GiftCheckoutFormProps {
  session: GiftCheckoutSession
  onSubmit?: (data: GiftPaymentFormData) => Promise<void>
  onCancel?: () => void
  isProcessing?: boolean
  className?: string
}

/**
 * Gift Checkout Form component
 *
 * Form for processing gift payment with simulated payment methods
 *
 * @example
 * ```tsx
 * <GiftCheckoutForm
 *   session={checkoutSession}
 *   onSubmit={handlePayment}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export function GiftCheckoutForm({
  session,
  onSubmit,
  onCancel,
  isProcessing = false,
  className,
}: GiftCheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleCardNumberChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim()
    setCardNumber(formatted.slice(0, 19)) // Max 16 digits + 3 spaces
  }

  const handleExpiryChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '')
    // Add slash after 2 digits
    let formatted = digits
    if (digits.length >= 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
    }
    setCardExpiry(formatted)
  }

  const handleCvcChange = (value: string) => {
    const digits = value.replace(/\D/g, '')
    setCardCvc(digits.slice(0, 3))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (paymentMethod === 'card') {
      const cardDigits = cardNumber.replace(/\D/g, '')
      if (!cardDigits || cardDigits.length !== 16) {
        newErrors.cardNumber = 'Número de tarjeta inválido'
      }

      if (!cardExpiry || cardExpiry.length !== 5) {
        newErrors.cardExpiry = 'Fecha de expiración inválida'
      }

      if (!cardCvc || cardCvc.length !== 3) {
        newErrors.cardCvc = 'CVC inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const formData: GiftPaymentFormData = {
      wishlistItemId: session.wishlistItemId,
      paymentMethod,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      cardExpiry: paymentMethod === 'card' ? cardExpiry : undefined,
      cardCvc: paymentMethod === 'card' ? cardCvc : undefined,
      message: message.trim() || undefined,
    }

    await onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Lock Timer Alert */}
      <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm text-amber-800 dark:text-amber-300">
            Completa el pago antes de que expire el tiempo
          </span>
          <LockTimerBadge lockedUntil={session.lockExpiresAt} />
        </AlertDescription>
      </Alert>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <GiftSummaryCompact session={session} />
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Método de Pago</CardTitle>
          <CardDescription>Selecciona cómo deseas pagar (Simulado para MVP)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'paypal')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Tarjeta de Crédito/Débito
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 4.114a.77.77 0 0 1 .76-.633h7.316c1.93 0 3.426.448 4.442 1.331 1.026.894 1.533 2.228 1.533 4.003 0 2.504-.845 4.442-2.514 5.767-1.66 1.323-4.003 1.994-6.975 1.994H7.417a.77.77 0 0 0-.76.633l-.58 3.128zm.66-10.95a.455.455 0 0 0-.452.382l-.936 5.056a.385.385 0 0 0 .38.448h1.878c2.305 0 4.124-.448 5.424-1.333 1.3-.895 1.95-2.228 1.95-3.987 0-1.323-.381-2.295-1.143-2.915-.761-.62-1.95-.931-3.567-.931H7.736z"/>
                </svg>
                PayPal
              </Label>
            </div>
          </RadioGroup>

          <Separator />

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className={cn('pr-10', errors.cardNumber && 'border-destructive')}
                    disabled={isProcessing}
                  />
                  <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                {errors.cardNumber && (
                  <p className="text-sm text-destructive">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Fecha de Expiración</Label>
                  <Input
                    id="cardExpiry"
                    type="text"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className={errors.cardExpiry ? 'border-destructive' : ''}
                    disabled={isProcessing}
                  />
                  {errors.cardExpiry && (
                    <p className="text-sm text-destructive">{errors.cardExpiry}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    type="text"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => handleCvcChange(e.target.value)}
                    className={errors.cardCvc ? 'border-destructive' : ''}
                    disabled={isProcessing}
                  />
                  {errors.cardCvc && (
                    <p className="text-sm text-destructive">{errors.cardCvc}</p>
                  )}
                </div>
              </div>

              <Alert className="bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800">
                <Lock className="h-4 w-4 text-sky-600" />
                <AlertDescription className="text-xs text-sky-800 dark:text-sky-300">
                  Este es un pago simulado para el MVP. No se realizará ningún cargo real.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* PayPal Note */}
          {paymentMethod === 'paypal' && (
            <Alert className="bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800">
              <Lock className="h-4 w-4 text-sky-600" />
              <AlertDescription className="text-sm text-sky-800 dark:text-sky-300">
                Serás redirigido a PayPal para completar el pago (simulado para MVP)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Optional Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Mensaje Personal (Opcional)
          </CardTitle>
          <CardDescription>Añade un mensaje especial para el destinatario</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Escribe un mensaje personal aquí..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={500}
            disabled={isProcessing}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {message.length}/500 caracteres
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isProcessing}
          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Pagar {formatGiftAmount(session.amount)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
