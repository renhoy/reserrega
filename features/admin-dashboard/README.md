# Admin Dashboard Module

Panel administrativo para superadmins - gestión de empresas, comerciales, estadísticas globales y configuración del sistema.

## 📁 Estructura

```
features/admin-dashboard/
├── components/          # Componentes UI del dashboard
│   ├── CompanyManager.tsx
│   ├── ComercialManager.tsx
│   ├── GlobalStats.tsx
│   ├── SystemConfig.tsx
│   └── ActivityLog.tsx
├── actions/            # Server actions
│   └── admin.actions.ts
├── hooks/              # Custom hooks
│   ├── use-companies.ts
│   ├── use-comercials.ts
│   └── use-global-stats.ts
├── lib/                # Utilidades
│   └── admin-utils.ts
├── types/              # TypeScript types
│   └── admin.types.ts
├── README.md
└── index.ts
```

## 🎯 Funcionalidades

### 1. Gestión de Empresas
- ✅ Listar empresas con búsqueda y filtros
- ✅ Crear nueva empresa
- ✅ Editar datos de empresa
- ✅ Activar/Desactivar empresa
- ✅ Ver estadísticas por empresa

### 2. Gestión de Comerciales
- ✅ Listar usuarios comerciales
- ✅ Crear nuevo comercial
- ✅ Editar datos de comercial
- ✅ Asignar/reasignar tienda
- ✅ Activar/Desactivar comercial

### 3. Estadísticas Globales
- ✅ Dashboard con métricas del sistema
- ✅ Total de empresas, usuarios, reservas
- ✅ Ingresos totales del sistema
- ✅ Métricas de crecimiento
- ✅ Filtros por fecha y empresa

### 4. Configuración del Sistema
- ✅ Editar tarifa de reserva
- ✅ Configurar días de validez
- ✅ Configurar tiempos de bloqueo
- ✅ Configuración de emails
- ✅ Feature flags

### 5. Log de Actividad
- ✅ Historial de acciones administrativas
- ✅ Registro de cambios
- ✅ Auditoría de sistema

## 🔐 Permisos

- **Superadmin**: Acceso completo a todas las funcionalidades
- **Admin**: Solo gestión de comerciales de su empresa
- **Otros roles**: Sin acceso

## 📊 Types Principales

```typescript
// Company
interface Company {
  id: number
  name: string
  nif: string
  address: string
  status: 'active' | 'inactive'
  // ... más campos
}

// Comercial
interface Comercial {
  id: string
  email: string
  name: string
  company_id: number
  store_id: number | null
  status: 'active' | 'inactive'
}

// GlobalStats
interface GlobalStats {
  total_companies: number
  total_users: number
  total_reservations: number
  total_revenue: number
  // ... más métricas
}
```

## 🛠️ Utilidades

```typescript
import {
  formatCurrency,
  validateNIF,
  isSuperadmin,
  calculateGrowthRate,
} from '@/features/admin-dashboard'

// Formateo
formatCurrency(1234.56) // "1.234,56 €"

// Validación
validateNIF('12345678Z') // true/false

// Permisos
isSuperadmin(userRole) // true/false

// Cálculos
calculateGrowthRate(120, 100) // 20
```

## 🎨 Componentes

### CompanyManager
Gestión completa de empresas con tabla, búsqueda, filtros y dialogs.

### ComercialManager
Gestión de usuarios comerciales con asignación de tiendas.

### GlobalStats
Dashboard con estadísticas y métricas del sistema.

### SystemConfig
Panel de configuración global del sistema.

### ActivityLog
Registro de actividad administrativa.

## 🚀 Uso

```tsx
import { CompanyManager, GlobalStats } from '@/features/admin-dashboard'

export default function AdminPage() {
  return (
    <div>
      <GlobalStats />
      <CompanyManager />
    </div>
  )
}
```

## ⚙️ Estado

**Status**: ✅ Completado
**Módulo**: 9/11 (FASE 3)
**Prioridad**: Alta

### Progreso
- [x] AD-001: Types y utilidades base
- [x] AD-002: Componentes de gestión de empresas
- [x] AD-003: Componentes de gestión de comerciales
- [x] AD-004: Componentes de estadísticas globales (GlobalStats, StatsCard)
- [x] AD-005: Componentes de configuración (SystemConfig)
- [x] AD-007: Server actions (12 actions implementadas)
- [x] AD-008: Custom hooks (use-companies, use-comercials, use-global-stats)
- [x] AD-009: Páginas del dashboard (/admin, /companies, /comercials, /config)
- [x] AD-010: Documentación y exports

### Archivos Creados (Nuevos en esta sesión)
- `components/StatsCard.tsx` - Card para métricas individuales
- `components/GlobalStats.tsx` - Dashboard de estadísticas
- `components/SystemConfig.tsx` - Panel de configuración
- `actions/admin.actions.ts` - 12 server actions
- `hooks/use-companies.ts` - Hook gestión empresas
- `hooks/use-comercials.ts` - Hook gestión comerciales
- `hooks/use-global-stats.ts` - Hook estadísticas
- `src/app/(dashboard)/admin/page.tsx` - Dashboard principal
- `src/app/(dashboard)/admin/companies/page.tsx` - Página empresas
- `src/app/(dashboard)/admin/comercials/page.tsx` - Página comerciales
- `src/app/(dashboard)/admin/config/page.tsx` - Página configuración
