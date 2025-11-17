# Tareas - MÓDULO: Friends-Network

## MÓDULO ACTIVO: Friends-Network 🔴

**Tareas Activas:** 0/7
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

#### FN-001: Types y Utilidades Base
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- Definir types para FriendRequest, Invitation, FriendshipStatus
- Crear utilidades para tokens de invitación
- Helpers para formatear estados de solicitud
- Utils para validar emails

**Archivos a crear:**
- `features/friends-network/types/friends.types.ts`
- `features/friends-network/lib/friends-utils.ts`

**Criterio de aceptación:**
- [ ] Types completos con JSDoc
- [ ] FriendRequest, Invitation, SearchResult types
- [ ] Función generateInvitationToken()
- [ ] Función validateInvitationToken()
- [ ] Función formatFriendRequestStatus()

---

#### FN-002: Componentes de Solicitudes
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- FriendRequestCard (recibida y enviada)
- Botones aprobar/rechazar/cancelar
- Estados visuales (pending/accepted/rejected)
- Información del usuario (avatar, nombre, email)

**Archivos a crear:**
- `features/friends-network/components/FriendRequestCard.tsx`
- `features/friends-network/components/FriendRequestsList.tsx`

**Criterio de aceptación:**
- [ ] FriendRequestCard muestra info de usuario
- [ ] Botones aprobar/rechazar funcionales
- [ ] Estados visuales claros
- [ ] Lista de solicitudes con separación recibidas/enviadas
- [ ] Responsive design

---

#### FN-003: Componentes de Lista y Búsqueda
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- FriendsList component (grid/list view)
- UserSearchBar con debounce
- Resultados de búsqueda
- InviteFriendForm (email)

**Archivos a crear:**
- `features/friends-network/components/FriendsList.tsx`
- `features/friends-network/components/FriendCard.tsx`
- `features/friends-network/components/UserSearchBar.tsx`
- `features/friends-network/components/InviteFriendForm.tsx`

**Criterio de aceptación:**
- [ ] FriendsList muestra todos los amigos
- [ ] FriendCard con avatar, nombre, y acciones
- [ ] Búsqueda con debounce (300ms)
- [ ] Formulario de invitación por email
- [ ] Empty states

---

#### FN-004: Server Actions
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- getFriends - obtener lista de amigos
- sendFriendRequest - enviar solicitud
- acceptFriendRequest - aceptar solicitud
- rejectFriendRequest - rechazar solicitud
- searchUsers - buscar por username/email
- sendInvitationEmail - invitar por email
- validateInvitationToken - validar token de invitación

**Archivos a crear:**
- `features/friends-network/actions/getFriends.ts`
- `features/friends-network/actions/sendFriendRequest.ts`
- `features/friends-network/actions/manageFriendRequest.ts`
- `features/friends-network/actions/searchUsers.ts`
- `features/friends-network/actions/generateInvitation.ts`

**Criterio de aceptación:**
- [ ] getFriends con paginación
- [ ] sendFriendRequest valida no duplicados
- [ ] acceptFriendRequest crea relación bidireccional
- [ ] searchUsers busca por nombre y email
- [ ] sendInvitationEmail genera token único
- [ ] validateInvitationToken verifica expiración
- [ ] Validación de permisos en todas las acciones

---

#### FN-005: Hooks de Gestión
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- useFriends hook para gestionar amigos
- useFriendRequests hook para solicitudes
- useUserSearch hook para búsqueda
- useInvitation hook para invitaciones
- Optimistic updates

**Archivos a crear:**
- `features/friends-network/hooks/useFriends.ts`
- `features/friends-network/hooks/useFriendRequests.ts`
- `features/friends-network/hooks/useUserSearch.ts`
- `features/friends-network/hooks/useInvitation.ts`

**Criterio de aceptación:**
- [ ] useFriends con loading states
- [ ] useFriendRequests separado por recibidas/enviadas
- [ ] useUserSearch con debounce
- [ ] useInvitation para enviar invitaciones
- [ ] Optimistic updates en aprobar/rechazar

---

#### FN-006: Páginas y Rutas
**Prioridad:** Crítica
**Tiempo:** 3 horas
**Descripción:**
- Página de amigos (/friends)
- Página de solicitudes (/friends/requests)
- Página de invitar (/friends/invite)
- Protección de rutas

**Archivos a crear:**
- `src/app/(user)/friends/page.tsx`
- `src/app/(user)/friends/requests/page.tsx`
- `src/app/(user)/friends/invite/page.tsx`

**Criterio de aceptación:**
- [ ] /friends muestra lista de amigos + búsqueda
- [ ] /friends/requests muestra solicitudes recibidas y enviadas
- [ ] /friends/invite permite invitar por email
- [ ] Tabs para navegación entre secciones
- [ ] Protección con requireAuth()
- [ ] Loading states y empty states

---

#### FN-007: README y Documentación
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- README del módulo
- Documentar componentes
- Documentar flujo completo
- Ejemplos de uso

**Archivos a crear:**
- `features/friends-network/README.md`
- `features/friends-network/index.ts`

**Criterio de aceptación:**
- [ ] README completo
- [ ] Flujo documentado paso a paso
- [ ] Ejemplos de uso
- [ ] Exports organizados

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### FN-008: QR Friend Add (Opcional)
**Prioridad:** Alta
**Tiempo:** 2-3 horas
**Descripción:**
- Generar QR con userId
- Escanear QR de otro usuario
- Enviar solicitud automáticamente

**Archivos a crear:**
- `features/friends-network/components/FriendQRGenerator.tsx`
- `features/friends-network/components/FriendQRScanner.tsx`
- `features/friends-network/actions/addFriendByQR.ts`

