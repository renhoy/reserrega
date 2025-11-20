-- =====================================================
-- FIX: PERMISOS DEL SCHEMA RESERREGA (SUPABASE DOCKER)
-- =====================================================
-- Este script configura los permisos necesarios para
-- Supabase autohospedado con Docker
--
-- EJECUTAR EN: psql o Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASO 1: PERMISOS EN EL SCHEMA
-- =====================================================

-- Permitir que todos los roles de Supabase usen el schema
GRANT USAGE ON SCHEMA reserrega TO anon, authenticated, authenticator, service_role;

-- Permitir crear objetos temporales
GRANT CREATE ON SCHEMA reserrega TO authenticated, service_role;

-- =====================================================
-- PASO 2: PERMISOS EN TODAS LAS TABLAS
-- =====================================================

-- service_role: acceso completo (admin)
GRANT ALL ON ALL TABLES IN SCHEMA reserrega TO service_role;

-- authenticated: usuarios autenticados (controlado por RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA reserrega TO authenticated;

-- authenticator: rol usado por PostgREST (necesario para Docker)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA reserrega TO authenticator;

-- anon: solo lectura (usuarios no autenticados)
GRANT SELECT ON ALL TABLES IN SCHEMA reserrega TO anon;

-- =====================================================
-- PASO 3: PERMISOS EN SECUENCIAS
-- =====================================================

-- Necesario para INSERTs con SERIAL/BIGSERIAL
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA reserrega TO authenticated, authenticator, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA reserrega TO anon;

-- =====================================================
-- PASO 4: PERMISOS EN FUNCIONES
-- =====================================================

-- Permitir ejecutar funciones del schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA reserrega TO authenticated, authenticator, anon, service_role;

-- =====================================================
-- PASO 5: PERMISOS POR DEFECTO (FUTUROS OBJETOS)
-- =====================================================

-- Configurar permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated, authenticator;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT USAGE, SELECT ON SEQUENCES TO authenticated, authenticator, anon, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT EXECUTE ON FUNCTIONS TO authenticated, authenticator, anon, service_role;

-- =====================================================
-- PASO 6: HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

-- Habilitar RLS en todas las tablas del schema
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'reserrega'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_record.tablename);
    RAISE NOTICE 'RLS habilitado en: public.%', table_record.tablename;
  END LOOP;
END $$;

-- =====================================================
-- PASO 7: VERIFICACIÓN
-- =====================================================

-- Verificar que los permisos se aplicaron correctamente
DO $$
DECLARE
  schema_usage_anon BOOLEAN;
  schema_usage_auth BOOLEAN;
  schema_usage_authenticator BOOLEAN;
  schema_usage_service BOOLEAN;
  table_count INTEGER;
BEGIN
  -- Verificar acceso al schema
  SELECT has_schema_privilege('anon', 'reserrega', 'USAGE') INTO schema_usage_anon;
  SELECT has_schema_privilege('authenticated', 'reserrega', 'USAGE') INTO schema_usage_auth;
  SELECT has_schema_privilege('authenticator', 'reserrega', 'USAGE') INTO schema_usage_authenticator;
  SELECT has_schema_privilege('service_role', 'reserrega', 'USAGE') INTO schema_usage_service;

  -- Contar tablas
  SELECT count(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'reserrega';

  RAISE NOTICE '';
  RAISE NOTICE '✅ Verificación de Permisos (Supabase Docker):';
  RAISE NOTICE '   - Schema accessible para anon: %', schema_usage_anon;
  RAISE NOTICE '   - Schema accessible para authenticated: %', schema_usage_auth;
  RAISE NOTICE '   - Schema accessible para authenticator: %', schema_usage_authenticator;
  RAISE NOTICE '   - Schema accessible para service_role: %', schema_usage_service;
  RAISE NOTICE '   - Tablas encontradas: %', table_count;
  RAISE NOTICE '';

  IF schema_usage_anon AND schema_usage_auth AND schema_usage_authenticator AND schema_usage_service THEN
    RAISE NOTICE '🎉 ¡Permisos configurados correctamente!';
  ELSE
    RAISE WARNING '⚠️  Algunos permisos pueden estar mal configurados';
    IF NOT schema_usage_authenticator THEN
      RAISE WARNING '   - authenticator NO tiene acceso (crítico para Docker)';
    END IF;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '📝 Próximos pasos:';
  RAISE NOTICE '   1. Reiniciar contenedores Docker: cd /supabase/docker && docker compose restart';
  RAISE NOTICE '   2. Probar el login en la aplicación';
END $$;
