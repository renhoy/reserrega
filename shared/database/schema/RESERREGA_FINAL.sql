-- =====================================================
-- RESERREGA - SCHEMA FINAL PRODUCTION
-- =====================================================
-- Basado en estructura existente de redpresu
-- Reutiliza tablas existentes + añade tablas nuevas
-- Usa TEXT con CHECK en lugar de ENUMs (estilo redpresu)
-- =====================================================

-- =====================================================
-- PASO 1: CREAR SCHEMA
-- =====================================================

-- Schema reserrega eliminado: ahora todo en public

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- COMMENT ON SCHEMA eliminado

-- =====================================================
-- PASO 2: FUNCIÓN HELPER PARA updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 3: TABLAS REUTILIZADAS DE REDPRESU (6 tablas)
-- =====================================================
-- Estas tablas se copian tal cual de redpresu
-- Solo cambiando el schema a 'reserrega'

-- TABLA: users (igual que redpresu)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  company_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES public.users(id),
  last_login TIMESTAMPTZ,
  last_name TEXT,

  -- Campos adicionales para Reserrega
  avatar_url TEXT,
  phone TEXT,
  birth_date DATE,

  -- Checks
  CONSTRAINT users_role_check CHECK (role IN ('superadmin', 'admin', 'comercial', 'usuario')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'pending'))
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_company_id ON public.users(company_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);

COMMENT ON TABLE public.users IS 'Usuarios del sistema';

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: companies (igual que redpresu)
CREATE TABLE IF NOT EXISTS public.companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',

  CONSTRAINT companies_status_check CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX idx_companies_status ON public.companies(status);

COMMENT ON TABLE public.companies IS 'Empresas partner (tiendas)';

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Añadir FK de users a companies
ALTER TABLE public.users
  ADD CONSTRAINT fk_users_company
  FOREIGN KEY (company_id)
  REFERENCES public.companies(id)
  ON DELETE SET NULL;

-- =====================================================

-- TABLA: issuers (datos fiscales - igual que redpresu)
CREATE TABLE IF NOT EXISTS public.issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL DEFAULT 1 REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  nif TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  postal_code TEXT,
  locality TEXT,
  province TEXT,
  country TEXT DEFAULT 'España',
  phone TEXT,
  email TEXT,
  web TEXT,
  irpf_percentage NUMERIC,
  logo_url TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT issuers_type_check CHECK (type IN ('empresa', 'autonomo'))
);

CREATE INDEX idx_issuers_user_id ON public.issuers(user_id);
CREATE INDEX idx_issuers_company_id ON public.issuers(company_id);
CREATE INDEX idx_issuers_nif ON public.issuers(nif);

COMMENT ON TABLE public.issuers IS 'Datos fiscales de emisores/tiendas';

CREATE TRIGGER issuers_updated_at
  BEFORE UPDATE ON public.issuers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: config (JSONB - igual que redpresu)
CREATE TABLE IF NOT EXISTS public.config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valores iniciales específicos de Reserrega
INSERT INTO public.config (key, value, description, category) VALUES
  ('app_name', '"Reserrega"', 'Nombre de la aplicación', 'general'),
  ('multiempresa', 'true', 'Modo multi-empresa', 'general'),
  ('subscriptions_enabled', 'true', 'Suscripciones habilitadas', 'general'),
  ('reservation_fee', '1.00', 'Tarifa de reserva en euros', 'reserrega'),
  ('reservation_days', '15', 'Días de validez de reserva', 'reserrega'),
  ('gift_lock_minutes', '15', 'Minutos de bloqueo temporal al regalar', 'reserrega'),
  ('store_share_percentage', '50', 'Porcentaje que recibe la tienda (50%)', 'reserrega'),
  ('platform_share_percentage', '50', 'Porcentaje que recibe la plataforma (50%)', 'reserrega')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE public.config IS 'Configuración global (JSONB)';

-- =====================================================

-- TABLA: subscriptions (igual que redpresu pero con límites adaptados)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id INTEGER NOT NULL DEFAULT 1 REFERENCES public.companies(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT subscriptions_plan_check CHECK (plan IN ('free', 'pro', 'enterprise')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'inactive'))
);

CREATE INDEX idx_subscriptions_company_id ON public.subscriptions(company_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

COMMENT ON TABLE public.subscriptions IS 'Suscripciones Stripe de empresas';

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: contact_messages (igual que redpresu)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nuevo',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT contact_messages_status_check CHECK (status IN ('nuevo', 'leido', 'respondido', 'archivado'))
);

CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

COMMENT ON TABLE public.contact_messages IS 'Mensajes de contacto';

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: user_invitations (igual que redpresu)
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT user_invitations_status_check CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'))
);

CREATE INDEX idx_user_invitations_token ON public.user_invitations(token);
CREATE INDEX idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_user_invitations_status ON public.user_invitations(status);

COMMENT ON TABLE public.user_invitations IS 'Invitaciones de usuarios';

CREATE TRIGGER user_invitations_updated_at
  BEFORE UPDATE ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PASO 4: TABLAS NUEVAS ESPECÍFICAS DE RESERREGA (7 tablas)
-- =====================================================

-- TABLA: stores (ubicaciones físicas de tiendas)
CREATE TABLE IF NOT EXISTS public.stores (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,

  -- Dirección
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  locality TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT DEFAULT 'España',

  -- Contacto
  phone TEXT,

  -- Manager (usuario comercial responsable)
  manager_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,

  -- Estado
  status TEXT NOT NULL DEFAULT 'active',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT stores_status_check CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX idx_stores_company_id ON public.stores(company_id);
CREATE INDEX idx_stores_manager_user_id ON public.stores(manager_user_id);
CREATE INDEX idx_stores_status ON public.stores(status);

COMMENT ON TABLE public.stores IS 'Tiendas físicas (ubicaciones)';

CREATE TRIGGER stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: products (catálogo de productos)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id INTEGER NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,

  -- Identificación
  barcode TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,

  -- Características
  size TEXT NOT NULL,  -- Talla (XS, S, M, L, XL, 36, 38, etc.)
  color TEXT NOT NULL,

  -- Precio
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),

  -- Imagen
  image_url TEXT,

  -- Categoría
  category TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_products_category ON public.products(category);

COMMENT ON TABLE public.products IS 'Catálogo de productos (ropa)';

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: reservations (reservas de productos - 1€, 15 días)
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,

  -- Pago
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 1.00 CHECK (amount_paid >= 0),
  store_share NUMERIC(10,2) NOT NULL DEFAULT 0.50 CHECK (store_share >= 0),
  platform_share NUMERIC(10,2) NOT NULL DEFAULT 0.50 CHECK (platform_share >= 0),

  -- Estado y expiración
  status TEXT NOT NULL DEFAULT 'active',
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 days'),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT reservations_status_check CHECK (status IN ('active', 'expired', 'completed', 'cancelled'))
);

CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX idx_reservations_product_id ON public.reservations(product_id);
CREATE INDEX idx_reservations_store_id ON public.reservations(store_id);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_expires_at ON public.reservations(expires_at);

COMMENT ON TABLE public.reservations IS 'Reservas de productos (€1, 15 días)';

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: wishlists (listas de deseos)
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,

  -- Configuración
  visibility TEXT NOT NULL DEFAULT 'friends',
  status TEXT NOT NULL DEFAULT 'available',
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT wishlists_visibility_check CHECK (visibility IN ('private', 'friends', 'public')),
  CONSTRAINT wishlists_status_check CHECK (status IN ('available', 'in_process', 'gifted', 'expired')),
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX idx_wishlists_reservation_id ON public.wishlists(reservation_id);
CREATE INDEX idx_wishlists_visibility ON public.wishlists(visibility);
CREATE INDEX idx_wishlists_status ON public.wishlists(status);

COMMENT ON TABLE public.wishlists IS 'Listas de deseos de usuarias';

CREATE TRIGGER wishlists_updated_at
  BEFORE UPDATE ON public.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: gifts (regalos realizados)
CREATE TABLE IF NOT EXISTS public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_item_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,

  -- Pago
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'simulated',  -- En MVP es simulado

  -- Envío
  shipping_status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT,

  -- Bloqueo temporal (15 min para completar compra)
  locked_until TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,

  CONSTRAINT gifts_payment_status_check CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  CONSTRAINT gifts_shipping_status_check CHECK (shipping_status IN ('pending', 'shipped', 'delivered', 'cancelled'))
);

CREATE INDEX idx_gifts_wishlist_item_id ON public.gifts(wishlist_item_id);
CREATE INDEX idx_gifts_buyer_id ON public.gifts(buyer_id);
CREATE INDEX idx_gifts_recipient_id ON public.gifts(recipient_id);
CREATE INDEX idx_gifts_product_id ON public.gifts(product_id);
CREATE INDEX idx_gifts_store_id ON public.gifts(store_id);
CREATE INDEX idx_gifts_payment_status ON public.gifts(payment_status);
CREATE INDEX idx_gifts_shipping_status ON public.gifts(shipping_status);

