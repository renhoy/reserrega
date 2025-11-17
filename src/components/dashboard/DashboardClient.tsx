"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { checkAndStartPendingTour } from "@/lib/helpers/tour-helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Gift,
  Heart,
  Home,
  Package,
  QrCode,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/helpers/format";
import type { HelpArticleMeta } from "@/lib/helpers/markdown-types";
import { TourButton } from "@/components/help/TourButton";

interface ReservationItem {
  id: string;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
  store: {
    name: string;
  };
  status: string;
  created_at: string;
  expires_at: string;
}

interface GiftItem {
  id: string;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
  buyer: {
    name: string;
  };
  created_at: string;
  shipping_status: string;
}

interface DashboardClientProps {
  initialStats: {
    totalReservations: number;
    activeReservations: number;
    totalWishlistItems: number;
    totalFriends: number;
    giftsSent: number;
    giftsReceived: number;
    recentReservations: ReservationItem[];
    recentGiftsReceived: GiftItem[];
  };
  userRole: string;
  helpArticles?: HelpArticleMeta[];
}

const statusColors: Record<string, string> = {
  active: "bg-lime-100 text-lime-800",
  expired: "bg-gray-100 text-gray-800",
  completed: "bg-violet-100 text-violet-800",
  cancelled: "bg-rose-100 text-rose-800",
};

const shippingStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  shipped: "bg-sky-100 text-sky-800",
  delivered: "bg-lime-100 text-lime-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export function DashboardClient({
  initialStats,
  userRole,
  helpArticles = [],
}: DashboardClientProps) {
  const [stats] = useState(initialStats);

  // Detectar si no hay datos (tablas no creadas)
  const hasNoData =
    stats.totalReservations === 0 &&
    stats.totalWishlistItems === 0 &&
    stats.totalFriends === 0 &&
    stats.giftsSent === 0 &&
    stats.giftsReceived === 0 &&
    stats.recentReservations.length === 0 &&
    stats.recentGiftsReceived.length === 0;

  // Detectar y ejecutar tour pendiente
  useEffect(() => {
    checkAndStartPendingTour();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-lime-50">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1
                className="text-3xl font-bold flex items-center gap-2"
                data-tour="titulo-dashboard"
              >
                <Home className="h-6 w-6" /> Panel de Control
              </h1>
              <TourButton tourId="dashboard-page" />
            </div>
            <p className="text-sm text-muted-foreground">
              Bienvenido a Reserrega - Tu red de regalos
            </p>
          </div>
        </div>

        {/* Mensaje informativo si no hay datos */}
        {hasNoData && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">
                    ¡Comienza a usar Reserrega!
                  </h3>
                  <p className="text-sm text-amber-800 mb-3">
                    Aún no tienes actividad en tu cuenta. Usa los accesos rápidos abajo para comenzar a reservar productos, crear tu wishlist y conectar con amigos.
                  </p>
                  <p className="text-xs text-amber-700">
                    <strong>Nota:</strong> Si eres administrador y ves este mensaje, es posible que las tablas de base de datos de Reserrega aún no estén creadas. Revisa <code className="bg-amber-100 px-1 rounded">shared/database/schema/RESERREGA_FINAL.sql</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas principales - Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-tour="estadisticas-principales"
        >
          {/* Wishlist */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mi Wishlist
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600">
                {stats.totalWishlistItems}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                productos deseados
              </p>
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mis Reservas
              </CardTitle>
              <Package className="h-5 w-5 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-lime-600">
                {stats.activeReservations}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                activas de {stats.totalReservations} totales
              </p>
            </CardContent>
          </Card>

          {/* Amigos */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mi Red
              </CardTitle>
              <Users className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-600">
                {stats.totalFriends}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                amigos conectados
              </p>
            </CardContent>
          </Card>

          {/* Regalos Enviados */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Regalos Enviados
              </CardTitle>
              <Heart className="h-5 w-5 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-500">
                {stats.giftsSent}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                regalos realizados
              </p>
            </CardContent>
          </Card>

          {/* Regalos Recibidos */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Regalos Recibidos
              </CardTitle>
              <Gift className="h-5 w-5 text-fuchsia-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fuchsia-500">
                {stats.giftsReceived}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                regalos de amigos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <Card data-tour="accesos-rapidos" className="bg-lime-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Accesos Rápidos
            </CardTitle>
            <CardDescription>Acciones frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/wishlist">
                <Button
                  className="w-full h-16 flex items-center gap-2 justify-center border-violet-500 text-violet-600 hover:bg-violet-500 hover:text-white"
                  variant="outline"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Mi Wishlist</span>
                </Button>
              </Link>

              <Link href="/qr">
                <Button
                  className="w-full h-16 flex items-center gap-2 justify-center border-lime-500 text-lime-600 hover:bg-lime-500 hover:text-white"
                  variant="outline"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Reservar Producto</span>
                </Button>
              </Link>

              <Link href="/friends">
                <Button
                  className="w-full h-16 flex items-center gap-2 justify-center border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white"
                  variant="outline"
                >
                  <Users className="w-5 h-5" />
                  <span>Mis Amigos</span>
                </Button>
              </Link>

              <Link href="/gift/history">
                <Button
                  className="w-full h-16 flex items-center gap-2 justify-center border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white"
                  variant="outline"
                >
                  <Gift className="w-5 h-5" />
                  <span>Historial</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Primeros Pasos - Solo si hay artículos */}
        {helpArticles.length > 0 && (
          <Card data-tour="primeros-pasos" className="bg-lime-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Primeros Pasos
              </CardTitle>
              <CardDescription>
                Guías para comenzar a usar Reserrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {helpArticles.map((article) => (
                  <Link key={article.id} href={`/help/${article.id}`}>
                    <Button
                      className="w-full h-16 flex items-center gap-2 justify-center bg-lime-500 hover:bg-lime-600 text-white hover:text-white"
                      variant="outline"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="text-sm">{article.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Últimas reservas */}
          <Card data-tour="ultimas-reservas" className="bg-white">
            <CardHeader>
              <CardTitle>Últimas Reservas</CardTitle>
              <CardDescription>Tus últimas 5 reservas</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentReservations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No tienes reservas aún. ¡Escanea el QR de un producto para
                  reservar!
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.recentReservations.map((reservation) => (
                    <Link
                      key={reservation.id}
                      href={`/reservations/${reservation.id}`}
                      className="block p-3 rounded-lg border bg-lime-50 hover:bg-lime-100 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={
                              reservation.product.image_url ||
                              `https://placehold.co/64x64/e5e7eb/6b7280?text=${encodeURIComponent(reservation.product.name.substring(0, 2))}`
                            }
                            alt={reservation.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {reservation.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.store.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(reservation.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <Badge
                            className={
                              statusColors[reservation.status] ||
                              "bg-gray-100"
                            }
                          >
                            {reservation.status === "active"
                              ? "Activa"
                              : reservation.status === "expired"
                                ? "Expirada"
                                : reservation.status === "completed"
                                  ? "Completada"
                                  : "Cancelada"}
                          </Badge>
                          <span className="text-sm font-medium text-lime-600">
                            {formatCurrency(reservation.product.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Últimos regalos recibidos */}
          <Card data-tour="regalos-recibidos" className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-fuchsia-500" />
                Regalos Recibidos
              </CardTitle>
              <CardDescription>Tus últimos 5 regalos</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentGiftsReceived.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No has recibido regalos aún. ¡Comparte tu wishlist con amigos!
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.recentGiftsReceived.map((gift) => (
                    <div
                      key={gift.id}
                      className="block p-3 rounded-lg border bg-fuchsia-50 hover:bg-fuchsia-100 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={
                              gift.product.image_url ||
                              `https://placehold.co/64x64/e5e7eb/6b7280?text=${encodeURIComponent(gift.product.name.substring(0, 2))}`
                            }
                            alt={gift.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {gift.product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <Heart className="inline h-3 w-3 text-rose-500 mr-1" />
                            De {gift.buyer.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(gift.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <Badge
                            className={
                              shippingStatusColors[gift.shipping_status] ||
                              "bg-gray-100"
                            }
                          >
                            {gift.shipping_status === "pending"
                              ? "Pendiente"
                              : gift.shipping_status === "shipped"
                                ? "Enviado"
                                : gift.shipping_status === "delivered"
                                  ? "Entregado"
                                  : "Cancelado"}
                          </Badge>
                          <span className="text-sm font-medium text-fuchsia-600">
                            {formatCurrency(gift.product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
