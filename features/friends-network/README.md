# Friends-Network Module

**Estado:** ✅ Completado
**Versión:** 1.0.0
**Última actualización:** 2025-01-17

## 📋 Descripción

El módulo Friends-Network gestiona la red social de amigos dentro de Reserrega, permitiendo a los usuarios:
- Enviar y gestionar solicitudes de amistad
- Buscar usuarios para agregar como amigos
- Invitar amigos por email con tokens seguros
- Ver wishlists de amigos
- Gestionar su círculo de regaladores

## 🏗️ Arquitectura

```
features/friends-network/
├── actions/
│   └── friends.actions.ts        # Server Actions
├── components/
│   ├── FriendCard.tsx            # Tarjeta individual de amigo
│   ├── FriendsList.tsx           # Lista de amigos con búsqueda
│   ├── FriendRequestCard.tsx     # Tarjeta de solicitud
│   ├── FriendRequestsList.tsx    # Lista de solicitudes
│   ├── InviteFriendForm.tsx      # Formulario de invitación
│   └── UserSearchBar.tsx         # Barra de búsqueda de usuarios
├── hooks/
│   └── use-friends.ts            # Hooks personalizados
├── lib/
│   └── friends-utils.ts          # Funciones utilitarias
├── types/
│   └── friends.types.ts          # Definiciones de tipos
└── README.md                     # Este archivo
```

## 🎯 Funcionalidades Completadas

### ✅ FN-001: Types y Utilidades Base
- Sistema completo de tipos TypeScript
- 30+ funciones utilitarias
- Generación y validación de tokens
- Formateo de estados y fechas

### ✅ FN-002: Componentes de Solicitudes
- `FriendRequestCard` con estados visuales
- `FriendRequestsList` con tabs recibidas/enviadas
- Acciones aprobar/rechazar/cancelar
- Estadísticas de solicitudes

### ✅ FN-003: Componentes de Lista y Búsqueda
- `FriendCard` con menú de acciones
- `FriendsList` con búsqueda y filtros
- `UserSearchBar` con debounce
- `InviteFriendForm` para invitaciones email

### ✅ FN-004: Server Actions
- `getFriends`: Obtener amigos con soporte bidireccional
- `getFriendRequests`: Solicitudes recibidas y enviadas
- `sendFriendRequest`: Enviar solicitudes con validación
- `manageFriendRequest`: Aceptar/rechazar/cancelar
- `searchUsers`: Búsqueda con estado de amistad
- `generateInvitation`: Invitaciones con tokens seguros

### ✅ FN-005: Hooks de Gestión
- `useFriends`: Gestión de lista de amigos
- `useFriendRequests`: Manejo de solicitudes
- `useUserSearch`: Búsqueda en tiempo real
- `useInvitation`: Generación de invitaciones

### ✅ FN-006: Páginas y Rutas
- `/friends`: Lista principal de amigos
- `/friends/requests`: Gestión de solicitudes
- `/friends/invite`: Buscar e invitar amigos

### ✅ FN-007: README y Documentación
- Documentación completa del módulo
- Ejemplos de uso
- Guías de integración

## 🚀 Uso

### Ejemplo: Listar Amigos

```typescript
import { getFriends } from '@/features/friends-network/actions/friends.actions'

export default async function MyPage() {
  const { friends } = await getFriends()

  return (
    <div>
      {friends.map(friend => (
        <p key={friend.id}>{friend.name}</p>
      ))}
    </div>
  )
}
```

### Ejemplo: Enviar Solicitud de Amistad

```typescript
'use client'

import { useFriendRequests } from '@/features/friends-network/hooks/use-friends'

export function SendRequestButton({ userId }: { userId: string }) {
  const { sendRequest } = useFriendRequests()

  return (
    <button onClick={() => sendRequest(userId)}>
      Enviar solicitud
    </button>
  )
}
```

### Ejemplo: Buscar Usuarios

```typescript
'use client'

import { UserSearchBar } from '@/features/friends-network/components/UserSearchBar'
import { useUserSearch } from '@/features/friends-network/hooks/use-friends'

export function SearchUsers() {
  const { search, sendRequestToUser } = useUserSearch()

  return (
    <UserSearchBar
      onSearch={search}
      onSendRequest={sendRequestToUser}
    />
  )
}
```

## 📊 Tablas de Base de Datos

