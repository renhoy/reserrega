# Reserrega

Red social de regalos que permite reservar productos en tiendas físicas y crear listas de deseos compartidas con amigos y familia.

## 🎯 Concepto

Reserrega conecta tiendas físicas con usuarias que quieren evitar regalos duplicados o equivocados:

- **Reserva productos** en tienda física (€1, válido 15 días)
- **Crea tu wishlist** con productos exactos (talla, color)
- **Comparte con amigos** para que sepan qué regalarte
- **Recibe regalos perfectos** sin sorpresas indeseadas

## 🚀 Setup del Proyecto

### 1. Clonar y Instalar

```bash
git clone <repo-url>
cd reserrega
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Completa los valores de Supabase en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Setup Base de Datos

**Paso 3.1: Ejecutar Schema**

En Supabase SQL Editor, ejecuta:
```bash
cat shared/database/schema/RESERREGA_FINAL.sql
```

**Paso 3.2: Setup Inicial (Superadmin + Empresa Demo)**

En Supabase SQL Editor, ejecuta:
```bash
cat SETUP_INICIAL_COMPLETO.sql
```

Esto crea:
- ✅ Usuario Superadmin (josivela+super@gmail.com)
- ✅ Empresa Demo (id=1)
- ✅ Issuer Demo

### 4. Iniciar Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
reserrega/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   ├── components/             # Componentes React
│   ├── lib/                    # Utilidades y configs
│   │   ├── supabase/          # Clientes Supabase
│   │   └── ...
│   └── ...
├── shared/
│   ├── database/              # Módulo Database
│   │   ├── schema/           # Schema SQL
│   │   ├── types/            # TypeScript types
│   │   ├── scripts/          # Scripts utilidad
│   │   └── README.md         # Docs del módulo
│   └── ...
├── docs/                      # Documentación del proyecto
│   ├── PRD.md                # Product Requirements Document
│   ├── claude.md             # Workflow de desarrollo
│   ├── planificacion.md      # Timeline MVP
│   ├── tareas.md             # Tareas por módulo
│   ├── design-system.md      # UI/UX specs
│   └── ADAPTACIONES.md       # Limpieza de Redpresu
├── SETUP_INICIAL_COMPLETO.sql # Setup completo (superadmin + empresa)
├── SETUP_SUPERADMIN.sql       # Solo superadmin
├── SETUP_EMPRESA_DEMO.sql     # Solo empresa demo
├── .env.example               # Template de variables
└── README.md                  # Este archivo
```

## 🗄️ Base de Datos

**Schema:** `reserrega`
**Base de datos:** PostgreSQL (Supabase)
**Multi-tenancy:** Por `company_id`

### Tablas (13 total)

**Heredadas de Redpresu (6):**
- `users` - Usuarios del sistema
- `companies` - Empresas partner (tiendas)
- `issuers` - Datos fiscales
- `config` - Configuración global (JSONB)
- `subscriptions` - Suscripciones Stripe
- `contact_messages` - Mensajes de contacto
- `user_invitations` - Invitaciones de usuarios

**Nuevas de Reserrega (7):**
- `stores` - Ubicaciones físicas de tiendas
- `products` - Catálogo de productos (ropa)
- `reservations` - Reservas de productos (€1, 15 días)
- `wishlists` - Listas de deseos
- `gifts` - Regalos realizados
- `friend_requests` - Solicitudes de amistad
- `friendships` - Amistades confirmadas

Ver documentación completa: [shared/database/README.md](shared/database/README.md)

## 🔐 Roles y Permisos

**4 roles del sistema:**

| Rol | Permisos |
|-----|----------|
| `superadmin` | Acceso total a todo el sistema |
| `admin` | Gestión de su empresa y usuarios |
| `comercial` | Gestión de tiendas y productos |
| `usuario` | Crear wishlists, reservar, regalar |

**Row Level Security (RLS)** habilitado en todas las tablas.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Ver coverage
npm run test:coverage
```

## 📚 Documentación

- **[PRD.md](docs/PRD.md)** - Requisitos del producto
- **[claude.md](docs/claude.md)** - Workflow de desarrollo modular
- **[planificacion.md](docs/planificacion.md)** - Timeline MVP (4 semanas)
- **[tareas.md](docs/tareas.md)** - Backlog de tareas por módulo
- **[design-system.md](docs/design-system.md)** - Guía de UI/UX
- **[Database README](shared/database/README.md)** - Schema y setup

## 🏗️ Stack Tecnológico

- **Framework:** Next.js 15.5.4 (App Router)
- **UI:** React 19, TypeScript 5
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (PKCE)
- **Payments:** Stripe
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **State:** Server Actions + React Context

## 📝 Scripts SQL en Raíz

Estos scripts están listos para copiar y pegar en Supabase SQL Editor:

- **`SETUP_INICIAL_COMPLETO.sql`** - Setup completo (recomendado)
  - Crea superadmin, empresa demo e issuer

- **`SETUP_SUPERADMIN.sql`** - Solo superadmin
  - Usuario: josivela+super@gmail.com

- **`SETUP_EMPRESA_DEMO.sql`** - Solo empresa demo
  - Company id=1 con issuer

## 🚦 Estado del Proyecto

**Fase Actual:** Desarrollo - Módulo Database

### Módulos Completados

- ✅ **Database** - Schema, tipos TypeScript, RLS policies

### Próximos Módulos

- ⏳ **Auth** - Registro, login, roles
- ⏳ **Tiendas** - CRUD de stores y products
- ⏳ **Reservas** - Sistema de reservas €1
- ⏳ **Wishlists** - Listas de deseos
- ⏳ **Gifts** - Flujo de regalos
- ⏳ **Friends** - Sistema de amistades
- ⏳ **Payments** - Integración Stripe (simulado en MVP)

Ver detalle en [docs/planificacion.md](docs/planificacion.md)

## 🤝 Contribuir

Este proyecto sigue un workflow modular estricto:

1. **Un módulo a la vez** - Ver `docs/claude.md`
2. **Sin modificar módulos READ-ONLY**
3. **Seguir estructura de carpetas**
4. **Tests antes de completar módulo**

## 📄 Licencia

[Pendiente]

## 👥 Autores

- José Ignacio Vela (@josivela)
