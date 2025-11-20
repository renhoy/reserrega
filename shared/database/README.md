# Database Module - Reserrega

**Status:** 🟡 En desarrollo
**Schema:** `reserrega`
**Base de datos:** PostgreSQL (Supabase)
**Multi-tenancy:** Por `company_id`

---

## 📁 Estructura del Módulo

```
shared/database/
├── schema/
│   ├── RESERREGA_FINAL.sql       ✅ PRODUCTION SCHEMA (usar este)
│   ├── INSPECT_REDPRESU_SCHEMA.sql  🔍 Herramienta de inspección
│   ├── QUICK_INSPECT.sql            🔍 Inspección rápida
│   ├── old/                         📦 Archivos históricos (no usar)
│   │   ├── 00_init_schema.sql
│   │   ├── FULL_SCHEMA_RESERREGA.sql
│   │   └── RESERREGA_SCHEMA_V2.sql
│   └── rls/                         🔒 RLS policies (incluidas en FINAL)
├── types/                           📝 Tipos TypeScript (pendiente)
├── functions/                       ⚙️ Funciones SQL
├── migrations/                      🔄 Migraciones Supabase
├── tests/                           🧪 Tests
└── README.md                        📖 Este archivo
```

---

## 🚀 Setup Rápido

### 1. Crear Proyecto Supabase

