# Product-Reservation Module

Módulo para reservar productos en tienda física mediante escaneo de QR y códigos de barras.

## 📦 Flujo Completo

### Usuario (Reserva producto):

1. Usuario genera QR temporal en `/qr`
2. Va a tienda física y muestra QR a comercial
3. Comercial escanea QR → obtiene `userId`
4. Comercial escanea código de barras del producto
5. Sistema vincula producto a usuario
6. Usuario completa formulario de reserva
7. Usuario paga 1€ (simulado)
8. Reserva creada con expiración 15 días
9. Producto aparece en `/reservations`

### Comercial (Ayuda a reservar):

1. Va a `/scan`
2. Escanea QR del usuario (Tab 1)
3. Escanea código de barras del producto (Tab 2)
4. Muestra formulario de confirmación (Tab 3)
5. Usuario completa pago desde su móvil
6. Reserva confirmada

## 🗂️ Estructura

```
features/product-reservation/
├── types/
│   └── reservation.types.ts      # TypeScript types completos
├── lib/
│   ├── qr-utils.ts                # Utilidades para QR codes
│   └── product-utils.ts           # Utilidades para productos
├── hooks/
│   ├── useQRCode.ts               # Hook para generar QR
│   └── useReservation.ts          # Hook para crear reservas
├── components/
│   ├── QRGenerator.tsx            # Generador de QR con countdown
│   ├── QRScanner.tsx              # Escáner de QR con cámara
│   ├── ProductScanner.tsx         # Escáner de códigos de barras
│   └── ReservationForm.tsx        # Formulario de confirmación
├── actions/
│   ├── generateQR.ts              # Server action: generar QR
│   ├── scanProduct.ts             # Server action: escanear producto
│   ├── createReservation.ts       # Server action: crear reserva
│   └── simulatePayment.ts         # Server action: simular pago
├── README.md
└── index.ts
```

## 🔧 Componentes

### QRGenerator

Genera y muestra QR temporal del usuario con auto-refresh.

```tsx
import { QRGenerator } from '@/features/product-reservation'

<QRGenerator showInstructions />
```

**Características:**
- QR expira en 24 horas
- Countdown en tiempo real
- Auto-refresh al expirar
- Instrucciones de uso
- Responsive

### QRScanner

Escanea QR de usuarios usando la cámara.

```tsx
import { QRScanner } from '@/features/product-reservation'

<QRScanner
  onScanSuccess={(userId, username) => {
    console.log('User:', userId, username)
  }}
  onScanError={(error) => {
    console.error(error)
  }}
/>
```

**Características:**
- Acceso a cámara del dispositivo
- Validación en servidor
- Detección de QR expirados
- Estados visuales (scanning, success, error)

### ProductScanner

Escanea códigos de barras de productos.

```tsx
import { ProductScanner } from '@/features/product-reservation'

<ProductScanner
  userId="user-123"
  storeId={1}
  onScanSuccess={(product) => {
    console.log('Product:', product)
  }}
/>
```

**Características:**
- Escaneo de códigos de barras (EAN-13, EAN-8, UPC-A, UPC-E)
- Búsqueda automática en BD
- Diálogo para crear producto si no existe
- Validación de campos

### ReservationForm

Formulario de confirmación de reserva con pago.

```tsx
import { ReservationForm } from '@/features/product-reservation'

<ReservationForm
  product={product}
  store={store}
  onSuccess={(reservationId) => {
    router.push(`/reservations/${reservationId}`)
  }}
/>
```

**Características:**
- Resumen completo del producto y tienda
- Cálculo de expiración (15 días)
- Desglose de precios
- Pago simulado de 1€
- Términos y condiciones

## 🪝 Hooks

### useQRCode

Hook para generar y gestionar QR codes.

