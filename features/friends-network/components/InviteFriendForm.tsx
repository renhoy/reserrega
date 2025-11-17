/**
 * =====================================================
 * FRIENDS-NETWORK MODULE - Invite Friend Form
 * =====================================================
 * Form component for inviting friends via email
 * =====================================================
 */

'use client'

import { useState } from 'react'
import { Mail, Send, Copy, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/common/components/ui/button'
import { Input } from '@/shared/common/components/ui/input'
import { Label } from '@/shared/common/components/ui/label'
import { Textarea } from '@/shared/common/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/common/components/ui/card'
import { Alert, AlertDescription } from '@/shared/common/components/ui/alert'
import type { EmailInvitation, SendInvitationFormData } from '../types/friends.types'
import { validateEmail, normalizeEmail } from '../lib/friends-utils'

// =====================================================
// TYPES
// =====================================================

interface InviteFriendFormProps {
  onSendInvitation: (data: SendInvitationFormData) => Promise<EmailInvitation>
  onClose?: () => void
  isLoading?: boolean
}

// =====================================================
// COMPONENT
// =====================================================

export function InviteFriendForm({
  onSendInvitation,
  onClose,
  isLoading = false,
}: InviteFriendFormProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({})
  const [isSending, setIsSending] = useState(false)
  const [sentInvitation, setSentInvitation] = useState<EmailInvitation | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { email?: string; message?: string } = {}

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido'
    }

    // Message is optional, but if provided, check length
    if (message && message.length > 500) {
      newErrors.message = 'El mensaje no puede exceder 500 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSending(true)

    try {
      const normalizedEmail = normalizeEmail(email)
      const invitation = await onSendInvitation({
        email: normalizedEmail,
        message: message.trim() || undefined,
      })

      setSentInvitation(invitation)
      setEmail('')
      setMessage('')
      setErrors({})
    } catch (error) {
      setErrors({
        email: 'Error al enviar la invitación. Intenta de nuevo.',
      })
    } finally {
      setIsSending(false)
    }
  }

  // Handle copy link
  const handleCopyLink = async () => {
    if (!sentInvitation) return

    try {
      await navigator.clipboard.writeText(sentInvitation.invitationLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = sentInvitation.invitationLink
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  // If invitation was sent successfully, show success message
  if (sentInvitation) {
    return (
      <Card className="border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">¡Invitación enviada!</CardTitle>
              <CardDescription>
                Se ha enviado un email a <span className="font-medium">{sentInvitation.email}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Link de invitación
            </Label>
            <div className="flex gap-2">
              <Input
                value={sentInvitation.invitationLink}
                readOnly
                className="bg-gray-50 font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex-shrink-0"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5 text-lime-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1.5" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              El link expira el{' '}
              <span className="font-medium">
                {new Date(sentInvitation.expiresAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            onClick={() => {
              setSentInvitation(null)
              setLinkCopied(false)
            }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
          >
            Enviar otra invitación
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cerrar
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Show form
  return (
    <Card className="border-pink-200">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl">Invitar Amigo por Email</CardTitle>
            <CardDescription>
              Envía una invitación para que se una a Reserva y Regala
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email del amigo <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="amigo@ejemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                className={`pl-10 ${errors.email ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                disabled={isSending || isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Message Input (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Mensaje personal (opcional)
            </Label>
            <Textarea
              id="message"
              placeholder="Ej: ¡Hola! Te invito a unirte a Reserva y Regala para compartir nuestras wishlists..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (errors.message) setErrors({ ...errors, message: undefined })
              }}
              rows={4}
              maxLength={500}
              className={errors.message ? 'border-red-300 focus-visible:ring-red-500' : ''}
              disabled={isSending || isLoading}
            />
            <div className="flex justify-between items-center">
              {errors.message ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.message}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  {message.length}/500 caracteres
                </p>
              )}
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Se enviará un email con un link de invitación válido por 7 días. Cuando tu amigo se
              registre, automáticamente serán amigos.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="submit"
            disabled={isSending || isLoading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar invitación
              </>
            )}
          </Button>
          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSending || isLoading}
            >
              Cancelar
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
