import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/shared/auth/server";
import { isDevelopmentMode, getAppName } from "@/lib/helpers/config-helpers";
import LoginForm from "@/components/auth/LoginForm";
import { InactiveUserDialog } from "@/components/auth/InactiveUserDialog";
import { Gift } from "lucide-react";

interface LoginPageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reason } = await searchParams;

  // Verificar si el usuario ya está autenticado
  const user = await getUser();

  if (user) {
    // Redirigir según rol
    switch (user.role) {
      case "superadmin":
      case "admin":
        redirect("/dashboard");
      case "comercial":
        redirect("/scan");
      default:
        redirect("/wishlist");
    }
  }

  // Obtener configuración
  const isDev = await isDevelopmentMode();
  const appName = await getAppName();

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-purple-50"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header con logo/título */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
              <Gift className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{appName}</h2>
          </Link>
          <p className="mt-2 text-sm text-gray-600">
            La app de regalos perfectos - Reserva, comparte y regala
          </p>
        </div>

        {/* Formulario de login */}
        <LoginForm />

        {/* Diálogo de usuario inactivo */}
        <InactiveUserDialog showDialog={reason === 'inactive'} />
      </div>
    </div>
  );
}
