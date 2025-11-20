# Claude Code - Reserrega

## MÓDULO ACTUAL: Store-Panel 🔴

**Objetivo:** Panel para comerciales/dependientas - escanear QR usuario, escanear productos, gestionar reservas activas, marcar envíos, dashboard de estadísticas

---

## ARCHIVOS PERMITIDOS (puedes modificar):

```
features/store-panel/
├── components/
│   ├── SessionScanner.tsx
│   ├── ProductLinker.tsx
│   ├── ActiveReservations.tsx
│   ├── DeliveryManager.tsx
│   └── StoreStats.tsx
├── actions/
│   └── store-panel.actions.ts
├── hooks/
│   └── use-store-session.ts
├── lib/
│   └── store-utils.ts
├── types/
│   └── store.types.ts
├── README.md
└── index.ts

src/app/
├── (comercial)/
│   └── store/
│       ├── page.tsx
│       └── session/
│           └── [userId]/
│               └── page.tsx
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

✅ features/product-reservation/* (READ-ONLY - Módulo completado)
  - QR generator y scanners (QR/barcode)
  - Formulario de reserva con pago simulado
  - Hooks y utilidades para reservas
  - Páginas de usuario y comercial
  - Solo lectura para uso

✅ features/wishlist/* (READ-ONLY - Módulo completado)
  - Grid responsivo con filtros por estado
  - Control de visibilidad (privado/amigos/público)
  - Badges de estado con warnings de expiración
  - Optimistic UI updates
  - Solo lectura para uso

✅ features/friends-network/* (READ-ONLY - Módulo completado)
  - Solicitudes de amistad (enviar, aceptar, rechazar, cancelar)
  - Búsqueda de usuarios con estado de amistad
  - Invitaciones por email con tokens seguros
  - Gestión de red de amigos
  - Páginas de amigos, solicitudes e invitaciones
  - Hooks personalizados (useFriends, useFriendRequests, useUserSearch, useInvitation)
  - Páginas /friends, /friends/requests, /friends/invite
  - Solo lectura para uso

✅ features/gift-flow/* (READ-ONLY - Módulo completado)
  - Ver wishlist de amigos según permisos
  - Selección de productos con bloqueo temporal (15 min)
  - Sistema de checkout con pago simulado
  - Confirmación de entrega
  - Historial de regalos enviados y recibidos
  - Componentes (GiftSelectionCard, GiftCheckoutForm, GiftConfirmation, etc.)
  - Páginas /gift/[friendId], /gift/[friendId]/checkout, /gift/history, /gift/confirmation
  - Solo lectura para uso

❌ features/* (Todavía no iniciados - excepto Store-Panel)
❌ src/app/(routes)/* (excepto rutas permitidas)
```

---

## REGLAS CRÍTICAS PARA CLAUDE CODE

### ⛔ ANTES de modificar CUALQUIER archivo:

1. **Verificar que está en lista PERMITIDOS**
2. Si NO está → **PARAR inmediatamente**
3. Si está fuera del módulo activo → **ESCALAR**

### ✅ Durante desarrollo:

- Solo trabajar en archivos del módulo Store-Panel
- Una tarea a la vez (ver tareas.md)
- Actualizar tareas.md cuando completes algo
- Puedes LEER shared/*, features/* (completados) pero NO MODIFICAR
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
- features/product-reservation/* - QR, escaneo, reservas, pago simulado
- features/wishlist/* - Grid, filtros, visibilidad, badges de estado
- features/friends-network/* - Red de amigos, solicitudes, invitaciones
- features/gift-flow/* - Flujo completo de regalo, bloqueos, checkout

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

**Store-Panel module incluye:**
- Escanear QR de usuario para abrir sesión de compra
- Escanear códigos de barras de productos
- Vincular productos escaneados al usuario
- Ver reservas activas de la tienda
- Marcar productos como enviados/entregados
- Dashboard con estadísticas de la tienda
- Gestión de sesiones de compra activas

---

## INSTRUCCIONES PARA NUEVA SESIÓN

**Al iniciar Claude Code:**

```
"Lee PRD.md, claude.md y tareas.md.

Módulo activo: Store-Panel
Solo puedes modificar archivos en features/store-panel/ y rutas en src/app/(comercial)/store

Tarea actual: [copiar de tareas.md]

Restricciones:
- NO modificar shared/* (READ-ONLY)
- NO modificar features/* completados (READ-ONLY)
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

✅ **Product-Reservation** - `features/product-reservation/` (READ-ONLY)
- QRGenerator component con auto-refresh (24h)
- QRScanner y ProductScanner con acceso a cámara
- ReservationForm con pago simulado (1€)
- Páginas /qr, /reservations, /scan
- Hooks useQRCode y useReservation
- Server actions completas

✅ **Wishlist** - `features/wishlist/` (READ-ONLY)
- WishlistGrid con filtros por estado y estadísticas
- WishlistItem cards responsivos con acciones
- ProductStatusBadge y VisibilityToggle
- Control de visibilidad (privado/amigos/público)
- Estados: disponible/en proceso/regalado/expirado
- Warnings de expiración
- Optimistic UI updates
- Páginas /wishlist y /wishlist/[id]
- Hook useWishlist
- Server actions completas

✅ **Friends-Network** - `features/friends-network/` (READ-ONLY)
- Solicitudes de amistad completas
- Búsqueda de usuarios
- Invitaciones por email
- Gestión de red de amigos

✅ **Gift-Flow** - `features/gift-flow/` (READ-ONLY)
- Ver wishlist de amigos
- Bloqueo temporal de productos
- Checkout con pago simulado
- Historial de regalos

---

## PRÓXIMO MÓDULO (después de completar Store-Panel)

**Admin Dashboard** - Panel administrativo

**Cuando Store-Panel esté READ-ONLY:**
1. Actualizar PRD.md → estado Store-Panel = READ-ONLY
2. Mover `features/store-panel/*` a ARCHIVOS PROHIBIDOS
3. Cambiar MÓDULO ACTUAL a: Admin Dashboard
4. Actualizar lista PERMITIDOS con archivos correspondientes
5. Crear nuevo backlog en tareas.md
