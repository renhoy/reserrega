# Gift-Flow Module

Módulo completo para el flujo de regalos entre amigos en Reserrega.

## 📋 Descripción

El módulo Gift-Flow permite a los usuarios regalar productos de la wishlist de sus amigos. Incluye un sistema de bloqueo temporal, checkout simulado, confirmación de entrega y historial de regalos.

## 🎯 Funcionalidades

### 1. Visualización de Wishlist de Amigos
- Ver productos disponibles de amigos
- Solo visible para usuarios conectados como amigos
- Respeta configuración de visibilidad (friends/public)
- Estados: disponible, en proceso, bloqueado

### 2. Sistema de Bloqueo Temporal
- Bloqueo de 15 minutos al seleccionar un producto
- Countdown timer en tiempo real
- Previene doble-gifting
- Auto-liberación al expirar
- Cancelación manual

### 3. Proceso de Checkout
- Formulario de pago simulado (MVP)
- Métodos: Tarjeta de crédito, PayPal
- Validación de campos
- Mensaje personal opcional (500 caracteres)
- Resumen visual del regalo

### 4. Confirmación y Tracking
- Número de orden único (GF-XXXXXX)
- Confirmación por email (simulado)
- Estados de envío (pending, shipped, delivered)
- Timeline del proceso

### 5. Historial de Regalos
- Regalos enviados con estado de entrega
- Regalos recibidos con información del remitente
- Filtros y estadísticas
- Tabs para enviados/recibidos

## 📁 Estructura

```
features/gift-flow/
├── actions/
│   └── gift-flow.actions.ts         # Server actions
├── components/
│   ├── GiftSelectionCard.tsx        # Card de producto para regalar
│   ├── FriendWishlistView.tsx       # Vista de wishlist completa
│   ├── LockTimerBadge.tsx          # Badge con countdown
│   ├── GiftCheckoutForm.tsx        # Formulario de pago
│   ├── GiftSummary.tsx             # Resumen del regalo
│   └── GiftConfirmation.tsx        # Página de confirmación
├── hooks/
│   └── use-gift-flow.ts            # Custom hooks
├── lib/
│   └── gift-utils.ts               # Utilidades
├── types/
│   └── gift.types.ts               # TypeScript types
├── README.md                        # Este archivo
└── index.ts                        # Barrel exports
```

## 🔧 Server Actions

### `viewFriendWishlist(friendId: string)`
Obtiene la wishlist de un amigo con productos disponibles para regalar.

**Validaciones:**
- Usuario autenticado
- Amistad verificada (bidireccional)
- Solo productos con visibilidad friends/public
- Solo estados available/in_process

**Retorna:**
```typescript
{
  success: boolean
  data?: FriendWishlist
  error?: string
}
```

### `lockGiftItem(wishlistItemId: string)`
Bloquea un producto temporalmente (15 minutos) para checkout.

**Validaciones:**
- Usuario autenticado
- Producto disponible (status === 'available')
- Usuario es amigo del owner
- No hay bloqueo existente por otro usuario

**Retorna:**
```typescript
{
  success: boolean
  data?: {
    lockExpiresAt: Date
    checkoutSession: GiftCheckoutSession
  }
  error?: string
}
```

### `processGiftPayment(formData: GiftPaymentFormData)`
Procesa el pago del regalo (simulado para MVP).

**Proceso:**
1. Verifica bloqueo no expirado
2. Actualiza payment_status a 'completed'
3. Limpia locked_until
4. Actualiza wishlist status: available → in_process
5. Genera número de orden

**Retorna:**
```typescript
{
  success: boolean
  data?: {
    giftId: string
    orderNumber: string
    gift: GiftWithDetails
  }
  error?: string
}
```

### `confirmGiftDelivery(giftId: string)`
Confirma la entrega del regalo.

**Validaciones:**
- Usuario es buyer o recipient
- payment_status === 'completed'

**Proceso:**
1. Actualiza shipping_status a 'delivered'
2. Registra delivered_at timestamp
3. Actualiza wishlist status: in_process → gifted

**Retorna:**
```typescript
{
  success: boolean
  data?: { gift: GiftWithDetails }
  error?: string
}
```

### `getGiftHistory()`
Obtiene historial de regalos enviados y recibidos.

**Filtros:**
- Solo gifts con payment completed
- Excluye locks pendientes
- Ordena por created_at descendente

**Retorna:**
```typescript
{
  success: boolean
  data?: {
    sent: GiftSummary[]
    received: ReceivedGift[]
    totalSent: number
    totalReceived: number
  }
  error?: string
}
```

### `releaseExpiredLocks()`
Limpia bloqueos expirados (job automático).

**Proceso:**
- Elimina gifts con locked_until < now
- Solo gifts con payment_status === 'pending'

### `releaseLock(wishlistItemId: string)`
Cancela bloqueo manual por usuario.

**Uso:** Cancelar checkout antes de completar pago.

