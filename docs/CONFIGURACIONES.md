# 📋 Configuraciones del Sistema - Reserrega

**Última actualización:** 2025-11-20
**Archivo SQL:** `shared/database/migrations/005_complete_config_settings.sql`

---

## 📊 Resumen

Reserrega utiliza una tabla `config` con formato clave-valor (JSONB) para gestionar todas las configuraciones del sistema. Esto permite modificar comportamientos sin necesidad de redesplegar la aplicación.

### Estadísticas
- **Total configuraciones:** 45+
- **Categorías:** 10
- **Configuraciones de sistema:** 8 (solo superadmin)
- **Configuraciones editables:** 37+ (admin puede modificar)

---

## 🗂️ Categorías de Configuración

### 1. **aplicacion** - Configuración General de la App
### 2. **reserrega** - Lógica de Negocio
### 3. **contacto** - Notificaciones y Contacto
### 4. **notificaciones** - Sistema de Notificaciones
### 5. **usuarios** - Gestión de Usuarios
### 6. **email** - Templates de Email
### 7. **features** - Funcionalidades Opcionales
### 8. **payments** - Pagos y Suscripciones
### 9. **subscriptions** - Planes y Límites
### 10. **general** - Configuraciones Legales y Globales

---

## 📋 Configuraciones Detalladas

### 1️⃣ APLICACIÓN (Categoría: `aplicacion`)

| Key | Valor Default | Tipo | Descripción | Editable |
|-----|---------------|------|-------------|----------|
| `app_mode` | `"development"` | string | Modo de la aplicación (development/production) | ✅ Admin |
| `app_name` | `"Reserrega"` | string | Nombre de la aplicación | ✅ Admin |
| `public_registration_enabled` | `true` | boolean | Permitir registro público de nuevos usuarios | ✅ Admin |

**Uso común:**
- `app_mode`: Cambiar a `"production"` al lanzar
- `app_name`: Personalizar si es white-label
- `public_registration_enabled`: Desactivar para registros solo por invitación

---

### 2️⃣ RESERREGA - Lógica de Negocio (Categoría: `reserrega`)

#### Reservas

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `reservation_fee` | `1.00` | number | Precio de reserva de productos (€) |
| `reservation_expiration_days` | `15` | number | Días de validez de una reserva |
| `max_products_per_reservation` | `10` | number | Máximo productos por sesión |
| `allow_reservation_extension` | `false` | boolean | Permitir extender validez |

**Ejemplo de cambio:**
```sql
-- Cambiar precio de reserva a 2€
UPDATE public.config
SET value = '2.00', updated_at = NOW()
WHERE key = 'reservation_fee';
```

#### QR y Escaneo

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `qr_user_expiration_hours` | `24` | number | Horas de validez del QR de usuario |
| `enable_qr_scanning` | `true` | boolean | Habilitar funcionalidad QR |

#### Regalos

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `gift_lock_duration_minutes` | `15` | number | Minutos de bloqueo al regalar |
| `allow_gift_messages` | `true` | boolean | Permitir mensajes personalizados |
| `require_delivery_confirmation` | `true` | boolean | Requerir confirmación de entrega |

#### Wishlists

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `wishlist_visibility_default` | `"friends"` | string | Visibilidad por defecto (private/friends/public) |
| `max_wishlist_products` | `100` | number | Máximo productos en wishlist |

#### Amigos

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `friend_request_expiration_days` | `30` | number | Días de validez de solicitudes |
| `max_friends_per_user` | `500` | number | Máximo amigos por usuario |
| `enable_friend_invitations` | `true` | boolean | Permitir invitaciones por email |

#### Reparto de Beneficios

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `store_share_percentage` | `50` | number | Porcentaje que recibe la tienda |
| `platform_share_percentage` | `50` | number | Porcentaje que recibe la plataforma |

---

### 3️⃣ NOTIFICACIONES (Categoría: `contacto`, `notificaciones`)

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `contact_notification_emails` | `["admin@public.com"]` | array | Emails que reciben notificaciones |
| `enable_gift_notifications` | `true` | boolean | Notificar cuando recibes regalo |
| `enable_delivery_notifications` | `true` | boolean | Notificar estado de entrega |
| `enable_friend_request_notifications` | `true` | boolean | Notificar solicitudes de amistad |

