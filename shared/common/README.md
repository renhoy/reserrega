# Common Module

Módulo compartido con componentes UI, layouts, hooks, utilidades y constantes reutilizables en toda la aplicación Reserrega.

## 📦 Contenido

```
shared/common/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── layouts/         # Layouts (Header, Sidebar, Footer, MainLayout)
│   └── shared/          # Componentes compartidos
├── hooks/               # Custom React hooks
├── lib/                 # Utilidades y helpers
├── constants/           # Constantes de la app
└── types/               # TypeScript types compartidos
```

## 🎨 Componentes UI

### Componentes Base

Todos los componentes de shadcn/ui están disponibles:

```tsx
import { Button, Input, Label, Card } from '@/shared/common/components/ui'

function MyForm() {
  return (
    <Card>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      <Button>Enviar</Button>
    </Card>
  )
}
```

**Componentes disponibles:**
- `Button`, `Input`, `Label`, `Textarea`, `PasswordInput`
- `Select`, `Checkbox`, `Switch`, `RadioGroup`
- `Card`, `Badge`, `Avatar`, `Table`, `Skeleton`, `Alert`
- `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`
- `NavigationMenu`, `Tabs`, `ScrollArea`, `Accordion`

## 🏗️ Layouts

### MainLayout

Layout principal con Header, Sidebar y Footer:

```tsx
import { MainLayout } from '@/shared/common/components/layouts'
import { requireAuth } from '@/shared/auth/server'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <MainLayout user={user}>
      <h1>Dashboard</h1>
      <p>Welcome {user.name}!</p>
    </MainLayout>
  )
}
```

**Props:**
- `user` - Usuario autenticado (AuthUser | null)
- `showSidebar` - Mostrar sidebar (default: true)
- `showFooter` - Mostrar footer (default: true)
- `className` - Clases adicionales para el main

### Header

Header con navegación y menú de usuario:

```tsx
import { Header } from '@/shared/common/components/layouts'

<Header user={user} onMenuClick={() => setSidebarOpen(true)} />
```

### Sidebar

Sidebar con navegación basada en roles:

```tsx
import { Sidebar } from '@/shared/common/components/layouts'

<Sidebar user={user} />
```

### Footer

Footer simple con enlaces:

```tsx
import { Footer } from '@/shared/common/components/layouts'

<Footer />
```

## 🔄 Componentes Compartidos

### LoadingSpinner

Indicador de carga:

```tsx
import { LoadingSpinner, LoadingPage } from '@/shared/common/components/shared'

// Spinner simple
<LoadingSpinner size="md" text="Cargando..." />

// Página de carga completa
<LoadingPage text="Cargando datos..." />
```

**Sizes:** `sm`, `md`, `lg`, `xl`

### ErrorBoundary

Captura errores de React:

```tsx
import { ErrorBoundary } from '@/shared/common/components/shared'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### EmptyState

Muestra estado vacío:

```tsx
import { EmptyState } from '@/shared/common/components/shared'
import { Heart } from 'lucide-react'

<EmptyState
  icon={Heart}
  title="No tienes productos en tu wishlist"
  description="Empieza a reservar productos en tienda"
  action={{
    label: "Explorar productos",
    onClick: () => router.push('/products')
  }}
/>
```

### ConfirmDialog

Diálogo de confirmación:

```tsx
import { ConfirmDialog } from '@/shared/common/components/shared'

const [open, setOpen] = useState(false)

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="¿Eliminar producto?"
  description="Esta acción no se puede deshacer."
  confirmText="Eliminar"
  variant="destructive"
  onConfirm={async () => {
    await deleteProduct(id)
    setOpen(false)
  }}
/>
```

### PageHeader

Header de página consistente:

```tsx
import { PageHeader } from '@/shared/common/components/shared'
import { Plus } from 'lucide-react'

<PageHeader
  title="Mi Wishlist"
  description="Todos los productos que has reservado"
  actions={
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Nueva reserva
    </Button>
  }
/>
```

## 🪝 Hooks

### usePermissions

Hook para verificar permisos:

```tsx
import { usePermissions } from '@/shared/common/hooks'

function ProductList() {
  const { can, isRole, isSuperadmin, user } = usePermissions()

  const canCreate = can({ resource: 'products', action: 'create' })
  const isAdmin = isRole('admin')

  return (
    <div>
      {canCreate && <Button>Crear producto</Button>}
      {isSuperadmin() && <AdminPanel />}
    </div>
  )
}
```

### useToast

Hook para notificaciones:

```tsx
import { useToast } from '@/shared/common/hooks'

