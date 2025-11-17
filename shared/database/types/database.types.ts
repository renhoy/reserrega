/**
 * =====================================================
 * RESERREGA - DATABASE TYPES
 * =====================================================
 * Auto-generated types from RESERREGA_FINAL.sql schema
 * Schema: reserrega
 * Generated: 2025-11-17
 * =====================================================
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// ENUMS SIMULADOS (CHECK constraints)
// =====================================================

export type UserRole = 'superadmin' | 'admin' | 'comercial' | 'usuario'
export type UserStatus = 'active' | 'inactive' | 'pending'
export type CompanyStatus = 'active' | 'inactive'
export type IssuerType = 'empresa' | 'autonomo'
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive'
export type ContactMessageStatus = 'nuevo' | 'leido' | 'respondido' | 'archivado'
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled'
export type StoreStatus = 'active' | 'inactive'
export type ReservationStatus = 'active' | 'expired' | 'completed' | 'cancelled'
export type WishlistVisibility = 'private' | 'friends' | 'public'
export type WishlistStatus = 'available' | 'in_process' | 'gifted' | 'expired'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type ShippingStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled'
export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected'

// =====================================================
// TABLAS HEREDADAS DE REDPRESU (6)
// =====================================================

/**
 * TABLA: users
 * Usuarios del sistema
 */
export interface User {
  id: string // UUID from auth.users
  role: UserRole
  company_id: number | null
  name: string
  email: string
  created_at: string
  updated_at: string
  status: UserStatus
  invited_by: string | null
  last_login: string | null
  last_name: string | null
  avatar_url: string | null
  phone: string | null
  birth_date: string | null
}

export interface UserInsert {
  id: string
  role: UserRole
  company_id?: number | null
  name: string
  email: string
  status?: UserStatus
  invited_by?: string | null
  last_name?: string | null
  avatar_url?: string | null
  phone?: string | null
  birth_date?: string | null
}

export interface UserUpdate {
  role?: UserRole
  company_id?: number | null
  name?: string
  email?: string
  status?: UserStatus
  invited_by?: string | null
  last_login?: string | null
  last_name?: string | null
  avatar_url?: string | null
  phone?: string | null
  birth_date?: string | null
}

/**
 * TABLA: companies
 * Empresas partner (tiendas)
 */
export interface Company {
  id: number
  name: string
  created_at: string
  updated_at: string
  status: CompanyStatus
}

export interface CompanyInsert {
  name: string
  status?: CompanyStatus
}

export interface CompanyUpdate {
  name?: string
  status?: CompanyStatus
}

/**
 * TABLA: issuers
 * Datos fiscales de emisores/tiendas
 */
