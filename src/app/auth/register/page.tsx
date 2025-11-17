/**
 * =====================================================
 * REGISTER PAGE
 * =====================================================
 * Public page for user registration
 * =====================================================
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/shared/auth/server'
import { RegisterForm } from '@/shared/auth/components/RegisterForm'

interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  // Redirect if already authenticated
  const user = await getUser()
  if (user) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const redirectTo = params.redirect || '/dashboard'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta en Reserrega
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  )
}
