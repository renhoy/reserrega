-- =====================================================
-- RESERREGA SCHEMA V2 - APROVECHANDO REDPRESU
-- =====================================================
-- Versión mejorada que reutiliza tablas existentes de redpresu
-- y añade solo las tablas específicas de Reserrega
-- =====================================================

-- =====================================================
-- PASO 1: CREAR SCHEMA RESERREGA
-- =====================================================

CREATE SCHEMA IF NOT EXISTS reserrega;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

COMMENT ON SCHEMA reserrega IS 'Schema para Reserrega - Red social de regalos';

-- =====================================================
-- PASO 2: ENUMS
-- =====================================================

-- Roles (igual que redpresu pero añadiendo 'usuario')
CREATE TYPE reserrega.user_role AS ENUM (
  'superadmin',
  'admin',
  'comercial',
  'usuario'
);

-- Estados
CREATE TYPE reserrega.user_status AS ENUM (
  'active',
  'inactive',
  'pending'
);

CREATE TYPE reserrega.company_type AS ENUM (
  'empresa',
  'autonomo'
);

-- Estados específicos de Reserrega
CREATE TYPE reserrega.reservation_status AS ENUM (
  'active',
  'expired',
  'completed',
  'cancelled'
);

CREATE TYPE reserrega.wishlist_visibility AS ENUM (
  'private',
  'friends',
  'public'
);

CREATE TYPE reserrega.wishlist_status AS ENUM (
  'available',
  'in_process',
  'gifted',
  'expired'
);

CREATE TYPE reserrega.payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

CREATE TYPE reserrega.shipping_status AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE reserrega.friend_request_status AS ENUM (
  'pending',
  'accepted',
  'rejected'
);

CREATE TYPE reserrega.subscription_plan AS ENUM (
  'free',
  'pro',
  'enterprise'
);

CREATE TYPE reserrega.subscription_status AS ENUM (
  'active',
  'canceled',
  'past_due',
  'trialing',
  'inactive'
);

-- =====================================================
-- PASO 3: FUNCIONES HELPER
-- =====================================================

CREATE OR REPLACE FUNCTION reserrega.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 4: TABLAS REUTILIZADAS DE REDPRESU
-- =====================================================

-- TABLA: users (adaptada de redpresu)
CREATE TABLE IF NOT EXISTS reserrega.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  last_name TEXT,
  role reserrega.user_role NOT NULL DEFAULT 'usuario',
  company_id INTEGER,
  status reserrega.user_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES reserrega.users(id),

  -- Campos adicionales para Reserrega
  avatar_url TEXT,
  phone TEXT,
  birth_date DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON reserrega.users(email);
CREATE INDEX idx_users_company_id ON reserrega.users(company_id);
CREATE INDEX idx_users_role ON reserrega.users(role);
CREATE INDEX idx_users_status ON reserrega.users(status);

COMMENT ON TABLE reserrega.users IS 'Usuarios del sistema';

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON reserrega.users
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: companies (tiendas partner)
CREATE TABLE IF NOT EXISTS reserrega.companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  nif TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_nif ON reserrega.companies(nif);
CREATE INDEX idx_companies_status ON reserrega.companies(status);

COMMENT ON TABLE reserrega.companies IS 'Empresas partner (tiendas)';

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON reserrega.companies
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- Añadir FK
ALTER TABLE reserrega.users
  ADD CONSTRAINT fk_users_company
  FOREIGN KEY (company_id)
  REFERENCES reserrega.companies(id)
  ON DELETE SET NULL;

-- =====================================================