---

#### FN-009: Notificaciones de Solicitudes
**Prioridad:** Alta
**Tiempo:** 1 hora
**Descripción:**
- Notificar cuando recibes solicitud
- Notificar cuando aceptan/rechazan
- Badge con contador de pendientes

---

## ARCHIVOS DE ESTE MÓDULO

```
features/friends-network/
├── components/
│   ├── FriendsList.tsx              # FN-003
│   ├── FriendCard.tsx               # FN-003
│   ├── FriendRequestCard.tsx        # FN-002
│   ├── FriendRequestsList.tsx       # FN-002
│   ├── UserSearchBar.tsx            # FN-003
│   ├── InviteFriendForm.tsx         # FN-003
│   ├── FriendQRGenerator.tsx        # FN-008 (opcional)
│   └── FriendQRScanner.tsx          # FN-008 (opcional)
├── actions/
│   ├── getFriends.ts                # FN-004
│   ├── sendFriendRequest.ts         # FN-004
│   ├── manageFriendRequest.ts       # FN-004
│   ├── searchUsers.ts               # FN-004
│   └── generateInvitation.ts        # FN-004
├── hooks/
│   ├── useFriends.ts                # FN-005
│   ├── useFriendRequests.ts         # FN-005
│   ├── useUserSearch.ts             # FN-005
│   └── useInvitation.ts             # FN-005
├── lib/
│   └── friends-utils.ts             # FN-001
├── types/
│   └── friends.types.ts             # FN-001
├── README.md                         # FN-007
└── index.ts                          # FN-007

src/app/
└── (user)/
    └── friends/
        ├── page.tsx                 # FN-006
        ├── requests/
        │   └── page.tsx             # FN-006
        └── invite/
            └── page.tsx             # FN-006
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** FN-001 → FN-002 → FN-003 → FN-004 → FN-005 → FN-006 → FN-007
- **Bloqueos:** FN-002 necesita FN-001, FN-003 necesita FN-001, etc.
- **Estados solicitud:** pending, accepted, rejected
- **Tokens invitación:** UUID v4 con expiración 7 días
- **Búsqueda:** Por username (campo `name` en users) y email
- **Relación bidireccional:** Al aceptar solicitud, se crea 1 registro con status=accepted
- **Tabla:** friend_requests (sender_id, recipient_id, status, invitation_token, invitation_email)

---

## FLUJO COMPLETO

### Flujo 1: Buscar y Añadir Amigo (usuario registrado)
1. Usuario va a /friends
2. Usa UserSearchBar para buscar por nombre o email
3. Ve resultados y hace click en "Añadir amigo"
4. Se crea friend_request con status=pending
5. Destinatario recibe notificación
6. Destinatario va a /friends/requests
7. Aprueba o rechaza solicitud
8. Si aprueba → ambos son amigos (status=accepted)

### Flujo 2: Invitar por Email (usuario no registrado)
1. Usuario va a /friends/invite
2. Ingresa email del amigo
3. Sistema genera invitation_token único
4. Envía email con link: /register?token={token}
5. Amigo hace click y se registra
6. Al completar registro, friend_request se actualiza con recipient_id
7. Amistad se crea automáticamente (status=accepted)

### Flujo 3: QR Add Friend (opcional - FN-008)
1. Usuario A genera QR en /friends/invite
2. Usuario B escanea QR (contiene userId de A)
3. Se crea friend_request automáticamente
4. Usuario A aprueba en /friends/requests
5. Amistad creada

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Flujo completo funcionando (búsqueda, envío, aprobación)
2. [ ] Invitaciones por email funcionales
3. [ ] Lista de amigos visible
4. [ ] Solicitudes recibidas y enviadas funcionan
5. [ ] Aprobar/rechazar funcional
6. [ ] Búsqueda por nombre/email funciona
7. [ ] README.md escrito (FN-007)
8. [ ] Actualizar PRD.md → estado Friends-Network = READ-ONLY
9. [ ] Mover a claude.md → features/friends-network/* a PROHIBIDOS
10. [ ] Cambiar MÓDULO ACTUAL en claude.md → Gift-Flow
11. [ ] Crear nuevo backlog en este archivo para Gift-Flow

---

## MÓDULOS COMPLETADOS

✅ **Database** - Schema, types, RLS policies
✅ **Auth** - Login, register, middleware, permisos
✅ **Common** - UI components, layouts, hooks, utilidades
✅ **Product-Reservation** - QR generator, scanners, reservas, pago simulado
✅ **Wishlist** - Grid, filtros, visibilidad, badges, páginas usuario

---

## MÓDULO ANTERIOR: Wishlist ✅ COMPLETADO

**Fecha completado:** 2025-11-17

**Tareas completadas:**
- ✅ WL-001: Types y Utilidades Base
- ✅ WL-002: Componentes Base UI (ProductStatusBadge, WishlistItem)
- ✅ WL-003: Grid y Controles de Visibilidad
- ✅ WL-004: Server Actions (getWishlist, updateStatus, updateVisibility)
- ✅ WL-005: Hook useWishlist con optimistic updates
- ✅ WL-006: Páginas /wishlist y /wishlist/[id]
- ✅ WL-007: README y Documentación

**Funcionalidad entregada:**
- Grid responsivo con filtros por estado
- Control de visibilidad (privado/amigos/público)
- ProductStatusBadge con colores según estado
- Warnings de expiración para productos
- Optimistic UI updates con rollback automático
- Estadísticas en tiempo real
- Páginas de lista y detalle completas