**Ejemplo de cambio:**
```sql
-- Añadir más emails de notificación
UPDATE public.config
SET value = '["admin@public.com", "support@public.com", "sales@public.com"]'
WHERE key = 'contact_notification_emails';
```

---

### 4️⃣ USUARIOS (Categoría: `usuarios`, `registration`)

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `registration_requires_approval` | `false` | boolean | Requiere aprobación de superadmin |
| `invitation_token_expiration_days` | `7` | number | Días de validez de tokens de invitación |

---

### 5️⃣ EMAIL TEMPLATES (Categoría: `email`)

#### Variables Disponibles

**Todos los templates soportan:**
- `{user_name}` - Nombre del usuario
- `{company_name}` - Nombre de la empresa/tienda
- `{app_name}` - Nombre de la aplicación

#### Templates Configurables

##### 1. Invitación (`invitation_email_template`)

**Variables específicas:**
- `{inviter_name}` - Quien invita
- `{role_name}` - Rol asignado
- `{accept_url}` - URL para aceptar

**Estructura:**
```json
{
  "subject": "Has sido invitado a...",
  "body_html": "<html>...</html>",
  "body_text": "Version texto plano..."
}
```

##### 2. Bienvenida (`welcome_email_template`)

**Variables específicas:**
- `{dashboard_url}` - URL del dashboard

##### 3. Regalo Recibido (`gift_received_email_template`)

**Variables específicas:**
- `{gifter_name}` - Quien regala
- `{product_name}` - Producto regalado
- `{store_name}` - Tienda donde recoger
- `{gift_message}` - Mensaje personalizado
- `{gift_url}` - URL para ver detalles

##### 4. Notificación de Entrega (`delivery_notification_email_template`)

**Variables específicas:**
- `{product_name}` - Producto a recoger
- `{store_name}` - Nombre de la tienda
- `{store_address}` - Dirección de la tienda
- `{store_hours}` - Horario
- `{tracking_url}` - URL de seguimiento

**Ejemplo de personalización:**
```sql
-- Personalizar email de bienvenida
UPDATE public.config
SET value = '{
  "subject": "¡Bienvenido a tu comunidad de regalos!",
  "body_html": "<div style=\"font-family: Arial;\"><h1>¡Hola {user_name}!</h1><p>Estamos encantados de tenerte en Reserrega.</p><p><a href=\"{dashboard_url}\">Empieza ahora</a></p></div>",
  "body_text": "¡Hola {user_name}! Bienvenido a Reserrega. Visita: {dashboard_url}"
}'
WHERE key = 'welcome_email_template';
```

---

### 6️⃣ PAGOS Y SUSCRIPCIONES (Categoría: `payments`, `subscriptions`)

| Key | Valor Default | Tipo | Sistema | Descripción |
|-----|---------------|------|---------|-------------|
| `subscriptions_enabled` | `false` | boolean | ✅ | Activar módulo de suscripciones |
| `stripe_enabled` | `false` | boolean | ❌ | Activar pagos reales (false = simulación) |
| `subscription_grace_period_days` | `7` | number | ❌ | Días de gracia tras expiración |
| `subscription_plans` | `{...}` | object | ✅ | Definición de planes |

#### Planes de Suscripción (`subscription_plans`)

**Estructura:**
```json
{
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
      "basic_support": true,
      "priority_support": false
    },
    "position": 1,
    "description": "Plan gratuito"
  },
  "pro": {
    "id": "pro",
    "name": "Pro",
    "price": 4.99,
    "priceId": "price_STRIPE_ID",
    "limits": {
      "products": 100,
      "friends": 500,
      "reservations_per_month": 50
    },
    "features": {
      "wishlist": true,
      "priority_support": true,
      "analytics": true,
      "custom_wishlist_url": true
    },
    "position": 2
  }
}
```

**Límites configurables:**
- `products` - Productos en wishlist
- `friends` - Amigos máximos
- `reservations_per_month` - Reservas mensuales

**Features booleanas:**
- `wishlist` - Acceso a wishlist
- `friend_network` - Red de amigos
- `gift_receiving` - Recibir regalos
- `gift_giving` - Dar regalos
- `basic_support` - Soporte básico
- `priority_support` - Soporte prioritario
- `analytics` - Estadísticas
- `custom_wishlist_url` - URL personalizada
- `no_ads` - Sin publicidad