### `friend_requests`
```sql
- id: string (PK)
- sender_id: string (FK → users)
- recipient_id: string (FK → users)
- status: 'pending' | 'accepted' | 'rejected'
- invitation_token: string | null
- invitation_email: string | null
- created_at: timestamp
- updated_at: timestamp
```

### `friendships`
```sql
- id: string (PK)
- user_id: string (FK → users)
- friend_id: string (FK → users)
- created_at: timestamp
```

**Nota:** Las amistades son bidireccionales. Al aceptar una solicitud se crean dos registros en `friendships`.

## 🎨 Componentes Principales

### FriendsList
Lista completa de amigos con:
- Búsqueda por nombre/email
- Ordenamiento (nombre, fecha)
- Grid responsivo
- Estados vacíos

**Props:**
```typescript
interface FriendsListProps {
  friends: FriendInfo[]
  onViewWishlist?: (friendId: string) => void
  onRemoveFriend?: (friendId: string) => Promise<void>
  onAddFriend?: () => void
  isLoading?: boolean
}
```

### FriendRequestsList
Gestión de solicitudes con:
- Tabs recibidas/enviadas
- Acciones aprobar/rechazar/cancelar
- Badges de estado
- Estadísticas

**Props:**
```typescript
interface FriendRequestsListProps {
  currentUserId: string
  receivedRequests: FriendRequestWithUsers[]
  sentRequests: FriendRequestWithUsers[]
  onAccept?: (requestId: string) => Promise<void>
  onReject?: (requestId: string) => Promise<void>
  onCancel?: (requestId: string) => Promise<void>
  isLoading?: boolean
}
```

### UserSearchBar
Búsqueda de usuarios con:
- Debounce personalizado (300ms)
- Resultados en tiempo real
- Estado de amistad
- Envío de solicitudes

**Props:**
```typescript
interface UserSearchBarProps {
  onSearch: (query: string) => Promise<UserSearchResult[]>
  onSendRequest: (userId: string) => Promise<void>
  placeholder?: string
  minSearchLength?: number
  debounceMs?: number
}
```

### InviteFriendForm
Invitaciones por email con:
- Validación de email
- Generación de token seguro
- Link de invitación
- Copiar al portapapeles

**Props:**
```typescript
interface InviteFriendFormProps {
  onSendInvitation: (data: SendInvitationFormData) => Promise<EmailInvitation>
  onClose?: () => void
  isLoading?: boolean
}
```

## 🔐 Seguridad

- ✅ Tokens de invitación con UUID v4
- ✅ Expiración de invitaciones (7 días)
- ✅ Validación de permisos en server actions
- ✅ Prevención de solicitudes duplicadas
- ✅ Normalización de emails
- ✅ Verificación de autenticación

## 🧪 Testing

### Casos de Prueba Recomendados

1. **Solicitudes de Amistad**
   - ✅ Enviar solicitud a usuario válido
   - ✅ No permitir solicitud a uno mismo
   - ✅ No permitir solicitudes duplicadas
   - ✅ Aceptar/rechazar solicitud recibida
   - ✅ Cancelar solicitud enviada

2. **Búsqueda de Usuarios**
   - ✅ Buscar por nombre
   - ✅ Buscar por email
   - ✅ Filtrar usuarios ya amigos
   - ✅ Mostrar solicitudes pendientes

3. **Invitaciones**
   - ✅ Generar token válido
   - ✅ Validar email
   - ✅ No permitir email ya registrado
   - ✅ Verificar expiración

## 🎯 Próximas Mejoras (Futuras)

- [ ] Notificaciones push para solicitudes
- [ ] Sugerencias de amigos (mutual friends)
- [ ] Importar contactos
- [ ] Grupos de amigos
- [ ] Bloquear usuarios
- [ ] Eliminar amigos (implementar server action)

## 📝 Notas de Desarrollo

### Decisiones de Diseño

1. **Bidireccionalidad**: Las amistades se guardan como dos registros para facilitar consultas.
2. **Estados separados**: `friend_requests` para pendientes/rechazadas, `friendships` para aceptadas.
3. **Tokens seguros**: UUID v4 para invitaciones con expiración.
4. **Debounce custom**: Evita dependencia externa de lodash.

### Dependencias

- `date-fns`: Manejo de fechas
- `lucide-react`: Iconos
- `sonner`: Notificaciones toast
- `@supabase/ssr`: Cliente Supabase

## 📚 Referencias

- [Documentación de Supabase](https://supabase.com/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [React Hooks](https://react.dev/reference/react)

---

**Módulo desarrollado para Reserrega** 🎁
Última actualización: 2025-01-17
