# Wishlist Module

**Estado:** ✅ Completado

Módulo de gestión de wishlist que permite a los usuarios ver y gestionar sus productos reservados, con control de estado y visibilidad.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Estructura](#estructura)
- [Componentes](#componentes)
- [Hooks](#hooks)
- [Server Actions](#server-actions)
- [Tipos](#tipos)
- [Utilidades](#utilidades)
- [Rutas](#rutas)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 📝 Descripción

El módulo Wishlist permite a los usuarios:
- Ver todos sus productos reservados
- Gestionar estados (disponible, en proceso, regalado, expirado)
- Configurar visibilidad por producto (privado, amigos, público)
- Ver productos expirados con advertencias
- Filtrar productos por estado
- Ver detalles completos de cada producto

---

## ✨ Funcionalidades

### Estados de Producto
- **Disponible** - Producto listo para ser regalado
- **En Proceso** - Alguien está comprando este producto
- **Regalado** - Producto ya regalado (no visible para otros)
- **Expirado** - Reserva vencida (visible sin botón de compra)

### Niveles de Visibilidad
- **Privado** - Solo el usuario puede ver el producto
- **Solo Amigos** - Solo amigos del usuario pueden ver el producto
- **Público** - Cualquiera puede ver el producto

### Filtrado
- Filtrar por estado
- Mostrar/ocultar productos expirados
- Estadísticas en tiempo real

---

## 📁 Estructura

```
features/wishlist/
├── components/
│   ├── WishlistGrid.tsx         # Grid responsivo con filtros
│   ├── WishlistItem.tsx         # Card de producto individual
│   ├── ProductStatusBadge.tsx   # Badge de estado
│   └── VisibilityToggle.tsx     # Selector de visibilidad
├── actions/
│   ├── getWishlist.ts           # Obtener wishlist
│   ├── updateProductStatus.ts   # Actualizar estado
│   └── updateVisibility.ts      # Actualizar visibilidad
├── hooks/
│   └── useWishlist.ts           # Hook de gestión
├── lib/
│   └── wishlist-utils.ts        # Utilidades
├── types/
│   └── wishlist.types.ts        # Definiciones de tipos
├── README.md
└── index.ts
```

---

## 🎨 Componentes

### `<WishlistGrid />`

Grid responsivo para mostrar productos de wishlist con filtros.

**Props:**
```typescript
interface WishlistGridProps {
  items: WishlistItemWithDetails[]
  isLoading?: boolean
  onStatusChange?: (itemId: string, newStatus: string) => void
  onVisibilityChange?: (itemId: string, newVisibility: string) => void
  onDelete?: (itemId: string) => void
  showFilters?: boolean
  className?: string
}
```

**Ejemplo:**
```tsx
<WishlistGrid
  items={wishlistItems}
  onStatusChange={handleStatusChange}
  onVisibilityChange={handleVisibilityChange}
  onDelete={handleDelete}
  showFilters
/>
```

---

### `<WishlistItem />`

Card individual que muestra un producto de wishlist.

**Props:**
```typescript
interface WishlistItemProps {
  item: WishlistItemWithDetails
  onStatusChange?: (itemId: string, newStatus: string) => void
  onVisibilityChange?: (itemId: string, newVisibility: string) => void
  onDelete?: (itemId: string) => void
  showActions?: boolean
  className?: string
}
```

**Ejemplo:**
```tsx
<WishlistItem
  item={wishlistItem}
  onStatusChange={(id, status) => updateStatus(id, status)}
  showActions
/>
```

---

### `<ProductStatusBadge />`

Badge que muestra el estado del producto.

**Props:**
```typescript
interface ProductStatusBadgeProps {
  status: WishlistStatus
  isExpired?: boolean
  className?: string
  showIcon?: boolean
}
```

**Ejemplo:**
```tsx
<ProductStatusBadge status="available" />
<ProductStatusBadge status="in_process" showIcon />
<ProductStatusBadge status="available" isExpired />
```

---

### `<VisibilityToggle />`

Selector para cambiar la visibilidad del producto.

**Props:**
```typescript
interface VisibilityToggleProps {
  value: WishlistVisibility
  onChange: (visibility: WishlistVisibility) => void
  disabled?: boolean
  showLabel?: boolean
  showDescription?: boolean
  className?: string
}
```

**Ejemplo:**
```tsx
<VisibilityToggle
  value={visibility}
  onChange={(newVisibility) => updateVisibility(newVisibility)}
  showLabel
  showDescription
/>
```

---

## 🪝 Hooks

### `useWishlist()`

Hook principal para gestionar wishlist con optimistic updates.

**Parámetros:**
```typescript
interface UseWishlistOptions {
  initialFilters?: WishlistFilters
  autoLoad?: boolean
}
```

**Retorna:**
```typescript
interface UseWishlistReturn {
  items: WishlistItemWithDetails[]
  filteredItems: WishlistItemWithDetails[]
  isLoading: boolean
  isUpdating: boolean
  error: string | null
  filters: WishlistFilters
  setFilters: (filters: WishlistFilters) => void
  loadWishlist: () => Promise<void>
  updateStatus: (itemId: string, newStatus: WishlistStatus) => Promise<void>
  updateVisibility: (itemId: string, newVisibility: WishlistVisibility) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refresh: () => Promise<void>
}
```

**Ejemplo:**
```tsx
function WishlistPage() {
  const {
    items,
    isLoading,
    updateStatus,
    filters,
    setFilters,
  } = useWishlist()

  return (
    <div>
      <FilterBar filters={filters} onChange={setFilters} />
      {isLoading ? <Spinner /> : <WishlistGrid items={items} onStatusChange={updateStatus} />}
    </div>
  )
}
```

---

## ⚡ Server Actions

### `getWishlistAction()`

Obtiene la wishlist del usuario con filtros opcionales.

```typescript
const wishlist = await getWishlistAction()
const available = await getWishlistAction({ status: 'available' })
const friendsOnly = await getWishlistAction({ visibility: 'friends' })
```

---

### `getWishlistItemAction()`

Obtiene un item específico de la wishlist.

```typescript
const { item } = await getWishlistItemAction('uuid-123')
```

---

### `getPublicWishlistAction()`

Obtiene la wishlist pública de un usuario (filtrada por visibilidad).

```typescript
const publicWishlist = await getPublicWishlistAction('user-uuid', 'my-uuid')
```

---

### `updateProductStatusAction()`

Actualiza el estado de un producto.

```typescript
await updateProductStatusAction('uuid-123', 'gifted')
```

---

### `updateVisibilityAction()`

Actualiza la visibilidad de un producto.

```typescript
await updateVisibilityAction('uuid-123', 'friends')
```

---

### `removeFromWishlistAction()`

Elimina un producto de la wishlist.

```typescript
await removeFromWishlistAction('uuid-123')
```

---

### `bulkUpdateStatusAction()`

Actualiza el estado de múltiples productos.

```typescript
await bulkUpdateStatusAction(['uuid-1', 'uuid-2'], 'available')
```

---

### `bulkUpdateVisibilityAction()`

Actualiza la visibilidad de múltiples productos.

```typescript
await bulkUpdateVisibilityAction(['uuid-1', 'uuid-2'], 'public')
```

---

## 🔧 Utilidades

### Formateo de Estado

```typescript
formatWishlistStatus('available') // 'Disponible'
getStatusColor('in_process') // 'amber'
getStatusIcon('gifted') // 'Gift'
```

### Formateo de Visibilidad

```typescript
formatVisibility('private') // 'Privado'
getVisibilityDescription('friends') // 'Tus amigos pueden ver...'
getVisibilityIcon('public') // 'Globe'
```

### Expiración

```typescript
isProductExpired('2024-01-15T10:00:00Z') // true/false

const info = getExpirationInfo('2024-12-31T23:59:59Z')
// { isExpired, daysRemaining, expiresAt, expirationWarning }

formatDaysRemaining(2) // 'Expira en 2 días'
```

### Permisos

```typescript
canViewProduct('friends', 'friend') // true
canViewProduct('private', 'stranger') // false

const perms = getAccessPermissions('owner', 'private')
// { canView, canEdit, canChangeStatus, canChangeVisibility, canDelete }
```

### Filtrado y Ordenamiento

```typescript
const availableItems = filterByStatus(items, 'available')
const activeItems = filterActiveItems(items) // sin expirados
const sortedItems = sortWishlistItems(items, 'priority', 'desc')
```

### Estadísticas

```typescript
const stats = calculateWishlistStats(items)
// { totalItems, availableCount, inProcessCount, giftedCount, expiredCount }
```

---

## 🛣️ Rutas

### `/wishlist`

Página principal de wishlist.

**Características:**
- Grid responsivo de productos
- Filtros por estado
- Estadísticas en tiempo real
- Acciones de gestión (cambiar estado, visibilidad, eliminar)

---

### `/wishlist/[id]`

Página de detalle de producto.

**Características:**
- Información completa del producto
- Detalles de reserva
- Información de tienda
- Control de visibilidad
- Advertencias de expiración
- Eliminar producto

---

## 📘 Ejemplos de Uso

### Ejemplo 1: Página de Wishlist Básica

```tsx
'use client'

import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { WishlistGrid } from '@/features/wishlist/components/WishlistGrid'

export default function WishlistPage() {
  const { items, isLoading, updateStatus, updateVisibility, removeItem } = useWishlist()

  return (
    <div className="container py-8">
      <h1>Mi Wishlist</h1>
      <WishlistGrid
        items={items}
        isLoading={isLoading}
        onStatusChange={updateStatus}
        onVisibilityChange={updateVisibility}
        onDelete={removeItem}
        showFilters
      />
    </div>
  )
}
```

---

### Ejemplo 2: Wishlist con Filtros Personalizados

```tsx
'use client'

import { useWishlist } from '@/features/wishlist/hooks/useWishlist'
import { WishlistGrid } from '@/features/wishlist/components/WishlistGrid'

export default function AvailableWishlistPage() {
  const { items, isLoading, setFilters } = useWishlist({
    initialFilters: { status: 'available', includeExpired: false },
  })

  return (
    <div className="container py-8">
      <h1>Productos Disponibles</h1>
      <WishlistGrid
        items={items}
        isLoading={isLoading}
        showFilters={false}
      />
    </div>
  )
}
```

---

### Ejemplo 3: Card de Producto Individual

```tsx
'use client'

import { WishlistItem } from '@/features/wishlist/components/WishlistItem'

export function ProductCard({ item, onUpdate }) {
  return (
    <WishlistItem
      item={item}
      onStatusChange={async (id, status) => {
        await onUpdate(id, status)
      }}
      showActions
    />
  )
}
```

---

## 🔗 Dependencias

- **Database:** `shared/database/*` (READ-ONLY)
- **Auth:** `shared/auth/*` (READ-ONLY)
- **Common:** `shared/common/*` (READ-ONLY)
- **Product-Reservation:** `features/product-reservation/*` (READ-ONLY)

---

## 📊 Base de Datos

### Tabla: wishlists

```sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  reservation_id UUID REFERENCES reservations(id),
  visibility TEXT NOT NULL DEFAULT 'friends',
  status TEXT NOT NULL DEFAULT 'available',
  priority INTEGER DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT wishlists_visibility_check CHECK (visibility IN ('private', 'friends', 'public')),
  CONSTRAINT wishlists_status_check CHECK (status IN ('available', 'in_process', 'gifted', 'expired'))
);
```

---

## ✅ Criterios de Completado

- [x] Types completos con JSDoc
- [x] Componentes UI (Grid, Item, Badge, Toggle)
- [x] Server Actions con validaciones
- [x] Hook useWishlist con optimistic updates
- [x] Páginas /wishlist y /wishlist/[id]
- [x] Filtrado por estado
- [x] Control de visibilidad
- [x] Advertencias de expiración
- [x] README completo

---

## 🚀 Próximos Módulos

- **Friends-Network** - Sistema de amigos e invitaciones
- **Gift-Flow** - Flujo completo de regalo
- **Store-Panel** - Panel para comerciales

---

## 📝 Notas

- Los productos con estado "gifted" no se muestran en wishlist pública
- Los productos expirados se muestran con advertencia y sin botón de compra
- Solo el propietario puede modificar estado y visibilidad
- Las actualizaciones usan optimistic updates para mejor UX
- Los filtros combinan server-side y client-side para performance óptima
