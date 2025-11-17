"use server";

import { createServerActionClient } from "@/lib/supabase/helpers";
import { supabaseAdmin } from "@/lib/supabase/server";
import { log } from "@/lib/logger";

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

interface DashboardStats {
  totalReservations: number;
  activeReservations: number;
  totalWishlistItems: number;
  totalFriends: number;
  giftsSent: number;
  giftsReceived: number;
  recentReservations: ReservationItem[];
  recentGiftsReceived: GiftItem[];
}

/**
 * Obtener estadísticas del dashboard para Reserrega
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const supabase = await createServerActionClient();

    // Obtener usuario actual
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      log.error("[getDashboardStats] Error de autenticación:", authError);
      return null;
    }

    // TEMPORAL: Retornar datos vacíos si las tablas de Reserrega no existen aún
    // TODO: Eliminar este bloque cuando las tablas estén creadas
    const emptyStats: DashboardStats = {
      totalReservations: 0,
      activeReservations: 0,
      totalWishlistItems: 0,
      totalFriends: 0,
      giftsSent: 0,
      giftsReceived: 0,
      recentReservations: [],
      recentGiftsReceived: [],
    };

    try {
      // 1. Obtener total de reservas del usuario
      const { count: totalReservations, error: err1 } = await supabaseAdmin
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (err1) {
        log.warn("[getDashboardStats] Tabla 'reservations' no existe o error:", err1.message);
        return emptyStats;
      }

      // 2. Obtener reservas activas (no expiradas, no completadas)
      const { count: activeReservations } = await supabaseAdmin
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");

      // 3. Obtener total de items en wishlist
      const { count: totalWishlistItems } = await supabaseAdmin
        .from("wishlists")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // 4. Obtener total de amigos
      const { count: totalFriends } = await supabaseAdmin
        .from("friendships")
        .select("*", { count: "exact", head: true })
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      // 5. Obtener regalos enviados
      const { count: giftsSent } = await supabaseAdmin
        .from("gifts")
        .select("*", { count: "exact", head: true })
        .eq("buyer_id", user.id)
        .eq("payment_status", "completed");

      // 6. Obtener regalos recibidos
      const { count: giftsReceived } = await supabaseAdmin
        .from("gifts")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("payment_status", "completed");

      // 7. Obtener últimas 5 reservas con detalles
      const { data: reservations } = await supabaseAdmin
        .from("reservations")
        .select(
          `
          id,
          status,
          created_at,
          expires_at,
          product:products(name, price, image_url),
          store:stores(name)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // 8. Obtener últimos 5 regalos recibidos
      const { data: gifts } = await supabaseAdmin
        .from("gifts")
        .select(
          `
          id,
          created_at,
          shipping_status,
          product:products(name, price, image_url),
          buyer:users!gifts_buyer_id_fkey(name)
        `
        )
        .eq("recipient_id", user.id)
        .eq("payment_status", "completed")
        .order("created_at", { ascending: false })
        .limit(5);

      return {
        totalReservations: totalReservations || 0,
        activeReservations: activeReservations || 0,
        totalWishlistItems: totalWishlistItems || 0,
        totalFriends: totalFriends || 0,
        giftsSent: giftsSent || 0,
        giftsReceived: giftsReceived || 0,
        recentReservations: (reservations || []) as any,
        recentGiftsReceived: (gifts || []) as any,
      };
    } catch (tableError: any) {
      // Si las tablas no existen, retornar stats vacías en lugar de null
      log.warn("[getDashboardStats] Tablas de Reserrega no encontradas:", tableError.message);
      return emptyStats;
    }
  } catch (error) {
    log.error("[getDashboardStats] Error crítico:", error);

    // Retornar stats vacías en lugar de null para evitar crashes
    return {
      totalReservations: 0,
      activeReservations: 0,
      totalWishlistItems: 0,
      totalFriends: 0,
      giftsSent: 0,
      giftsReceived: 0,
      recentReservations: [],
      recentGiftsReceived: [],
    };
  }
}