```tsx
import { useQRCode } from '@/features/product-reservation'

function MyComponent() {
  const {
    qrCodeUrl,
    qrData,
    isExpired,
    timeRemaining,
    isLoading,
    error,
    generateQR,
    refreshQR,
  } = useQRCode()

  return (
    <div>
      <img src={qrCodeUrl} alt="QR Code" />
      <p>Expira en: {timeRemaining}</p>
      {isExpired && <button onClick={refreshQR}>Renovar</button>}
    </div>
  )
}
```

### useReservation

Hook para crear reservas.

```tsx
import { useReservation } from '@/features/product-reservation'

function MyComponent() {
  const { createReservation, isCreating, error } = useReservation()

  const handleReserve = async () => {
    const reservationId = await createReservation({
      userId: user.id,
      productId: product.id,
      storeId: store.id,
    })

    if (reservationId) {
      router.push(`/reservations/${reservationId}`)
    }
  }

  return <button onClick={handleReserve}>Reservar</button>
}
```

## 🔄 Server Actions

### generateQRAction

Genera QR code para el usuario autenticado.

```tsx
import { generateQRAction } from '@/features/product-reservation/actions/generateQR'

const { qrData, qrCodeUrl, expiresAt } = await generateQRAction()
```

### scanQRAction / scanProductAction

Escanea QR de usuario o código de barras.

```tsx
import { scanQRAction, scanProductAction } from '@/features/product-reservation/actions/scanProduct'

// Escanear QR
const qrResult = await scanQRAction({ qrData: '...' })
if (qrResult.valid) {
  console.log('User ID:', qrResult.userId)
}

// Escanear producto
const productResult = await scanProductAction({
  barcode: '1234567890123',
  userId: 'user-123',
  storeId: 1,
})
```

### createReservationAction

Crea reserva con pago simulado.

```tsx
import { createReservationAction } from '@/features/product-reservation/actions/createReservation'

const { reservationId, reservation } = await createReservationAction({
  userId: 'user-123',
  productId: 'prod-456',
  storeId: 1,
  amountPaid: 1.00,
})
```

### getUserReservationsAction / getReservationByIdAction

Obtiene reservas del usuario.

```tsx
import {
  getUserReservationsAction,
  getReservationByIdAction,
} from '@/features/product-reservation/actions/createReservation'

// Lista de reservas
const reservations = await getUserReservationsAction(userId, 'active')

// Detalle de reserva
const reservation = await getReservationByIdAction(reservationId)
```

## 🛠️ Utilidades

### QR Utils

```tsx
import {
  generateQRData,
  generateQRCodeURL,
  validateQRCode,
  isQRExpired,
  getQRTimeRemaining,
  formatQRTimeRemaining,
} from '@/features/product-reservation/lib/qr-utils'

// Generar QR data
const qrData = generateQRData('user-123', 'John Doe')

// Generar QR image
const qrCodeUrl = await generateQRCodeURL(qrData)

// Validar QR
const validation = validateQRCode(qrDataString)
if (validation.valid) {
  console.log('User ID:', validation.userId)
}

// Check expiración
if (isQRExpired(qrData)) {
  console.log('QR expired')
}

// Tiempo restante
const timeRemaining = formatQRTimeRemaining(qrData) // "23h 45m"
```

### Product Utils

```tsx
import {
  validateBarcode,
  normalizeBarcode,
  calculateExpiration,
  getExpirationInfo,
  isReservationExpired,
  calculatePaymentSplit,
  validateProductData,
  formatProductName,
} from '@/features/product-reservation/lib/product-utils'

// Validar código de barras
const isValid = validateBarcode('1234567890123') // true

// Normalizar
const barcode = normalizeBarcode(' 123 456 789 012 3 ') // "1234567890123"

// Calcular expiración
const expiresAt = calculateExpiration() // Date + 15 días

// Info de expiración
const info = getExpirationInfo(reservation.expiresAt)
console.log(info.daysUntilExpiration) // 12
console.log(info.isExpired) // false

// Split de pago
const { storeShare, platformShare } = calculatePaymentSplit(1.00)
// storeShare: 0.50, platformShare: 0.50

// Formatear nombre
const name = formatProductName({
  name: 'T-Shirt',
  brand: 'Nike',
  size: 'M',
  color: 'Blue',
})
// "Nike T-Shirt (M, Blue)"
```