function MyComponent() {
  const toast = useToast()

  const handleSave = async () => {
    try {
      await saveData()
      toast.success('Guardado exitosamente')
    } catch (error) {
      toast.error('Error al guardar', error.message)
    }
  }

  // Con promise
  toast.promise(
    fetchData(),
    {
      loading: 'Cargando...',
      success: 'Datos cargados',
      error: 'Error al cargar'
    }
  )

  return <Button onClick={handleSave}>Guardar</Button>
}
```

**Métodos:**
- `success(message, description?)`
- `error(message, description?)`
- `info(message, description?)`
- `warning(message, description?)`
- `loading(message)`
- `promise(promise, messages)`
- `dismiss(toastId?)`

### useMediaQuery

Hook para responsive design:

```tsx
import { useIsMobile, useIsTablet, useIsDesktop, useMediaQuery } from '@/shared/common/hooks'

function MyComponent() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  // Custom query
  const isLarge = useMediaQuery('(min-width: 1440px)')

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

### useDebounce

Hook para debouncing:

```tsx
import { useDebounce } from '@/shared/common/hooks'

function SearchInput() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch)
    }
  }, [debouncedSearch])

  return <Input value={search} onChange={(e) => setSearch(e.target.value)} />
}
```

### useLocalStorage

Hook para localStorage:

```tsx
import { useLocalStorage } from '@/shared/common/hooks'

function MyComponent() {
  const [name, setName, removeName] = useLocalStorage('userName', 'Guest')

  return (
    <div>
      <p>Hello, {name}!</p>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={removeName}>Clear</Button>
    </div>
  )
}
```

## 🛠️ Utilidades

### Formatters

```tsx
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatPhone
} from '@/shared/common/lib/formatters'

formatDate(new Date()) // "17/11/2025"
formatDateTime(new Date()) // "17/11/2025 14:30"
formatRelativeTime(new Date()) // "hace unos segundos"
formatCurrency(1234.56) // "1.234,56 €"
formatNumber(1234567) // "1.234.567"
formatPercentage(0.1234, 2) // "12,34%"
formatFileSize(1048576) // "1 MB"
formatPhone('611234567') // "+34 611 23 45 67"
```

### Validators

```tsx
import {
  isValidEmail,
  isValidPhone,
  isValidDNI,
  isValidCIF,
  isStrongPassword,
  isValidURL,
  isValidPostalCode,
  isEmpty,
  isValidCardNumber
} from '@/shared/common/lib/validators'

isValidEmail('test@example.com') // true
isValidPhone('611234567') // true
isValidDNI('12345678Z') // true
isStrongPassword('Pass123!') // { valid: true, reasons: [] }
```

### Helpers

**String:**
```tsx
import {
  capitalize,
  titleCase,
  truncate,
  slugify,
  getInitials,
  stripHtml
} from '@/shared/common/lib/helpers'

capitalize('hello') // "Hello"
titleCase('hello world') // "Hello World"
truncate('Hello World', 8) // "Hello..."
slugify('Hello World!') // "hello-world"
getInitials('José Ignacio Vela') // "JV"
stripHtml('<p>Hello</p>') // "Hello"
```

**Array:**
```tsx
import {
  unique,
  groupBy,
  chunk,
  shuffle,
  randomItem,
  sortBy
} from '@/shared/common/lib/helpers'

unique([1, 2, 2, 3]) // [1, 2, 3]
groupBy(users, 'role') // { admin: [...], user: [...] }
chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4]
sortBy(users, 'age', 'desc') // Sorted by age descending
```

**Object:**
```tsx
import {
  deepClone,
  pick,
  omit,
  isEmptyObject,
  deepMerge
} from '@/shared/common/lib/helpers'

deepClone(obj) // Deep copy
pick(obj, ['a', 'c']) // { a: 1, c: 3 }
omit(obj, ['b']) // { a: 1, c: 3 }
isEmptyObject({}) // true
deepMerge(obj1, obj2) // Merged object
```

**Utility:**
```tsx
import {
  sleep,
  generateId,
  clamp,
  isDefined
} from '@/shared/common/lib/helpers'

await sleep(1000) // Wait 1 second
generateId() // "a1b2c3d4"
clamp(15, 0, 10) // 10
isDefined(value) // true if not null/undefined
```

## 📍 Constantes

### Routes

```tsx
import { ROUTES, API_ROUTES, isPublicRoute, getDefaultRouteByRole } from '@/shared/common/constants/routes'

// Navigate
router.push(ROUTES.WISHLIST)
router.push(ROUTES.PRODUCT_DETAIL('123'))

// API
fetch(API_ROUTES.PRODUCTS.LIST)

// Helpers
isPublicRoute('/auth/login') // true
getDefaultRouteByRole('usuario') // '/wishlist'
```

