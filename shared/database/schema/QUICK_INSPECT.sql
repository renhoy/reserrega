-- =====================================================
-- QUICK INSPECTION - Ver tablas de redpresu
-- =====================================================

-- 1. Listar todas las tablas
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'redpresu' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'redpresu'
ORDER BY table_name;

-- 2. Ver estructura de cada tabla
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'redpresu'
ORDER BY table_name, ordinal_position;
