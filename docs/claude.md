# Claude Code - Reserrega

## MÓDULO ACTUAL: Product-Reservation 🔴

**Objetivo:** Escaneo QR temporal, vincular productos a usuarios, pago 1€, expiración 15 días

---

## ARCHIVOS PERMITIDOS (puedes modificar):

```
features/product-reservation/
├── components/
│   ├── QRGenerator.tsx
│   ├── QRScanner.tsx
│   ├── ProductScanner.tsx
│   └── ReservationForm.tsx
├── actions/
│   ├── generateQR.ts
│   ├── scanProduct.ts
│   └── createReservation.ts
├── hooks/
│   ├── useQRCode.ts
│   └── useReservation.ts
├── lib/
│   ├── qr-utils.ts
│   └── product-utils.ts
├── types/
│   └── reservation.types.ts
├── README.md
└── index.ts

src/app/
├── (user)/
│   ├── reservations/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   └── qr/
│       └── page.tsx
└── (comercial)/
    └── scan/
        └── page.tsx
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

✅ shared/common/* (READ-ONLY - Módulo completado)
  - 25+ componentes UI (shadcn/ui)
  - Layouts (Header, Sidebar, Footer, MainLayout)
  - Hooks compartidos (usePermissions, useToast, etc.)
  - Utilidades (formatters, validators, helpers)
  - Constantes y types
  - Solo lectura para uso

❌ features/* (Todavía no iniciados - excepto Product-Reservation)
❌ src/app/(routes)/* (excepto rutas permitidas)
```

---

## REGLAS CRÍTICAS PARA CLAUDE CODE

### ⛔ ANTES de modificar CUALQUIER archivo:

1. **Verificar que está en lista PERMITIDOS**
2. Si NO está → **PARAR inmediatamente**
3. Si está fuera del módulo activo → **ESCALAR**

### ✅ Durante desarrollo:

- Solo trabajar en archivos del módulo Product-Reservation
- Una tarea a la vez (ver tareas.md)
- Actualizar tareas.md cuando completes algo
- Puedes LEER shared/database/*, shared/auth/* y shared/common/* pero NO MODIFICAR
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
- shared/common/* - UI components, layouts, hooks, utilidades

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

**Product-Reservation module incluye:**
- Generación de QR temporal para usuarios
- Escaneo de QR + código de barras por comerciales
- Vinculación de productos a usuarios
- Sistema de pago simulado (1€ por reserva)
- Expiración automática de reservas (15 días)

---

## INSTRUCCIONES PARA NUEVA SESIÓN

**Al iniciar Claude Code:**

```
"Lee PRD.md, claude.md y tareas.md.

Módulo activo: Product-Reservation
Solo puedes modificar archivos en features/product-reservation/ y rutas en src/app/(user)/reservations, src/app/(user)/qr, src/app/(comercial)/scan

Tarea actual: [copiar de tareas.md]

Restricciones:
- NO modificar shared/database/* (READ-ONLY)
- NO modificar shared/auth/* (READ-ONLY)
- NO modificar shared/common/* (READ-ONLY)
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

✅ **Common** - `shared/common/` (READ-ONLY)
- 25+ componentes UI (shadcn/ui)
- Layouts completos (Header, Sidebar, Footer, MainLayout)
- Componentes compartidos (LoadingSpinner, ErrorBoundary, EmptyState, etc.)
- Hooks compartidos (usePermissions, useToast, useMediaQuery, etc.)
- Utilidades (formatters, validators, helpers)
- Constantes (routes, UI) y types compartidos

---

## PRÓXIMO MÓDULO (después de completar Product-Reservation)

**Wishlist** - `features/wishlist/`

**Cuando Product-Reservation esté READ-ONLY:**
1. Actualizar PRD.md → estado Product-Reservation = READ-ONLY
2. Mover `features/product-reservation/*` a ARCHIVOS PROHIBIDOS
3. Cambiar MÓDULO ACTUAL a: Wishlist
4. Actualizar lista PERMITIDOS con archivos de Wishlist
5. Crear nuevo backlog en tareas.md para Wishlist
