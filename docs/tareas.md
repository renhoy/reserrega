# Tareas - MÓDULO: Wishlist

## MÓDULO ACTIVO: Wishlist 🔴

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

#### WL-001: Types y Utilidades Base
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- Definir types para Wishlist, WishlistItem, filters
- Crear utilidades para formatear estados
- Helpers para validar visibilidad
- Utils para detectar productos expirados

**Archivos a crear:**
- `features/wishlist/types/wishlist.types.ts`
- `features/wishlist/lib/wishlist-utils.ts`

**Criterio de aceptación:**
- [ ] Types completos con JSDoc
- [ ] WishlistItem, WishlistFilters types
- [ ] Función formatWishlistStatus()
- [ ] Función isProductExpired()
- [ ] Función canViewProduct(visibility, relationship)

---

#### WL-002: Componentes Base UI
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- WishlistItem component (card con producto)
- ProductStatusBadge (disponible/proceso/regalado/expirado)
- Mostrar info producto, precio, estado
- Warning si está expirado

**Archivos a crear:**
- `features/wishlist/components/WishlistItem.tsx`
- `features/wishlist/components/ProductStatusBadge.tsx`

**Criterio de aceptación:**
- [ ] WishlistItem muestra producto completo
- [ ] Incluye imagen, nombre, marca, talla, color, precio
- [ ] ProductStatusBadge con colores según estado
- [ ] Warning visual para productos expirados
- [ ] Responsive design

---

#### WL-003: Grid y Controles de Visibilidad
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- WishlistGrid con layout responsive
- VisibilityToggle component (private/friends/public)
- Filtros por estado
- Empty state

**Archivos a crear:**
- `features/wishlist/components/WishlistGrid.tsx`
- `features/wishlist/components/VisibilityToggle.tsx`

**Criterio de aceptación:**
- [ ] Grid responsivo (1/2/3 columnas)
- [ ] Toggle de visibilidad por producto
- [ ] Filtros por estado funcionales
- [ ] Empty state con call-to-action
- [ ] Loading states

---

#### WL-004: Server Actions
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- getWishlist - obtener productos del usuario
- updateProductStatus - cambiar estado
- updateVisibility - cambiar visibilidad
- removeFromWishlist - eliminar producto
- Validar permisos de propietario

**Archivos a crear:**
- `features/wishlist/actions/getWishlist.ts`
- `features/wishlist/actions/updateProductStatus.ts`
- `features/wishlist/actions/updateVisibility.ts`

**Criterio de aceptación:**
- [ ] getWishlist con filtros opcionales
- [ ] updateProductStatus valida estados
- [ ] updateVisibility valida opciones
- [ ] Solo propietario puede modificar
- [ ] Incluye info de reserva y producto

---

#### WL-005: Hook de Gestión
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- useWishlist hook para gestionar estado
- Filtrado local por estado
- Optimistic updates
- Error handling

**Archivos a crear:**
- `features/wishlist/hooks/useWishlist.ts`

**Criterio de aceptación:**
- [ ] Fetch inicial con loading state
- [ ] Filtros cliente-side
- [ ] updateStatus con optimistic update
- [ ] updateVisibility con optimistic update
- [ ] Error handling y rollback

---

#### WL-006: Páginas y Rutas
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- Página principal de wishlist (/wishlist)
- Página de detalle de producto (/wishlist/[id])
- Integración con Header/Sidebar
- Protección de rutas

**Archivos a crear:**
- `src/app/(user)/wishlist/page.tsx`
- `src/app/(user)/wishlist/[id]/page.tsx`

**Criterio de aceptación:**
- [ ] /wishlist muestra grid completo
- [ ] Filtros y controles funcionales
- [ ] /wishlist/[id] muestra detalle completo
- [ ] Permite cambiar estado y visibilidad
- [ ] Protección con requireAuth()

---

#### WL-007: README y Documentación
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- README del módulo
- Documentar componentes
- Documentar flujo completo
- Ejemplos de uso

**Archivos a crear:**
- `features/wishlist/README.md`
- `features/wishlist/index.ts`

**Criterio de aceptación:**
- [ ] README completo
- [ ] Flujo documentado paso a paso
- [ ] Ejemplos de uso
- [ ] Exports organizados

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### WL-008: Ordenamiento y Prioridad
**Prioridad:** Alta
**Tiempo:** 1 hora
**Descripción:**
- Ordenar por prioridad (1-5)
- Drag & drop para reordenar
- Guardar orden en BD

