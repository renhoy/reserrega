-- =====================================================
-- RESERREGA - SCHEMA COMPLETO
-- =====================================================
-- Script para ejecutar en Supabase SQL Editor
-- Crea schema nuevo aprovechando infraestructura existente
-- =====================================================

-- =====================================================
-- PASO 1: CREAR SCHEMA Y EXTENSIONES
-- =====================================================

CREATE SCHEMA IF NOT EXISTS reserrega;

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

COMMENT ON SCHEMA reserrega IS 'Schema principal para Reserrega - Red social de regalos';

-- =====================================================
-- PASO 2: ENUMS (Tipos personalizados)
-- =====================================================

-- Roles de usuario (adaptar de redpresu)
CREATE TYPE reserrega.user_role AS ENUM (
  'superadmin',
  'admin',
  'comercial',
  'usuario'
);

-- Estados de usuario
CREATE TYPE reserrega.user_status AS ENUM (
  'active',
  'inactive',
  'pending'
);

-- Tipo de empresa
CREATE TYPE reserrega.company_type AS ENUM (
  'empresa',
  'autonomo'
);

-- Estado de reserva
CREATE TYPE reserrega.reservation_status AS ENUM (
  'active',
  'expired',
  'completed',
  'cancelled'
);

-- Visibilidad de wishlist
CREATE TYPE reserrega.wishlist_visibility AS ENUM (
  'private',
  'friends',
  'public'
);

-- Estado de wishlist item
CREATE TYPE reserrega.wishlist_status AS ENUM (
  'available',
  'in_process',
  'gifted',
  'expired'
);

-- Estado de pago
CREATE TYPE reserrega.payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

-- Estado de envío
CREATE TYPE reserrega.shipping_status AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'cancelled'
);

-- Estado de solicitud de amistad
CREATE TYPE reserrega.friend_request_status AS ENUM (
  'pending',
  'accepted',
  'rejected'
);

-- =====================================================
-- PASO 3: FUNCIONES HELPER
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION reserrega.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 4: TABLAS CORE (Adaptadas de redpresu)
-- =====================================================

-- TABLA: users
-- Adaptada de redpresu, añadiendo campos específicos de Reserrega
CREATE TABLE IF NOT EXISTS reserrega.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  last_name TEXT,
  role reserrega.user_role NOT NULL DEFAULT 'usuario',
  company_id INTEGER,  -- FK a companies (se crea después)
  status reserrega.user_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES reserrega.users(id),

  -- Campos adicionales de perfil
  avatar_url TEXT,
  phone TEXT,
  birth_date DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON reserrega.users(email);
CREATE INDEX idx_users_company_id ON reserrega.users(company_id);
CREATE INDEX idx_users_role ON reserrega.users(role);

COMMENT ON TABLE reserrega.users IS 'Usuarios del sistema (usuarias, comerciales, admins, superadmins)';

-- Trigger updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON reserrega.users
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: companies
-- Adaptada de redpresu (tiendas partner)
CREATE TABLE IF NOT EXISTS reserrega.companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  nif TEXT UNIQUE NOT NULL,
  type reserrega.company_type NOT NULL DEFAULT 'empresa',

  -- Dirección fiscal
  address TEXT,
  postal_code TEXT,
  locality TEXT,
  province TEXT,
  country TEXT DEFAULT 'España',

  -- Contacto
  phone TEXT,
  email TEXT,
  web TEXT,

  -- Branding
  logo_url TEXT,

  -- Estado
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_nif ON reserrega.companies(nif);
CREATE INDEX idx_companies_status ON reserrega.companies(status);

COMMENT ON TABLE reserrega.companies IS 'Empresas partner (tiendas de ropa)';

-- Trigger updated_at
CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON reserrega.companies
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- Añadir FK de users a companies
ALTER TABLE reserrega.users
  ADD CONSTRAINT fk_users_company
  FOREIGN KEY (company_id)
  REFERENCES reserrega.companies(id)
  ON DELETE SET NULL;

-- =====================================================

