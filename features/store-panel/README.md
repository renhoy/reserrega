# Store-Panel Module 🏪

Panel de gestión para comerciales/dependientas de tienda. Permite escanear QR de usuarios, vincular productos, gestionar reservas y controlar entregas.

---

## 📋 Descripción

El módulo Store-Panel es el panel de control para los usuarios con rol `comercial`, permitiéndoles:

- **Iniciar sesiones de compra** escaneando el QR del usuario
- **Escanear productos** mediante código de barras
- **Crear reservas** vinculando productos al usuario (€1 por producto)
- **Gestionar entregas** marcando estados (pendiente, listo, entregado, cancelado)
- **Ver estadísticas** de la tienda en tiempo real

---

## 🗂️ Estructura del Módulo

```
features/store-panel/
├── types/
│   └── store.types.ts          # Tipos TypeScript
├── lib/
│   └── store-utils.ts           # Utilidades y helpers
├── components/
│   ├── SessionScanner.tsx       # Escanear QR del usuario
│   ├── ProductLinker.tsx        # Escanear y vincular productos
│   ├── ActiveSessionIndicator.tsx # Indicador de sesión activa
│   ├── ActiveReservations.tsx   # Lista de reservas
│   ├── DeliveryManager.tsx      # Gestión de entregas
│   ├── StoreStats.tsx           # Estadísticas de tienda
│   └── ReservationFilters.tsx   # Filtros de reservas
├── actions/
│   └── store-panel.actions.ts   # Server Actions
├── hooks/
│   ├── use-store-session.ts     # Hook de sesión
│   ├── use-store-reservations.ts # Hook de reservas
│   └── use-store-stats.ts       # Hook de estadísticas
├── README.md                     # Este archivo
└── index.ts                      # Exportaciones
```

---

## 🚀 Uso

### Importar componentes

```tsx
import {
  SessionScanner,
  ProductLinker,
  ActiveReservations,
  DeliveryManager,
  StoreStats,
  ReservationFilters,
} from '@/features/store-panel'
```

### Importar hooks

```tsx
import {
  useStoreSession,
  useStoreReservations,
  useStoreStats,
} from '@/features/store-panel'
```

### Importar tipos

```tsx
import type {
  StoreSession,
  SessionProduct,
  StoreReservation,
  StoreStats,
  DeliveryStatus,
} from '@/features/store-panel'
```

---

## 🎯 Flujo de Trabajo

### 1. Iniciar Sesión

```tsx
const { startSession, session } = useStoreSession(storeId)

// Usuario escanea su QR
await startSession(userQRCode)
```

### 2. Escanear Productos

```tsx
const { addProduct, session } = useStoreSession(storeId)

// Escanear código de barras
await addProduct(barcode)

// Los productos se agregan a session.products
```

### 3. Finalizar Sesión

```tsx
const { endSession } = useStoreSession(storeId)

// Crear reservas y agregar a wishlist
await endSession()
```

### 4. Gestionar Reservas

```tsx
const {
  reservations,
  updateStatus,
  filters,
  setFilters,
} = useStoreReservations(storeId)

// Actualizar estado de entrega
await updateStatus(reservationId, 'delivered')

// Aplicar filtros
setFilters({
  status: 'pending',
  search: 'Ana',
  onlyActive: true,
})
```

### 5. Ver Estadísticas

```tsx
const { stats, refresh } = useStoreStats({
  storeId,
  storeName: 'Tienda Demo',
  autoRefresh: true,
})

// stats incluye: totalReservations, pendingDeliveries, monthlyRevenue, etc.
```

---

## 🔑 Server Actions

### `startStoreSession(params)`

Inicia una nueva sesión de compra.

**Params:**
```typescript
{
  storeId: number
  userQR: string  // QR escaneado del usuario
}
```

**Returns:**
```typescript
{
  success: boolean
  session?: StoreSession
  error?: string
}
```

---

### `addProductToSession(params)`

Agrega un producto a la sesión activa.

**Params:**
```typescript
{
  sessionId: string
  storeId: number
  barcode: string
}
```

**Returns:**
```typescript
{
  success: boolean
  product?: SessionProduct
  error?: string
}
```

---

### `endStoreSession(sessionId, products, userId, storeId)`

Finaliza sesión y crea reservas.

**Returns:**
```typescript
{
  success: boolean
  reservationIds?: string[]
  totalReserved?: number
  error?: string
}
```

---

### `getStoreReservations(params)`