---

#### WL-009: Notificaciones de Estado
**Prioridad:** Alta
**Tiempo:** 1 hora
**Descripción:**
- Notificar cuando producto está "en proceso"
- Notificar cuando es regalado
- Notificar cuando expira

---

## ARCHIVOS DE ESTE MÓDULO

```
features/wishlist/
├── components/
│   ├── WishlistGrid.tsx         # WL-003
│   ├── WishlistItem.tsx         # WL-002
│   ├── ProductStatusBadge.tsx   # WL-002
│   └── VisibilityToggle.tsx     # WL-003
├── actions/
│   ├── getWishlist.ts           # WL-004
│   ├── updateProductStatus.ts   # WL-004
│   └── updateVisibility.ts      # WL-004
├── hooks/
│   └── useWishlist.ts           # WL-005
├── lib/
│   └── wishlist-utils.ts        # WL-001
├── types/
│   └── wishlist.types.ts        # WL-001
├── README.md                     # WL-007
└── index.ts                      # WL-007

src/app/
└── (user)/
    └── wishlist/
        ├── page.tsx             # WL-006
        └── [id]/
            └── page.tsx         # WL-006
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** WL-001 → WL-002 → WL-003 → WL-004 → WL-005 → WL-006 → WL-007
- **Bloqueos:** WL-002 necesita WL-001, WL-003 necesita WL-002, etc.
- **Estados:** available, in_process, gifted, expired
- **Visibilidad:** private (solo yo), friends (amigos), public (todos)
- **Productos expirados:** Visibles pero sin botón de compra
- **Relación con Reservations:** wishlist.reservation_id → reservations.id

---

## FLUJO COMPLETO

**Usuario (Gestiona su wishlist):**
1. Va a /wishlist
2. Ve todos sus productos reservados
3. Productos expirados aparecen con warning (sin botón compra)
4. Puede filtrar por estado (disponible/proceso/regalado/expirado)
5. Puede cambiar visibilidad de cada producto (privado/amigos/público)
6. Puede cambiar estado manualmente (disponible → regalado si lo compró él mismo)
7. Click en producto → ve detalle completo
8. Desde detalle puede editar estado, visibilidad, y ver info de reserva

**Amigo (Ve wishlist de otro usuario):**
1. Ve productos según visibilidad configurada
2. Si producto = "in_process" → muestra "Alguien está comprando esto"
3. Si producto = "gifted" → no se muestra
4. Si producto = "expired" → se muestra con warning, sin botón compra

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Flujo completo funcionando
2. [ ] Ver productos reservados con estados
3. [ ] Filtrado por estado funcional
4. [ ] Cambio de visibilidad funcional
5. [ ] Productos expirados se muestran correctamente
6. [ ] README.md escrito (WL-007)
7. [ ] Actualizar PRD.md → estado Wishlist = READ-ONLY
8. [ ] Mover a claude.md → features/wishlist/* a PROHIBIDOS
9. [ ] Cambiar MÓDULO ACTUAL en claude.md → Friends-Network
10. [ ] Crear nuevo backlog en este archivo para Friends-Network

---

## MÓDULOS COMPLETADOS

✅ **Database** - Schema, types, RLS policies
✅ **Auth** - Login, register, middleware, permisos
✅ **Common** - UI components, layouts, hooks, utilidades
✅ **Product-Reservation** - QR generator, scanners, reservas, pago simulado

---

## MÓDULO ANTERIOR: Product-Reservation ✅ COMPLETADO

**Fecha completado:** 2025-11-17

**Tareas completadas:**
- ✅ PR-001: Types y Utilidades Base
- ✅ PR-002: QR Generator Component
- ✅ PR-003: Product Scanner (Comercial)
- ✅ PR-004: Crear Reserva con Pago
- ✅ PR-005: Páginas y Rutas
- ✅ PR-006: README y Documentación

**Funcionalidad entregada:**
- Generación de QR temporal (24h) para usuarios
- Escaneo de QR + código de barras con cámara
- Creación de productos on-the-fly si no existen
- Sistema de reservas con expiración 15 días
- Pago simulado de 1€ con split 50/50
- Páginas completas para usuarios (/qr, /reservations)
- Página completa para comerciales (/scan)
- Documentación completa del módulo
