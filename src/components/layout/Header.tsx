"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gift,
  HelpCircle,
  Home,
  Heart,
  UserPlus,
  Users,
  Camera,
  Package,
  QrCode,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userId?: string;
  userRole?: string;
  userName?: string;
  isAuthenticated?: boolean;
  appName?: string;
  companyName?: string;
  issuerType?: string;
  currentPlan?: string;
  multiempresa?: boolean;
  showSubscriptions?: boolean;
  subscriptionsEnabled?: boolean;
  testingMode?: boolean; // NEW: Indica si mock time está activo
}

export function Header({
  userId,
  userRole,
  userName,
  isAuthenticated = true,
  appName = "Reserva y Regala",
  companyName,
  issuerType,
  currentPlan = "free",
  multiempresa = true,
  showSubscriptions = false,
  subscriptionsEnabled = false,
  testingMode = false,
}: HeaderProps) {
  const pathname = usePathname();

  // Si no está autenticado, mostrar header público
  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md text-white font-black text-sm">
                RR
              </div>
              <span className="text-xl font-bold text-gray-900">{appName}</span>
            </Link>

            {/* Enlaces de navegación */}
            <div className="flex items-center gap-6">
              {/* Solo mostrar Pricing si suscripciones habilitadas y multiempresa */}
              {multiempresa && subscriptionsEnabled && (
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
                >
                  Precios
                </Link>
              )}
              {/* Solo mostrar Registro en modo multiempresa */}
              {multiempresa && (
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                    Registro
                  </Button>
                </Link>
              )}
              <Link
                href="/login"
                className="text-gray-700 hover:text-pink-600 transition-colors font-medium"
              >
                Acceso
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Construir navegación según rol (solo si está autenticado)
  const isSuperadmin = userRole === "superadmin";
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  // Navegación simplificada a 4 items: Panel, Item 1, Item 2, Ayuda
  const navigation = isAdmin
    ? [
        // Admin/Superadmin: Panel, Usuarios, Empresas, Ayuda
        { name: "Panel", href: "/dashboard", icon: Home },
        { name: "Usuarios", href: "/users", icon: Users },
        { name: "Empresas", href: "/companies", icon: Package },
        { name: "Ayuda", href: "/help", icon: HelpCircle },
      ]
    : userRole === "comercial"
    ? [
        // Comercial: Escanear, Tienda, Reservas, Ayuda
        { name: "Escanear", href: "/scan", icon: Camera },
        { name: "Tienda", href: "/store", icon: Package },
        { name: "Reservas", href: "/reservations", icon: QrCode },
        { name: "Ayuda", href: "/help", icon: HelpCircle },
      ]
    : [
        // Usuario: Wishlist, Amigos, Reservas, Ayuda
        { name: "Wishlist", href: "/wishlist", icon: Heart },
        { name: "Amigos", href: "/friends", icon: UserPlus },
        { name: "Reservas", href: "/reservations", icon: Package },
        { name: "Ayuda", href: "/help", icon: HelpCircle },
      ];

  // Formatear rol para mostrar
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "comercial":
        return "Comercial";
      default:
        return "Usuario";
    }
  };

  // Debug log - commented out to avoid hooks rules violation
  // useEffect(() => {
  //   console.log("[Header] userRole:", userRole);
  //   console.log("[Header] userName:", userName);
  //   console.log(
  //     "[Header] navigation items:",
  //     navigation.map((n) => n.name)
  //   );
  // }, [userRole, userName]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-pink-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAdmin ? "/dashboard" : userRole === "comercial" ? "/scan" : "/wishlist"}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md text-white font-black text-sm">
              RR
            </div>
            <span className="text-xl font-bold text-gray-900">{appName}</span>
            {testingMode && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded uppercase">
                TEST
              </span>
            )}
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && item.href !== "/wishlist" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-pink-50 text-pink-700"
                      : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu Dropdown */}
          <UserMenu
            userId={userId}
            userName={userName}
            userRole={userRole}
            companyName={companyName}
            issuerType={issuerType}
            currentPlan={currentPlan}
            showSubscriptions={showSubscriptions}
          />
        </div>
      </div>
    </header>
  );
}