---

### 7️⃣ FUNCIONALIDADES (Categoría: `features`)

| Key | Valor Default | Tipo | Descripción |
|-----|---------------|------|-------------|
| `enable_delivery_tracking` | `true` | boolean | Seguimiento de entregas |
| `enable_wishlist_sharing` | `true` | boolean | Compartir wishlists públicamente |
| `enable_barcode_scanning` | `true` | boolean | Escaneo de códigos de barras |
| `enable_product_images` | `true` | boolean | Subir imágenes de productos |
| `max_image_size_mb` | `5` | number | Tamaño máximo de imagen (MB) |

---

### 8️⃣ LEGAL (Categoría: `general`)

#### forms_legal_notice

**Descripción:** Texto legal que aparece al final de formularios públicos (registro, contacto).

**Valor por defecto:**
```html
<p><strong>Información legal</strong></p>
<ul>
  <li><strong>Responsable:</strong> Reserrega</li>
  <li><strong>Finalidad:</strong> Gestión de reservas, wishlists y regalos</li>
  <li><strong>Derechos:</strong> Acceso, rectificación, cancelación en <a href="/legal">política de privacidad</a></li>
</ul>
```

**Uso:** Se muestra automáticamente en:
- Formulario de registro (`/register`)
- Formulario de contacto (`/contact`)
- Invitaciones de amigos

#### legal_page_content

**Descripción:** Contenido completo de la página `/legal` con aviso legal y política de privacidad.

**Secciones incluidas:**
1. Información General
2. Política de Privacidad
3. Uso de Datos
4. Derechos del Usuario
5. Cookies
6. Contacto

**Personalización:**
```sql
-- Actualizar página legal
UPDATE public.config
SET value = '"<h1>Mi Política Personalizada</h1>..."'
WHERE key = 'legal_page_content';
```

---

### 9️⃣ SISTEMA (is_system = true)

Estas configuraciones **solo pueden ser modificadas por superadmin**:

| Key | Categoría | Descripción |
|-----|-----------|-------------|
| `multiempresa` | general | Modo multi-empresa (siempre true) |
| `subscriptions_enabled` | features | Activar suscripciones |
| `subscription_plans` | subscriptions | Definición de planes |
| `invitation_email_template` | email | Template de invitación |
| `welcome_email_template` | email | Template de bienvenida |
| `gift_received_email_template` | email | Template regalo recibido |
| `delivery_notification_email_template` | email | Template de entrega |
| `forms_legal_notice` | general | Aviso legal de formularios |
| `legal_page_content` | general | Contenido página legal |

---

## 🔧 Cómo Usar las Configuraciones

### Desde SQL (Supabase Dashboard)

```sql
-- Ver todas las configuraciones
SELECT key, value, description, category, is_system
FROM public.config
ORDER BY category, key;

-- Ver configuraciones de una categoría
SELECT key, value, description
FROM public.config
WHERE category = 'reserrega'
ORDER BY key;

-- Actualizar un valor
UPDATE public.config
SET value = '"new_value"', updated_at = NOW()
WHERE key = 'app_mode';

-- Actualizar valor numérico
UPDATE public.config
SET value = '20', updated_at = NOW()
WHERE key = 'reservation_expiration_days';

-- Actualizar valor booleano
UPDATE public.config
SET value = 'true', updated_at = NOW()
WHERE key = 'enable_qr_scanning';

-- Actualizar valor JSON
UPDATE public.config
SET value = '["email1@example.com", "email2@example.com"]', updated_at = NOW()
WHERE key = 'contact_notification_emails';
```

### Desde la Aplicación (TypeScript)

```typescript
// Leer configuración
import { getConfig } from '@/lib/config-helpers'

const reservationFee = await getConfig<number>('reservation_fee')
const appName = await getConfig<string>('app_name')
const notificationEmails = await getConfig<string[]>('contact_notification_emails')

// Actualizar configuración (requiere permisos)
import { updateConfig } from '@/lib/config-helpers'

await updateConfig('reservation_fee', 1.50)
await updateConfig('enable_qr_scanning', false)
```

