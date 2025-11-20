-- =====================================================
-- CREATE SUPERADMIN USER (VERSION SIMPLE)
-- =====================================================
-- Para ejecutar desde Supabase SQL Editor (Cloud)
--
-- INSTRUCCIONES:
-- 1. Regístrate primero en la aplicación (crea tu cuenta)
-- 2. Reemplaza 'tu-email@example.com' con tu email real
-- 3. Ejecuta este script completo en Supabase SQL Editor
-- 4. El script buscará automáticamente tu UUID y creará el superadmin
-- =====================================================

-- =====================================================
-- CONFIGURACIÓN
-- =====================================================
-- ⚠️ IMPORTANTE: Reemplaza este email con el tuyo
\set SUPERADMIN_EMAIL 'tu-email@example.com'

-- =====================================================
-- PASO 1: Verificar que el usuario existe en auth.users
-- =====================================================

DO $$
DECLARE
  user_exists BOOLEAN;
  superadmin_email TEXT := 'tu-email@example.com';  -- ⚠️ CAMBIAR ESTE EMAIL
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = superadmin_email
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE EXCEPTION '⚠️  El usuario % no existe en auth.users. Debes registrarte primero en la aplicación.', superadmin_email;
  END IF;

  RAISE NOTICE '✅ Usuario encontrado en auth.users: %', superadmin_email;
END $$;

-- =====================================================
-- PASO 2: Crear/Actualizar usuario como superadmin
-- =====================================================

INSERT INTO public.users (
  id,
  role,
  company_id,
  name,
  email,
  status
)
SELECT
  id,
  'superadmin',
  NULL,  -- Superadmin no está ligado a ninguna empresa
  'Super Admin',  -- Puedes cambiar el nombre si quieres
  email,
  'active'
FROM auth.users
WHERE email = 'tu-email@example.com'  -- ⚠️ CAMBIAR ESTE EMAIL
ON CONFLICT (id)
DO UPDATE SET
  role = 'superadmin',
  status = 'active',
  updated_at = NOW();

-- =====================================================
-- PASO 3: Verificar que se creó correctamente
-- =====================================================

SELECT
  '✅ SUPERADMIN CREADO' as resultado,
  id,
  role,
  name,
  email,
  status,
  created_at,
  updated_at
FROM public.users
WHERE email = 'tu-email@example.com';  -- ⚠️ CAMBIAR ESTE EMAIL

-- =====================================================
-- MENSAJE FINAL
-- =====================================================

DO $$
DECLARE
  superadmin_email TEXT := 'tu-email@example.com';  -- ⚠️ CAMBIAR ESTE EMAIL
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ SUPERADMIN CREADO EXITOSAMENTE';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📧 Email: %', superadmin_email;
  RAISE NOTICE '🔐 Role: superadmin';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximos pasos:';
  RAISE NOTICE '   1. Inicia sesión en la aplicación';
  RAISE NOTICE '   2. Accede al panel de superadmin';
  RAISE NOTICE '   3. Crea tu primera empresa';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- ✅ Si todo funcionó verás tu usuario con role='superadmin'
-- =====================================================
