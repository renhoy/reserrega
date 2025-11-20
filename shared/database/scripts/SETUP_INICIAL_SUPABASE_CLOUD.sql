-- =====================================================
-- SETUP INICIAL COMPLETO - RESERREGA (SUPABASE CLOUD)
-- =====================================================
-- Este script configura todo lo necesario para empezar en Supabase Cloud:
-- 1. Usuario Superadmin (José Ignacio)
-- 2. Empresa Demo (id=1)
-- 3. Issuer Demo asociado
-- 4. Tienda Demo con ubicación física
-- 5. Productos Demo para testing
--
-- IMPORTANTE:
-- Primero debes registrarte en la app con el email: josivela+super@gmail.com
-- Luego ejecuta este script completo en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASO 1: CREAR SUPERADMIN
-- =====================================================

-- Verificar que el usuario existe en auth.users
DO $$
DECLARE
  user_exists BOOLEAN;
  superadmin_email TEXT := 'josivela+super@gmail.com';
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = superadmin_email
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE EXCEPTION '⚠️  El usuario % no existe en auth.users. Debes registrarte primero en la aplicación.', superadmin_email;
  END IF;

  RAISE NOTICE '✅ Usuario encontrado en auth.users: %', superadmin_email;
END $$;

-- Crear/Actualizar usuario como superadmin
INSERT INTO public.users (
  id,
  role,
  company_id,
  name,
  last_name,
  email,
  status
)
SELECT
  id,
  'superadmin',
  NULL,  -- Superadmin no está ligado a ninguna empresa
  'José Ignacio',
  'Vela',
  email,
  'active'
FROM auth.users
WHERE email = 'josivela+super@gmail.com'
ON CONFLICT (id)
DO UPDATE SET
  role = 'superadmin',
  name = 'José Ignacio',
  last_name = 'Vela',
  status = 'active',
  updated_at = NOW();

-- =====================================================
-- PASO 2: CREAR EMPRESA DEMO
-- =====================================================

