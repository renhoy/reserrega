# Reserrega 🎁

> Red social de regalos que conecta tiendas físicas con usuarias que quieren evitar regalos duplicados o equivocados.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-green)](https://supabase.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)

---

## 📋 Tabla de Contenidos

- [Concepto](#-concepto)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Setup del Proyecto](#-setup-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Deploy](#-deploy)
- [Documentación](#-documentación)

---

## 🎯 Concepto

Reserrega conecta tiendas físicas con usuarias que quieren evitar regalos duplicados o equivocados:

### Para Usuarios
- 🛍️ **Reserva productos** en tienda física (€1, válido 15 días)
- 📝 **Crea tu wishlist** con productos exactos (talla, color, modelo)
- 👥 **Comparte con amigos** para que sepan qué regalarte
- 🎁 **Recibe regalos perfectos** sin sorpresas indeseadas

### Para Comerciales
- 📱 **Escanea QR** del usuario para iniciar sesión de compra
- 🔍 **Escanea productos** (código de barras) durante la sesión
- 📦 **Gestiona reservas** activas de tu tienda
- ✅ **Marca como enviado** cuando el producto llega

### Para Administradores
- 🏢 **Gestiona empresas** y tiendas del sistema
- 👤 **Gestiona comerciales** y sus permisos
- 📊 **Visualiza estadísticas** globales del sistema
- ⚙️ **Configura parámetros** del sistema

---

## 📊 Estado del Proyecto

### Progreso General: **91% Completado** (10/11 módulos)

#### ✅ MVP COMPLETADO (8/8 módulos)
- ✅ Database - Schema multi-tenant, RLS policies
- ✅ Auth - Sistema de autenticación completo
- ✅ Common - UI components y utilidades
- ✅ Product-Reservation - Reserva de productos con QR
- ✅ Wishlist - Gestión de listas de deseos
- ✅ Friends-Network - Red social de amigos
- ✅ Gift-Flow - Flujo completo de regalos
- ✅ Store-Panel - Panel para comerciales

#### 🟡 FASE 3 (2/3 módulos completados)
- ✅ Admin Dashboard - Panel administrativo COMPLETO
- 🟡 Testing & Bug Fixes - Build exitoso, faltan tests manuales
- 🟡 Deploy & Onboarding - **Configuración 100% lista**, falta deploy manual

### Deployment Status
```
✅ Build compilando correctamente
✅ Package.json configurado con Turbopack (puerto 3434)
✅ Variables de entorno documentadas (.env.example)
✅ Next.js optimizado (standalone, security headers)
✅ Docker multi-stage ready
✅ PM2 cluster mode configurado
✅ Health check API implementado (/api/health)
✅ Documentación completa (VERCEL_DEPLOY.md, QUICKSTART.md)
🟢 READY TO DEPLOY - Ver DEPLOY_INSTRUCTIONS.md
```

---

## 🏗️ Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Usuario    │  │  Comercial   │  │    Admin     │ │
│  │   Dashboard  │  │    Panel     │  │   Dashboard  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Server Actions & API Routes                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Auth  │  Reservas  │  Wishlist  │  Gifts  │ etc │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase (Backend as a Service)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │ │
│  │   Database   │  │    Service   │  │   (Future)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Multi-Tenancy

El sistema soporta múltiples empresas (multi-tenant) mediante:
- Tabla `companies` como entidad principal
- Todas las tablas relacionadas filtran por `company_id`
- RLS Policies que aseguran aislamiento de datos
- Roles: Superadmin, Admin, Comercial, Usuario

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS
- **Componentes UI:** shadcn/ui + Radix UI
- **Iconos:** Lucide React
- **Forms:** React Hook Form
- **Estado:** React Context + Server Actions

### Backend
- **BaaS:** Supabase Cloud
- **Base de Datos:** PostgreSQL
- **Autenticación:** Supabase Auth
- **ORM/Cliente:** Supabase Client
- **Server Actions:** Next.js Server Actions

### Herramientas de Desarrollo
- **Linting:** ESLint
- **Formateo:** Prettier
- **Type Checking:** TypeScript
- **Package Manager:** npm
- **Version Control:** Git

---

## 📦 Módulos del Sistema

### SHARED (Módulos Base)

#### 1. Database (`shared/database/`)
- Schema multi-tenant con 13 tablas
- RLS Policies por rol
- Tipos TypeScript generados
- Scripts de setup

#### 2. Auth (`shared/auth/`)
- Login/Register
- Middleware de protección
- Helpers server-side (requireAuth, requireRole)
- Sistema de permisos

#### 3. Common (`shared/common/`)
- 25+ componentes UI (shadcn/ui)
- Layouts (Header, Sidebar, Footer)
- Hooks compartidos (useToast, usePermissions)
- Utilidades (formatters, validators)

### FEATURES (Módulos de Funcionalidad)

#### 4. Product-Reservation (`features/product-reservation/`)
**Funcionalidad:**
- QR Generator (auto-refresh 24h)
- QR/Barcode Scanner
- Formulario de reserva
- Pago simulado (€1)

**Páginas:**
- `/qr` - Generar QR personal
- `/reservations` - Ver mis reservas
- `/scan` - Escanear productos (comercial)

#### 5. Wishlist (`features/wishlist/`)
**Funcionalidad:**
- Grid de productos reservados
- Filtros por estado (disponible, en proceso, regalado, expirado)
- Control de visibilidad (privado, amigos, público)
- Warnings de expiración

**Páginas:**
- `/wishlist` - Mi lista de deseos
- `/wishlist/[id]` - Detalle de producto

#### 6. Friends-Network (`features/friends-network/`)
**Funcionalidad:**
- Solicitudes de amistad
- Búsqueda de usuarios
- Invitaciones por email (tokens 7 días)
- Gestión de red de amigos

**Páginas:**
- `/friends` - Lista de amigos
- `/friends/requests` - Solicitudes pendientes
- `/friends/invite` - Invitar por email

#### 7. Gift-Flow (`features/gift-flow/`)
**Funcionalidad:**
- Ver wishlist de amigos
- Bloqueo temporal de producto (15 min)
- Checkout con pago simulado
- Confirmación de entrega
- Historial de regalos

**Páginas:**
- `/gift/[friendId]` - Wishlist del amigo
- `/gift/[friendId]/checkout` - Checkout
- `/gift/history` - Mi historial de regalos

#### 8. Store-Panel (`features/store-panel/`)
**Funcionalidad:**
- Escanear QR de usuario
- Escanear productos (barcode)
- Gestión de sesiones de compra
- Ver reservas de la tienda
- Marcar productos como enviados
- Estadísticas de tienda

**Páginas:**
- `/store` - Dashboard comercial (3 tabs)
- `/store/session/[userId]` - Sesión activa

#### 9. Admin-Dashboard (`features/admin-dashboard/`)
**Funcionalidad:**
- CRUD de empresas
- CRUD de comerciales
- Dashboard con 16 métricas globales
- Configuración del sistema
- Auto-refresh de estadísticas

**Páginas:**
- `/admin` - Dashboard principal
- `/admin/companies` - Gestión de empresas
- `/admin/comercials` - Gestión de comerciales
- `/admin/config` - Configuración del sistema

---

## 🚀 Setup del Proyecto

### 1. Requisitos Previos

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **Cuenta Supabase:** [supabase.com](https://supabase.com)

### 2. Clonar y Instalar

```bash
# Clonar el repositorio
git clone https://github.com/renhoy/public.git
cd reserrega

# Instalar dependencias
npm install --legacy-peer-deps
```

### 3. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env.local
```

Completar en `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3434
```

### 4. Setup Base de Datos

**Paso 4.1: Ejecutar Schema Principal**
```sql
-- En Supabase SQL Editor, ejecutar:
shared/database/schema/RESERREGA_FINAL.sql
```

**Paso 4.2: Configurar Permisos**
```sql
-- En Supabase SQL Editor, ejecutar:
shared/database/scripts/setup-permissions.sql
```

**Paso 4.3: Setup Inicial (Opcional)**
```sql
-- Crear superadmin y empresa demo:
SETUP_INICIAL_COMPLETO.sql
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3434](http://localhost:3434)

---

## 📁 Estructura del Proyecto

```
reserrega/
├── docs/                          # Documentación del proyecto
│   ├── PRD.md                    # Product Requirements Document
│   ├── planificacion.md          # Planificación y timeline
│   ├── tareas.md                 # Tareas y progreso
│   └── claude.md                 # Instrucciones para Claude Code
│
├── features/                      # Módulos de funcionalidad
│   ├── product-reservation/      # Módulo de reservas
│   ├── wishlist/                 # Módulo de wishlist
│   ├── friends-network/          # Módulo de amigos
│   ├── gift-flow/                # Módulo de regalos
│   ├── store-panel/              # Módulo de comerciales
│   └── admin-dashboard/          # Módulo de administración
│
├── shared/                        # Módulos compartidos
│   ├── database/                 # Schema y configuración DB
│   ├── auth/                     # Sistema de autenticación
│   └── common/                   # UI components y utilidades
│
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── (auth)/              # Rutas de autenticación
│   │   ├── (app)/               # Rutas protegidas de usuario
│   │   ├── (comercial)/         # Rutas de comerciales
│   │   └── (dashboard)/         # Rutas de admin
│   └── lib/                      # Librerías y configuración
│
└── public/                        # Assets estáticos
```

---

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Build
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Linting
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Ejecutar ESLint y auto-fix

# Type Checking
npm run type-check   # Verificar tipos TypeScript
```

### Guía de Desarrollo

#### Crear un Nuevo Módulo

1. Crear carpeta en `features/nombre-modulo/`
2. Estructura base:
```
nombre-modulo/
├── components/       # Componentes React
├── actions/          # Server Actions
├── hooks/            # Custom Hooks
├── lib/              # Utilidades
├── types/            # Types TypeScript
├── README.md         # Documentación
└── index.ts          # Exports
```

3. Documentar en `docs/tareas.md`
4. Actualizar `docs/PRD.md` cuando se complete

#### Reglas de Desarrollo

- ✅ Un módulo a la vez
- ✅ Completar antes de avanzar
- ✅ Marcar como READ-ONLY al completar
- ✅ Actualizar documentación
- ⛔ No modificar módulos READ-ONLY sin autorización

---

## 🚀 Deploy

### Deploy a Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno en Vercel Dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 📚 Documentación

### Documentación del Proyecto
- **[PRD.md](docs/PRD.md)** - Product Requirements Document
- **[planificacion.md](docs/planificacion.md)** - Timeline y planificación
- **[tareas.md](docs/tareas.md)** - Estado y tareas
- **[claude.md](docs/claude.md)** - Guía para desarrollo

### Documentación de Módulos
Cada módulo tiene su propio README:
- `features/product-reservation/README.md`
- `features/wishlist/README.md`
- `features/friends-network/README.md`
- `features/gift-flow/README.md`
- `features/store-panel/README.md`
- `features/admin-dashboard/README.md`

### Base de Datos
- **Schema:** `shared/database/schema/RESERREGA_FINAL.sql`
- **Permisos:** `shared/database/scripts/setup-permissions.sql`
- **Docs:** `shared/database/README.md`

---

## 🎨 Diseño y Branding

### Colores
- **Primary:** Pink/Rose (#ec4899)
- **Accent:** Pink-600
- **Background:** White/Slate
- **Text:** Slate-900/White

### Tipografía
- **Font:** System UI Stack (Inter preferido)
- **Sizes:** Tailwind typography scale

---

## 🔐 Seguridad

### Row Level Security (RLS)
Todas las tablas tienen RLS Policies que aseguran:
- Usuarios solo ven sus propios datos
- Comerciales solo ven datos de su tienda
- Admins solo ven datos de su empresa
- Superadmins ven todo

### Autenticación
- Supabase Auth con JWT
- Middleware de Next.js para protección de rutas
- Server Actions con validación de permisos

---

## 👥 Roles y Permisos

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Usuario** | Usuario final | Wishlist, Amigos, Regalos |
| **Comercial** | Empleado de tienda | Store Panel, Reservas |
| **Admin** | Administrador de empresa | Gestión de comerciales |
| **Superadmin** | Administrador del sistema | Todo el sistema |

---

## 📈 Roadmap

### ✅ Fase 1 - MVP (Completado)
- [x] Database y Auth
- [x] Reservas y Wishlist
- [x] Red de Amigos
- [x] Flujo de Regalos
- [x] Panel de Comerciales
- [x] Admin Dashboard

### 🟡 Fase 2 - Testing y Deploy (En Progreso)
- [x] Build exitoso
- [ ] Tests end-to-end
- [ ] Deploy a Vercel
- [ ] Onboarding de empresa demo

### 🔮 Fase 3 - Marketplace (Futuro)
- [ ] Múltiples tiendas por producto
- [ ] Sistema de escrow real
- [ ] Tracking de envíos
- [ ] Gamificación

---

## 🤝 Contribución

Este es un proyecto privado en desarrollo. Para contribuir:

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📝 Licencia

Proyecto privado - Todos los derechos reservados © 2025

---

## 📞 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

## 🙏 Agradecimientos

- **Next.js** - Framework React
- **Supabase** - Backend as a Service
- **shadcn/ui** - Componentes UI
- **Vercel** - Hosting y deploy
- **Tailwind CSS** - Framework CSS

---

**Última actualización:** 2025-11-20
**Versión:** 0.9.5 (86% completado)
**Estado:** Beta - Listo para testing