Ve a [Supabase Dashboard](https://app.supabase.com) y crea un nuevo proyecto.

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Completa los valores:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Ejecutar Schema

**Opción A: Desde Supabase Dashboard (Recomendado)**
1. Abre **SQL Editor** en Supabase
2. Copia el contenido de `shared/database/schema/RESERREGA_FINAL.sql`
3. Click **Run** ▶️

**Opción B: Desde CLI**
```bash
psql -h db.xxxxx.supabase.co -U postgres -f shared/database/schema/RESERREGA_FINAL.sql
```

### 4. Verificar Creación

En Supabase **Table Editor**, verifica que existan **13 tablas**:
- ✅ users
- ✅ companies
- ✅ issuers
- ✅ stores
- ✅ products
- ✅ reservations
- ✅ wishlists
- ✅ gifts
- ✅ friend_requests
- ✅ friendships
- ✅ subscriptions
- ✅ config
- ✅ contact_messages
- ✅ user_invitations

### 5. Setup Inicial de Datos

**⚡ Script Todo-en-Uno (Recomendado)**

Ejecuta este script en Supabase SQL Editor para configurar todo de una vez:

```bash
# En la raíz del proyecto
cat SETUP_INICIAL_COMPLETO.sql
```

Este script crea:
- ✅ Usuario Superadmin (josivela+super@gmail.com)
- ✅ Empresa Demo (id=1)
- ✅ Issuer Demo asociado

**Scripts Individuales (Opcionales)**

Si prefieres ejecutar por separado:

1. **Superadmin:** `SETUP_SUPERADMIN.sql`
   - Crea/actualiza el usuario superadmin

2. **Empresa Demo:** `SETUP_EMPRESA_DEMO.sql`
   - Crea la empresa por defecto (id=1)
   - Crea el issuer demo

**Verificar Setup:**

```sql
-- Ver superadmin
SELECT role, name, email FROM public.users
WHERE email = 'josivela+super@gmail.com';

-- Ver empresa demo
SELECT * FROM public.companies WHERE id = 1;

-- Ver issuer demo
SELECT * FROM public.issuers WHERE company_id = 1;
```

---

## 📊 Schema Overview

### Tablas Heredadas de Redpresu (6)

Estas tablas se reutilizan de la infraestructura existente:

| Tabla | Descripción | Campos Clave |
|-------|-------------|--------------|
| `users` | Usuarios del sistema | id, email, role, company_id, avatar_url |
| `companies` | Empresas partner (tiendas) | id, name, status |
| `issuers` | Datos fiscales | id, user_id, company_id, nif, irpf_percentage |
| `config` | Configuración global (JSONB) | key, value, category |
| `subscriptions` | Suscripciones Stripe | id, company_id, plan, status |
| `contact_messages` | Mensajes de contacto | id, email, subject, message |
| `user_invitations` | Invitaciones de usuarios | id, inviter_id, email, token |

### Tablas Nuevas de Reserrega (7)

| Tabla | Descripción | Campos Clave |
|-------|-------------|--------------|
| `stores` | Ubicaciones físicas | id, company_id, name, address, manager_user_id |
| `products` | Catálogo de productos | id, store_id, barcode, name, size, color, price |
| `reservations` | Reservas (€1, 15 días) | id, user_id, product_id, amount_paid, expires_at |
| `wishlists` | Listas de deseos | id, user_id, product_id, visibility, status |
| `gifts` | Regalos realizados | id, buyer_id, recipient_id, payment_status |
| `friend_requests` | Solicitudes de amistad | id, sender_id, recipient_id, status |
| `friendships` | Amistades confirmadas | id, user_id, friend_id |

---

## 🔒 Row Level Security (RLS)

**Todas las tablas tienen RLS habilitado.**

### Políticas por Rol

**Superadmin:**
- ✅ Acceso total a todo

**Admin:**
- ✅ Gestiona su empresa y usuarios de su empresa
- ✅ Gestiona tiendas y productos de su empresa

**Comercial:**
- ✅ Ve reservas de su tienda
- ✅ Gestiona productos de su tienda

**Usuario:**
- ✅ Ve y modifica su perfil
- ✅ Gestiona sus reservas y wishlist
- ✅ Ve wishlists de amigos según visibilidad

### Visibilidad de Wishlists

- `private`: Solo el propietario
- `friends`: Propietario + amigos confirmados
- `public`: Todos los usuarios autenticados

---

## ⚙️ Funciones Helper

### `expire_old_reservations()`
Marca reservas como `expired` cuando `expires_at < NOW()`.

**Uso:**
```sql
SELECT public.expire_old_reservations();
```

**Retorna:** Número de reservas expiradas.

**Recomendación:** Ejecutar vía cron job o Supabase Edge Function cada hora.

---

## 🎯 Configuración Inicial

La tabla `config` incluye valores por defecto:

```json
{
  "app_name": "Reserrega",
  "multiempresa": true,
  "subscriptions_enabled": true,
  "reservation_fee": 1.00,
  "reservation_days": 15,
  "gift_lock_minutes": 15,
  "store_share_percentage": 50,
  "platform_share_percentage": 50
}
```

---

## 📝 Tipos TypeScript

**Los tipos ya están generados** ✅ en `shared/database/types/database.types.ts`

### Uso de los tipos

```typescript
import { supabase } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/shared/database/types/database.types'

// Tipos automáticos en queries
const { data: users } = await supabase
  .from('users')  // ✅ Autocomplete de tablas
  .select('*')    // ✅ Tipos inferidos automáticamente

// Usar tipos específicos
type User = Tables<'users'>
type UserInsert = TablesInsert<'users'>
type UserUpdate = TablesUpdate<'users'>

const newUser: UserInsert = {
  id: 'uuid-here',
  name: 'María',
  email: 'maria@example.com',
  role: 'usuario'  // ✅ Autocomplete de roles válidos
}
```

### Regenerar tipos (cuando cambies el schema)

```bash
# Opción 1: Script automático (requiere .env.local configurado)
./shared/database/scripts/generate-types.sh

# Opción 2: Manual
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  --schema reserrega \
  > shared/database/types/database.types.ts
```

---

## 🧪 Testing

### Verificar RLS Policies

```sql
-- Como usuario normal
SET ROLE authenticated;
SET request.jwt.claims.sub TO 'user-uuid-here';

-- Intentar ver todas las wishlists (debería fallar)
SELECT * FROM public.wishlists;

-- Ver solo mis wishlists (debería funcionar)
SELECT * FROM public.wishlists WHERE user_id = 'user-uuid-here';
```

### Probar Auto-expiración

```sql
-- Crear reserva con fecha pasada
INSERT INTO public.reservations (user_id, product_id, store_id, expires_at)
VALUES ('uuid', 'uuid', 1, NOW() - INTERVAL '1 day');

-- Ejecutar función
SELECT public.expire_old_reservations();

-- Verificar que cambió a expired
SELECT status FROM public.reservations WHERE id = 'uuid';
```

---

## 📋 Checklist de Completitud

**Módulo Database - Estado Actual:**

- [x] Estructura de carpetas creada
- [x] Schema SQL production-ready (`RESERREGA_FINAL.sql`)
- [x] Scripts de inspección
- [x] Configuración de Supabase clients actualizada
- [x] Documentación del módulo
- [x] Schema ejecutado en Supabase Cloud
- [x] Tipos TypeScript generados
- [x] Clientes de Supabase configurados con tipos
- [ ] Tests básicos
- [ ] Migraciones configuradas
- [ ] Usuario superadmin inicial creado

---

## 🔄 Próximo Módulo

Una vez completado este módulo:
- **Marcar como:** READ-ONLY ✅
- **Mover a:** Archivos prohibidos en `docs/claude.md`
- **Continuar con:** `shared/auth/` - Sistema de autenticación

---

## 📚 Referencias

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Reserrega PRD](../../docs/PRD.md)
- [Reserrega Planificación](../../docs/planificacion.md)

---

**Última actualización:** 2025-11-17
