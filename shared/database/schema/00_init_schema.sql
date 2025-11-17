-- =====================================================
-- RESERREGA - Schema Initialization
-- =====================================================
-- Descripción: Configuración inicial del schema reserrega
-- Autor: Reserrega Team
-- Fecha: 2025-11-17
-- =====================================================

-- Crear schema si no existe
CREATE SCHEMA IF NOT EXISTS reserrega;

-- Configurar search_path para que use reserrega por defecto
-- Esto permite que las tablas se creen automáticamente en este schema
ALTER DATABASE postgres SET search_path TO reserrega, public;

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Para encriptación
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Para búsquedas de texto

-- Comentario del schema
COMMENT ON SCHEMA reserrega IS 'Schema principal para la aplicación Reserrega - Red social de regalos';

-- =====================================================
-- ENUMS GLOBALES
-- =====================================================

-- Roles de usuario
CREATE TYPE reserrega.user_role AS ENUM (
  'superadmin',
  'admin',
  'comercial',
  'usuario'
);

COMMENT ON TYPE reserrega.user_role IS 'Roles de usuario en el sistema';

-- Estados de usuario
CREATE TYPE reserrega.user_status AS ENUM (
  'active',
  'inactive',
  'pending'
);

COMMENT ON TYPE reserrega.user_status IS 'Estados de activación de usuario';

-- Tipo de empresa
CREATE TYPE reserrega.company_type AS ENUM (
  'empresa',
  'autonomo'
);

COMMENT ON TYPE reserrega.company_type IS 'Tipo de empresa partner';

-- Estado de empresa/tienda
CREATE TYPE reserrega.entity_status AS ENUM (
  'active',
  'inactive'
);

COMMENT ON TYPE reserrega.entity_status IS 'Estado activo/inactivo para empresas y tiendas';

-- Estado de reserva
CREATE TYPE reserrega.reservation_status AS ENUM (
  'active',
  'expired',
  'completed',
  'cancelled'
);

COMMENT ON TYPE reserrega.reservation_status IS 'Estados de una reserva de producto';

-- Visibilidad de wishlist
CREATE TYPE reserrega.wishlist_visibility AS ENUM (
  'private',
  'friends',
  'public'
);

COMMENT ON TYPE reserrega.wishlist_visibility IS 'Nivel de visibilidad de items en wishlist';

-- Estado de wishlist item
CREATE TYPE reserrega.wishlist_status AS ENUM (
  'available',
  'in_process',
  'gifted',
  'expired'
);

COMMENT ON TYPE reserrega.wishlist_status IS 'Estado de un item en la wishlist';

-- Estado de pago
CREATE TYPE reserrega.payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

COMMENT ON TYPE reserrega.payment_status IS 'Estado de un pago';

-- Estado de envío
CREATE TYPE reserrega.shipping_status AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'cancelled'
);

COMMENT ON TYPE reserrega.shipping_status IS 'Estado de envío de un regalo';

-- Estado de solicitud de amistad
CREATE TYPE reserrega.friend_request_status AS ENUM (
  'pending',
  'accepted',
  'rejected'
);

COMMENT ON TYPE reserrega.friend_request_status IS 'Estado de solicitud de amistad';

-- =====================================================
-- FUNCIONES HELPER GLOBALES
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION reserrega.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reserrega.update_updated_at_column() IS 'Trigger function para actualizar updated_at automáticamente';

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- Verificar que el schema existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'reserrega'
  ) THEN
    RAISE EXCEPTION 'Schema reserrega no fue creado correctamente';
  END IF;

  RAISE NOTICE 'Schema reserrega inicializado correctamente';
END $$;
