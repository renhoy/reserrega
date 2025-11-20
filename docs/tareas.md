# Tareas - MÓDULO: Store-Panel

## MÓDULO ACTIVO: Store-Panel 🔴

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

#### SP-001: Types y Utilidades Base
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Definir types para StoreSession, ScanResult, StoreStats
- Utilidades para manejo de sesiones de tienda
- Helpers para validar códigos QR y códigos de barras
- Utils para calcular estadísticas de tienda

**Archivos a crear:**
- `features/store-panel/types/store.types.ts`
- `features/store-panel/lib/store-utils.ts`

**Criterio de aceptación:**
- [ ] Types completos con JSDoc
- [ ] StoreSession, ScanResult, StoreStats types
- [ ] Función validateQRCode() para validar QR de usuario
- [ ] Función validateBarcode() para validar códigos de producto
- [ ] Función calculateSessionDuration()
- [ ] Helpers para formatear stats de tienda

**Estado:** ⏸️ PENDIENTE

---

#### SP-002: Componentes de Escaneo
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- UserQRScanner para escanear QR de usuario
- ProductScanner para escanear códigos de barras
- SessionHeader con info de sesión activa
- Feedback visual de escaneos exitosos/fallidos

**Archivos a crear:**
- `features/store-panel/components/UserQRScanner.tsx`
- `features/store-panel/components/ProductScanner.tsx`
- `features/store-panel/components/SessionHeader.tsx`

**Criterio de aceptación:**
- [ ] UserQRScanner abre cámara y lee QR de usuario
- [ ] ProductScanner lee códigos de barras de productos
- [ ] SessionHeader muestra usuario actual y duración de sesión
- [ ] Feedback visual claro (success/error)
- [ ] Manejo de errores de cámara
- [ ] Responsive design

**Estado:** ⏸️ PENDIENTE

---

#### SP-003: Componentes de Gestión
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- ActiveReservations para ver reservas de la tienda
- DeliveryMarker para marcar productos como enviados
- StoreStats con métricas de tienda
- Filtros por estado de reserva

**Archivos a crear:**
- `features/store-panel/components/ActiveReservations.tsx`
- `features/store-panel/components/DeliveryMarker.tsx`
- `features/store-panel/components/StoreStats.tsx`

**Criterio de aceptación:**
- [ ] ActiveReservations muestra lista de reservas activas
- [ ] Filtros por estado (pending, confirmed, shipped)
- [ ] DeliveryMarker permite marcar como enviado
- [ ] StoreStats muestra métricas (total reservas, enviados, pendientes)
- [ ] Actualización en tiempo real
- [ ] Empty states cuando no hay datos

**Estado:** ⏸️ PENDIENTE

---

#### SP-004: Server Actions
**Prioridad:** Crítica
**Tiempo:** 4-5 horas
**Descripción:**
- scanUserQR - validar QR y crear sesión
- scanProduct - vincular producto a sesión
- getStoreReservations - obtener reservas de la tienda
- markAsShipped - marcar producto como enviado
- getStoreStats - obtener estadísticas de tienda
- endSession - finalizar sesión de escaneo

**Archivos a crear:**
- `features/store-panel/actions/store-panel.actions.ts`

**Criterio de aceptación:**
- [ ] scanUserQR valida QR y crea sesión temporal
- [ ] scanProduct vincula producto escaneado a usuario de sesión
- [ ] getStoreReservations filtra por store_id del comercial
- [ ] markAsShipped actualiza estado de reserva
- [ ] getStoreStats calcula métricas en tiempo real
- [ ] endSession limpia sesión y libera recursos
- [ ] Validación de permisos (solo rol Comercial)
- [ ] Manejo de errores robusto

**Estado:** ⏸️ PENDIENTE

---

#### SP-005: Hooks de Gestión
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- useStoreSession hook para gestionar sesión activa
- useProductScanner para manejar escaneo de productos
- useStoreReservations para listar reservas
- useStoreStats para estadísticas con polling
- Optimistic updates

