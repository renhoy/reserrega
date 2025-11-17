-- =====================================================
-- SETUP EMPRESA DEMO
-- =====================================================
-- Crea la empresa Demo (id=1) y su issuer asociado
-- Esta es la empresa por defecto del sistema
-- Copia y pega este script completo en Supabase SQL Editor
-- =====================================================

-- PASO 1: Crear Empresa Demo (id=1)
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

-- PASO 2: Crear Issuer para Empresa Demo
-- Usa el user_id del superadmin automáticamente
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
  u.id,  -- user_id del superadmin
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

-- PASO 3: Verificar que se crearon correctamente
SELECT
  id,
  name,
  status,
  created_at,
  updated_at
FROM reserrega.companies
WHERE id = 1;

SELECT
  id,
  user_id,
  company_id,
  type,
  name,
  nif,
  address,
  email,
  web,
  created_at,
  updated_at
FROM reserrega.issuers
WHERE company_id = 1;

-- ✅ Deberías ver:
-- Company: id=1, name='Empresa Demo', status='active'
-- Issuer: company_id=1, name='Demo', nif='B36936926'
