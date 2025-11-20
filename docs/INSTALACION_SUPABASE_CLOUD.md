# 🚀 Instalación Reserrega en Supabase Cloud

Guía completa para instalar Reserrega en Supabase Cloud desde cero.

## 📋 Requisitos Previos

- Una cuenta en [Supabase](https://supabase.com)
- Un proyecto creado en Supabase
- Acceso al SQL Editor de Supabase

## 🎯 Orden de Ejecución

Sigue estos pasos **EN ORDEN** para una instalación correcta:

---

## PASO 1: Limpiar Schema Public (si es necesario)

Si ya ejecutaste algunos scripts parcialmente o tienes objetos existentes, ejecuta primero el script de limpieza:

📁 **Archivo:** `shared/database/scripts/CLEANUP_PUBLIC_SCHEMA_COMPLETE.sql`

Este script:
- ✅ Elimina todas las políticas RLS dinámicamente
- ✅ Deshabilita RLS en todas las tablas
- ✅ Elimina todas las tablas de Reserrega
- ✅ Elimina funciones y triggers

```sql
-- En Supabase Dashboard → SQL Editor
-- Copia y pega el contenido de CLEANUP_PUBLIC_SCHEMA_COMPLETE.sql
-- Ejecuta
```

---

## PASO 2: Crear Schema Completo

Ejecuta el schema principal que crea todas las tablas, índices, triggers y políticas RLS:

📁 **Archivo:** `shared/database/schema/RESERREGA_FINAL.sql`

Este script crea:
- ✅ 13 tablas en schema `public`
- ✅ Extensiones necesarias (uuid-ossp, pgcrypto, pg_trgm)
- ✅ Función `public.update_updated_at_column()`
- ✅ Función `public.expire_old_reservations()`
- ✅ Todos los índices para rendimiento
- ✅ Todos los triggers para updated_at
- ✅ Políticas RLS completas
- ✅ Configuraciones básicas iniciales

**Tablas creadas:**

**Core (6 tablas):**
- `public.users` - Usuarios del sistema
- `public.companies` - Empresas/Tiendas partner
- `public.issuers` - Datos fiscales
- `public.config` - Configuración global JSONB
- `public.subscriptions` - Suscripciones Stripe
- `public.contact_messages` - Mensajes de contacto
- `public.user_invitations` - Invitaciones de usuarios

**Reserrega específicas (7 tablas):**
- `public.stores` - Ubicaciones físicas de tiendas
- `public.products` - Catálogo de productos (ropa)
- `public.reservations` - Reservas de productos (€1, 15 días)
- `public.wishlists` - Listas de deseos de usuarios
- `public.gifts` - Regalos realizados
- `public.friend_requests` - Solicitudes de amistad
- `public.friendships` - Amistades confirmadas

```sql
-- En Supabase Dashboard → SQL Editor
-- Copia y pega el contenido de RESERREGA_FINAL.sql
-- Ejecuta
```

**✅ El script es idempotente:** Puedes ejecutarlo múltiples veces sin errores.

---

## PASO 3: Configuraciones Extendidas (Opcional)

Si quieres las 45+ configuraciones adicionales (templates de email, configuraciones de negocio, etc.):

📁 **Archivo:** `shared/database/migrations/005_complete_config_settings.sql`

Este script añade:
- ✅ 45+ configuraciones organizadas en 10 categorías
- ✅ Templates de email (invitación, bienvenida, regalo recibido, entrega)
- ✅ Configuraciones de Reserrega (fees, expiración, límites)
- ✅ Configuraciones de notificaciones
- ✅ Configuraciones de features
- ✅ Planes de suscripción
- ✅ Contenido legal

**Categorías:**
- `aplicacion` - Configuración general de la app
- `reserrega` - Lógica de negocio específica
- `contacto` - Emails de notificación
- `notificaciones` - Flags de notificaciones
- `usuarios` - Configuración de usuarios
- `email` - Templates de email
- `features` - Flags de funcionalidades
- `payments` - Configuración de pagos
- `subscriptions` - Planes de suscripción
- `general` - Configuración legal y general

```sql
-- En Supabase Dashboard → SQL Editor
-- Copia y pega el contenido de 005_complete_config_settings.sql
-- Ejecuta
```

---

## PASO 4: Setup Inicial (Superadmin + Demo)

Ahora necesitas crear el usuario superadmin y datos de demo.

### Opción A: Setup Completo con Datos Demo (RECOMENDADO)

📁 **Archivo:** `shared/database/scripts/SETUP_INICIAL_SUPABASE_CLOUD.sql`

**⚠️ IMPORTANTE:** Antes de ejecutar este script:

1. **Regístrate en la aplicación** con el email: `josivela+super@gmail.com`
2. Luego ejecuta el script

Este script crea:
- ✅ Superadmin (José Ignacio Vela)
- ✅ Empresa Demo "Tienda Demo Reserrega"
- ✅ Issuer con datos fiscales completos
- ✅ Tienda física demo en Vigo
- ✅ 5 productos demo:
  - Vestido de Fiesta Elegante (Zara) - €89.95
  - Chaqueta de Cuero (Mango) - €129.99
  - Jeans Skinny Fit (Levi's) - €69.95
  - Blusa con Volantes (H&M) - €39.99
  - Zapatos de Tacón Alto (Bershka) - €49.99
- ✅ Suscripción Free activa

```sql
-- En Supabase Dashboard → SQL Editor
-- Copia y pega el contenido de SETUP_INICIAL_SUPABASE_CLOUD.sql
-- Ejecuta
```

**Credenciales de acceso:**
- 📧 Email: `josivela+super@gmail.com`
- 🔑 Password: (la que configuraste al registrarte)

### Opción B: Solo Crear Superadmin (Sin Demo)

Si prefieres crear solo el superadmin sin datos demo:

📁 **Archivo:** `shared/database/scripts/CREATE_SUPERADMIN_SIMPLE.sql`

**Instrucciones:**

1. Regístrate en la aplicación con tu email
2. Abre `CREATE_SUPERADMIN_SIMPLE.sql`
3. Reemplaza `tu-email@example.com` en **3 lugares** con tu email real
4. Ejecuta el script completo

```sql
-- En Supabase Dashboard → SQL Editor
-- Edita CREATE_SUPERADMIN_SIMPLE.sql
-- Cambia 'tu-email@example.com' por tu email en las 3 líneas marcadas
-- Copia y pega el contenido editado
-- Ejecuta
```

---

## ✅ Verificación

Después de ejecutar todos los scripts, verifica que todo está correcto:

### 1. Verificar tablas

```sql
-- Ver todas las tablas en public
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Deberías ver al menos 13 tablas de Reserrega
```

### 2. Verificar superadmin

```sql
SELECT id, role, name, email, status
FROM public.users
WHERE role = 'superadmin';
```

### 3. Verificar empresa demo (si ejecutaste SETUP_INICIAL)

```sql
SELECT id, name, status
FROM public.companies
WHERE id = 1;
```

### 4. Verificar productos demo (si ejecutaste SETUP_INICIAL)

```sql
SELECT name, brand, size, color, price, category
FROM public.products
WHERE store_id = 1
ORDER BY category, name;
```

### 5. Verificar configuraciones

```sql
-- Ver resumen de configuraciones por categoría
SELECT
  category,
  COUNT(*) as total
FROM public.config
GROUP BY category
ORDER BY category;

-- Ver configuraciones de Reserrega
SELECT key, value, description
FROM public.config
WHERE category = 'reserrega'
ORDER BY key;
```

---

## 🔐 Variables de Entorno

Configura las siguientes variables de entorno en tu proyecto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_secreta

# App
NEXT_PUBLIC_APP_URL=https://tu-dominio.com  # o http://localhost:3434 para desarrollo
```

Puedes obtener estas keys en: Supabase Dashboard → Settings → API

---

## 🎯 Siguientes Pasos

Una vez instalado el schema:

1. ✅ **Inicia sesión** con tu cuenta de superadmin
2. ✅ **Explora el panel de admin** en `/admin`
3. ✅ **Verifica las configuraciones** en `/settings`
4. ✅ **Crea usuarios de prueba** para testing
5. ✅ **Prueba el flujo completo:**
   - Crear wishlist
   - Reservar productos
   - Regalar entre amigos
   - QR de usuario

---

## 🐛 Troubleshooting

### Error: "relation does not exist"

Si ves errores de que las tablas no existen:
- Ejecuta primero `CLEANUP_PUBLIC_SCHEMA_COMPLETE.sql`
- Luego ejecuta `RESERREGA_FINAL.sql`

### Error: "policy already exists"

El schema es idempotente. Si ves este error significa que el script se ejecutó parcialmente. Simplemente ejecuta de nuevo `RESERREGA_FINAL.sql` - las políticas duplicadas se eliminarán y recrearán.

### Error: "user does not exist in auth.users"

Debes registrarte primero en la aplicación antes de ejecutar los scripts de setup. El usuario debe existir en `auth.users` antes de poder agregarlo a `public.users`.

### No puedo acceder como superadmin

Verifica que:
1. El usuario existe en `public.users` con role='superadmin'
2. El status es 'active'
3. Estás usando el email correcto para iniciar sesión
4. Has confirmado tu email (revisa tu bandeja de entrada)

---

## 📚 Documentación Adicional

- **Configuraciones:** Ver `docs/CONFIGURACIONES.md` para guía completa de configuraciones
- **Schema:** Ver `shared/database/schema/RESERREGA_FINAL.sql` con comentarios detallados
- **Deploy:** Ver `DEPLOY_INSTRUCTIONS.md` para deployment en producción

---

## 🎉 ¡Listo!

Tu instalación de Reserrega en Supabase Cloud está completa.

Ahora puedes:
- Desarrollar localmente con `npm run dev`
- Desplegar en Vercel/producción
- Configurar tu dominio personalizado
- Invitar usuarios y empezar a usar la plataforma

Si tienes problemas, revisa la sección de Troubleshooting o consulta la documentación adicional.
