# Tareas - MÓDULO: Database

## MÓDULO ACTIVO: Database 🔴

**Tareas Activas:** 0/3  
**Progreso:** 0%

---

## SLOTS DE TRABAJO (Máximo 3 tareas activas)

### Slot 1: [VACÍO]
**Estado:** Disponible  
**Tiempo estimado:** -

### Slot 2: [VACÍO]
**Estado:** Disponible  
**Tiempo estimado:** -

### Slot 3: [VACÍO]
**Estado:** Disponible  
**Tiempo estimado:** -

---

## BACKLOG

### 🔴 CRÍTICAS (Requeridas para completar módulo)

#### DB-001: Setup Supabase y Schema Base
**Prioridad:** Crítica  
**Tiempo:** 2-3 horas  
**Descripción:**
- Crear proyecto Supabase Cloud
- Configurar schema `reserrega`
- Conectar con proyecto Next.js
- Configurar variables de entorno
- Verificar conexión

**Archivos a crear:**
- `shared/database/supabase/config.sql`
- `.env.local` (variables)

**Criterio de aceptación:**
- [ ] Proyecto Supabase creado
- [ ] Schema `reserrega` activo
- [ ] Variables env configuradas
- [ ] Conexión exitosa desde Next.js

---

#### DB-002: Tabla Users + RLS
**Prioridad:** Crítica  
**Tiempo:** 3-4 horas  
**Descripción:**
- Crear tabla `users` con campos:
  - id (uuid, PK, ref: auth.users)
  - email (text, unique)
  - name (text)
  - last_name (text)
  - role (enum: superadmin, admin, comercial, usuario)
  - company_id (int, FK → companies)
  - status (enum: active, inactive, pending)
  - invited_by (uuid, FK → users)
  - created_at, updated_at
- RLS policies por rol
- Trigger updated_at automático

**Archivos a crear:**
- `shared/database/schema/01_users_table.sql`
- `shared/database/schema/rls/users_policies.sql`

**Criterio de aceptación:**
- [ ] Tabla creada con todos los campos
- [ ] RLS habilitado
- [ ] Policies: superadmin (all), admin (su empresa), usuario (solo su perfil)
- [ ] Trigger updated_at funcional

---

#### DB-003: Tabla Companies + RLS
**Prioridad:** Crítica  
**Tiempo:** 2-3 horas  
**Descripción:**
- Crear tabla `companies` (tiendas partner):
  - id (serial, PK)
  - name (text)
  - nif (text, unique)
  - type (enum: empresa, autonomo)
  - address, postal_code, locality, province, country
  - phone, email, web
  - logo_url (text, nullable)
  - status (enum: active, inactive)
  - created_at, updated_at
- RLS policies

**Archivos a crear:**
- `shared/database/schema/02_companies_table.sql`
- `shared/database/schema/rls/companies_policies.sql`

**Criterio de aceptación:**
- [ ] Tabla creada
- [ ] RLS: superadmin (all), admin (su empresa), usuario (read su empresa)
- [ ] Constraint: nif unique

---

#### DB-004: Tabla Products
**Prioridad:** Crítica  
**Tiempo:** 2-3 horas  
**Descripción:**
- Crear tabla `products`:
  - id (uuid, PK)
  - barcode (text, indexed)
  - name (text)
  - description (text, nullable)
  - brand (text, nullable)
  - size (text) - talla/tamaño
  - color (text)
  - price (decimal)
  - image_url (text, nullable)
  - category (text, nullable)
  - store_id (int, FK → stores)
  - created_at, updated_at
- Índices en barcode, store_id

**Archivos a crear:**
- `shared/database/schema/03_products_table.sql`

**Criterio de aceptación:**
- [ ] Tabla creada
- [ ] Índices configurados
- [ ] FK a stores válida

---

