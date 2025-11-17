# Tareas - MÓDULO: Auth

## MÓDULO ACTIVO: Auth 🔴

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

#### AUTH-001: Estructura y Tipos del Módulo
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- Crear estructura de carpetas `shared/auth/`
- Definir tipos TypeScript para auth
- Crear README.md del módulo
- Configurar exports principales

**Archivos a crear:**
- `shared/auth/types/auth.types.ts`
- `shared/auth/README.md`
- `shared/auth/index.ts`

**Criterio de aceptación:**
- [ ] Estructura de carpetas creada
- [ ] Tipos de roles, sesión, y usuario definidos
- [ ] README con documentación básica
- [ ] Exports configurados

---

#### AUTH-002: Server Helpers (getUser, requireAuth)
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- Helper para obtener usuario actual (server-side)
- Helper para requerir autenticación
- Helper para requerir rol específico
- Manejo de errores y redirects

**Archivos a crear:**
- `shared/auth/server/getUser.ts`
- `shared/auth/server/requireAuth.ts`
- `shared/auth/server/requireRole.ts`
- `shared/auth/server/index.ts`

**Criterio de aceptación:**
- [ ] getUser() retorna usuario o null
- [ ] requireAuth() redirige si no autenticado
- [ ] requireRole() verifica permisos por rol
- [ ] Manejo de errores claro

---

#### AUTH-003: Páginas de Login y Register
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Página de login con formulario
- Página de registro con validación
- Integración con Supabase Auth
- Manejo de errores de auth
- Redirección post-login

