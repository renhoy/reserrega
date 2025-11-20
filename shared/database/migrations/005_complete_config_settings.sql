-- =====================================================
-- RESERREGA - Complete Config Settings
-- =====================================================
-- Añade todas las configuraciones aplicables al sistema
-- Adaptadas de RedPresu + específicas de Reserrega
-- =====================================================

-- =====================================================
-- CONFIGURACIONES GENERALES
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  -- Aplicación
  ('app_mode', '"development"', 'Modo de la aplicación (development/production)', 'aplicacion', false),
  ('app_name', '"Reserrega"', 'Nombre de la aplicación', 'aplicacion', false),
  ('multiempresa', 'true', 'Modo multi-empresa (siempre true para Reserrega)', 'general', true),
  ('public_registration_enabled', 'true', 'Permitir registro público de nuevos usuarios', 'aplicacion', false),
  ('registration_requires_approval', 'false', 'Requiere aprobación de superadmin para nuevos registros', 'registration', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_system = EXCLUDED.is_system,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES DE CONTACTO Y NOTIFICACIONES
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  ('contact_notification_emails', '["admin@reserrega.com"]', 'Emails que reciben notificaciones de formularios de contacto', 'contacto', false),
  ('enable_gift_notifications', 'true', 'Activar notificaciones cuando se recibe un regalo', 'notificaciones', false),
  ('enable_delivery_notifications', 'true', 'Activar notificaciones de estado de entrega', 'notificaciones', false),
  ('enable_friend_request_notifications', 'true', 'Activar notificaciones de solicitudes de amistad', 'notificaciones', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES DE RESERREGA (NEGOCIO)
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  -- Reservas
  ('reservation_fee', '1.00', 'Precio de reserva de productos en euros', 'reserrega', false),
  ('reservation_expiration_days', '15', 'Días de validez de una reserva', 'reserrega', false),
  ('max_products_per_reservation', '10', 'Máximo de productos por sesión de reserva', 'reserrega', false),
  ('allow_reservation_extension', 'false', 'Permitir extender la validez de reservas', 'reserrega', false),

  -- QR
  ('qr_user_expiration_hours', '24', 'Horas de validez del QR de usuario para escaneo', 'reserrega', false),
  ('enable_qr_scanning', 'true', 'Habilitar funcionalidad de escaneo QR', 'reserrega', false),

  -- Regalos
  ('gift_lock_duration_minutes', '15', 'Minutos de bloqueo temporal al seleccionar un regalo', 'reserrega', false),
  ('allow_gift_messages', 'true', 'Permitir mensajes personalizados en regalos', 'reserrega', false),
  ('require_delivery_confirmation', 'true', 'Requerir confirmación de entrega por parte del usuario', 'reserrega', false),

  -- Wishlists
  ('wishlist_visibility_default', '"friends"', 'Visibilidad por defecto de productos (private/friends/public)', 'reserrega', false),
  ('max_wishlist_products', '100', 'Máximo de productos en wishlist por usuario', 'reserrega', false),

  -- Amigos
  ('friend_request_expiration_days', '30', 'Días de validez de solicitudes de amistad', 'reserrega', false),
  ('max_friends_per_user', '500', 'Máximo de amigos por usuario', 'reserrega', false),
  ('enable_friend_invitations', 'true', 'Permitir invitaciones de amigos por email', 'reserrega', false),

  -- Reparto de beneficios
  ('store_share_percentage', '50', 'Porcentaje que recibe la tienda de cada reserva', 'reserrega', false),
  ('platform_share_percentage', '50', 'Porcentaje que recibe la plataforma de cada reserva', 'reserrega', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES DE INVITACIONES
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  ('invitation_token_expiration_days', '7', 'Días de validez de los tokens de invitación', 'usuarios', false),
  ('invitation_email_template', '{
    "subject": "Has sido invitado a unirte a {company_name} en Reserrega",
    "body_html": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;\"><div style=\"background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);\"><h1 style=\"color: #ec4899; margin-bottom: 20px;\">¡Hola!</h1><p style=\"color: #333; font-size: 16px; line-height: 1.6;\">Has sido invitado por <strong>{inviter_name}</strong> a unirte a <strong>{company_name}</strong> en Reserrega.</p><p style=\"color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;\"><strong>Tu rol será:</strong> {role_name}</p><div style=\"margin: 30px 0; text-align: center;\"><a href=\"{accept_url}\" style=\"background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;\">Aceptar Invitación</a></div><p style=\"color: #999; font-size: 12px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;\">Este enlace expira en 7 días. Si no solicitaste esta invitación, puedes ignorar este mensaje.</p></div><div style=\"text-align: center; margin-top: 20px; color: #999; font-size: 12px;\"><p>Reserrega - Reserva y Regala</p></div></div>",
    "body_text": "¡Hola!\\n\\nHas sido invitado por {inviter_name} a unirte a {company_name} en Reserrega.\\n\\nTu rol será: {role_name}\\n\\nPara aceptar la invitación, visita el siguiente enlace:\\n{accept_url}\\n\\nEste enlace expira en 7 días. Si no solicitaste esta invitación, puedes ignorar este mensaje.\\n\\n---\\nReserrega - Reserva y Regala"
  }', 'Template de email para invitaciones. Variables: {company_name}, {inviter_name}, {role_name}, {accept_url}', 'email', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_system = EXCLUDED.is_system,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES DE EMAIL
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  ('welcome_email_template', '{
    "subject": "¡Bienvenido a Reserrega!",
    "body_html": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\"><h1 style=\"color: #ec4899;\">¡Bienvenido a Reserrega!</h1><p>Hola {user_name},</p><p>Gracias por registrarte en Reserrega. Ahora puedes:</p><ul><li>Reservar productos en tiendas físicas</li><li>Crear tu wishlist de regalos</li><li>Invitar amigos para que sepan qué regalarte</li><li>Regalar sin errores</li></ul><p><a href=\"{dashboard_url}\" style=\"background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;\">Ir a mi Dashboard</a></p></div>",
    "body_text": "¡Bienvenido a Reserrega!\\n\\nHola {user_name},\\n\\nGracias por registrarte. Visita tu dashboard: {dashboard_url}"
  }', 'Template de email de bienvenida. Variables: {user_name}, {dashboard_url}', 'email', true),

  ('gift_received_email_template', '{
    "subject": "¡Has recibido un regalo en Reserrega!",
    "body_html": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\"><h1 style=\"color: #ec4899;\">¡Has recibido un regalo!</h1><p>Hola {user_name},</p><p><strong>{gifter_name}</strong> te ha regalado:</p><p style=\"font-size: 18px; font-weight: bold; color: #333;\">{product_name}</p><p>Puedes recogerlo en: <strong>{store_name}</strong></p><p>{gift_message}</p><p><a href=\"{gift_url}\" style=\"background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;\">Ver Detalles</a></p></div>",
    "body_text": "¡Has recibido un regalo!\\n\\n{gifter_name} te ha regalado: {product_name}\\n\\nRecógelo en: {store_name}\\n\\n{gift_message}"
  }', 'Template cuando recibes un regalo. Variables: {user_name}, {gifter_name}, {product_name}, {store_name}, {gift_message}, {gift_url}', 'email', true),

  ('delivery_notification_email_template', '{
    "subject": "Tu regalo está listo para recoger",
    "body_html": "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\"><h1 style=\"color: #ec4899;\">¡Tu regalo está listo!</h1><p>Hola {user_name},</p><p>Tu regalo <strong>{product_name}</strong> está listo para recoger en:</p><p style=\"font-size: 16px;\"><strong>{store_name}</strong><br>{store_address}</p><p>Horario: {store_hours}</p><p><a href=\"{tracking_url}\" style=\"background-color: #ec4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;\">Ver Estado</a></p></div>",
    "body_text": "¡Tu regalo está listo!\\n\\nRecoge {product_name} en:\\n{store_name}\\n{store_address}\\n\\nVer estado: {tracking_url}"
  }', 'Template de notificación de entrega. Variables: {user_name}, {product_name}, {store_name}, {store_address}, {store_hours}, {tracking_url}', 'email', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_system = EXCLUDED.is_system,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES DE PAGOS (STRIPE)
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  ('subscriptions_enabled', 'false', 'Activar módulo de suscripciones Stripe', 'features', true),
  ('stripe_enabled', 'false', 'Activar pagos reales con Stripe (false = simulación)', 'payments', false),
  ('subscription_grace_period_days', '7', 'Días de gracia después de que expire una suscripción', 'suscripciones', false),
  ('subscription_plans', '{
    "free": {
      "id": "free",
      "name": "Free",
      "price": 0,
      "limits": {
        "products": 10,
        "friends": 50,
        "reservations_per_month": 5
      },
      "features": {
        "wishlist": true,
        "friend_network": true,
        "gift_receiving": true,
        "gift_giving": true,
        "basic_support": true,
        "priority_support": false,
        "analytics": false
      },
      "position": 1,
      "description": "Plan gratuito para comenzar"
    },
    "pro": {
      "id": "pro",
      "name": "Pro",
      "price": 4.99,
      "priceId": "price_REPLACE_WITH_REAL_PRICE_ID",
      "limits": {
        "products": 100,
        "friends": 500,
        "reservations_per_month": 50
      },
      "features": {
        "wishlist": true,
        "friend_network": true,
        "gift_receiving": true,
        "gift_giving": true,
        "basic_support": true,
        "priority_support": true,
        "analytics": true,
        "custom_wishlist_url": true,
        "no_ads": true
      },
      "position": 2,
      "description": "Para usuarios activos"
    }
  }', 'Planes de suscripción disponibles para usuarios', 'subscriptions', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_system = EXCLUDED.is_system,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES LEGALES
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  ('forms_legal_notice', '"<p><strong>Información legal</strong></p><ul><li><strong>Responsable:</strong> Reserrega</li><li><strong>Finalidad:</strong> Gestión de reservas, wishlists y regalos</li><li><strong>Derechos:</strong> Acceso, rectificación, cancelación en <a href=\"/legal\">política de privacidad</a></li></ul>"', 'Texto legal que aparece en formularios públicos (registro, contacto)', 'general', true),

  ('legal_page_content', '"<h1>Aviso Legal y Política de Privacidad - Reserrega</h1><p>Última actualización: 2025-11-20</p><h2>1. Información General</h2><p>Titular: Reserrega<br>Web: https://reserrega.com<br>Email: legal@reserrega.com</p><h2>2. Política de Privacidad</h2><p>Reserrega es una plataforma que conecta tiendas físicas con usuarios para gestionar wishlists y regalos.</p><h3>Datos que recopilamos:</h3><ul><li>Información de cuenta (nombre, email)</li><li>Productos en wishlist</li><li>Red de amigos</li><li>Reservas y regalos</li></ul><h3>Uso de datos:</h3><ul><li>Gestión de reservas de productos</li><li>Facilitar regalos entre amigos</li><li>Comunicaciones del servicio</li></ul><h3>Tus derechos:</h3><p>Acceso, rectificación, supresión, oposición. Contacto: legal@reserrega.com</p><h2>3. Cookies</h2><p>Utilizamos cookies técnicas necesarias para el funcionamiento del sitio.</p><h2>4. Contacto</h2><p>Para cualquier consulta: legal@reserrega.com</p>"', 'Contenido de la página legal (/legal)', 'general', true)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  is_system = EXCLUDED.is_system,
  updated_at = NOW();

-- =====================================================
-- CONFIGURACIONES DE FUNCIONALIDADES
-- =====================================================

INSERT INTO public.config (key, value, description, category, is_system) VALUES
  ('enable_delivery_tracking', 'true', 'Habilitar seguimiento de entregas', 'features', false),
  ('enable_wishlist_sharing', 'true', 'Permitir compartir wishlists públicamente', 'features', false),
  ('enable_barcode_scanning', 'true', 'Habilitar escaneo de códigos de barras', 'features', false),
  ('enable_product_images', 'true', 'Permitir subir imágenes de productos', 'features', false),
  ('max_image_size_mb', '5', 'Tamaño máximo de imagen en MB', 'features', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = NOW();

-- =====================================================
-- COMENTARIOS DE AYUDA
-- =====================================================

COMMENT ON TABLE public.config IS 'Configuración global del sistema. Clave-valor con descripción y categoría.';
COMMENT ON COLUMN public.config.key IS 'Identificador único de la configuración';
COMMENT ON COLUMN public.config.value IS 'Valor en formato JSONB (permite cualquier tipo de dato)';
COMMENT ON COLUMN public.config.description IS 'Descripción legible de qué hace esta configuración';
COMMENT ON COLUMN public.config.category IS 'Categoría para agrupar configuraciones (aplicacion, reserrega, email, features, etc.)';
COMMENT ON COLUMN public.config.is_system IS 'Si true, solo superadmin puede modificar. Si false, admin puede modificar.';

-- =====================================================
-- RESULTADO
-- =====================================================

-- Verificar configuraciones insertadas
SELECT
  category,
  COUNT(*) as total_configs,
  COUNT(*) FILTER (WHERE is_system = true) as system_configs,
  COUNT(*) FILTER (WHERE is_system = false) as user_configs
FROM public.config
GROUP BY category
ORDER BY category;