## 🎣 Hooks

### `useFriendWishlist(friendId: string)`
Hook para cargar wishlist de un amigo.

```typescript
const { wishlist, isLoading, error, reload } = useFriendWishlist(friendId)
```

### `useGiftCheckout()`
Hook para gestionar checkout de regalo.

```typescript
const {
  checkoutSession,
  isLocking,
  isProcessing,
  completedGift,
  orderNumber,
  lockItem,
  cancelCheckout,
  processPayment,
} = useGiftCheckout()
```

### `useGiftHistory()`
Hook para cargar historial de regalos.

```typescript
const {
  sentGifts,
  receivedGifts,
  totalSent,
  totalReceived,
  isLoading,
  reload,
} = useGiftHistory()
```

### `useDeliveryConfirmation()`
Hook para confirmar entregas.

```typescript
const { confirmDelivery, isConfirming } = useDeliveryConfirmation()
```

### `useGiftFlow(friendId?)`
Hook completo que combina todos los sub-hooks.

```typescript
const {
  stage,                    // 'viewing' | 'selecting' | 'checkout' | 'processing' | 'confirmed'
  wishlist,
  isLoadingWishlist,
  checkoutSession,
  isLocking,
  isProcessing,
  completedGift,
  orderNumber,
  selectItemForGift,
  cancelSelection,
  completePayment,
  reloadWishlist,
} = useGiftFlow(friendId)
```

## 🛣️ Rutas

### `/gift/[friendId]`
Página de wishlist del amigo.

**Funcionalidades:**
- Ver productos disponibles para regalar
- Seleccionar producto → bloqueo + redirect a checkout
- Cancelar bloqueo existente
- Continuar con checkout existente

### `/gift/[friendId]/checkout`
Página de checkout.

**Query params:**
- `item`: ID del wishlist item

**Funcionalidades:**
- Formulario de pago simulado
- Countdown de bloqueo
- Resumen del regalo
- Cancelar y volver

### `/gift/confirmation`
Página de confirmación de pedido.

**Query params:**
- `order`: Número de orden
- `gift`: ID del regalo

**Funcionalidades:**
- Muestra confirmación exitosa
- Número de orden prominente
- Detalles completos del regalo
- Timeline "¿Qué sigue?"

### `/gift/history`
Página de historial de regalos.

**Funcionalidades:**
- Tabs: Enviados / Recibidos
- Cards con detalles completos
- Estados de envío
- Estadísticas globales

## 🔑 Types Principales

### `GiftableWishlistItem`
Producto de wishlist visible para regalar.

```typescript
interface GiftableWishlistItem {
  id: string
  product: ProductInfo
  store: StoreInfo
  status: WishlistStatus
  priority: number | null
  notes: string | null
  lockStatus: LockStatus
}
```

### `GiftCheckoutSession`
Sesión de checkout con producto bloqueado.

```typescript
interface GiftCheckoutSession {
  wishlistItemId: string
  product: Product
  recipient: UserInfo
  store: Store
  lockExpiresAt: Date
  amount: number
}
```

### `LockStatus`
Estado de bloqueo de un producto.

```typescript
interface LockStatus {
  isLocked: boolean
  lockedBy: string | null
  lockedUntil: Date | null
  timeRemaining: number | null
  canRelease: boolean
}
```

## 🎨 Componentes

### `<GiftSelectionCard>`
Card de producto con estados de bloqueo.

**Props:**
- `item`: GiftableWishlistItem
- `currentUserId`: string
- `onSelectGift`: (itemId) => void
- `onReleaseLock`: (itemId) => void
- `onContinueCheckout`: (itemId) => void

**Estados:**
- Disponible: Botón "Seleccionar para Regalar"
- Bloqueado por ti: Botones "Continuar" y "Cancelar"
- Bloqueado por otro: Botón deshabilitado

### `<FriendWishlistView>`
Vista completa de wishlist con grid.

**Props:**
- `wishlist`: FriendWishlist | null
- `currentUserId`: string
- `onSelectGift`: (itemId) => void
- `onReleaseLock`: (itemId) => void
- `onContinueCheckout`: (itemId) => void

**Funcionalidades:**
- Header con avatar del amigo
- Filtros por estado
- Toggle mostrar/ocultar bloqueados
- Estadísticas

### `<LockTimerBadge>`
Badge con countdown de bloqueo.

**Props:**
- `lockedUntil`: Date | string | null
- `showIcon`: boolean (default: true)

**Características:**
- Actualización cada segundo
- Formato MM:SS
- Animación pulse cuando < 5 min
- Auto-hide cuando expira

### `<GiftCheckoutForm>`
Formulario de checkout con pago simulado.

**Props:**
- `session`: GiftCheckoutSession
- `onSubmit`: (formData) => Promise<void>
- `onCancel`: () => void
- `isProcessing`: boolean

**Validaciones:**
- Tarjeta: 16 dígitos
- Expiración: MM/AA
- CVC: 3 dígitos

