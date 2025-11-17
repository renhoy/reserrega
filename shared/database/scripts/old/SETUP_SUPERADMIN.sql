-- =====================================================
-- SETUP SUPERADMIN - José Ignacio
-- =====================================================
-- Configura josivela+super@gmail.com como superadmin
-- Copia y pega este script completo en Supabase SQL Editor
-- =====================================================

-- Insertar/actualizar usuario como superadmin
-- Si el usuario ya existe, solo actualiza el role
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

-- Verificar que se creó correctamente
SELECT
  id,
  role,
  name,
  last_name,
  email,
  status,
  created_at,
  updated_at
FROM reserrega.users
WHERE email = 'josivela+super@gmail.com';

-- ✅ Deberías ver: role = 'superadmin', status = 'active'
