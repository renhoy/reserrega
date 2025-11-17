-- =====================================================
-- FIX: DATOS INICIALES FALTANTES
-- =====================================================
-- Este script crea los datos que faltan para que
-- el dashboard funcione correctamente
-- =====================================================

-- =====================================================
-- PASO 1: INSERTAR VALORES DE CONFIG
-- =====================================================

INSERT INTO reserrega.config (key, value, description, category, is_system) VALUES
  ('app_name', '"Reserrega"', 'Nombre de la aplicación', 'general', false),
  ('multiempresa', 'true', 'Modo multi-empresa', 'general', false),
  ('subscriptions_enabled', 'true', 'Suscripciones habilitadas', 'general', false),
  ('reservation_fee', '1.00', 'Tarifa de reserva en euros', 'reserrega', false),
  ('reservation_days', '15', 'Días de validez de reserva', 'reserrega', false),
  ('gift_lock_minutes', '15', 'Minutos de bloqueo temporal al regalar', 'reserrega', false),
  ('store_share_percentage', '50', 'Porcentaje que recibe la tienda (50%)', 'reserrega', false),
  ('platform_share_percentage', '50', 'Porcentaje que recibe la plataforma (50%)', 'reserrega', false),
  -- Valores opcionales para testing
  ('mock_time', 'null', 'Tiempo simulado para testing (null = usar tiempo real)', 'testing', true),
  ('testing_mode', 'false', 'Modo de testing habilitado', 'testing', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = NOW();

-- =====================================================
-- PASO 2: CREAR SUSCRIPCIÓN PARA EMPRESA DEMO
-- =====================================================

-- Primero eliminar suscripción existente si hay alguna (para evitar duplicados)
DELETE FROM reserrega.subscriptions WHERE company_id = 1;

-- Crear nueva suscripción
INSERT INTO reserrega.subscriptions (
  id,
  company_id,
  plan,
  status,
  current_period_start,
  current_period_end,
  cancel_at_period_end
)
VALUES (
  gen_random_uuid(),
  1, -- Empresa Demo
  'pro', -- Plan Pro
  'active', -- Activa
  NOW(), -- Inicio ahora
  NOW() + INTERVAL '1 year', -- Expira en 1 año
  false -- No cancelar al final del periodo
);

-- =====================================================
-- PASO 3: ASEGURAR QUE SUPERADMIN ESTÁ EN EMPRESA DEMO
-- =====================================================

UPDATE reserrega.users
SET company_id = 1
WHERE email = 'josivela+super@gmail.com'
  AND (company_id IS NULL OR company_id != 1);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver valores de config
SELECT
  '✅ CONFIG' as tipo,
  key,
  value,
  category
FROM reserrega.config
ORDER BY category, key;

-- Ver suscripción de empresa demo
SELECT
  '✅ SUSCRIPCIÓN' as tipo,
  id,
  company_id,
  plan,
  status,
  current_period_end
FROM reserrega.subscriptions
WHERE company_id = 1;

-- Ver superadmin
SELECT
  '✅ SUPERADMIN' as tipo,
  id,
  email,
  role,
  company_id,
  status
FROM reserrega.users
WHERE email = 'josivela+super@gmail.com';

-- =====================================================
-- ✅ DATOS INICIALES COMPLETADOS
-- =====================================================
-- Ahora el dashboard debería funcionar correctamente
-- =====================================================