-- TABLA: stores
-- Ubicaciones físicas de tiendas
CREATE TABLE IF NOT EXISTS reserrega.stores (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES reserrega.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,

  -- Dirección
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  locality TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT DEFAULT 'España',

  -- Contacto
  phone TEXT,

  -- Manager (usuario comercial de esta tienda)
  manager_user_id UUID REFERENCES reserrega.users(id) ON DELETE SET NULL,

  -- Estado
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stores_company_id ON reserrega.stores(company_id);
CREATE INDEX idx_stores_manager_user_id ON reserrega.stores(manager_user_id);
CREATE INDEX idx_stores_status ON reserrega.stores(status);

COMMENT ON TABLE reserrega.stores IS 'Tiendas físicas (ubicaciones)';

-- Trigger updated_at
CREATE TRIGGER stores_updated_at
  BEFORE UPDATE ON reserrega.stores
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================
-- PASO 5: TABLAS ESPECÍFICAS DE RESERREGA
-- =====================================================

-- TABLA: products
-- Catálogo de productos
CREATE TABLE IF NOT EXISTS reserrega.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id INTEGER NOT NULL REFERENCES reserrega.stores(id) ON DELETE CASCADE,

  -- Identificación del producto
  barcode TEXT NOT NULL,  -- Código de barras
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,

  -- Características
  size TEXT NOT NULL,     -- Talla (XS, S, M, L, XL, 36, 38, etc.)
  color TEXT NOT NULL,    -- Color

  -- Precio
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),

  -- Imagen
  image_url TEXT,

  -- Categoría
  category TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_store_id ON reserrega.products(store_id);
CREATE INDEX idx_products_barcode ON reserrega.products(barcode);
CREATE INDEX idx_products_category ON reserrega.products(category);

COMMENT ON TABLE reserrega.products IS 'Catálogo de productos (ropa probada en tienda)';

-- Trigger updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON reserrega.products
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: reservations
-- Reservas de productos (1€, 15 días)
CREATE TABLE IF NOT EXISTS reserrega.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES reserrega.products(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES reserrega.stores(id) ON DELETE CASCADE,

  -- Pago
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 1.00 CHECK (amount_paid >= 0),
  store_share DECIMAL(10,2) NOT NULL DEFAULT 0.50 CHECK (store_share >= 0),
  platform_share DECIMAL(10,2) NOT NULL DEFAULT 0.50 CHECK (platform_share >= 0),

  -- Estado y expiración
  status reserrega.reservation_status NOT NULL DEFAULT 'active',
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 days'),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_user_id ON reserrega.reservations(user_id);
CREATE INDEX idx_reservations_product_id ON reserrega.reservations(product_id);
CREATE INDEX idx_reservations_store_id ON reserrega.reservations(store_id);
CREATE INDEX idx_reservations_status ON reserrega.reservations(status);
CREATE INDEX idx_reservations_expires_at ON reserrega.reservations(expires_at);

COMMENT ON TABLE reserrega.reservations IS 'Reservas de productos (1€, 15 días de validez)';

-- Trigger updated_at
CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reserrega.reservations
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: wishlists
-- Listas de deseos de usuarios
CREATE TABLE IF NOT EXISTS reserrega.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES reserrega.products(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reserrega.reservations(id) ON DELETE SET NULL,

  -- Configuración
  visibility reserrega.wishlist_visibility NOT NULL DEFAULT 'friends',
  status reserrega.wishlist_status NOT NULL DEFAULT 'available',
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: un usuario no puede tener el mismo producto duplicado
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON reserrega.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON reserrega.wishlists(product_id);
CREATE INDEX idx_wishlists_reservation_id ON reserrega.wishlists(reservation_id);
CREATE INDEX idx_wishlists_visibility ON reserrega.wishlists(visibility);
CREATE INDEX idx_wishlists_status ON reserrega.wishlists(status);

COMMENT ON TABLE reserrega.wishlists IS 'Listas de deseos de usuarias';

-- Trigger updated_at
CREATE TRIGGER wishlists_updated_at
  BEFORE UPDATE ON reserrega.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: gifts
-- Regalos realizados
CREATE TABLE IF NOT EXISTS reserrega.gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_item_id UUID NOT NULL REFERENCES reserrega.wishlists(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES reserrega.products(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES reserrega.stores(id) ON DELETE CASCADE,

  -- Pago
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_status reserrega.payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'simulated',  -- En MVP es simulado

  -- Envío
  shipping_status reserrega.shipping_status NOT NULL DEFAULT 'pending',
  tracking_number TEXT,

  -- Bloqueo temporal (15 min para completar compra)
  locked_until TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_gifts_wishlist_item_id ON reserrega.gifts(wishlist_item_id);
CREATE INDEX idx_gifts_buyer_id ON reserrega.gifts(buyer_id);
CREATE INDEX idx_gifts_recipient_id ON reserrega.gifts(recipient_id);
CREATE INDEX idx_gifts_product_id ON reserrega.gifts(product_id);
CREATE INDEX idx_gifts_store_id ON reserrega.gifts(store_id);
CREATE INDEX idx_gifts_payment_status ON reserrega.gifts(payment_status);
CREATE INDEX idx_gifts_shipping_status ON reserrega.gifts(shipping_status);

COMMENT ON TABLE reserrega.gifts IS 'Regalos realizados entre usuarios';

-- Trigger updated_at
CREATE TRIGGER gifts_updated_at
  BEFORE UPDATE ON reserrega.gifts
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: friend_requests
-- Solicitudes de amistad
CREATE TABLE IF NOT EXISTS reserrega.friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,

  status reserrega.friend_request_status NOT NULL DEFAULT 'pending',

  -- Para invitaciones por email (usuario no registrado aún)
  invitation_token TEXT UNIQUE,
  invitation_email TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: no enviar solicitud duplicada
  CONSTRAINT unique_friend_request UNIQUE (sender_id, recipient_id),
  -- Constraint: no enviarse solicitud a sí mismo
  CONSTRAINT no_self_request CHECK (sender_id != recipient_id)
);

CREATE INDEX idx_friend_requests_sender_id ON reserrega.friend_requests(sender_id);
CREATE INDEX idx_friend_requests_recipient_id ON reserrega.friend_requests(recipient_id);
CREATE INDEX idx_friend_requests_status ON reserrega.friend_requests(status);
CREATE INDEX idx_friend_requests_token ON reserrega.friend_requests(invitation_token);

COMMENT ON TABLE reserrega.friend_requests IS 'Solicitudes de amistad pendientes';

-- Trigger updated_at
CREATE TRIGGER friend_requests_updated_at
  BEFORE UPDATE ON reserrega.friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: friendships
-- Relaciones de amistad confirmadas
CREATE TABLE IF NOT EXISTS reserrega.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: no duplicados (bidireccional)
  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),
  -- Constraint: no ser amigo de sí mismo
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id)
);

