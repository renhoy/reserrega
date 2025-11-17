-- =====================================================
-- CLEANUP SCRIPT - Limpiar schema reserrega
-- =====================================================
-- ADVERTENCIA: Este script ELIMINA PERMANENTEMENTE:
-- - Todas las tablas del schema reserrega
-- - Todos los datos
-- - Todas las funciones y triggers
--
-- Solo ejecutar si estás seguro de empezar desde cero
-- =====================================================

-- Deshabilitar temporalmente las foreign keys para poder eliminar en orden
SET session_replication_role = 'replica';

-- Eliminar tablas si existen (en orden inverso para evitar errores de FK)
DROP TABLE IF EXISTS reserrega.friendships CASCADE;
DROP TABLE IF EXISTS reserrega.friend_requests CASCADE;
DROP TABLE IF EXISTS reserrega.gifts CASCADE;
DROP TABLE IF EXISTS reserrega.wishlists CASCADE;
DROP TABLE IF EXISTS reserrega.reservations CASCADE;
DROP TABLE IF EXISTS reserrega.products CASCADE;
DROP TABLE IF EXISTS reserrega.stores CASCADE;
DROP TABLE IF EXISTS reserrega.user_invitations CASCADE;
DROP TABLE IF EXISTS reserrega.contact_messages CASCADE;
DROP TABLE IF EXISTS reserrega.subscriptions CASCADE;
DROP TABLE IF EXISTS reserrega.config CASCADE;
DROP TABLE IF EXISTS reserrega.issuers CASCADE;
DROP TABLE IF EXISTS reserrega.companies CASCADE;
DROP TABLE IF EXISTS reserrega.users CASCADE;

-- Eliminar funciones
DROP FUNCTION IF EXISTS reserrega.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS reserrega.expire_old_reservations() CASCADE;

-- Habilitar de nuevo las foreign keys
SET session_replication_role = 'origin';

-- Opcional: Eliminar el schema completo (descomentar si quieres empezar totalmente desde cero)
-- DROP SCHEMA IF EXISTS reserrega CASCADE;

-- Verificación
DO $$
BEGIN
  RAISE NOTICE '🧹 Schema reserrega limpiado';
  RAISE NOTICE '✅ Ahora puedes ejecutar RESERREGA_FINAL.sql';
END $$;