-- TABLA: issuers (datos fiscales - adaptada de redpresu)
-- En Reserrega, esto puede servir para datos fiscales de tiendas
CREATE TABLE IF NOT EXISTS reserrega.issuers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES reserrega.users(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES reserrega.companies(id) ON DELETE CASCADE,

  -- Tipo y datos fiscales
  type reserrega.company_type NOT NULL DEFAULT 'empresa',
  name TEXT NOT NULL,
  nif TEXT NOT NULL UNIQUE,

  -- Dirección fiscal
  address TEXT NOT NULL,
  postal_code TEXT,
  locality TEXT,
  province TEXT,
  country TEXT DEFAULT 'España',

  -- Contacto
  phone TEXT,
  email TEXT,
  web TEXT,

  -- IRPF (solo para autónomos)
  irpf_percentage DECIMAL(5,2) DEFAULT 15.00,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_issuers_user_id ON reserrega.issuers(user_id);
CREATE INDEX idx_issuers_company_id ON reserrega.issuers(company_id);
CREATE INDEX idx_issuers_nif ON reserrega.issuers(nif);

COMMENT ON TABLE reserrega.issuers IS 'Datos fiscales de emisores/tiendas';

CREATE TRIGGER issuers_updated_at
  BEFORE UPDATE ON reserrega.issuers
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: config (JSONB - igual que redpresu)
CREATE TABLE IF NOT EXISTS reserrega.config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO reserrega.config (key, value, description) VALUES
  ('app_name', '"Reserrega"', 'Nombre de la aplicación'),
  ('multiempresa', 'true', 'Modo multi-empresa'),
  ('subscriptions_enabled', 'true', 'Suscripciones habilitadas'),
  ('reservation_fee', '1.00', 'Tarifa de reserva (€)'),
  ('reservation_days', '15', 'Días validez reserva'),
  ('gift_lock_minutes', '15', 'Minutos bloqueo regalo')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE reserrega.config IS 'Configuración global';

-- =====================================================

-- TABLA: subscriptions (adaptada de redpresu)
CREATE TABLE IF NOT EXISTS reserrega.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id INTEGER NOT NULL REFERENCES reserrega.companies(id) ON DELETE CASCADE,

  plan reserrega.subscription_plan NOT NULL DEFAULT 'free',
  status reserrega.subscription_status NOT NULL DEFAULT 'trialing',

  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Límites del plan
  limits JSONB DEFAULT '{
    "users": 1,
    "stores": 1,
    "products": 100,
    "reservations_per_month": 50
  }'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_company_id ON reserrega.subscriptions(company_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON reserrega.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON reserrega.subscriptions(status);

COMMENT ON TABLE reserrega.subscriptions IS 'Suscripciones Stripe';

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON reserrega.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: contact_messages (igual que redpresu)
CREATE TABLE IF NOT EXISTS reserrega.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_status ON reserrega.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON reserrega.contact_messages(created_at DESC);

COMMENT ON TABLE reserrega.contact_messages IS 'Mensajes de contacto';

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON reserrega.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================
-- PASO 5: TABLAS ESPECÍFICAS DE RESERREGA
-- =====================================================