CREATE INDEX idx_friendships_user_id ON reserrega.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON reserrega.friendships(friend_id);

COMMENT ON TABLE reserrega.friendships IS 'Relaciones de amistad confirmadas';

-- =====================================================
-- PASO 6: TABLA DE SUSCRIPCIONES (Reutilizar de redpresu)
-- =====================================================

-- Tipo de plan
CREATE TYPE reserrega.subscription_plan AS ENUM ('free', 'pro', 'enterprise');

-- Estado de suscripción
CREATE TYPE reserrega.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'inactive');

-- TABLA: subscriptions
CREATE TABLE IF NOT EXISTS reserrega.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id INTEGER NOT NULL REFERENCES reserrega.companies(id) ON DELETE CASCADE,

  -- Plan y estado
  plan reserrega.subscription_plan NOT NULL DEFAULT 'free',
  status reserrega.subscription_status NOT NULL DEFAULT 'trialing',

  -- Stripe IDs
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  -- Periodo
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Límites del plan (JSONB para flexibilidad)
  limits JSONB DEFAULT '{
    "users": 1,
    "stores": 1,
    "products": 100
  }'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_company_id ON reserrega.subscriptions(company_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON reserrega.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON reserrega.subscriptions(status);

COMMENT ON TABLE reserrega.subscriptions IS 'Suscripciones Stripe de empresas';

-- Trigger updated_at
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON reserrega.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================
-- PASO 7: TABLA DE CONFIGURACIÓN (JSONB)
-- =====================================================

CREATE TABLE IF NOT EXISTS reserrega.config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Configuración inicial
INSERT INTO reserrega.config (key, value, description) VALUES
  ('app_name', '"Reserrega"', 'Nombre de la aplicación'),
  ('multiempresa', 'true', 'Modo multi-empresa activado'),
  ('subscriptions_enabled', 'true', 'Suscripciones habilitadas'),
  ('reservation_fee', '1.00', 'Tarifa de reserva en euros'),
  ('reservation_days', '15', 'Días de validez de reserva'),
  ('gift_lock_minutes', '15', 'Minutos de bloqueo al regalar')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE reserrega.config IS 'Configuración global de la aplicación';

-- =====================================================
-- PASO 8: FUNCIONES ESPECÍFICAS DE RESERREGA
-- =====================================================

-- Función para expirar reservas automáticamente
CREATE OR REPLACE FUNCTION reserrega.expire_old_reservations()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE reserrega.reservations
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();

  GET DIAGNOSTICS expired_count = ROW_COUNT;

  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reserrega.expire_old_reservations() IS 'Marca reservas vencidas como expired';

-- =====================================================
-- PASO 9: ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE reserrega.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.config ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: USERS
-- =====================================================

-- Superadmin: acceso total
CREATE POLICY "superadmin_all_users" ON reserrega.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reserrega.users u
      WHERE u.id = auth.uid() AND u.role = 'superadmin'
    )
  );

-- Admin: usuarios de su empresa
CREATE POLICY "admin_company_users" ON reserrega.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reserrega.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'superadmin')
        AND u.company_id = reserrega.users.company_id
    )
  );

-- Usuario: solo su propio perfil
CREATE POLICY "user_own_profile" ON reserrega.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user_update_own_profile" ON reserrega.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- =====================================================
-- RLS POLICIES: COMPANIES
-- =====================================================