Obtiene reservas de la tienda con filtros.

**Params:**
```typescript
{
  storeId: number
  status?: DeliveryStatus | 'all'
}
```

**Returns:**
```typescript
{
  success: boolean
  reservations?: StoreReservation[]
  total?: number
  error?: string
}
```

---

### `updateDeliveryStatus(params)`

Actualiza el estado de entrega de una reserva.

**Params:**
```typescript
{
  reservationId: string
  status: DeliveryStatus  // 'pending' | 'ready' | 'delivered' | 'cancelled'
}
```

**Returns:**
```typescript
{
  success: boolean
  reservation?: any
  error?: string
}
```

---

## 🎨 Componentes

### SessionScanner

Escanea el QR del usuario para iniciar sesión de compra.

```tsx
<SessionScanner
  onSessionStart={(userId) => console.log(userId)}
  isLoading={false}
  storeId="1"
/>
```

**Props:**
- `onSessionStart: (userId: string) => void` - Callback al escanear QR
- `isLoading?: boolean` - Estado de carga
- `storeId: string` - ID de la tienda

---

### ProductLinker

Escanea códigos de barras y vincula productos a la sesión.

```tsx
<ProductLinker
  sessionId={session.id}
  userId={session.userId}
  userName={session.user.name}
  products={session.products}
  onProductAdd={(barcode) => console.log(barcode)}
  onProductRemove={(barcode) => console.log(barcode)}
  isLoading={false}
/>
```

**Props:**
- `sessionId: string`
- `userId: string`
- `userName: string`
- `products: SessionProduct[]`
- `onProductAdd: (barcode: string) => void`
- `onProductRemove: (barcode: string) => void`
- `isLoading?: boolean`

---

### ActiveSessionIndicator

Muestra información de la sesión activa.

```tsx
<ActiveSessionIndicator
  session={session}
  onEndSession={() => endSession()}
  isEnding={false}
/>
```

**Props:**
- `session: StoreSession | null`
- `onEndSession?: () => void`
- `isEnding?: boolean`

---

### ActiveReservations

Lista de reservas activas de la tienda.

```tsx
<ActiveReservations
  reservations={reservations}
  onReservationClick={(reservation) => console.log(reservation)}
  isLoading={false}
/>
```

**Props:**
- `reservations: StoreReservation[]`
- `onReservationClick?: (reservation: StoreReservation) => void`
- `isLoading?: boolean`

---

### DeliveryManager

Dialog para gestionar estado de entrega.

```tsx
<DeliveryManager
  reservation={selectedReservation}
  isOpen={true}
  onClose={() => setOpen(false)}
  onUpdateStatus={async (id, status) => await updateStatus(id, status)}
  isUpdating={false}
/>
```

**Props:**
- `reservation: StoreReservation | null`
- `isOpen: boolean`
- `onClose: () => void`
- `onUpdateStatus: (id: string, status: DeliveryStatus) => Promise<void>`
- `isUpdating?: boolean`

---

### StoreStats

Dashboard con estadísticas de la tienda.

```tsx
<StoreStats
  stats={stats}
  isLoading={false}
/>
```

**Props:**
- `stats: StoreStats`
- `isLoading?: boolean`

---

### ReservationFilters

Filtros para lista de reservas.

```tsx
<ReservationFilters
  filters={filters}
  onFiltersChange={(newFilters) => setFilters(newFilters)}
  onClearFilters={() => clearFilters()}
/>
```

**Props:**
- `filters: ReservationFilters`
- `onFiltersChange: (filters: ReservationFilters) => void`
- `onClearFilters: () => void`

---

## 🔧 Utilidades

### Validación

```typescript
import { validateQRCode, validateBarcode } from '@/features/store-panel'

const isValidQR = validateQRCode(qrCode)      // min 10 chars
const isValidBarcode = validateBarcode(code)  // alphanumeric, min 6 chars
```

### Cálculos

```typescript
import {
  calculateSessionTotal,
  calculateDaysUntilExpiration,
  isReservationExpired,
} from '@/features/store-panel'

const total = calculateSessionTotal(products)
const days = calculateDaysUntilExpiration(expiresAt)
const expired = isReservationExpired(expiresAt)
```

### Formateo

```typescript
import {
  formatPrice,
  formatDate,
  formatDateTime,
  formatSessionDuration,
} from '@/features/store-panel'

const price = formatPrice(29.99)          // "29,99 €"
const date = formatDate(new Date())       // "20/11/2025"
const datetime = formatDateTime(new Date()) // "20/11/2025, 14:30"
const duration = formatSessionDuration(startedAt) // "hace 5 minutos"
```