**Archivos a crear:**
- `features/store-panel/hooks/use-store-session.ts`
- `features/store-panel/hooks/use-product-scanner.ts`
- `features/store-panel/hooks/use-store-reservations.ts`

**Criterio de aceptación:**
- [ ] useStoreSession gestiona sesión con timeout automático
- [ ] useProductScanner maneja estados de escaneo
- [ ] useStoreReservations con filtros y paginación
- [ ] useStoreStats con polling cada 30 segundos
- [ ] Optimistic updates en todas las acciones
- [ ] Auto-cleanup de recursos al desmontar

**Estado:** ⏸️ PENDIENTE

---

#### SP-006: Páginas y Rutas
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Dashboard de tienda (/store)
- Página de escaneo de usuario (/store/scan)
- Página de sesión activa (/store/session/[sessionId])
- Página de reservas (/store/reservations)
- Página de estadísticas (/store/stats)
- Protección de rutas (solo Comercial)

**Archivos a crear:**
- `src/app/(app)/store/page.tsx`
- `src/app/(app)/store/scan/page.tsx`
- `src/app/(app)/store/session/[sessionId]/page.tsx`
- `src/app/(app)/store/reservations/page.tsx`
- `src/app/(app)/store/stats/page.tsx`

**Criterio de aceptación:**
- [ ] /store muestra dashboard con accesos rápidos
- [ ] /store/scan permite escanear QR de usuario
- [ ] /store/session/[sessionId] muestra sesión activa con escaneo de productos
- [ ] /store/reservations muestra lista de reservas de la tienda
- [ ] /store/stats muestra estadísticas y métricas
- [ ] Protección con requireRole('Comercial')
- [ ] Verificar que comercial pertenece a tienda correcta
- [ ] Loading states y empty states

**Estado:** ⏸️ PENDIENTE

---

#### SP-007: README y Documentación
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- README del módulo
- Documentar flujo completo de escaneo
- Documentar sistema de sesiones
- Ejemplos de uso para comerciales

**Archivos a crear:**
- `features/store-panel/README.md`
- `features/store-panel/index.ts`

**Criterio de aceptación:**
- [ ] README completo con descripción del módulo
- [ ] Flujo de escaneo documentado paso a paso
- [ ] Sistema de sesiones explicado
- [ ] Ejemplos de uso para cada componente
- [ ] Exports organizados en index.ts
- [ ] Instrucciones para comerciales

**Estado:** ⏸️ PENDIENTE

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### SP-008: Notificaciones Push
**Prioridad:** Alta
**Tiempo:** 2 horas
**Descripción:**
- Notificar al comercial cuando hay nueva reserva
- Notificar al usuario cuando se marca como enviado
- Badge con reservas pendientes

---

#### SP-009: Historial de Sesiones
**Prioridad:** Alta
**Tiempo:** 2-3 horas
**Descripción:**
- Ver historial de sesiones de escaneo
- Estadísticas por comercial
- Reporte de productos escaneados por día

---

## ARCHIVOS DE ESTE MÓDULO