export interface Issuer {
  id: string
  user_id: string
  company_id: number
  type: IssuerType
  name: string
  nif: string
  address: string
  postal_code: string | null
  locality: string | null
  province: string | null
  country: string
  phone: string | null
  email: string | null
  web: string | null
  irpf_percentage: number | null
  logo_url: string | null
  note: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IssuerInsert {
  user_id: string
  company_id?: number
  type: IssuerType
  name: string
  nif: string
  address: string
  postal_code?: string | null
  locality?: string | null
  province?: string | null
  country?: string
  phone?: string | null
  email?: string | null
  web?: string | null
  irpf_percentage?: number | null
  logo_url?: string | null
  note?: string | null
}

export interface IssuerUpdate {
  type?: IssuerType
  name?: string
  nif?: string
  address?: string
  postal_code?: string | null
  locality?: string | null
  province?: string | null
  country?: string
  phone?: string | null
  email?: string | null
  web?: string | null
  irpf_percentage?: number | null
  logo_url?: string | null
  note?: string | null
  deleted_at?: string | null
}

/**
 * TABLA: config
 * Configuración global (JSONB)
 */
export interface Config {
  key: string
  value: Json
  description: string | null
  category: string
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface ConfigInsert {
  key: string
  value: Json
  description?: string | null
  category?: string
  is_system?: boolean
}

export interface ConfigUpdate {
  value?: Json
  description?: string | null
  category?: string
  is_system?: boolean
}

/**
 * TABLA: subscriptions
 * Suscripciones Stripe de empresas
 */
export interface Subscription {
  id: string
  company_id: number
  plan: SubscriptionPlan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionInsert {
  company_id?: number
  plan?: SubscriptionPlan
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  status?: SubscriptionStatus
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end?: boolean
}

export interface SubscriptionUpdate {
  plan?: SubscriptionPlan
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  status?: SubscriptionStatus
  current_period_start?: string | null
  current_period_end?: string | null
  cancel_at_period_end?: boolean
}

/**
 * TABLA: contact_messages
 * Mensajes de contacto
 */
export interface ContactMessage {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  status: ContactMessageStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ContactMessageInsert {
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  status?: ContactMessageStatus
  notes?: string | null
}

export interface ContactMessageUpdate {
  status?: ContactMessageStatus
  notes?: string | null
}

/**
 * TABLA: user_invitations
 * Invitaciones de usuarios
 */
export interface UserInvitation {
  id: string
  inviter_id: string
  email: string
  token: string
  expires_at: string
  status: InvitationStatus
  created_at: string
  updated_at: string
}

export interface UserInvitationInsert {
  inviter_id: string
  email: string
  token: string
  expires_at: string
  status?: InvitationStatus
}

export interface UserInvitationUpdate {
  status?: InvitationStatus
}

// =====================================================
// TABLAS NUEVAS DE RESERREGA (7)
// =====================================================

/**
 * TABLA: stores
 * Tiendas físicas (ubicaciones)
 */
export interface Store {
  id: number
  company_id: number
  name: string
  address: string
  postal_code: string
  locality: string
  province: string
  country: string
  phone: string | null
  manager_user_id: string | null
  status: StoreStatus
  created_at: string
  updated_at: string
}

export interface StoreInsert {
  company_id: number
  name: string
  address: string
  postal_code: string
  locality: string
  province: string
  country?: string
  phone?: string | null
  manager_user_id?: string | null
  status?: StoreStatus
}

export interface StoreUpdate {
  name?: string
  address?: string
  postal_code?: string
  locality?: string
  province?: string
  country?: string
  phone?: string | null
  manager_user_id?: string | null
  status?: StoreStatus
}

/**
 * TABLA: products
 * Catálogo de productos (ropa)
 */
export interface Product {
  id: string
  store_id: number
  barcode: string
  name: string
  description: string | null
  brand: string | null
  size: string
  color: string
  price: number
  image_url: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export interface ProductInsert {
  store_id: number
  barcode: string
  name: string
  description?: string | null
  brand?: string | null
  size: string
  color: string
  price: number
  image_url?: string | null
  category?: string | null
}

export interface ProductUpdate {
  barcode?: string
  name?: string
  description?: string | null
  brand?: string | null
  size?: string
  color?: string
  price?: number
  image_url?: string | null
  category?: string | null
}

/**
 * TABLA: reservations
 * Reservas de productos (€1, 15 días)
 */
export interface Reservation {
  id: string
  user_id: string
  product_id: string
  store_id: number
  amount_paid: number
  store_share: number
  platform_share: number
  status: ReservationStatus
  reserved_at: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface ReservationInsert {
  user_id: string
  product_id: string
  store_id: number
  amount_paid?: number
  store_share?: number
  platform_share?: number
  status?: ReservationStatus
  reserved_at?: string
  expires_at?: string
}

export interface ReservationUpdate {
  status?: ReservationStatus
  expires_at?: string
}

/**
 * TABLA: wishlists
 * Listas de deseos de usuarias
 */
export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  reservation_id: string | null
  visibility: WishlistVisibility
  status: WishlistStatus
  priority: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WishlistInsert {
  user_id: string
  product_id: string
  reservation_id?: string | null
  visibility?: WishlistVisibility
  status?: WishlistStatus
  priority?: number | null
  notes?: string | null
}

export interface WishlistUpdate {
  reservation_id?: string | null
  visibility?: WishlistVisibility
  status?: WishlistStatus
  priority?: number | null
  notes?: string | null
}

/**
 * TABLA: gifts
 * Regalos realizados entre usuarios
 */
export interface Gift {
  id: string
  wishlist_item_id: string
  buyer_id: string
  recipient_id: string
  product_id: string
  store_id: number
  amount: number
  payment_status: PaymentStatus
  payment_method: string
  shipping_status: ShippingStatus
  tracking_number: string | null
  locked_until: string | null
  created_at: string
  updated_at: string
  delivered_at: string | null
}

export interface GiftInsert {
  wishlist_item_id: string
  buyer_id: string
  recipient_id: string
  product_id: string
  store_id: number
  amount: number
  payment_status?: PaymentStatus
  payment_method?: string
  shipping_status?: ShippingStatus
  tracking_number?: string | null
  locked_until?: string | null
}

export interface GiftUpdate {
  payment_status?: PaymentStatus
  shipping_status?: ShippingStatus
  tracking_number?: string | null
  delivered_at?: string | null
}

/**
 * TABLA: friend_requests
 * Solicitudes de amistad
 */
export interface FriendRequest {
  id: string
  sender_id: string
  recipient_id: string
  status: FriendRequestStatus
  invitation_token: string | null
  invitation_email: string | null
  created_at: string
  updated_at: string
}

export interface FriendRequestInsert {
  sender_id: string
  recipient_id: string
  status?: FriendRequestStatus
  invitation_token?: string | null
  invitation_email?: string | null
}

export interface FriendRequestUpdate {
  status?: FriendRequestStatus
}

/**
 * TABLA: friendships
 * Amistades confirmadas
 */
export interface Friendship {
  id: string
  user_id: string
  friend_id: string
  created_at: string
}

export interface FriendshipInsert {
  user_id: string
  friend_id: string
}

// =====================================================
// DATABASE TYPE (para uso con Supabase Client)
// =====================================================

export interface Database {
  reserrega: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      companies: {
        Row: Company
        Insert: CompanyInsert
        Update: CompanyUpdate
      }
      issuers: {
        Row: Issuer
        Insert: IssuerInsert
        Update: IssuerUpdate
      }
      config: {
        Row: Config
        Insert: ConfigInsert
        Update: ConfigUpdate
      }
      subscriptions: {
        Row: Subscription
        Insert: SubscriptionInsert
        Update: SubscriptionUpdate
      }
      contact_messages: {
        Row: ContactMessage
        Insert: ContactMessageInsert
        Update: ContactMessageUpdate
      }
      user_invitations: {
        Row: UserInvitation
        Insert: UserInvitationInsert
        Update: UserInvitationUpdate
      }
      stores: {
        Row: Store
        Insert: StoreInsert
        Update: StoreUpdate
      }
      products: {
        Row: Product
        Insert: ProductInsert
        Update: ProductUpdate
      }
      reservations: {
        Row: Reservation
        Insert: ReservationInsert
        Update: ReservationUpdate
      }
      wishlists: {
        Row: Wishlist
        Insert: WishlistInsert
        Update: WishlistUpdate
      }
      gifts: {
        Row: Gift
        Insert: GiftInsert
        Update: GiftUpdate
      }
      friend_requests: {
        Row: FriendRequest
        Insert: FriendRequestInsert
        Update: FriendRequestUpdate
      }
      friendships: {
        Row: Friendship
        Insert: FriendshipInsert
        Update: Partial<Friendship>
      }
    }
    Views: {}
    Functions: {
      expire_old_reservations: {
        Args: Record<string, never>
        Returns: number
      }
    }
    Enums: {}
  }
}

// =====================================================
// HELPER TYPES
// =====================================================

/**
 * Type helper para extraer el tipo Row de una tabla
 * @example
 * type UserRow = Tables<'users'>
 */
export type Tables<T extends keyof Database['reserrega']['Tables']> =
  Database['reserrega']['Tables'][T]['Row']

/**
 * Type helper para extraer el tipo Insert de una tabla
 * @example
 * type UserInsert = TablesInsert<'users'>
 */
export type TablesInsert<T extends keyof Database['reserrega']['Tables']> =
  Database['reserrega']['Tables'][T]['Insert']

/**
 * Type helper para extraer el tipo Update de una tabla
 * @example
 * type UserUpdate = TablesUpdate<'users'>
 */
export type TablesUpdate<T extends keyof Database['reserrega']['Tables']> =
  Database['reserrega']['Tables'][T]['Update']
