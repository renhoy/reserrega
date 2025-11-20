-- =====================================================
-- CLEANUP PUBLIC SCHEMA - COMPLETO Y DINÁMICO
-- =====================================================
-- Elimina TODAS las políticas, tablas y funciones de Reserrega
-- de forma dinámica para asegurar limpieza total
-- =====================================================
-- ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos de Reserrega
-- =====================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  -- =====================================================
  -- 1. ELIMINAR TODAS LAS POLÍTICAS RLS EN TABLAS DE RESERREGA
  -- =====================================================

  RAISE NOTICE '🗑️  Eliminando políticas RLS...';

  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
      'users', 'companies', 'issuers', 'config', 'subscriptions',
      'contact_messages', 'user_invitations', 'stores', 'products',
      'reservations', 'wishlists', 'gifts', 'friend_requests', 'friendships'
    )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE',
      r.policyname, r.schemaname, r.tablename);
    RAISE NOTICE '  ✓ Política eliminada: %.%', r.tablename, r.policyname;
  END LOOP;

  -- =====================================================
  -- 2. DESHABILITAR RLS EN TODAS LAS TABLAS
  -- =====================================================

  RAISE NOTICE '🔓 Deshabilitando RLS...';

  FOR r IN (
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN (
      'users', 'companies', 'issuers', 'config', 'subscriptions',
      'contact_messages', 'user_invitations', 'stores', 'products',
      'reservations', 'wishlists', 'gifts', 'friend_requests', 'friendships'
    )
  ) LOOP
    EXECUTE format('ALTER TABLE IF EXISTS public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
    RAISE NOTICE '  ✓ RLS deshabilitado: %', r.tablename;
  END LOOP;

  -- =====================================================
  -- 3. ELIMINAR TABLAS EN ORDEN (por dependencias)
  -- =====================================================

  RAISE NOTICE '🗑️  Eliminando tablas...';

  -- Tablas que dependen de otras (eliminar primero)
  DROP TABLE IF EXISTS public.gifts CASCADE;
  RAISE NOTICE '  ✓ gifts';

  DROP TABLE IF EXISTS public.wishlists CASCADE;
  RAISE NOTICE '  ✓ wishlists';

  DROP TABLE IF EXISTS public.reservations CASCADE;
  RAISE NOTICE '  ✓ reservations';

  DROP TABLE IF EXISTS public.friendships CASCADE;
  RAISE NOTICE '  ✓ friendships';

  DROP TABLE IF EXISTS public.friend_requests CASCADE;
  RAISE NOTICE '  ✓ friend_requests';

  DROP TABLE IF EXISTS public.products CASCADE;
  RAISE NOTICE '  ✓ products';

  DROP TABLE IF EXISTS public.stores CASCADE;
  RAISE NOTICE '  ✓ stores';

  DROP TABLE IF EXISTS public.user_invitations CASCADE;
  RAISE NOTICE '  ✓ user_invitations';

  DROP TABLE IF EXISTS public.contact_messages CASCADE;
  RAISE NOTICE '  ✓ contact_messages';

  DROP TABLE IF EXISTS public.subscriptions CASCADE;
  RAISE NOTICE '  ✓ subscriptions';

  DROP TABLE IF EXISTS public.issuers CASCADE;
  RAISE NOTICE '  ✓ issuers';

  -- Tablas base
  DROP TABLE IF EXISTS public.users CASCADE;
  RAISE NOTICE '  ✓ users';

  DROP TABLE IF EXISTS public.companies CASCADE;
  RAISE NOTICE '  ✓ companies';

  DROP TABLE IF EXISTS public.config CASCADE;
  RAISE NOTICE '  ✓ config';

  -- =====================================================
  -- 4. ELIMINAR FUNCIONES
  -- =====================================================

  RAISE NOTICE '🗑️  Eliminando funciones...';

  DROP FUNCTION IF EXISTS public.expire_old_reservations() CASCADE;
  RAISE NOTICE '  ✓ expire_old_reservations()';

  DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
  RAISE NOTICE '  ✓ update_updated_at_column()';

  DROP FUNCTION IF EXISTS update_config_updated_at() CASCADE;
  RAISE NOTICE '  ✓ update_config_updated_at()';

  -- =====================================================
  -- VERIFICACIÓN FINAL
  -- =====================================================

  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ LIMPIEZA COMPLETADA EXITOSAMENTE';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Objetos eliminados:';
  RAISE NOTICE '   - Todas las políticas RLS de Reserrega';
  RAISE NOTICE '   - 13 tablas (users, companies, config, etc.)';
  RAISE NOTICE '   - 3 funciones (triggers y helpers)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximo paso:';
  RAISE NOTICE '   Ejecutar: shared/database/schema/RESERREGA_FINAL.sql';
  RAISE NOTICE '';

END $$;
