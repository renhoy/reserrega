# Claude Code - Reserrega

## MÓDULO ACTUAL: Auth 🔴

**Objetivo:** Sistema de autenticación y autorización con Supabase Auth

---

## ARCHIVOS PERMITIDOS (puedes modificar):

```
shared/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── AuthProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── useSession.ts
├── middleware/
│   ├── authMiddleware.ts
│   └── roleGuard.ts
├── server/
│   ├── getUser.ts
│   ├── requireAuth.ts
│   └── requireRole.ts
├── types/
│   └── auth.types.ts
├── utils/
│   ├── permissions.ts
│   └── session.ts
├── README.md
└── index.ts

src/middleware.ts
src/app/auth/
├── login/
│   └── page.tsx
├── register/
│   └── page.tsx
└── callback/
    └── route.ts
```

---

## ARCHIVOS PROHIBIDOS (NO tocar):

```
✅ shared/database/* (READ-ONLY - Módulo completado)
  - Schema ya definido y ejecutado
  - Tipos TypeScript generados
  - Solo lectura para consultas

❌ shared/common/* (Todavía no iniciado)
❌ features/* (Todavía no iniciados)
❌ src/app/* (excepto src/app/auth/)
```

---

## REGLAS CRÍTICAS PARA CLAUDE CODE

### ⛔ ANTES de modificar CUALQUIER archivo:

1. **Verificar que está en lista PERMITIDOS**
2. Si NO está → **PARAR inmediatamente**
3. Si está fuera del módulo activo → **ESCALAR**

### ✅ Durante desarrollo:

- Solo trabajar en archivos del módulo Auth
- Una tarea a la vez (ver tareas.md)
- Actualizar tareas.md cuando completes algo
- Puedes LEER shared/database/* pero NO MODIFICAR
- Si necesitas tocar otro módulo → PARAR y reportar

### 🚨 Si algo sale mal:

- Archivo prohibido tocado → REVERT + reiniciar sesión
- Error de compilación → arreglar antes de seguir
- Test falla → arreglar antes de nueva funcionalidad

---

## STACK TÉCNICO PERMITIDO

**Framework:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5

**Autenticación:**
- Supabase Auth (PKCE flow)
- Email/Password
- Magic Links (futuro)

**Base de datos (READ-ONLY):**
- PostgreSQL (Supabase)
- Schema: `reserrega`
- Tabla `users` ya creada

**Herramientas:**
- @supabase/supabase-js
- @supabase/ssr (para cookies)
- Server Actions

**NO usar:**
- NextAuth / Auth.js (conflicto con Supabase)
- Cookies manuales (usar @supabase/ssr)
- Client-side routing sin protección

---

## CONTEXTO DEL PROYECTO

**Tipo:** SaaS multi-tenant, red social de regalos
**Roles:** Superadmin, Admin, Comercial, Usuario
**Multi-tenancy:** Por `company_id` en tabla `companies`

**Autenticación requerida:**
- Login con email/password
- Registro de nuevos usuarios (rol: usuario por defecto)
- Callback URL para auth flow
- Middleware para proteger rutas
- Server helpers para verificar roles
- Logout

---

## INSTRUCCIONES PARA NUEVA SESIÓN

**Al iniciar Claude Code:**

```
"Lee PRD.md, claude.md y tareas.md.

Módulo activo: Auth
Solo puedes modificar archivos en shared/auth/ y src/app/auth/

Tarea actual: [copiar de tareas.md]

Restricciones:
- NO modificar shared/database/* (READ-ONLY)
- Puedes LEER shared/database/* para consultas
- Una tarea a la vez
- Actualizar tareas.md al completar"
```

---

## MÓDULO ANTERIOR (completado)

✅ **Database** - `shared/database/` (READ-ONLY)
- Schema con 13 tablas creadas
- Tipos TypeScript generados
- RLS policies configuradas
- Superadmin y empresa demo creados

---

## PRÓXIMO MÓDULO (después de completar Auth)

**Common** - `shared/common/`

**Cuando Auth esté READ-ONLY:**
1. Actualizar PRD.md → estado Auth = READ-ONLY
2. Mover `shared/auth/*` a ARCHIVOS PROHIBIDOS
3. Cambiar MÓDULO ACTUAL a: Common
4. Actualizar lista PERMITIDOS con archivos de Common
5. Crear nuevo backlog en tareas.md para Common