INSERT INTO public.companies (
  id,
  name,
  status
)
VALUES (
  1,
  'Tienda Demo Reserrega',
  'active'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Tienda Demo Reserrega',
  status = 'active',
  updated_at = NOW();

-- Reiniciar secuencia para que próximas companies empiecen en 2
SELECT setval('public.companies_id_seq', 1, true);

-- =====================================================
-- PASO 3: CREAR ISSUER DEMO (Datos fiscales)
-- =====================================================

INSERT INTO public.issuers (
  id,
  user_id,
  company_id,
  type,
  name,
  nif,
  address,
  postal_code,
  locality,
  province,
  country,
  phone,
  email,
  web,
  irpf_percentage
)
SELECT
  'adc5b25e-7874-46bf-98a0-d2db9ba842cc'::uuid,
  u.id,
  1,
  'empresa',
  'Tienda Demo Reserrega S.L.',
  'B36936926',
  'Calle Príncipe, 36',
  '36202',
  'Vigo',
  'Pontevedra',
  'España',
  '+34 986 123 456',
  'contacto@demo-reserrega.com',
  'https://demo-reserrega.com',
  15.00
FROM public.users u
WHERE u.email = 'josivela+super@gmail.com'
ON CONFLICT (id)
DO UPDATE SET
  user_id = (SELECT id FROM public.users WHERE email = 'josivela+super@gmail.com'),
  company_id = 1,
  type = 'empresa',
  name = 'Tienda Demo Reserrega S.L.',
  nif = 'B36936926',
  address = 'Calle Príncipe, 36',
  postal_code = '36202',
  locality = 'Vigo',
  province = 'Pontevedra',
  country = 'España',
  phone = '+34 986 123 456',
  email = 'contacto@demo-reserrega.com',
  web = 'https://demo-reserrega.com',
  irpf_percentage = 15.00,
  updated_at = NOW();

-- =====================================================
-- PASO 4: CREAR TIENDA FÍSICA DEMO
-- =====================================================

INSERT INTO public.stores (
  id,
  company_id,
  name,
  address,
  postal_code,
  locality,
  province,
  country,
  phone,
  manager_user_id,
  status
)
SELECT
  1,
  1,
  'Tienda Demo Centro - Vigo',
  'Calle Príncipe, 36',
  '36202',
  'Vigo',
  'Pontevedra',
  'España',
  '+34 986 123 456',
  u.id,  -- El superadmin es el manager por defecto
  'active'
FROM public.users u
WHERE u.email = 'josivela+super@gmail.com'
ON CONFLICT (id)
DO UPDATE SET
  name = 'Tienda Demo Centro - Vigo',
  address = 'Calle Príncipe, 36',
  postal_code = '36202',
  locality = 'Vigo',
  province = 'Pontevedra',
  phone = '+34 986 123 456',
  status = 'active',
  updated_at = NOW();

-- Reiniciar secuencia para que próximas stores empiecen en 2
SELECT setval('public.stores_id_seq', 1, true);

-- =====================================================
-- PASO 5: CREAR PRODUCTOS DEMO
-- =====================================================

-- Producto 1: Vestido Rojo
INSERT INTO public.products (
  id,
  store_id,
  barcode,
  name,
  description,
  brand,
  size,
  color,
  price,
  category
)
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  1,
  '8436012345001',
  'Vestido de Fiesta Elegante',
  'Vestido largo de fiesta con detalles en encaje. Perfecto para eventos especiales.',
  'Zara',
  'M',
  'Rojo',
  89.95,
  'Vestidos'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Vestido de Fiesta Elegante',
  description = 'Vestido largo de fiesta con detalles en encaje. Perfecto para eventos especiales.',
  price = 89.95,
  updated_at = NOW();

-- Producto 2: Chaqueta Negra
INSERT INTO public.products (
  id,
  store_id,
  barcode,
  name,
  description,
  brand,
  size,
  color,
  price,
  category
)
VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  1,
  '8436012345002',
  'Chaqueta de Cuero',
  'Chaqueta de cuero sintético con forro interior. Estilo casual urbano.',
  'Mango',
  'L',
  'Negro',
  129.99,
  'Chaquetas'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Chaqueta de Cuero',
  description = 'Chaqueta de cuero sintético con forro interior. Estilo casual urbano.',
  price = 129.99,
  updated_at = NOW();

-- Producto 3: Jeans Azul
INSERT INTO public.products (
  id,
  store_id,
  barcode,
  name,
  description,
  brand,
  size,
  color,
  price,
  category
)
VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  1,
  '8436012345003',
  'Jeans Skinny Fit',
  'Pantalón vaquero ajustado de tiro medio. Tejido elástico y cómodo.',
  'Levi''s',
  '38',
  'Azul',
  69.95,
  'Pantalones'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Jeans Skinny Fit',
  description = 'Pantalón vaquero ajustado de tiro medio. Tejido elástico y cómodo.',
  price = 69.95,
  updated_at = NOW();

-- Producto 4: Blusa Blanca
INSERT INTO public.products (
  id,
  store_id,
  barcode,
  name,
  description,
  brand,
  size,
  color,
  price,
  category
)
VALUES (
  '10000000-0000-0000-0000-000000000004'::uuid,
  1,
  '8436012345004',
  'Blusa con Volantes',
  'Blusa elegante de manga larga con detalles de volantes en cuello y puños.',
  'H&M',
  'S',
  'Blanco',
  39.99,
  'Blusas'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Blusa con Volantes',
  description = 'Blusa elegante de manga larga con detalles de volantes en cuello y puños.',
  price = 39.99,
  updated_at = NOW();

-- Producto 5: Zapatos Tacón
INSERT INTO public.products (
  id,
  store_id,
  barcode,
  name,
  description,
  brand,
  size,
  color,
  price,
  category
)
VALUES (
  '10000000-0000-0000-0000-000000000005'::uuid,
  1,
  '8436012345005',
  'Zapatos de Tacón Alto',
  'Zapatos de tacón de 10cm con punta cerrada. Ideales para combinar con vestidos.',
  'Bershka',
  '37',
  'Negro',
  49.99,
  'Calzado'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Zapatos de Tacón Alto',
  description = 'Zapatos de tacón de 10cm con punta cerrada. Ideales para combinar con vestidos.',
  price = 49.99,
  updated_at = NOW();

-- =====================================================
-- PASO 6: CREAR SUSCRIPCIÓN FREE PARA LA EMPRESA
-- =====================================================

INSERT INTO public.subscriptions (
  id,
  company_id,
  plan,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end
)
VALUES (
  '20000000-0000-0000-0000-000000000001'::uuid,
  1,
  'free',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  false
)
ON CONFLICT (id)
DO UPDATE SET
  status = 'active',
  updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Ver superadmin
SELECT
  '✅ SUPERADMIN' as tipo,
  id,
  role,
  name,
  last_name,
  email,
  status
FROM public.users
WHERE email = 'josivela+super@gmail.com';

-- Ver empresa demo
SELECT
  '✅ EMPRESA DEMO' as tipo,
  id,
  name,
  status,
  created_at
FROM public.companies
WHERE id = 1;

-- Ver issuer demo
SELECT
  '✅ ISSUER DEMO' as tipo,
  id,
  company_id,
  type,
  name,
  nif,
  email,
  web
FROM public.issuers
WHERE company_id = 1;

-- Ver tienda demo
SELECT
  '✅ TIENDA DEMO' as tipo,
  id,
  company_id,
  name,
  address,
  locality,
  status
FROM public.stores
WHERE id = 1;

-- Ver productos demo
SELECT
  '✅ PRODUCTOS DEMO' as tipo,
  COUNT(*) as total_productos
FROM public.products
WHERE store_id = 1;

-- Lista de productos
SELECT
  name,
  brand,
  size,
  color,
  price::text || ' €' as precio,
  category
FROM public.products
WHERE store_id = 1
ORDER BY category, name;

-- Ver suscripción
SELECT
  '✅ SUSCRIPCIÓN' as tipo,
  plan,
  status,
  current_period_end
FROM public.subscriptions
WHERE company_id = 1;

-- =====================================================
-- MENSAJE FINAL
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '🎉 SETUP INICIAL COMPLETADO EXITOSAMENTE';
  RAISE NOTICE '🎉 ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Resumen de lo creado:';
  RAISE NOTICE '   ✅ 1 Usuario Superadmin';
  RAISE NOTICE '   ✅ 1 Empresa Demo';
  RAISE NOTICE '   ✅ 1 Issuer (datos fiscales)';
  RAISE NOTICE '   ✅ 1 Tienda física';
  RAISE NOTICE '   ✅ 5 Productos demo';
  RAISE NOTICE '   ✅ 1 Suscripción Free activa';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Credenciales de acceso:';
  RAISE NOTICE '   📧 Email: josivela+super@gmail.com';
  RAISE NOTICE '   🔑 Password: (la que configuraste al registrarte)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Próximos pasos:';
  RAISE NOTICE '   1. Inicia sesión en http://localhost:3434';
  RAISE NOTICE '   2. Accede al panel de superadmin';
  RAISE NOTICE '   3. Explora los productos demo en la tienda';
  RAISE NOTICE '   4. Crea usuarios de prueba para testing';
  RAISE NOTICE '';
END $$;