```
features/store-panel/
├── components/
│   ├── UserQRScanner.tsx         # SP-002
│   ├── ProductScanner.tsx        # SP-002
│   ├── SessionHeader.tsx         # SP-002
│   ├── ActiveReservations.tsx    # SP-003
│   ├── DeliveryMarker.tsx        # SP-003
│   └── StoreStats.tsx            # SP-003
├── actions/
│   └── store-panel.actions.ts    # SP-004
├── hooks/
│   ├── use-store-session.ts      # SP-005
│   ├── use-product-scanner.ts    # SP-005
│   └── use-store-reservations.ts # SP-005
├── lib/
│   └── store-utils.ts            # SP-001
├── types/
│   └── store.types.ts            # SP-001
├── README.md                      # SP-007
└── index.ts                       # SP-007

src/app/
└── (app)/
    └── store/
        ├── page.tsx                           # SP-006
        ├── scan/page.tsx                      # SP-006
        ├── session/
        │   └── [sessionId]/page.tsx          # SP-006
        ├── reservations/
        │   └── page.tsx                       # SP-006
        └── stats/
            └── page.tsx                       # SP-006
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** SP-001 → SP-002 → SP-003 → SP-004 → SP-005 → SP-006 → SP-007
- **Bloqueos:** SP-002 necesita SP-001, SP-003 necesita SP-001, etc.
- **Rol requerido:** Comercial (verificar con requireRole)
- **Multi-tenancy:** Comercial solo ve reservas de su tienda (filtrar por store_id)
- **Sesiones:** Timeout de 10 minutos de inactividad
- **QR de usuario:** Reutilizar QRGenerator del módulo product-reservation
- **Estados de reserva:** pending, confirmed, shipped, delivered

---

## FLUJO COMPLETO

### Flujo Principal: Escaneo y Reserva

1. Comercial abre /store/scan
2. Escanea QR del usuario → crea sesión temporal
3. Redirige a /store/session/[sessionId]
4. Muestra info del usuario y botón "Escanear Producto"
5. Escanea código de barras de productos
6. Cada producto escaneado se vincula al usuario
7. Confirma lista de productos → crea reserva
8. Usuario ve productos en su wishlist
9. Comercial puede marcar productos como enviados desde /store/reservations

### Gestión de Reservas

1. Comercial va a /store/reservations
2. Ve lista de reservas activas de su tienda
3. Filtros por estado (pending, confirmed, shipped)
4. Selecciona reserva y marca como shipped
5. Estado se actualiza en tiempo real
6. Usuario recibe notificación (opcional)

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Flujo completo de escaneo funcionando
2. [ ] Sesiones con timeout automático
3. [ ] Solo rol Comercial puede acceder
4. [ ] Filtrado por tienda (multi-tenancy)
5. [ ] Marcar como enviado funcional
6. [ ] Estadísticas de tienda en tiempo real
7. [ ] README.md escrito (SP-007)
8. [ ] Actualizar PRD.md → estado Store-Panel = READ-ONLY
9. [ ] Mover a claude.md → features/store-panel/* a PROHIBIDOS
10. [ ] Cambiar MÓDULO ACTUAL en claude.md → Admin-Dashboard
11. [ ] Crear nuevo backlog en este archivo para Admin-Dashboard

---

## MÓDULOS COMPLETADOS

✅ **Database** - Schema, types, RLS policies
✅ **Auth** - Login, register, middleware, permisos
✅ **Common** - UI components, layouts, hooks, utilidades
✅ **Product-Reservation** - QR generator, scanners, reservas, pago simulado
✅ **Wishlist** - Grid, filtros, visibilidad, badges, páginas usuario
✅ **Friends-Network** - Solicitudes amistad, búsqueda usuarios, invitaciones email
✅ **Gift-Flow** - Ver wishlist amigos, bloqueo temporal, checkout, confirmación, historial

---

## MÓDULO ANTERIOR: Gift-Flow ✅ COMPLETADO

**Fecha completado:** 2025-01-17

**Tareas completadas:**
- ✅ GF-001: Types y Utilidades Base
- ✅ GF-002: Componentes de Selección
- ✅ GF-003: Componentes de Checkout
- ✅ GF-004: Server Actions
- ✅ GF-005: Hooks de Gestión
- ✅ GF-006: Páginas y Rutas
- ✅ GF-007: README y Documentación

**Funcionalidad entregada:**
- Ver wishlist de amigos con verificación de permisos
- Selección de productos con bloqueo temporal (15 minutos)
- Sistema de bloqueo automático con countdown
- Checkout con pago simulado y validaciones
- Confirmación de entrega y tracking
- Historial de regalos enviados y recibidos
- Páginas /gift/[friendId], /gift/[friendId]/checkout, /gift/history
- Hooks personalizados (useGiftFlow, useGiftLock, useDeliveryTracking, useGiftHistory)
- Liberación automática de bloqueos expirados
- Optimistic UI updates en todas las acciones