### `<GiftConfirmation>`
Página de confirmación exitosa.

**Props:**
- `gift`: GiftWithDetails
- `orderNumber`: string (opcional)

**Secciones:**
- Alert de éxito
- Número de orden
- Información del destinatario
- Detalles del producto
- Info de entrega
- Timeline "¿Qué sigue?"

## 🔒 Sistema de Bloqueos

### Duración
- **Default:** 15 minutos
- **Configurable:** DEFAULT_LOCK_DURATION_MINUTES

### Implementación
Los bloqueos se implementan usando la tabla `gifts`:
- Se inserta un registro con `locked_until` y `payment_status='pending'`
- Al completar pago: `locked_until=null`, `payment_status='completed'`
- Al expirar: Job elimina registros con `locked_until < now` y `payment_status='pending'`

### Validaciones
- ✅ Un usuario no puede bloquear si ya está bloqueado por otro
- ✅ Un usuario puede ver y continuar su propio bloqueo
- ✅ Un usuario puede cancelar su propio bloqueo
- ✅ Los bloqueos expiran automáticamente

## 📊 Flujo Completo

```
1. Usuario ve wishlist de amigo (/gift/[friendId])
   ↓
2. Selecciona producto → lockGiftItem()
   ↓
3. Producto bloqueado 15 min → Redirect a /gift/[friendId]/checkout
   ↓
4. Usuario completa formulario de pago
   ↓
5. processGiftPayment() → Actualiza estados
   ↓
6. Redirect a /gift/confirmation
   ↓
7. Confirmación exitosa con número de orden
   ↓
8. Wishlist status: available → in_process
   ↓
9. Comercial marca como enviado
   ↓
10. confirmGiftDelivery() → Wishlist status: in_process → gifted
```

## 🚀 Uso

### Ejemplo: Ver wishlist de amigo

```typescript
import { FriendWishlistView, useFriendWishlist } from '@/features/gift-flow'

function FriendWishlistPage({ friendId }: { friendId: string }) {
  const { user } = useAuth()
  const { wishlist, isLoading } = useFriendWishlist(friendId)

  const handleSelectGift = async (itemId: string) => {
    // Lógica de selección
  }

  return (
    <FriendWishlistView
      wishlist={wishlist}
      currentUserId={user?.id || ''}
      isLoading={isLoading}
      onSelectGift={handleSelectGift}
    />
  )
}
```

### Ejemplo: Checkout completo

```typescript
import { GiftCheckoutForm, useGiftCheckout } from '@/features/gift-flow'

function CheckoutPage() {
  const { checkoutSession, processPayment, isProcessing } = useGiftCheckout()

  const handleSubmit = async (formData: GiftPaymentFormData) => {
    const result = await processPayment(formData)
    if (result) {
      router.push(`/gift/confirmation?order=${result.orderNumber}`)
    }
  }

  if (!checkoutSession) return <div>Loading...</div>

  return (
    <GiftCheckoutForm
      session={checkoutSession}
      onSubmit={handleSubmit}
      isProcessing={isProcessing}
    />
  )
}
```

## ✅ Tests

### Criterios de aceptación verificados:

- [x] Ver wishlist de amigos con verificación de amistad
- [x] Bloqueo temporal de 15 minutos
- [x] Countdown en tiempo real
- [x] Pago simulado con validación
- [x] Actualización de estados (available → in_process → gifted)
- [x] Confirmación de entrega
- [x] Historial de regalos enviados y recibidos
- [x] Liberación automática de bloqueos expirados
- [x] Validación de permisos en todas las acciones

## 🔄 Próximas Mejoras (Post-MVP)

1. **Notificaciones en tiempo real**
   - WebSocket para actualizar bloqueos
   - Notificaciones push cuando alguien regala

2. **Vaquitas (Crowdfunding)**
   - Múltiples usuarios contribuyen a un regalo
   - Sistema de escrow para fondos
   - Refund automático si no se completa

3. **Tracking real**
   - Integración con servicios de envío
   - Número de tracking real
   - Updates de ubicación

4. **Pago real**
   - Integración Stripe/PayPal real
   - 3D Secure
   - Split payment (tienda/plataforma)

## 📝 Notas

- **MVP:** Pago simulado, sin transacciones reales
- **Bloqueos:** In-memory via database, no Redis necesario para MVP
- **Emails:** Simulados, no envío real
- **Tracking:** No integración con carriers, simulado

## 🤝 Dependencias

### Módulos requeridos (READ-ONLY):
- `shared/database` - Schema y tipos
- `shared/auth` - Autenticación
- `shared/common` - UI components
- `features/wishlist` - Datos de wishlist
- `features/friends-network` - Verificación de amistad

### Packages externos:
- `date-fns` - Manejo de fechas
- `next` - Framework
- `react` - UI library

## 📄 Licencia

Parte del proyecto Reserrega - Uso interno