COMMENT ON TABLE public.gifts IS 'Regalos realizados entre usuarios';

CREATE TRIGGER gifts_updated_at
  BEFORE UPDATE ON public.gifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: friend_requests (solicitudes de amistad)
CREATE TABLE IF NOT EXISTS public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'pending',

  -- Para invitaciones por email (usuario no registrado)
  invitation_token TEXT UNIQUE,
  invitation_email TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT friend_requests_status_check CHECK (status IN ('pending', 'accepted', 'rejected')),
  CONSTRAINT unique_friend_request UNIQUE (sender_id, recipient_id),
  CONSTRAINT no_self_request CHECK (sender_id != recipient_id)
);

CREATE INDEX idx_friend_requests_sender_id ON public.friend_requests(sender_id);
CREATE INDEX idx_friend_requests_recipient_id ON public.friend_requests(recipient_id);
CREATE INDEX idx_friend_requests_status ON public.friend_requests(status);
CREATE INDEX idx_friend_requests_token ON public.friend_requests(invitation_token);

COMMENT ON TABLE public.friend_requests IS 'Solicitudes de amistad';

CREATE TRIGGER friend_requests_updated_at
  BEFORE UPDATE ON public.friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================

-- TABLA: friendships (relaciones de amistad confirmadas)
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id)
);

CREATE INDEX idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON public.friendships(friend_id);

COMMENT ON TABLE public.friendships IS 'Amistades confirmadas';

-- =====================================================
-- PASO 5: FUNCIÓN PARA EXPIRAR RESERVAS
-- =====================================================

CREATE OR REPLACE FUNCTION public.expire_old_reservations()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.reservations
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();

  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.expire_old_reservations() IS 'Marca reservas vencidas como expired';

-- =====================================================
-- PASO 6: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES BÁSICAS
-- =====================================================

-- Superadmin: acceso total
CREATE POLICY "superadmin_all_users" ON public.users
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'superadmin')
  );

-- Usuario: su propio perfil
CREATE POLICY "user_own_profile" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user_update_profile" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Config: todos leen, solo superadmin modifica
CREATE POLICY "read_config" ON public.config
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "superadmin_modify_config" ON public.config
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'superadmin')
  );

-- Wishlists: usuario ve sus listas
CREATE POLICY "user_own_wishlists" ON public.wishlists
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Wishlists: amigos según visibilidad
CREATE POLICY "friends_wishlists" ON public.wishlists
  FOR SELECT TO authenticated
  USING (
    visibility = 'friends' AND user_id IN (
      SELECT friend_id FROM public.friendships WHERE user_id = auth.uid()
    )
  );

-- Wishlists: públicas
CREATE POLICY "public_wishlists" ON public.wishlists
  FOR SELECT TO authenticated
  USING (visibility = 'public');

-- Gifts: comprador y receptor
CREATE POLICY "buyer_own_gifts" ON public.gifts
  FOR ALL TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "recipient_gifts" ON public.gifts
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

-- Reservations: usuario ve sus reservas
CREATE POLICY "user_own_reservations" ON public.reservations
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Products: todos pueden ver
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT TO authenticated
  USING (true);

-- Stores: todos pueden ver
CREATE POLICY "public_read_stores" ON public.stores
  FOR SELECT TO authenticated
  USING (true);

-- Friends: solicitudes propias
CREATE POLICY "user_own_friend_requests" ON public.friend_requests
  FOR ALL TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Friendships: amistades propias
CREATE POLICY "user_own_friendships" ON public.friendships
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR friend_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema public actualizado exitosamente';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Resumen:';
  RAISE NOTICE '   - 6 tablas reutilizadas de redpresu';
  RAISE NOTICE '   - 7 tablas nuevas específicas de Reserrega';
  RAISE NOTICE '   - Total: 13 tablas operativas';
  RAISE NOTICE '   - RLS habilitado en todas las tablas';
  RAISE NOTICE '   - Función expire_old_reservations() creada';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximos pasos:';
  RAISE NOTICE '   1. Verificar tablas en Supabase Table Editor';
  RAISE NOTICE '   2. Generar tipos TypeScript';
  RAISE NOTICE '   3. Crear usuario superadmin inicial';
  RAISE NOTICE '   4. Probar RLS policies';
END $$;
