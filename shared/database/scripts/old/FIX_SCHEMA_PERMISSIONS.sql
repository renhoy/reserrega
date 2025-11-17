-- =====================================================
-- FIX: PERMISOS DEL SCHEMA RESERREGA
-- =====================================================
-- Este script configura los permisos necesarios para que
-- los roles anon y authenticated de Supabase puedan
-- acceder al schema reserrega y sus tablas.
--
-- EJECUTAR EN: Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASO 1: PERMISOS EN EL SCHEMA
-- =====================================================

-- Permitir que anon y authenticated usen el schema
GRANT USAGE ON SCHEMA reserrega TO anon, authenticated;

-- Permitir que anon y authenticated creen objetos temporales (opcional)
GRANT CREATE ON SCHEMA reserrega TO authenticated;

-- =====================================================
-- PASO 2: PERMISOS EN TODAS LAS TABLAS
-- =====================================================

-- Dar permisos en todas las tablas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA reserrega TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA reserrega TO anon;

-- =====================================================
-- PASO 3: PERMISOS EN SECUENCIAS
-- =====================================================

-- Necesario para INSERTs con SERIAL/BIGSERIAL
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA reserrega TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA reserrega TO anon;

-- =====================================================
-- PASO 4: PERMISOS EN FUNCIONES
-- =====================================================

-- Permitir ejecutar funciones del schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA reserrega TO authenticated, anon;

-- =====================================================
-- PASO 5: PERMISOS POR DEFECTO (FUTUROS OBJETOS)
-- =====================================================

-- Configurar permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT USAGE, SELECT ON SEQUENCES TO authenticated, anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA reserrega
GRANT EXECUTE ON FUNCTIONS TO authenticated, anon;

-- =====================================================
-- PASO 6: VERIFICACIÓN
-- =====================================================

-- Verificar que los permisos se aplicaron correctamente
DO $$
DECLARE
  schema_usage_anon BOOLEAN;
  schema_usage_auth BOOLEAN;
  table_count INTEGER;
BEGIN
  -- Verificar acceso al schema
  SELECT has_schema_privilege('anon', 'reserrega', 'USAGE') INTO schema_usage_anon;
  SELECT has_schema_privilege('authenticated', 'reserrega', 'USAGE') INTO schema_usage_auth;

  -- Contar tablas
  SELECT count(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'reserrega';

  RAISE NOTICE '';
  RAISE NOTICE '✅ Verificación de Permisos:';
  RAISE NOTICE '   - Schema accessible para anon: %', schema_usage_anon;
  RAISE NOTICE '   - Schema accessible para authenticated: %', schema_usage_auth;
  RAISE NOTICE '   - Tablas encontradas: %', table_count;
  RAISE NOTICE '';

  IF schema_usage_anon AND schema_usage_auth THEN
    RAISE NOTICE '🎉 ¡Permisos configurados correctamente!';
  ELSE
    RAISE WARNING '⚠️  Algunos permisos pueden estar mal configurados';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '📝 Próximo paso: Probar el login en la aplicación';
END $$;