-- TABLA: stores (ubicaciones físicas)
CREATE TABLE IF NOT EXISTS reserrega.stores (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES reserrega.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,

  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  locality TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT DEFAULT 'España',

  phone TEXT,
  manager_user_id UUID REFERENCES reserrega.users(id) ON DELETE SET NULL,

  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stores_company_id ON reserrega.stores(company_id);
CREATE INDEX idx_stores_manager_user_id ON reserrega.stores(manager_user_id);

COMMENT ON TABLE reserrega.stores IS 'Tiendas físicas';

CREATE TRIGGER stores_updated_at
  BEFORE UPDATE ON reserrega.stores
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: products
CREATE TABLE IF NOT EXISTS reserrega.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id INTEGER NOT NULL REFERENCES reserrega.stores(id) ON DELETE CASCADE,

  barcode TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_store_id ON reserrega.products(store_id);
CREATE INDEX idx_products_barcode ON reserrega.products(barcode);
CREATE INDEX idx_products_category ON reserrega.products(category);

COMMENT ON TABLE reserrega.products IS 'Catálogo de productos';

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON reserrega.products
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: reservations
CREATE TABLE IF NOT EXISTS reserrega.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES reserrega.products(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES reserrega.stores(id) ON DELETE CASCADE,

  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  store_share DECIMAL(10,2) NOT NULL DEFAULT 0.50,
  platform_share DECIMAL(10,2) NOT NULL DEFAULT 0.50,

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

COMMENT ON TABLE reserrega.reservations IS 'Reservas de productos';

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reserrega.reservations
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: wishlists
CREATE TABLE IF NOT EXISTS reserrega.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES reserrega.products(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reserrega.reservations(id) ON DELETE SET NULL,

  visibility reserrega.wishlist_visibility NOT NULL DEFAULT 'friends',
  status reserrega.wishlist_status NOT NULL DEFAULT 'available',
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON reserrega.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON reserrega.wishlists(product_id);
CREATE INDEX idx_wishlists_visibility ON reserrega.wishlists(visibility);
CREATE INDEX idx_wishlists_status ON reserrega.wishlists(status);

COMMENT ON TABLE reserrega.wishlists IS 'Listas de deseos';

CREATE TRIGGER wishlists_updated_at
  BEFORE UPDATE ON reserrega.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: gifts
CREATE TABLE IF NOT EXISTS reserrega.gifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_item_id UUID NOT NULL REFERENCES reserrega.wishlists(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES reserrega.products(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES reserrega.stores(id) ON DELETE CASCADE,

  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_status reserrega.payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'simulated',

  shipping_status reserrega.shipping_status NOT NULL DEFAULT 'pending',
  tracking_number TEXT,

  locked_until TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_gifts_buyer_id ON reserrega.gifts(buyer_id);
CREATE INDEX idx_gifts_recipient_id ON reserrega.gifts(recipient_id);
CREATE INDEX idx_gifts_product_id ON reserrega.gifts(product_id);
CREATE INDEX idx_gifts_payment_status ON reserrega.gifts(payment_status);
CREATE INDEX idx_gifts_shipping_status ON reserrega.gifts(shipping_status);

COMMENT ON TABLE reserrega.gifts IS 'Regalos realizados';

CREATE TRIGGER gifts_updated_at
  BEFORE UPDATE ON reserrega.gifts
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: friend_requests
CREATE TABLE IF NOT EXISTS reserrega.friend_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,

  status reserrega.friend_request_status NOT NULL DEFAULT 'pending',
  invitation_token TEXT UNIQUE,
  invitation_email TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_friend_request UNIQUE (sender_id, recipient_id),
  CONSTRAINT no_self_request CHECK (sender_id != recipient_id)
);

CREATE INDEX idx_friend_requests_sender_id ON reserrega.friend_requests(sender_id);
CREATE INDEX idx_friend_requests_recipient_id ON reserrega.friend_requests(recipient_id);
CREATE INDEX idx_friend_requests_status ON reserrega.friend_requests(status);

COMMENT ON TABLE reserrega.friend_requests IS 'Solicitudes de amistad';

CREATE TRIGGER friend_requests_updated_at
  BEFORE UPDATE ON reserrega.friend_requests
  FOR EACH ROW
  EXECUTE FUNCTION reserrega.update_updated_at_column();

-- =====================================================

-- TABLA: friendships
CREATE TABLE IF NOT EXISTS reserrega.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES reserrega.users(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id)
);

CREATE INDEX idx_friendships_user_id ON reserrega.friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON reserrega.friendships(friend_id);

COMMENT ON TABLE reserrega.friendships IS 'Amistades confirmadas';

-- =====================================================
-- PASO 6: FUNCIONES ESPECÍFICAS
-- =====================================================

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

-- =====================================================
-- PASO 7: ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE reserrega.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.config ENABLE ROW LEVEL SECURITY;
ALTER TABLE reserrega.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplificadas - expandir según necesidad)

-- Superadmin: acceso total a todo
CREATE POLICY "superadmin_all" ON reserrega.users
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM reserrega.users u WHERE u.id = auth.uid() AND u.role = 'superadmin')
  );

-- Usuario: su propio perfil
CREATE POLICY "user_own_profile" ON reserrega.users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user_update_profile" ON reserrega.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Config: todos leen, solo superadmin modifica
CREATE POLICY "read_config" ON reserrega.config
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "superadmin_modify_config" ON reserrega.config
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM reserrega.users u WHERE u.id = auth.uid() AND u.role = 'superadmin')
  );

-- Wishlists: usuario ve sus listas y las de amigos según visibilidad
CREATE POLICY "user_own_wishlists" ON reserrega.wishlists
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "friends_wishlists" ON reserrega.wishlists
  FOR SELECT TO authenticated
  USING (
    visibility = 'friends' AND user_id IN (
      SELECT friend_id FROM reserrega.friendships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "public_wishlists" ON reserrega.wishlists
  FOR SELECT TO authenticated
  USING (visibility = 'public');

-- (Añadir más policies según necesidad)

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema reserrega creado (V2)';
  RAISE NOTICE '✅ Tablas reutilizadas: users, companies, issuers, config, subscriptions, contact_messages';
  RAISE NOTICE '✅ Tablas nuevas: stores, products, reservations, wishlists, gifts, friend_requests, friendships';
  RAISE NOTICE '✅ Total: 13 tablas con RLS';
END $$;
