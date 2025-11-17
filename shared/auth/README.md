# Auth Module - Reserrega

**Status:** 🟡 En desarrollo
**Autenticación:** Supabase Auth (PKCE flow)
**Autorización:** Role-based (4 roles)

---

## 📁 Estructura del Módulo

```
shared/auth/
├── components/
│   ├── LoginForm.tsx           # Formulario de login
│   ├── RegisterForm.tsx        # Formulario de registro
│   ├── AuthProvider.tsx        # Context provider global
│   └── LogoutButton.tsx        # Botón de logout
├── hooks/
│   ├── useAuth.ts              # Hook de autenticación
│   ├── useUser.ts              # Hook de datos de usuario
│   ├── useSession.ts           # Hook de sesión
│   └── index.ts                # Exports
├── middleware/
│   ├── authMiddleware.ts       # Middleware de autenticación
│   ├── roleGuard.ts            # Guard de roles
│   └── index.ts
├── server/
│   ├── getUser.ts              # Obtener usuario server-side
│   ├── requireAuth.ts          # Requerir autenticación
│   ├── requireRole.ts          # Requerir rol específico
│   └── index.ts
├── actions/
│   └── logout.ts               # Server action de logout
├── types/
│   └── auth.types.ts           # Tipos TypeScript
├── utils/
│   ├── permissions.ts          # Sistema de permisos
│   ├── session.ts              # Utils de sesión
│   ├── constants.ts            # Constantes
│   └── index.ts
├── tests/
│   ├── server.test.ts          # Tests server helpers
│   ├── hooks.test.ts           # Tests hooks
│   └── middleware.test.ts      # Tests middleware
├── README.md                   # Este archivo
└── index.ts                    # Exports principales
```

---

## 🚀 Setup

### Prerequisitos

- ✅ Módulo Database completado
- ✅ Supabase configurado en `.env.local`
- ✅ Usuario superadmin creado

### Uso Básico

#### 1. Envolver app con AuthProvider

```tsx
// src/app/layout.tsx
import { AuthProvider } from '@/shared/auth'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### 2. Usar hooks en componentes cliente

```tsx
'use client'
import { useAuth } from '@/shared/auth'

export function UserProfile() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Role: {user.role}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

#### 3. Proteger rutas con middleware

```ts
// src/middleware.ts
import { authMiddleware } from '@/shared/auth/middleware'

export default authMiddleware
```

#### 4. Usar server helpers en Server Components

```tsx
// src/app/dashboard/page.tsx
import { requireAuth } from '@/shared/auth/server'

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>You have role: {user.role}</p>
    </div>
  )
}
```

---

## 🔐 Roles y Permisos

### Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `superadmin` | Administrador global | Acceso total al sistema |
| `admin` | Administrador de empresa | Gestión de su empresa y usuarios |
| `comercial` | Dependiente/Comercial | Gestión de tiendas y productos de su empresa |
| `usuario` | Usuario final | Crear wishlists, reservar productos, regalar |

### Verificar Permisos

```ts
import { canAccess, hasPermission } from '@/shared/auth/utils'

// Por rol y recurso
const allowed = canAccess(user.role, 'companies', 'manage')

// Por permission completo
const canCreate = hasPermission(user, {
  resource: 'products',
  action: 'create',
  companyId: 1
})
```

---

## 🎯 API Reference

### Hooks

#### `useAuth()`

Hook principal de autenticación.

```tsx
const { user, session, loading, error, signOut, refresh } = useAuth()
```

**Returns:**
- `user`: Usuario autenticado o `null`
- `session`: Sesión de Supabase o `null`
- `loading`: Estado de carga
- `error`: Error de autenticación
- `signOut()`: Función para cerrar sesión
- `refresh()`: Refrescar datos de usuario

---

#### `useUser()`

Hook para obtener datos del usuario.

```tsx
const { user, loading, error, refetch } = useUser()
```

**Returns:**
- `user`: Datos del usuario de reserrega.users
- `loading`: Estado de carga
- `error`: Error
- `refetch()`: Refetch datos

