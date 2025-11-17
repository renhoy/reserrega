# Tareas - MÓDULO: Gift-Flow

## MÓDULO ACTIVO: Gift-Flow 🔴

**Tareas Activas:** 4/7
**Progreso:** 57%

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

#### GF-001: Types y Utilidades Base
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Definir types para Gift, GiftLock, GiftTransaction
- Utilidades para bloqueo temporal de productos
- Helpers para calcular tiempos de bloqueo
- Utils para validar estados de regalo

**Archivos a crear:**
- `features/gift-flow/types/gift.types.ts`
- `features/gift-flow/lib/gift-utils.ts`

**Criterio de aceptación:**
- [x] Types completos con JSDoc
- [x] Gift, GiftLock, GiftTransaction types
- [x] Función lockGiftItem() con timeout
- [x] Función releaseLock()
- [x] Función calculateLockExpiration()
- [x] Helpers para formatear estados de regalo

**Estado:** ✅ COMPLETADA (2025-01-17)

---

#### GF-002: Componentes de Selección
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- GiftSelectionCard para mostrar productos del wishlist
- Indicador de producto bloqueado por otro usuario
- Botón de seleccionar/desbloquear
- Badge con tiempo restante de bloqueo

**Archivos a crear:**
- `features/gift-flow/components/GiftSelectionCard.tsx`
- `features/gift-flow/components/FriendWishlistView.tsx`

**Criterio de aceptación:**
- [x] GiftSelectionCard muestra info del producto
- [x] Indicador visual de productos bloqueados
- [x] Badge con countdown de bloqueo
- [x] Botón seleccionar funcional
- [x] Solo mostrar productos disponibles del wishlist
- [x] Responsive design

**Estado:** ✅ COMPLETADA (2025-01-17)

---

#### GF-003: Componentes de Checkout
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- GiftCheckoutForm con datos de pago simulado
- Resumen del producto seleccionado
- Confirmación antes de completar
- GiftConfirmation con detalles de la orden

**Archivos a crear:**
- `features/gift-flow/components/GiftCheckoutForm.tsx`
- `features/gift-flow/components/GiftConfirmation.tsx`
- `features/gift-flow/components/GiftSummary.tsx`

**Criterio de aceptación:**
- [x] Formulario de pago simulado
- [x] Resumen del producto y precio
- [x] Confirmación de orden
- [x] GiftConfirmation muestra número de orden
- [x] Info de tracking
- [x] Email de confirmación (simulado)

**Estado:** ✅ COMPLETADA (2025-01-17)

---

#### GF-004: Server Actions
**Prioridad:** Crítica
**Tiempo:** 4-5 horas
**Descripción:**
- viewFriendWishlist - ver wishlist de un amigo
- lockGiftItem - bloquear producto temporalmente
- processGiftPayment - procesar pago simulado
- confirmGiftDelivery - marcar como entregado
- getGiftHistory - historial de regalos enviados
- releaseExpiredLocks - liberar bloqueos expirados

**Archivos a crear:**
- `features/gift-flow/actions/gift-flow.actions.ts`

**Criterio de aceptación:**
- [x] viewFriendWishlist verifica que sean amigos
- [x] lockGiftItem bloquea por 15 minutos
- [x] processGiftPayment actualiza estados (available → in_process)
- [x] confirmGiftDelivery marca como gifted
- [x] getGiftHistory muestra regalos enviados
- [x] releaseExpiredLocks limpia bloqueos antiguos
- [x] Validación de permisos en todas las acciones

**Estado:** ✅ COMPLETADA (2025-01-17)

---

#### GF-005: Hooks de Gestión
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- useGiftFlow hook para gestionar flujo completo
- useGiftLock para manejar bloqueos
- useDeliveryTracking para seguimiento
- useGiftHistory para historial
- Optimistic updates

**Archivos a crear:**
- `features/gift-flow/hooks/use-gift-flow.ts`

**Criterio de aceptación:**
- [ ] useGiftFlow con estados (viewing, selecting, checkout, confirmed)
- [ ] useGiftLock con countdown timer
- [ ] useDeliveryTracking con polling
- [ ] useGiftHistory con paginación
- [ ] Optimistic updates en todas las acciones
- [ ] Auto-release de bloqueos al salir

---

#### GF-006: Páginas y Rutas
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Página de wishlist de amigo (/gift/[friendId])
- Página de checkout (/gift/[friendId]/checkout)
- Página de historial de regalos (/gift/history)
- Protección de rutas

**Archivos a crear:**
- `src/app/(app)/gift/[friendId]/page.tsx`
- `src/app/(app)/gift/[friendId]/checkout/page.tsx`
- `src/app/(app)/gift/history/page.tsx`

**Criterio de aceptación:**
- [ ] /gift/[friendId] muestra wishlist del amigo
- [ ] Solo productos available/in_process visibles
- [ ] /gift/[friendId]/checkout muestra formulario de pago
- [ ] /gift/history muestra regalos enviados
- [ ] Protección con requireAuth()
- [ ] Verificar que sean amigos antes de mostrar wishlist
- [ ] Loading states y empty states

---

#### GF-007: README y Documentación
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- README del módulo
- Documentar flujo completo de regalo
- Documentar sistema de bloqueo
- Ejemplos de uso

**Archivos a crear:**
- `features/gift-flow/README.md`
- `features/gift-flow/index.ts`