-- Superadmin: todas las empresas
CREATE POLICY "superadmin_all_companies" ON reserrega.companies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reserrega.users u
      WHERE u.id = auth.uid() AND u.role = 'superadmin'
    )
  );

-- Admin: su empresa
CREATE POLICY "admin_own_company" ON reserrega.companies
  FOR ALL
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM reserrega.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Usuario: leer su empresa
CREATE POLICY "user_read_company" ON reserrega.companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM reserrega.users WHERE id = auth.uid()
    )
  );

-- =====================================================
-- RLS POLICIES: WISHLISTS
-- =====================================================

-- Usuario: sus propias wishlists (todas las operaciones)
CREATE POLICY "user_own_wishlists" ON reserrega.wishlists
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Usuario: ver wishlists de amigos (según visibility)
CREATE POLICY "user_friends_wishlists" ON reserrega.wishlists
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'friends' AND user_id IN (
      SELECT friend_id FROM reserrega.friendships WHERE user_id = auth.uid()
    )
  );

-- Público: ver wishlists públicas
CREATE POLICY "public_wishlists" ON reserrega.wishlists
  FOR SELECT
  TO authenticated
  USING (visibility = 'public');

-- =====================================================
-- RLS POLICIES: GIFTS
-- =====================================================

-- Comprador: ver sus regalos comprados
CREATE POLICY "buyer_own_gifts" ON reserrega.gifts
  FOR ALL
  TO authenticated
  USING (buyer_id = auth.uid());

-- Receptor: ver regalos recibidos
CREATE POLICY "recipient_gifts" ON reserrega.gifts
  FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

-- Admin/Comercial: ver regalos de su tienda
CREATE POLICY "store_staff_gifts" ON reserrega.gifts
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT s.id FROM reserrega.stores s
      JOIN reserrega.users u ON u.company_id = s.company_id
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'comercial')
    )
  );

-- =====================================================
-- RLS POLICIES: FRIENDS
-- =====================================================

-- Usuario: sus solicitudes enviadas/recibidas
CREATE POLICY "user_own_friend_requests" ON reserrega.friend_requests
  FOR ALL
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Usuario: sus amistades
CREATE POLICY "user_own_friendships" ON reserrega.friendships
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR friend_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- RLS POLICIES: RESERVATIONS, PRODUCTS, STORES
-- =====================================================

-- Usuario: sus propias reservas
CREATE POLICY "user_own_reservations" ON reserrega.reservations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Comercial: reservas de su tienda
CREATE POLICY "comercial_store_reservations" ON reserrega.reservations
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT s.id FROM reserrega.stores s
      JOIN reserrega.users u ON s.manager_user_id = u.id
      WHERE u.id = auth.uid() AND u.role = 'comercial'
    )
  );

-- Productos: todos pueden ver (catálogo público)
CREATE POLICY "public_read_products" ON reserrega.products
  FOR SELECT
  TO authenticated
  USING (true);

-- Comercial/Admin: gestionar productos de su tienda
CREATE POLICY "store_staff_manage_products" ON reserrega.products
  FOR ALL
  TO authenticated
  USING (
    store_id IN (
      SELECT s.id FROM reserrega.stores s
      JOIN reserrega.users u ON u.company_id = s.company_id
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'comercial')
    )
  );

-- Stores: ver todas (catálogo público)
CREATE POLICY "public_read_stores" ON reserrega.stores
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin: gestionar tiendas de su empresa
CREATE POLICY "admin_manage_stores" ON reserrega.stores
  FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM reserrega.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- =====================================================
-- RLS POLICIES: CONFIG
-- =====================================================

-- Todos: leer config
CREATE POLICY "read_config" ON reserrega.config
  FOR SELECT
  TO authenticated
  USING (true);

-- Superadmin: modificar config
CREATE POLICY "superadmin_modify_config" ON reserrega.config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reserrega.users u
      WHERE u.id = auth.uid() AND u.role = 'superadmin'
    )
  );

-- =====================================================
-- PASO 10: VERIFICACIÓN FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema reserrega creado correctamente';
  RAISE NOTICE '✅ Tablas: users, companies, stores, products, reservations, wishlists, gifts, friends';
  RAISE NOTICE '✅ RLS policies habilitadas';
  RAISE NOTICE '✅ Funciones helper creadas';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Próximos pasos:';
  RAISE NOTICE '   1. Verificar tablas en Supabase Table Editor';
  RAISE NOTICE '   2. Generar tipos TypeScript: npx supabase gen types typescript';
  RAISE NOTICE '   3. Crear usuario superadmin inicial';
  RAISE NOTICE '   4. Probar RLS policies';
END $$;
