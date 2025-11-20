-- =====================================================
-- CLEANUP PUBLIC SCHEMA - Reserrega
-- =====================================================
-- Este script elimina todas las tablas y objetos de Reserrega
-- del schema public para poder ejecutar un schema limpio
-- =====================================================
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos
-- =====================================================

-- Deshabilitar RLS temporalmente para evitar problemas
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.issuers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.friend_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.friendships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_invitations DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- ELIMINAR POLÍTICAS RLS
-- =====================================================

DROP POLICY IF EXISTS "superadmin_all_users" ON public.users;
DROP POLICY IF EXISTS "user_own_profile" ON public.users;
DROP POLICY IF EXISTS "user_update_profile" ON public.users;
DROP POLICY IF EXISTS "read_config" ON public.config;
DROP POLICY IF EXISTS "superadmin_modify_config" ON public.config;
DROP POLICY IF EXISTS "user_own_wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "friends_wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "public_wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "buyer_own_gifts" ON public.gifts;
DROP POLICY IF EXISTS "recipient_gifts" ON public.gifts;
DROP POLICY IF EXISTS "user_own_reservations" ON public.reservations;
DROP POLICY IF EXISTS "public_read_products" ON public.products;
DROP POLICY IF EXISTS "public_read_stores" ON public.stores;
DROP POLICY IF EXISTS "user_own_friend_requests" ON public.friend_requests;
DROP POLICY IF EXISTS "user_own_friendships" ON public.friendships;

-- =====================================================
-- ELIMINAR TABLAS EN ORDEN CORRECTO (por dependencias)
-- =====================================================

-- Tablas que dependen de otras (eliminar primero)
DROP TABLE IF EXISTS public.gifts CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.friendships CASCADE;
DROP TABLE IF EXISTS public.friend_requests CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.stores CASCADE;
DROP TABLE IF EXISTS public.user_invitations CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.issuers CASCADE;

-- Tablas base
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.config CASCADE;

-- =====================================================
-- ELIMINAR FUNCIONES
-- =====================================================

DROP FUNCTION IF EXISTS public.expire_old_reservations() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_config_updated_at() CASCADE;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Limpieza completada';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tablas eliminadas:';
  RAISE NOTICE '   - users, companies, issuers';
  RAISE NOTICE '   - config, subscriptions';
  RAISE NOTICE '   - contact_messages, user_invitations';
  RAISE NOTICE '   - stores, products';
  RAISE NOTICE '   - reservations, wishlists, gifts';
  RAISE NOTICE '   - friend_requests, friendships';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximo paso:';
  RAISE NOTICE '   Ejecutar shared/database/schema/RESERREGA_FINAL.sql';
END $$;