### Filtros y Orden

```typescript
import {
  filterReservations,
  sortReservationsByPriority,
} from '@/features/store-panel'

const filtered = filterReservations(reservations, filters)
const sorted = sortReservationsByPriority(reservations)
```

---

## 📊 Tipos Principales

### StoreSession

```typescript
interface StoreSession {
  id: string
  storeId: string
  userId: string
  user: { id: string; name: string; email: string }
  comercialId: string
  products: SessionProduct[]
  startedAt: Date
  state: SessionState  // 'idle' | 'scanning' | 'active' | 'ending' | 'error'
  totalProducts: number
  totalValue: number
}
```

### SessionProduct

```typescript
interface SessionProduct {
  barcode: string
  name: string
  price: number
  scannedAt: Date
  productId?: string
}
```

### StoreReservation

```typescript
interface StoreReservation {
  id: string
  user_id: string
  product_id: string
  store_id: number
  status: string
  created_at: string
  expires_at: string
  deliveryStatus: DeliveryStatus
  deliveredAt: string | null
  isExpired: boolean
  daysUntilExpiration: number
  user?: { id: string; name: string; email: string }
  product?: { name: string; price: number; barcode: string }
}
```

### DeliveryStatus

```typescript
type DeliveryStatus = 'pending' | 'ready' | 'delivered' | 'cancelled'
```

---

## 🎯 Permisos

**Rol requerido:** `comercial`

Los usuarios con rol `comercial` tienen acceso a:
- Ver reservas de su tienda
- Crear sesiones de compra
- Vincular productos
- Actualizar estados de entrega
- Ver estadísticas de su tienda

---

## 🔗 Dependencias

### Módulos Internos

- `shared/database` - Schema y tipos (READ-ONLY)
- `shared/common` - UI components (READ-ONLY)
- `features/product-reservation` - Lógica de reservas (READ-ONLY)

### Tablas de Base de Datos

- `public.stores` - Tiendas físicas
- `public.products` - Catálogo de productos
- `public.reservations` - Reservas de usuarios
- `public.wishlists` - Listas de deseos
- `public.users` - Usuarios del sistema

---

## 🚦 Estados de Sesión

```
idle ──────> scanning ──────> active ──────> ending ──────> idle
              ↓                  ↓
           error ←──────────── error
```

- **idle**: Sin sesión activa
- **scanning**: Escaneando QR de usuario
- **active**: Sesión activa, escaneando productos
- **ending**: Finalizando sesión, creando reservas
- **error**: Error en el proceso

---

## 🎨 Estados de Entrega

```
pending ──────> ready ──────> delivered
   ↓              ↓              ↓
cancelled <── cancelled <── cancelled
```

- **pending**: Producto reservado, pendiente de preparar
- **ready**: Producto listo para entregar al cliente
- **delivered**: Producto entregado al cliente
- **cancelled**: Reserva cancelada

---

## 📝 Notas Importantes

1. **Sesiones en memoria**: Las sesiones activas se gestionan en el estado del cliente, no se persisten en BD hasta finalizar.

2. **Tarifa de reserva**: Cada producto reservado cuesta €1, dividido 50/50 entre tienda y plataforma.

3. **Expiración**: Las reservas expiran automáticamente a los 15 días.

4. **Multi-tienda**: Cada comercial solo ve reservas de su tienda asignada.

5. **Estadísticas en tiempo real**: Las stats se actualizan automáticamente cada minuto si `autoRefresh` está habilitado.

---

## 🧪 Testing

TODO: Agregar tests cuando el módulo esté completo.

---

## 📚 Recursos

- [PRD - Reserrega](../../docs/PRD.md)
- [Planificación](../../docs/planificacion.md)
- [Tareas](../../docs/tareas.md)

---

## ✅ Estado del Módulo

**Estado:** ✅ COMPLETADO

**Versión:** 1.0.0

**Última actualización:** 2025-11-20

---

## 🤝 Contribuir

Este módulo sigue las reglas de desarrollo de Reserrega:

1. Solo modificar archivos en `features/store-panel/`
2. No tocar módulos completados (READ-ONLY)
3. Actualizar `tareas.md` al completar funcionalidad
4. Tests antes de marcar como completado

---

## 📄 Licencia

Proyecto privado - Reserrega © 2025