### UI Constants

```tsx
import {
  BREAKPOINTS,
  MEDIA_QUERIES,
  Z_INDEX,
  ANIMATION_DURATION,
  SIZES,
  PAGINATION,
  FILE_UPLOAD,
  DEBOUNCE_DELAY
} from '@/shared/common/constants/ui'

// Use in media queries
useMediaQuery(MEDIA_QUERIES.MOBILE)

// Use in styles
zIndex: Z_INDEX.MODAL

// File validation
if (file.size > FILE_UPLOAD.MAX_SIZE) {
  toast.error(`File too large. Max ${FILE_UPLOAD.MAX_SIZE_MB}MB`)
}
```

## 📝 Types

```tsx
import type {
  ApiResponse,
  PaginatedResponse,
  SelectOption,
  Size,
  Variant,
  Status,
  SortConfig,
  TableColumn,
  Address,
  Timestamps,
  PaymentStatus,
  Visibility
} from '@/shared/common/types/common.types'

// Use in components
interface Props {
  size?: Size
  variant?: Variant
  status: Status
}

// API responses
const response: ApiResponse<User> = await fetchUser()
const paginatedUsers: PaginatedResponse<User> = await fetchUsers()
```

## 🎯 Best Practices

1. **Importar desde el módulo común:**
   ```tsx
   import { Button, useToast, formatCurrency } from '@/shared/common'
   ```

2. **Usar MainLayout en páginas:**
   ```tsx
   export default async function Page() {
     const user = await requireAuth()
     return <MainLayout user={user}>...</MainLayout>
   }
   ```

3. **Validar inputs:**
   ```tsx
   if (!isValidEmail(email)) {
     toast.error('Email inválido')
     return
   }
   ```

4. **Usar hooks compartidos:**
   ```tsx
   const { can } = usePermissions()
   const toast = useToast()
   const isMobile = useIsMobile()
   ```

5. **Formatear datos:**
   ```tsx
   <p>{formatCurrency(product.price)}</p>
   <p>{formatRelativeTime(reservation.createdAt)}</p>
   ```

## 📚 Ejemplos Completos

### Formulario con validación

```tsx
'use client'

import { useState } from 'react'
import { Button, Input, Label } from '@/shared/common/components/ui'
import { useToast } from '@/shared/common/hooks'
import { isValidEmail, isStrongPassword } from '@/shared/common/lib/validators'

export function RegisterForm() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      toast.error('Email inválido')
      return
    }

    const passwordValidation = isStrongPassword(password)
    if (!passwordValidation.valid) {
      toast.error('Contraseña débil', passwordValidation.reasons[0])
      return
    }

    toast.promise(
      register({ email, password }),
      {
        loading: 'Registrando...',
        success: 'Registro exitoso',
        error: 'Error al registrar'
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Registrarse</Button>
    </form>
  )
}
```

### Lista con permisos

```tsx
'use client'

import { Button } from '@/shared/common/components/ui'
import { PageHeader, EmptyState } from '@/shared/common/components/shared'
import { usePermissions } from '@/shared/common/hooks'
import { Package, Plus } from 'lucide-react'

export function ProductList({ products }: { products: Product[] }) {
  const { can } = usePermissions()
  const canCreate = can({ resource: 'products', action: 'create' })

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No hay productos"
        description="Empieza creando tu primer producto"
        action={canCreate.allowed ? {
          label: "Crear producto",
          onClick: () => router.push('/products/create')
        } : undefined}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="Productos"
        description={`${products.length} productos encontrados`}
        actions={
          canCreate.allowed && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo producto
            </Button>
          )
        }
      />
      {/* Product list */}
    </div>
  )
}
```

## ✅ Estado del Módulo

**Estado:** ✅ READ-ONLY (Completado)

**Completado:**
- [x] Configuración Tailwind y shadcn/ui
- [x] Componentes UI base (25+ componentes)
- [x] Layouts (Header, Sidebar, Footer, MainLayout)
- [x] Componentes compartidos (LoadingSpinner, ErrorBoundary, EmptyState, etc.)
- [x] Hooks compartidos (usePermissions, useToast, useMediaQuery, etc.)
- [x] Utilidades (formatters, validators, helpers)
- [x] Constantes (routes, UI)
- [x] Types compartidos
- [x] Documentación completa

**Prohibido modificar:** Este módulo está completado. Para cambios, consultar con el equipo.
