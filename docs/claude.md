# Claude Code - Reserrega

## MÓDULO ACTUAL: Database 🔴

**Objetivo:** Crear schema multi-tenant en Supabase con tablas core y RLS policies

---

## ARCHIVOS PERMITIDOS (puedes modificar):

```
shared/database/schema/
├── 01_core_tables.sql
├── 02_rls_policies.sql
├── 03_functions.sql
└── 04_triggers.sql

shared/database/types/
├── database.types.ts
└── index.ts

shared/database/migrations/
└── [archivos de migración]

shared/database/tests/
└── database.test.ts

shared/database/
├── README.md
└── package.json
```

---

## ARCHIVOS PROHIBIDOS (NO tocar):

```
(Ninguno todavía - es el primer módulo)

A medida que completes módulos, se añadirán aquí:
- shared/auth/* (cuando esté READ-ONLY)
- shared/common/* (cuando esté READ-ONLY)
- features/* (cuando estén READ-ONLY)
```

---

## REGLAS CRÍTICAS PARA CLAUDE CODE

### ⛔ ANTES de modificar CUALQUIER archivo:

1. **Verificar que está en lista PERMITIDOS**
2. Si NO está → **PARAR inmediatamente**
3. Si está fuera del módulo activo → **ESCALAR**

### ✅ Durante desarrollo:

- Solo trabajar en archivos del módulo Database
- Una tarea a la vez (ver tareas.md)
- Actualizar tareas.md cuando completes algo
- Si necesitas tocar otro módulo → PARAR y reportar

### 🚨 Si algo sale mal:

- Archivo prohibido tocado → REVERT + reiniciar sesión
- Error de compilación → arreglar antes de seguir
- Test falla → arreglar antes de nueva funcionalidad

---

## STACK TÉCNICO PERMITIDO

**Base de datos:**
- PostgreSQL (Supabase)
- Schema: `reserrega`
- RLS habilitado

**Lenguajes:**
- SQL (DDL/DML)
- TypeScript 5

**Herramientas:**
- Supabase CLI (migraciones)
- @supabase/supabase-js

**NO usar:**
- ORMs externos (Prisma, TypeORM) - usar Supabase directamente
- Migraciones custom - usar Supabase migrations

---

## CONTEXTO DEL PROYECTO

**Tipo:** SaaS multi-tenant, red social de regalos  
**Roles:** Superadmin, Admin empresa, Usuario, Comercial  
**Multi-tenancy:** Por `company_id` en tabla `companies`

**Tablas Core (a crear en este módulo):**
- `users` - Usuarios del sistema
- `companies` - Tiendas/empresas partner
- `products` - Catálogo de productos
- `reservations` - Reservas activas (1€, 15 días)
- `wishlists` - Listas de deseos de usuarios
- `gifts` - Regalos realizados
- `friend_requests` - Solicitudes de amistad
- `friendships` - Relaciones de amistad confirmadas
- `stores` - Tiendas físicas (ubicaciones)

---

## INSTRUCCIONES PARA NUEVA SESIÓN

**Al iniciar Claude Code:**

```
"Lee PRD.md, claude.md y tareas.md.

Módulo activo: Database
Solo puedes modificar archivos en shared/database/

Tarea actual: [copiar de tareas.md]

Restricciones:
- NO tocar archivos fuera de shared/database/
- Una tarea a la vez
- Actualizar tareas.md al completar"
```

---

## PRÓXIMO MÓDULO (después de completar Database)

**Auth** - `shared/auth/`

**Cuando Database esté READ-ONLY:**
1. Actualizar PRD.md → estado Database = READ-ONLY
2. Mover `shared/database/*` a ARCHIVOS PROHIBIDOS
3. Cambiar MÓDULO ACTUAL a: Auth
4. Actualizar lista PERMITIDOS con archivos de Auth
5. Crear nuevo backlog en tareas.md para Auth
