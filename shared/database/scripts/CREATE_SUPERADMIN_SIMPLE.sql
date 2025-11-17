-- =====================================================
-- CREATE SUPERADMIN USER (VERSION SIMPLE)
-- =====================================================
-- Para ejecutar desde Supabase SQL Editor
--
-- INSTRUCCIONES:
-- 1. Regístrate primero en la aplicación (crea tu cuenta)
-- 2. Obtén tu UUID ejecutando:
--    SELECT id, email FROM auth.users WHERE email = 'tu-email@example.com';
-- 3. Reemplaza 'TU-UUID-AQUI' y 'tu-email@example.com' abajo
-- 4. Ejecuta este script completo
-- =====================================================

-- PASO 1: Verificar que el usuario existe en auth.users
-- Reemplaza el email con tu email real
SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'tu-email@example.com';  -- ⚠️ CAMBIAR ESTE EMAIL

-- Si la query anterior devuelve tu usuario, copia el UUID y continúa

-- PASO 2: Crear/Actualizar usuario como superadmin
-- Reemplaza TU-UUID-AQUI con el UUID del paso anterior
INSERT INTO reserrega.users (
  id,
  role,
  company_id,
  name,
  email,
  status
)
VALUES (
  'TU-UUID-AQUI',  -- ⚠️ CAMBIAR ESTE UUID
  'superadmin',
  NULL,
  'Super Admin',
  'tu-email@example.com',  -- ⚠️ CAMBIAR ESTE EMAIL
  'active'
)
ON CONFLICT (id)
DO UPDATE SET
  role = 'superadmin',
  status = 'active',
  updated_at = NOW();

-- PASO 3: Verificar que se creó correctamente
SELECT
  id,
  role,
  name,
  email,
  status,
  created_at,
  updated_at
FROM reserrega.users
WHERE email = 'tu-email@example.com';  -- ⚠️ CAMBIAR ESTE EMAIL

-- PASO 4: Verificar permisos RLS
-- Como superadmin deberías poder ver todas las tablas
SELECT 'OK - Tienes acceso superadmin' as status;

-- =====================================================
-- ✅ Si todo funcionó verás tu usuario con role='superadmin'
-- =====================================================