---

#### `useSession()`

Hook para sesión actual.

```tsx
const { session, loading, error } = useSession()
```

---

### Server Helpers

#### `getUser()`

Obtener usuario actual (server-side).

```ts
import { getUser } from '@/shared/auth/server'

const user = await getUser()
if (!user) {
  // No autenticado
}
```

**Returns:** `AuthUser | null`

---

#### `requireAuth()`

Requerir autenticación (redirige si no está autenticado).

```ts
import { requireAuth } from '@/shared/auth/server'

const user = await requireAuth() // throw redirect if not authenticated
```

**Returns:** `AuthUser`
**Throws:** Redirect a `/auth/login`

---

#### `requireRole(allowedRoles)`

Requerir rol específico.

```ts
import { requireRole } from '@/shared/auth/server'

const user = await requireRole(['admin', 'superadmin'])
```

**Params:**
- `allowedRoles`: Array de roles permitidos

**Returns:** `AuthUser`
**Throws:** Redirect a `/auth/login` o `/unauthorized`

---

### Middleware

#### `authMiddleware`

Middleware de Next.js para proteger rutas.

```ts
// src/middleware.ts
import { authMiddleware } from '@/shared/auth/middleware'

export default authMiddleware

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ]
}
```

**Rutas protegidas por defecto:**
- `/dashboard/*` - Requiere autenticación
- `/admin/*` - Requiere rol admin/superadmin

**Rutas públicas:**
- `/auth/*` - Login, register, callback
- `/` - Home pública

---

### Utils

#### `canAccess(role, resource, action?)`

Verificar si un rol puede acceder a un recurso.

```ts
import { canAccess } from '@/shared/auth/utils'

const allowed = canAccess('admin', 'companies', 'manage')
```

---

#### `hasPermission(user, permission)`

Verificar si un usuario tiene un permiso específico.

```ts
import { hasPermission } from '@/shared/auth/utils'

const allowed = hasPermission(user, {
  resource: 'products',
  action: 'create',
  companyId: 1
})
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
npm run test:auth
```

### Estructura de Tests

```
tests/
├── server.test.ts          # Tests de getUser, requireAuth, requireRole
├── hooks.test.ts           # Tests de useAuth, useUser, useSession
└── middleware.test.ts      # Tests de authMiddleware, roleGuard
```

---

## 🔄 Flujo de Autenticación

### 1. Registro

```
Usuario → /auth/register
  → RegisterForm (validación)
  → Supabase Auth (crea en auth.users)
  → /auth/callback
  → Crea registro en reserrega.users
  → Redirige a /dashboard
```

### 2. Login

```
Usuario → /auth/login
  → LoginForm (validación)
  → Supabase Auth (verifica credenciales)
  → /auth/callback
  → Obtiene datos de reserrega.users
  → Redirige a /dashboard
```

### 3. Acceso a Ruta Protegida

```
Usuario → /dashboard
  → Middleware verifica autenticación
  → Si no autenticado → redirect /auth/login
  → Si autenticado → permite acceso
  → Server Component usa requireAuth()
  → Renderiza página
```

---

## 📋 Checklist de Completitud

**Módulo Auth - Estado Actual:**

- [ ] Estructura de carpetas creada
- [ ] Tipos TypeScript definidos
- [ ] README.md escrito
- [ ] Server helpers (getUser, requireAuth, requireRole)
- [ ] Páginas de login y register
- [ ] Callback route
- [ ] Hooks (useAuth, useUser, useSession)
- [ ] Middleware de protección de rutas
- [ ] Utilidades y permisos
- [ ] AuthProvider
- [ ] Logout funcional
- [ ] Tests básicos

---

## 🔗 Referencias

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js 15 Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [PKCE Flow](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 📝 Notas

- **PKCE Flow:** Usado para seguridad en apps web
- **Cookies:** Gestionadas por @supabase/ssr
- **Multi-tenancy:** Verificar company_id en permisos
- **RLS:** Database ya tiene RLS habilitado
