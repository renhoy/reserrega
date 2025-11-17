# Claude Code - Reserrega

## MÓDULO ACTUAL: Common 🔴

**Objetivo:** UI components base, layouts, utilidades compartidas

---

## ARCHIVOS PERMITIDOS (puedes modificar):

```
shared/common/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layouts/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── ...
├── hooks/
│   ├── usePermissions.ts
│   ├── useToast.ts
│   └── ...
├── lib/
│   ├── utils.ts
│   └── cn.ts
├── types/
│   └── common.types.ts
├── constants/
│   └── routes.ts
├── README.md
└── index.ts

src/app/
├── layout.tsx                 # Root layout
├── (dashboard)/              # Dashboard routes
│   └── layout.tsx
└── components/                # App-specific components
```

---

## ARCHIVOS PROHIBIDOS (NO tocar):

```
✅ shared/database/* (READ-ONLY - Módulo completado)
  - Schema ya definido y ejecutado
  - Tipos TypeScript generados
  - Solo lectura para consultas

✅ shared/auth/* (READ-ONLY - Módulo completado)
  - Sistema de autenticación completo
  - Middleware, hooks, server helpers
  - Solo lectura para uso

❌ features/* (Todavía no iniciados)
❌ src/app/(routes)/* (excepto layouts permitidos)
```

---

## REGLAS CRÍTICAS PARA CLAUDE CODE

### ⛔ ANTES de modificar CUALQUIER archivo:

1. **Verificar que está en lista PERMITIDOS**
2. Si NO está → **PARAR inmediatamente**
3. Si está fuera del módulo activo → **ESCALAR**

### ✅ Durante desarrollo:

- Solo trabajar en archivos del módulo Common
- Una tarea a la vez (ver tareas.md)
- Actualizar tareas.md cuando completes algo
- Puedes LEER shared/database/* y shared/auth/* pero NO MODIFICAR
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

**UI/UX:**
- shadcn/ui (componentes base)
- Tailwind CSS
- Radix UI primitives
- Lucide icons

**State Management:**
- React Context
- Server Actions
- URL state

**Módulos completados (READ-ONLY):**
- shared/database/* - Schema y tipos
- shared/auth/* - Autenticación completa

**Herramientas:**
- clsx / tailwind-merge
- class-variance-authority

**NO usar:**
- CSS-in-JS libraries
- Styled components
- Otras UI libraries (Material UI, Ant Design, etc.)

---

## CONTEXTO DEL PROYECTO

**Tipo:** SaaS multi-tenant, red social de regalos
**Roles:** Superadmin, Admin, Comercial, Usuario
**Multi-tenancy:** Por `company_id` en tabla `companies`

**Common module incluye:**
- shadcn/ui components configurados
- Layouts base (Header, Sidebar, Footer)
- Componentes reutilizables
- Hooks compartidos (usePermissions, etc.)
- Utilidades comunes
- Constantes de rutas

---

## INSTRUCCIONES PARA NUEVA SESIÓN

**Al iniciar Claude Code:**

```
"Lee PRD.md, claude.md y tareas.md.

Módulo activo: Common
Solo puedes modificar archivos en shared/common/ y layouts en src/app/

Tarea actual: [copiar de tareas.md]

Restricciones:
- NO modificar shared/database/* (READ-ONLY)
- NO modificar shared/auth/* (READ-ONLY)
- Puedes LEER módulos completados para uso
- Una tarea a la vez
- Actualizar tareas.md al completar"
```

---

## MÓDULOS ANTERIORES (completados)

✅ **Database** - `shared/database/` (READ-ONLY)
- Schema con 13 tablas creadas
- Tipos TypeScript generados
- RLS policies configuradas
- Superadmin y empresa demo creados

✅ **Auth** - `shared/auth/` (READ-ONLY)
- Login/Register funcional
- Middleware de protección
- Hooks de autenticación
- Server helpers (requireAuth, requireRole)
- Sistema de permisos completo

---

## PRÓXIMO MÓDULO (después de completar Common)

**Product-Reservation** - `features/product-reservation/`

**Cuando Common esté READ-ONLY:**
1. Actualizar PRD.md → estado Common = READ-ONLY
2. Mover `shared/common/*` a ARCHIVOS PROHIBIDOS
3. Cambiar MÓDULO ACTUAL a: Product-Reservation
4. Actualizar lista PERMITIDOS con archivos de Product-Reservation
5. Crear nuevo backlog en tareas.md para Product-Reservation
