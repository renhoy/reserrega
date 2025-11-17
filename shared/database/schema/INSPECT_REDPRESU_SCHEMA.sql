-- =====================================================
-- SCRIPT PARA INSPECCIONAR SCHEMA REDPRESU EXISTENTE
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor
-- para ver la estructura completa de las tablas existentes
-- =====================================================

-- Ver todas las tablas del schema redpresu
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'redpresu'
ORDER BY table_name;

-- =====================================================
-- Ver estructura de cada tabla con columnas y tipos
-- =====================================================

-- Tabla: users
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'users'
ORDER BY ordinal_position;

-- Tabla: companies
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'companies'
ORDER BY ordinal_position;

-- Tabla: issuers (IMPORTANTE - datos fiscales del emisor)
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'issuers'
ORDER BY ordinal_position;

-- Tabla: config
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'config'
ORDER BY ordinal_position;

-- Tabla: subscriptions
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'subscriptions'
ORDER BY ordinal_position;

-- Tabla: contact_messages
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'contact_messages'
ORDER BY ordinal_position;

-- =====================================================
-- Ver ENUMS definidos en redpresu
-- =====================================================

SELECT
  t.typname AS enum_name,
  e.enumlabel AS enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'redpresu'
ORDER BY t.typname, e.enumsortorder;

-- =====================================================
-- Ver FOREIGN KEYS (relaciones entre tablas)
-- =====================================================

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM
  information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'redpresu'
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- Ver ÍNDICES creados
-- =====================================================

SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'redpresu'
ORDER BY tablename, indexname;

-- =====================================================
-- Ver RLS POLICIES (Row Level Security)
-- =====================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'redpresu'
ORDER BY tablename, policyname;

-- =====================================================
-- GENERAR DDL COMPLETO (estructura de tabla específica)
-- =====================================================
-- Ejemplo para tabla users:

SELECT
  'CREATE TABLE redpresu.' || table_name || ' (' ||
  string_agg(
    column_name || ' ' ||
    data_type ||
    CASE
      WHEN character_maximum_length IS NOT NULL
      THEN '(' || character_maximum_length || ')'
      ELSE ''
    END ||
    CASE
      WHEN is_nullable = 'NO' THEN ' NOT NULL'
      ELSE ''
    END ||
    CASE
      WHEN column_default IS NOT NULL
      THEN ' DEFAULT ' || column_default
      ELSE ''
    END,
    ', '
  ) ||
  ');' AS create_statement
FROM information_schema.columns
WHERE table_schema = 'redpresu' AND table_name = 'users'
GROUP BY table_name;

-- =====================================================
-- RESUMEN FINAL
-- =====================================================

SELECT
  'Total de tablas en redpresu: ' || count(*) AS summary
FROM information_schema.tables
WHERE table_schema = 'redpresu';

SELECT
  'Total de enums en redpresu: ' || count(DISTINCT typname) AS summary
FROM pg_type t
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'redpresu' AND t.typtype = 'e';

-- =====================================================
-- NOTA: Ejecuta este script completo en Supabase SQL Editor
-- y envíame el resultado para generar un mejor schema de migración
-- =====================================================