### En Componentes React

```typescript
'use client'

import { useConfig } from '@/hooks/useConfig'

export function MyComponent() {
  const { config, loading } = useConfig('app_name')

  if (loading) return <div>Loading...</div>

  return <h1>{config}</h1>
}
```

---

## 📊 Configuraciones por Categoría

```sql
-- Ver resumen por categoría
SELECT
  category,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_system = true) as system_only,
  COUNT(*) FILTER (WHERE is_system = false) as editable
FROM public.config
GROUP BY category
ORDER BY category;
```

**Resultado esperado:**
```
    category     | total | system_only | editable
-----------------+-------+-------------+----------
 aplicacion      |     3 |           0 |        3
 contacto        |     1 |           0 |        1
 email           |     4 |           4 |        0
 features        |     6 |           1 |        5
 general         |     3 |           2 |        1
 notificaciones  |     3 |           0 |        3
 payments        |     1 |           0 |        1
 registration    |     1 |           0 |        1
 reserrega       |    15 |           0 |       15
 subscriptions   |     2 |           1 |        1
 usuarios        |     1 |           0 |        1
```

---

## 🚀 Aplicar Configuraciones

### 1. Ejecutar Migración

```bash
# En Supabase Dashboard → SQL Editor
# Copiar y ejecutar: shared/database/migrations/005_complete_config_settings.sql
```

### 2. Verificar Instalación

```sql
-- Verificar que se insertaron todas
SELECT COUNT(*) as total_configs FROM public.config;
-- Debe retornar: 45+ configuraciones

-- Ver todas las categorías
SELECT DISTINCT category FROM public.config ORDER BY category;
```

### 3. Personalizar

```sql
-- Ejemplo: Configurar para producción
UPDATE public.config SET value = '"production"' WHERE key = 'app_mode';
UPDATE public.config SET value = 'true' WHERE key = 'stripe_enabled';
UPDATE public.config SET value = '["support@midominio.com"]' WHERE key = 'contact_notification_emails';
```

---

## 📝 Mejores Prácticas

### 1. **Documentar Cambios**
Añadir comentario al actualizar:
```sql
UPDATE public.config
SET value = '2.00', updated_at = NOW()
WHERE key = 'reservation_fee';

-- Comentar el cambio
COMMENT ON COLUMN public.config.value IS 'Cambiado a 2€ el 2025-11-20 por promoción';
```

### 2. **Backup Antes de Cambios Masivos**
```sql
-- Crear tabla de respaldo
CREATE TABLE config_backup AS SELECT * FROM public.config;
```

### 3. **Validar Valores JSON**
```sql
-- Verificar que los valores JSON son válidos
SELECT key, value::text
FROM public.config
WHERE value::text !~ '^["{\\[].*["}\\]]$'
AND key NOT IN (SELECT key FROM public.config WHERE value::text ~ '^[0-9]+$');
```

### 4. **Testing en Development Primero**
```sql
-- Cambiar solo en development
UPDATE public.config
SET value = '"new_value"'
WHERE key = 'some_key'
AND (SELECT value FROM public.config WHERE key = 'app_mode') = '"development"';
```

---

## 🔒 Seguridad

### Permisos RLS

```sql
-- Solo superadmin puede modificar configuraciones de sistema
CREATE POLICY "superadmin_modify_config" ON public.config
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE role = 'superadmin'
    )
    OR (
      auth.uid() IN (
        SELECT user_id FROM public.user_profiles WHERE role = 'admin'
      )
      AND is_system = false
    )
  );
```

### Auditoría

```sql
-- Ver últimas modificaciones
SELECT key, value, updated_at
FROM public.config
ORDER BY updated_at DESC
LIMIT 10;
```

---

## 📚 Referencias

- **Archivo SQL:** `shared/database/migrations/005_complete_config_settings.sql`
- **Schema:** `shared/database/schema/RESERREGA_FINAL.sql`
- **Helpers:** `src/lib/config-helpers.ts` (crear si no existe)
- **Hook React:** `src/hooks/useConfig.ts` (crear si no existe)

---

**Última actualización:** 2025-11-20
**Mantenedor:** Equipo Reserrega
**Versión:** 1.0
