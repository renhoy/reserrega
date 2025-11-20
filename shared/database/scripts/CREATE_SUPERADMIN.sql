-- =====================================================
-- CREATE SUPERADMIN USER
-- =====================================================
-- Script para convertir un usuario existente en superadmin
--
-- IMPORTANTE:
-- 1. Primero debes registrar el usuario a través de Supabase Auth
-- 2. Luego ejecuta este script reemplazando los valores
-- =====================================================

-- =====================================================
-- PASO 1: CONFIGURAR ESTOS VALORES
-- =====================================================

-- Reemplaza con el email del usuario que será superadmin
\set SUPERADMIN_EMAIL 'tu-email@example.com'

-- Reemplaza con el UUID del usuario desde auth.users
-- Puedes obtenerlo con: SELECT id FROM auth.users WHERE email = 'tu-email@example.com';
\set SUPERADMIN_UUID 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

-- =====================================================
-- PASO 2: EJECUTAR SCRIPT
-- =====================================================

-- Verificar que el usuario existe en auth.users
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE id = :'SUPERADMIN_UUID'
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE EXCEPTION 'El usuario con UUID % no existe en auth.users', :'SUPERADMIN_UUID';
  END IF;

  RAISE NOTICE '✅ Usuario encontrado en auth.users';
END $$;

-- Insertar o actualizar usuario en public.users como superadmin
INSERT INTO public.users (
  id,
  role,
  company_id,
  name,
  email,
  status
)
VALUES (
  :'SUPERADMIN_UUID',
  'superadmin',
  NULL,  -- Superadmin no está ligado a ninguna empresa
  'Super Admin',  -- Puedes cambiar el nombre
  :'SUPERADMIN_EMAIL',
  'active'
)
ON CONFLICT (id)
DO UPDATE SET
  role = 'superadmin',
  status = 'active',
  updated_at = NOW();

-- Verificar que se creó correctamente
SELECT
  id,
  role,
  name,
  email,
  status,
  created_at
FROM public.users
WHERE id = :'SUPERADMIN_UUID';

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Usuario superadmin creado/actualizado correctamente';
  RAISE NOTICE '📧 Email: %', :'SUPERADMIN_EMAIL';
  RAISE NOTICE '🔑 UUID: %', :'SUPERADMIN_UUID';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximos pasos:';
  RAISE NOTICE '   1. Verifica que puedes iniciar sesión con este usuario';
  RAISE NOTICE '   2. Crea tu primera empresa desde el panel de admin';
  RAISE NOTICE '   3. Invita usuarios con rol admin para esa empresa';
END $$;