**Criterio de aceptación:**
- [ ] README completo
- [ ] Flujo de regalo documentado paso a paso
- [ ] Sistema de bloqueo explicado
- [ ] Ejemplos de uso
- [ ] Exports organizados

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### GF-008: Notificaciones de Regalo
**Prioridad:** Alta
**Tiempo:** 2 horas
**Descripción:**
- Notificar al receptor cuando alguien regala
- Notificar al remitente cuando se entrega
- Badge con productos en proceso

---

#### GF-009: Vaquitas (Crowdfunding)
**Prioridad:** Alta
**Tiempo:** 4-5 horas
**Descripción:**
- Permitir contribuciones parciales
- Pool de contribuyentes
- Liberar pago cuando se completa objetivo
- Refund si no se completa en tiempo

---

## ARCHIVOS DE ESTE MÓDULO

```
features/gift-flow/
├── components/
│   ├── GiftSelectionCard.tsx        # GF-002
│   ├── FriendWishlistView.tsx       # GF-002
│   ├── GiftCheckoutForm.tsx         # GF-003
│   ├── GiftConfirmation.tsx         # GF-003
│   ├── GiftSummary.tsx              # GF-003
│   ├── DeliveryTracking.tsx         # GF-005
│   └── GiftHistory.tsx              # GF-005
├── actions/
│   └── gift-flow.actions.ts         # GF-004
├── hooks/
│   └── use-gift-flow.ts             # GF-005
├── lib/
│   └── gift-utils.ts                # GF-001
├── types/
│   └── gift.types.ts                # GF-001
├── README.md                         # GF-007
└── index.ts                          # GF-007

src/app/
└── (app)/
    └── gift/
        ├── [friendId]/
        │   ├── page.tsx             # GF-006
        │   └── checkout/
        │       └── page.tsx         # GF-006
        └── history/
            └── page.tsx             # GF-006
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** GF-001 → GF-002 → GF-003 → GF-004 → GF-005 → GF-006 → GF-007
- **Bloqueos:** GF-002 necesita GF-001, GF-003 necesita GF-001, etc.
- **Estados de producto:** available, in_process, gifted, expired
- **Bloqueo temporal:** 15 minutos para completar compra
- **Tabla gift_locks:** Registra bloqueos temporales con expiración
- **Tabla gifts:** Registra regalos completados (giver_id, receiver_id, product_id, status)
- **Verificación:** Solo amigos pueden ver wishlists con visibilidad "friends"

---

## FLUJO COMPLETO

### Flujo Principal: Regalar un Producto

1. Usuario va a /friends y selecciona un amigo
2. Click en "Ver wishlist" → redirige a /gift/[friendId]
3. Ve productos available e in_process del amigo
4. Selecciona un producto → se bloquea temporalmente (15 min)
5. Sistema verifica que producto está available
6. Redirige a /gift/[friendId]/checkout
7. Formulario de pago simulado con countdown de bloqueo
8. Confirma pago → estado cambia a in_process
9. Registro en tabla gifts (giver_id, receiver_id, product_id)
10. Página de confirmación con número de orden
11. Amigo ve producto como "in_process" en su wishlist
12. Comercial marca como entregado
13. Estado cambia a gifted
14. Notificación al remitente y receptor

### Bloqueo Temporal

- Duración: 15 minutos
- Propósito: Evitar que varios amigos compren el mismo regalo
- Liberación automática: Si no completa checkout en 15 min
- Visible para otros: Badge "Alguien está regalando esto" en el producto

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Flujo completo funcionando (ver wishlist, seleccionar, pagar)
2. [ ] Bloqueo temporal funcional con countdown
3. [ ] Solo amigos pueden ver wishlists
4. [ ] Checkout con pago simulado
5. [ ] Confirmación de regalo funcional
6. [ ] Historial de regalos enviados
7. [ ] README.md escrito (GF-007)
8. [ ] Actualizar PRD.md → estado Gift-Flow = READ-ONLY
9. [ ] Mover a claude.md → features/gift-flow/* a PROHIBIDOS
10. [ ] Cambiar MÓDULO ACTUAL en claude.md → Store-Panel
11. [ ] Crear nuevo backlog en este archivo para Store-Panel

---

## MÓDULOS COMPLETADOS

✅ **Database** - Schema, types, RLS policies
✅ **Auth** - Login, register, middleware, permisos
✅ **Common** - UI components, layouts, hooks, utilidades
✅ **Product-Reservation** - QR generator, scanners, reservas, pago simulado
✅ **Wishlist** - Grid, filtros, visibilidad, badges, páginas usuario
✅ **Friends-Network** - Solicitudes amistad, búsqueda usuarios, invitaciones email

---

## MÓDULO ANTERIOR: Friends-Network ✅ COMPLETADO

**Fecha completado:** 2025-01-17

**Tareas completadas:**
- ✅ FN-001: Types y Utilidades Base
- ✅ FN-002: Componentes de Solicitudes
- ✅ FN-003: Componentes de Lista y Búsqueda
- ✅ FN-004: Server Actions
- ✅ FN-005: Hooks de Gestión
- ✅ FN-006: Páginas y Rutas
- ✅ FN-007: README y Documentación

**Funcionalidad entregada:**
- Solicitudes de amistad (enviar, aceptar, rechazar, cancelar)
- Búsqueda de usuarios con estado de amistad
- Invitaciones por email con tokens seguros (7 días expiración)
- Gestión de red de amigos bidireccional
- Páginas /friends, /friends/requests, /friends/invite
- Hooks personalizados (useFriends, useFriendRequests, useUserSearch, useInvitation)
- Validación de permisos y prevención de duplicados
- Debounce personalizado sin dependencias externas