#### DB-005: Tabla Reservations + Expiration Logic
**Prioridad:** Crítica  
**Tiempo:** 4 horas  
**Descripción:**
- Crear tabla `reservations`:
  - id (uuid, PK)
  - user_id (uuid, FK → users)
  - product_id (uuid, FK → products)
  - store_id (int, FK → stores)
  - amount_paid (decimal) - ej: 1.00
  - store_share (decimal) - ej: 0.50
  - platform_share (decimal) - ej: 0.50
  - status (enum: active, expired, completed, cancelled)
  - reserved_at (timestamp)
  - expires_at (timestamp) - reserved_at + 15 días
  - created_at, updated_at
- Function: auto-expirar reservas vencidas
- Trigger o Supabase Edge Function (cron)

**Archivos a crear:**
- `shared/database/schema/04_reservations_table.sql`
- `shared/database/functions/expire_reservations.sql`

**Criterio de aceptación:**
- [ ] Tabla creada
- [ ] Campo expires_at calculado automáticamente
- [ ] Function expire_reservations funcional
- [ ] Test: reserva caduca tras 15 días

---

#### DB-006: Tabla Wishlists
**Prioridad:** Crítica  
**Tiempo:** 2 horas  
**Descripción:**
- Crear tabla `wishlists`:
  - id (uuid, PK)
  - user_id (uuid, FK → users)
  - product_id (uuid, FK → products)
  - reservation_id (uuid, FK → reservations, nullable)
  - visibility (enum: private, friends, public)
  - status (enum: available, in_process, gifted, expired)
  - priority (int, 1-5)
  - notes (text, nullable)
  - created_at, updated_at

**Archivos a crear:**
- `shared/database/schema/05_wishlists_table.sql`
- `shared/database/schema/rls/wishlists_policies.sql`

**Criterio de aceptación:**
- [ ] Tabla creada
- [ ] RLS: usuario (su lista), amigos (según visibility)
- [ ] Constraint: user_id + product_id unique

---

#### DB-007: Tabla Gifts + Tracking
**Prioridad:** Crítica  
**Tiempo:** 3 horas  
**Descripción:**
- Crear tabla `gifts`:
  - id (uuid, PK)
  - wishlist_item_id (uuid, FK → wishlists)
  - buyer_id (uuid, FK → users)
  - recipient_id (uuid, FK → users)
  - product_id (uuid, FK → products)
  - store_id (int, FK → stores)
  - amount (decimal)
  - payment_status (enum: pending, completed, failed, refunded)
  - payment_method (text) - "simulated" en MVP
  - shipping_status (enum: pending, shipped, delivered, cancelled)
  - tracking_number (text, nullable)
  - locked_until (timestamp) - bloqueo temporal 15 min
  - created_at, updated_at, delivered_at

**Archivos a crear:**
- `shared/database/schema/06_gifts_table.sql`
- `shared/database/schema/rls/gifts_policies.sql`

**Criterio de aceptación:**
- [ ] Tabla creada
- [ ] RLS: buyer/recipient pueden ver sus regalos
- [ ] Campo locked_until para bloqueo temporal

---

#### DB-008: Tablas Friend System
**Prioridad:** Crítica  
**Tiempo:** 2-3 horas  
**Descripción:**
- Tabla `friend_requests`:
  - id (uuid, PK)
  - sender_id (uuid, FK → users)
  - recipient_id (uuid, FK → users)
  - status (enum: pending, accepted, rejected)
  - invitation_token (text, unique, nullable) - para invitación email
  - created_at, updated_at
- Tabla `friendships`:
  - id (uuid, PK)
  - user_id (uuid, FK → users)
  - friend_id (uuid, FK → users)
  - created_at
  - Constraint: unique(user_id, friend_id)

**Archivos a crear:**
- `shared/database/schema/07_friends_tables.sql`
- `shared/database/schema/rls/friends_policies.sql`

**Criterio de aceptación:**
- [ ] Ambas tablas creadas
- [ ] RLS: usuarios solo ven sus solicitudes/amistades
- [ ] Constraint: no duplicados en friendships

---