**Archivos a crear:**
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`
- `shared/auth/components/LoginForm.tsx`
- `shared/auth/components/RegisterForm.tsx`

**Criterio de aceptación:**
- [ ] Login funcional con email/password
- [ ] Register crea usuario en auth.users
- [ ] Validación de campos (email, password min 6 chars)
- [ ] Mensajes de error claros
- [ ] Redirección a dashboard tras login

---

#### AUTH-004: Callback Route (Auth Flow)
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- Route handler para callback de Supabase
- Manejar código de auth
- Crear entrada en reserrega.users
- Redirección apropiada

**Archivos a crear:**
- `src/app/auth/callback/route.ts`

**Criterio de aceptación:**
- [ ] Callback procesa auth code correctamente
- [ ] Crea usuario en reserrega.users si no existe
- [ ] Redirige a dashboard
- [ ] Maneja errores de callback

---

#### AUTH-005: Hooks de Cliente (useAuth, useUser)
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- Hook useAuth() para estado de autenticación
- Hook useUser() para datos del usuario
- Hook useSession() para sesión actual
- Integración con Supabase realtime

**Archivos a crear:**
- `shared/auth/hooks/useAuth.ts`
- `shared/auth/hooks/useUser.ts`
- `shared/auth/hooks/useSession.ts`
- `shared/auth/hooks/index.ts`

**Criterio de aceptación:**
- [ ] useAuth() retorna { user, loading, signOut }
- [ ] useUser() obtiene datos de reserrega.users
- [ ] useSession() retorna sesión actual
- [ ] Hooks reactivos a cambios de auth

---

#### AUTH-006: Middleware de Protección de Rutas
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- Middleware Next.js para proteger rutas
- Verificar autenticación
- Verificar roles
- Redirecciones apropiadas

**Archivos a crear:**
- `src/middleware.ts`
- `shared/auth/middleware/authMiddleware.ts`
- `shared/auth/middleware/roleGuard.ts`

**Criterio de aceptación:**
- [ ] Middleware protege rutas /dashboard/*
- [ ] Redirige a /auth/login si no autenticado
- [ ] Verifica roles en rutas específicas
- [ ] Permite rutas públicas (/auth/*)

---

#### AUTH-007: Utilidades y Permisos
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Sistema de permisos por rol
- Helpers para verificar permisos
- Constantes de roles
- Utils de sesión

**Archivos a crear:**
- `shared/auth/utils/permissions.ts`
- `shared/auth/utils/session.ts`
- `shared/auth/utils/constants.ts`

**Criterio de aceptación:**
- [ ] Constantes de roles definidas
- [ ] canAccess(role, resource) funcional
- [ ] hasPermission(user, action) funcional
- [ ] Utils reutilizables

---

#### AUTH-008: AuthProvider (Context)
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- Context Provider para auth global
- Sincronización con Supabase
- Estado global de usuario
- Refresh automático de sesión

**Archivos a crear:**
- `shared/auth/components/AuthProvider.tsx`

**Criterio de aceptación:**
- [ ] Provider envuelve app
- [ ] Sincroniza auth state globalmente
- [ ] Refresh automático de token
- [ ] Maneja onAuthStateChange

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### AUTH-009: Tests de Auth
**Prioridad:** Alta
**Tiempo:** 2-3 horas
**Descripción:**
- Tests de server helpers
- Tests de hooks
- Tests de middleware
- Tests de permisos

**Archivos a crear:**
- `shared/auth/tests/server.test.ts`
- `shared/auth/tests/hooks.test.ts`
- `shared/auth/tests/middleware.test.ts`

---

#### AUTH-010: Logout y Session Management
**Prioridad:** Alta
**Tiempo:** 1 hora
**Descripción:**
- Botón de logout
- Limpiar sesión correctamente
- Server action para logout
- Redirección post-logout

**Archivos a crear:**
- `shared/auth/actions/logout.ts`
- `shared/auth/components/LogoutButton.tsx`

---

## ARCHIVOS DE ESTE MÓDULO

```
shared/auth/
├── components/
│   ├── LoginForm.tsx           # AUTH-003
│   ├── RegisterForm.tsx        # AUTH-003
│   ├── AuthProvider.tsx        # AUTH-008
│   └── LogoutButton.tsx        # AUTH-010
├── hooks/
│   ├── useAuth.ts              # AUTH-005
│   ├── useUser.ts              # AUTH-005
│   ├── useSession.ts           # AUTH-005
│   └── index.ts                # AUTH-005
├── middleware/
│   ├── authMiddleware.ts       # AUTH-006
│   ├── roleGuard.ts            # AUTH-006
│   └── index.ts
├── server/
│   ├── getUser.ts              # AUTH-002
│   ├── requireAuth.ts          # AUTH-002
│   ├── requireRole.ts          # AUTH-002
│   └── index.ts                # AUTH-002
├── actions/
│   └── logout.ts               # AUTH-010
├── types/
│   └── auth.types.ts           # AUTH-001
├── utils/
│   ├── permissions.ts          # AUTH-007
│   ├── session.ts              # AUTH-007
│   ├── constants.ts            # AUTH-007
│   └── index.ts
├── tests/
│   ├── server.test.ts          # AUTH-009
│   ├── hooks.test.ts           # AUTH-009
│   └── middleware.test.ts      # AUTH-009
├── README.md                   # AUTH-001
└── index.ts                    # AUTH-001

src/middleware.ts               # AUTH-006
src/app/auth/
├── login/
│   └── page.tsx                # AUTH-003
├── register/
│   └── page.tsx                # AUTH-003
└── callback/
    └── route.ts                # AUTH-004
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** AUTH-001 → AUTH-002 → AUTH-003 → AUTH-004 → AUTH-005 → AUTH-006 → AUTH-007 → AUTH-008
- **Bloqueos:** AUTH-003 necesita AUTH-001, AUTH-006 necesita AUTH-002
- **Testing:** AUTH-009 antes de marcar READ-ONLY
- **Base de datos:** Solo LEER shared/database/*, NO MODIFICAR

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Verificar tests pasando (AUTH-009)
2. [ ] README.md escrito (AUTH-001)
3. [ ] Login/Register funcional end-to-end
4. [ ] Middleware protegiendo rutas
5. [ ] Actualizar PRD.md → estado Auth = READ-ONLY
6. [ ] Mover a claude.md → shared/auth/* a PROHIBIDOS
7. [ ] Cambiar MÓDULO ACTUAL en claude.md → Common
8. [ ] Crear nuevo backlog en este archivo para Common
