# Claude Code - Reserrega

## MÓDULO ACTUAL: Friends-Network 🔴

**Objetivo:** Sistema de amigos - invitar por email/QR, búsqueda de usuarios, solicitudes de amistad, gestionar red de regaladores

---

## ARCHIVOS PERMITIDOS (puedes modificar):

```
features/friends-network/
├── components/
│   ├── FriendsList.tsx
│   ├── FriendRequestCard.tsx
│   ├── InviteFriendForm.tsx
│   ├── FriendQRGenerator.tsx
│   ├── FriendQRScanner.tsx
│   └── UserSearchBar.tsx
├── actions/
│   ├── getFriends.ts
│   ├── sendFriendRequest.ts
│   ├── manageFriendRequest.ts
│   ├── searchUsers.ts
│   └── generateInvitation.ts
├── hooks/
│   ├── useFriends.ts
│   └── useInvitation.ts
├── lib/
│   └── friends-utils.ts
├── types/
│   └── friends.types.ts
├── README.md
└── index.ts

src/app/
├── (user)/
│   ├── friends/
│   │   ├── page.tsx
│   │   ├── requests/
│   │   │   └── page.tsx
│   │   └── invite/
│   │       └── page.tsx
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
  - Páginas /wishlist y /wishlist/[id]
  - Solo lectura para uso

❌ features/* (Todavía no iniciados - excepto Friends-Network)
❌ src/app/(routes)/* (excepto rutas permitidas)
```

---

## REGLAS CRÍTICAS PARA CLAUDE CODE

### ⛔ ANTES de modificar CUALQUIER archivo:

1. **Verificar que está en lista PERMITIDOS**
2. Si NO está → **PARAR inmediatamente**
3. Si está fuera del módulo activo → **ESCALAR**

### ✅ Durante desarrollo:

- Solo trabajar en archivos del módulo Friends-Network
- Una tarea a la vez (ver tareas.md)
- Actualizar tareas.md cuando completes algo
- Puedes LEER shared/*, features/product-reservation/* y features/wishlist/* pero NO MODIFICAR
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

**Friends-Network module incluye:**
- Invitar amigos por email con token único
- Generar/escanear QR para añadir amigos
- Búsqueda de usuarios por username/email
- Enviar/aprobar/rechazar solicitudes de amistad
- Ver lista de amigos
- Gestionar red de regaladores

---

## INSTRUCCIONES PARA NUEVA SESIÓN

**Al iniciar Claude Code:**

```
"Lee PRD.md, claude.md y tareas.md.

Módulo activo: Friends-Network
Solo puedes modificar archivos en features/friends-network/ y rutas en src/app/(user)/friends

Tarea actual: [copiar de tareas.md]

Restricciones:
- NO modificar shared/* (READ-ONLY)
- NO modificar features/product-reservation/* (READ-ONLY)
- NO modificar features/wishlist/* (READ-ONLY)
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

---

## PRÓXIMO MÓDULO (después de completar Friends-Network)

**Gift-Flow** - `features/gift-flow/`

**Cuando Friends-Network esté READ-ONLY:**
1. Actualizar PRD.md → estado Friends-Network = READ-ONLY
2. Mover `features/friends-network/*` a ARCHIVOS PROHIBIDOS
3. Cambiar MÓDULO ACTUAL a: Gift-Flow
4. Actualizar lista PERMITIDOS con archivos de Gift-Flow
5. Crear nuevo backlog en tareas.md para Gift-Flow