#### DB-009: Tabla Stores (Tiendas físicas)
**Prioridad:** Crítica  
**Tiempo:** 2 horas  
**Descripción:**
- Crear tabla `stores`:
  - id (serial, PK)
  - company_id (int, FK → companies)
  - name (text)
  - address (text)
  - postal_code (text)
  - locality (text)
  - province (text)
  - country (text)
  - phone (text, nullable)
  - manager_user_id (uuid, FK → users, nullable)
  - status (enum: active, inactive)
  - created_at, updated_at

**Archivos a crear:**
- `shared/database/schema/08_stores_table.sql`
- `shared/database/schema/rls/stores_policies.sql`

**Criterio de aceptación:**
- [ ] Tabla creada
- [ ] RLS: admin empresa ve sus tiendas, superadmin ve todas
- [ ] FK a companies y users válidas

---

#### DB-010: Generar Tipos TypeScript
**Prioridad:** Crítica  
**Tiempo:** 1 hora  
**Descripción:**
- Generar tipos desde schema Supabase
- Configurar script en package.json
- Exportar tipos en index.ts

**Archivos a crear:**
- `shared/database/types/database.types.ts`
- `shared/database/types/index.ts`
- `shared/database/package.json` (script)

**Comando:**
```bash
npx supabase gen types typescript --project-id [PROJECT_ID] > database.types.ts
```

**Criterio de aceptación:**
- [ ] Tipos generados sin errores
- [ ] Exportados correctamente
- [ ] Script `npm run generate-types` funcional

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### DB-011: Tests Básicos
**Prioridad:** Alta  
**Tiempo:** 2 horas  
**Descripción:**
- Test: crear usuario → verificar RLS
- Test: crear reserva → auto-expiración
- Test: friend request → aceptar → crear friendship

**Archivos a crear:**
- `shared/database/tests/database.test.ts`

---

#### DB-012: Migraciones Supabase
**Prioridad:** Alta  
**Tiempo:** 1 hora  
**Descripción:**
- Convertir todos los .sql a migraciones Supabase
- Ordenar cronológicamente
- Documentar rollback

**Archivos a crear:**
- `shared/database/migrations/[timestamp]_*.sql`

---

#### DB-013: README.md del Módulo
**Prioridad:** Alta  
**Tiempo:** 30 min  
**Descripción:**
- Documentar schema
- Diagrama ER (texto/mermaid)
- Instrucciones setup local

**Archivos a crear:**
- `shared/database/README.md`

---

## ARCHIVOS DE ESTE MÓDULO

```
shared/database/
├── schema/
│   ├── 01_users_table.sql
│   ├── 02_companies_table.sql
│   ├── 03_products_table.sql
│   ├── 04_reservations_table.sql
│   ├── 05_wishlists_table.sql
│   ├── 06_gifts_table.sql
│   ├── 07_friends_tables.sql
│   ├── 08_stores_table.sql
│   └── rls/
│       ├── users_policies.sql
│       ├── companies_policies.sql
│       ├── wishlists_policies.sql
│       ├── gifts_policies.sql
│       ├── friends_policies.sql
│       └── stores_policies.sql
├── functions/
│   └── expire_reservations.sql
├── types/
│   ├── database.types.ts
│   └── index.ts
├── migrations/
│   └── [archivos generados]
├── tests/
│   └── database.test.ts
├── README.md
└── package.json
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** DB-001 → DB-002 → DB-003 → DB-009 → DB-004 → DB-005 → DB-006 → DB-007 → DB-008 → DB-010
- **Bloqueos:** DB-004 necesita DB-009 (stores), DB-005 necesita DB-004 (products)
- **RLS crítico:** Sin RLS = módulo no completable
- **Testing:** DB-011 antes de marcar READ-ONLY

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Verificar tests pasando (DB-011)
2. [ ] README.md escrito (DB-013)
3. [ ] Tipos generados sin errores (DB-010)
4. [ ] Actualizar PRD.md → estado Database = READ-ONLY
5. [ ] Mover a claude.md → shared/database/* a PROHIBIDOS
6. [ ] Cambiar MÓDULO ACTUAL en claude.md → Auth
7. [ ] Crear nuevo backlog en este archivo para Auth
