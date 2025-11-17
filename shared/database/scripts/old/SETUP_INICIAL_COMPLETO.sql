-- =====================================================
-- SETUP INICIAL COMPLETO - RESERREGA
-- =====================================================
-- Este script configura todo lo necesario para empezar:
-- 1. Usuario Superadmin (José Ignacio)
-- 2. Empresa Demo (id=1)
-- 3. Issuer Demo asociado
--
-- Copia y pega TODO este script en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASO 1: CREAR SUPERADMIN
-- =====================================================

INSERT INTO reserrega.users (
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
  NULL,
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

INSERT INTO reserrega.companies (
  id,
  name,
  status
)
VALUES (
  1,
  'Empresa Demo',
  'active'
)
ON CONFLICT (id)
DO UPDATE SET
  name = 'Empresa Demo',
  status = 'active',
  updated_at = NOW();

-- Reiniciar secuencia para que próximas companies empiecen en 2
SELECT setval('reserrega.companies_id_seq', 1, true);

-- =====================================================
-- PASO 3: CREAR ISSUER DEMO
-- =====================================================

INSERT INTO reserrega.issuers (
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
  'autonomo',
  'Demo',
  'B36936926',
  'Calle Demo, 369',
  '36900',
  'Localidad Demo',
  'Provincia Demo',
  'España',
  '963 369 369',
  'demo@demo.com',
  'https://demo.com',
  15.00
FROM reserrega.users u
WHERE u.email = 'josivela+super@gmail.com'
ON CONFLICT (id)
DO UPDATE SET
  user_id = (SELECT id FROM reserrega.users WHERE email = 'josivela+super@gmail.com'),
  company_id = 1,
  type = 'autonomo',
  name = 'Demo',
  nif = 'B36936926',
  address = 'Calle Demo, 369',
  postal_code = '36900',
  locality = 'Localidad Demo',
  province = 'Provincia Demo',
  country = 'España',
  phone = '963 369 369',
  email = 'demo@demo.com',
  web = 'https://demo.com',
  irpf_percentage = 15.00,
  updated_at = NOW();

-- =====================================================
-- VERIFICACIÓN
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
FROM reserrega.users
WHERE email = 'josivela+super@gmail.com';

-- Ver empresa demo
SELECT
  '✅ EMPRESA DEMO' as tipo,
  id,
  name,
  status,
  created_at
FROM reserrega.companies
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
FROM reserrega.issuers
WHERE company_id = 1;

-- =====================================================
-- ✅ SETUP COMPLETADO
-- =====================================================
-- Ya puedes iniciar sesión con:
-- Email: josivela+super@gmail.com
-- Password: xtatil2025
-- =====================================================