## 📄 Types

```tsx
import type {
  Reservation,
  Product,
  Store,
  QRCodeData,
  CreateReservationRequest,
  ReservationWithRelations,
} from '@/features/product-reservation/types/reservation.types'

// Usar en componentes
interface Props {
  reservation: Reservation
  product: Product
  store: Store
}
```

## 🌐 Rutas

### Usuario

- `/qr` - Genera y muestra QR code temporal
- `/reservations` - Lista de reservas del usuario
- `/reservations/[id]` - Detalle de reserva específica

### Comercial

- `/scan` - Página de escaneo (QR + Producto + Confirmación)

## 🔒 Permisos

### Usuario

- Puede ver su propio QR
- Puede ver sus propias reservas
- Puede crear reservas

### Comercial

- Puede escanear QR de usuarios
- Puede escanear productos
- Puede crear productos nuevos
- Puede ayudar a crear reservas

### Admin/Superadmin

- Puede ver todas las reservas
- Gestión completa del sistema

## ⚙️ Configuración

### Constantes

Las siguientes constantes se usan desde `shared/common/constants/ui.ts`:

- `RESERVATION_EXPIRATION_DAYS` - 15 días
- `QR_CODE_EXPIRATION_HOURS` - 24 horas
- `GIFT_BLOCK_DURATION_MINUTES` - 15 minutos

### Base de Datos

**Tablas utilizadas:**
- `public.users` - Usuarios del sistema
- `public.products` - Productos escaneables
- `public.stores` - Tiendas físicas
- `public.reservations` - Reservas de productos

**RLS Policies:**
- Usuarios solo ven sus propias reservas
- Comerciales pueden crear reservas y productos
- Admins tienen acceso completo

## 📚 Ejemplos Completos

### Página de Usuario con QR

```tsx
import { requireAuth } from '@/shared/auth/server'
import { MainLayout } from '@/shared/common/components/layouts'
import { QRGenerator } from '@/features/product-reservation'

export default async function MyQRPage() {
  const user = await requireAuth()

  return (
    <MainLayout user={user}>
      <h1>Mi Código QR</h1>
      <QRGenerator showInstructions />
    </MainLayout>
  )
}
```

### Página de Escaneo (Comercial)

```tsx
'use client'

import { useState } from 'react'
import { QRScanner, ProductScanner, ReservationForm } from '@/features/product-reservation'

export default function ScanPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [product, setProduct] = useState(null)
  const [step, setStep] = useState<'qr' | 'product' | 'confirm'>('qr')

  return (
    <div>
      {step === 'qr' && (
        <QRScanner
          onScanSuccess={(id) => {
            setUserId(id)
            setStep('product')
          }}
        />
      )}

      {step === 'product' && userId && (
        <ProductScanner
          userId={userId}
          storeId={1}
          onScanSuccess={(prod) => {
            setProduct(prod)
            setStep('confirm')
          }}
        />
      )}

      {step === 'confirm' && product && (
        <ReservationForm
          product={product}
          store={store}
          onSuccess={() => setStep('qr')}
        />
      )}
    </div>
  )
}
```

## ✅ Estado del Módulo

**Estado:** ✅ COMPLETADO

**Completado:**
- [x] PR-001: Types y Utilidades Base
- [x] PR-002: QR Generator Component
- [x] PR-003: Product Scanner (Comercial)
- [x] PR-004: Crear Reserva con Pago
- [x] PR-005: Páginas y Rutas
- [x] PR-006: README y Documentación

**Próximo módulo:** Wishlist

---

**Última actualización:** Completado el 17/11/2025
