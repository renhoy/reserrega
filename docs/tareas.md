# Tareas - MÓDULO: Admin Dashboard

## MÓDULO ACTIVO: Admin Dashboard 🔴

**Tareas Activas:** 0/10
**Progreso:** 0%

---

## SLOTS DE TRABAJO (Máximo 3 tareas activas)

### Slot 1: [VACÍO]
**Estado:** Disponible
**Tiempo estimado:** -

### Slot 2: [VACÍO]
**Estado:** Disponible
**Tiempo estimado:** -

### Slot 3: [VACÍO]
**Estado:** Disponible
**Tiempo estimado:** -

---

## BACKLOG

### 🔴 CRÍTICAS (Requeridas para completar módulo)

#### AD-001: Types y Utilidades Base
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Definir types para Company, Comercial, GlobalStats, SystemConfig
- Utilidades para formateo y validación
- Helpers para permisos de admin
- Utils para cálculos de estadísticas globales

**Archivos a crear:**
- `features/admin-dashboard/types/admin.types.ts`
- `features/admin-dashboard/lib/admin-utils.ts`

**Criterio de aceptación:**
- [ ] Types completos con JSDoc
- [ ] Company, Comercial, GlobalStats, SystemConfig types
- [ ] Request/Response types para server actions
- [ ] Helpers de formateo (fechas, números, porcentajes)
- [ ] Validadores para formularios
- [ ] Utils de permisos (isSuperadmin, canManageCompany, etc.)
- [ ] Funciones de cálculo para stats globales

---

#### AD-002: Componentes de Gestión de Empresas
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Tabla/Grid de empresas con búsqueda y filtros
- Dialog para crear/editar empresa
- Card de detalles de empresa
- Confirmación de eliminación

**Archivos a crear:**
- `features/admin-dashboard/components/CompanyManager.tsx`
- `features/admin-dashboard/components/CompanyDialog.tsx`
- `features/admin-dashboard/components/CompanyCard.tsx`

**Criterio de aceptación:**
- [ ] Lista de empresas con paginación
- [ ] Búsqueda por nombre
- [ ] Filtro por estado (activa/inactiva)
- [ ] Dialog para crear empresa con validación
- [ ] Dialog para editar empresa
- [ ] Confirmación antes de eliminar
- [ ] Toast notifications
- [ ] Loading y error states

---

#### AD-003: Componentes de Gestión de Comerciales
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Tabla de usuarios comerciales
- Dialog para crear/editar comercial
- Asignación de tienda
- Activar/Desactivar comercial

**Archivos a crear:**
- `features/admin-dashboard/components/ComercialManager.tsx`
- `features/admin-dashboard/components/ComercialDialog.tsx`
- `features/admin-dashboard/components/ComercialCard.tsx`

**Criterio de aceptación:**
- [ ] Lista de comerciales con filtros
- [ ] Filtro por empresa/tienda
- [ ] Filtro por estado (activo/inactivo)
- [ ] Dialog para crear comercial
- [ ] Dialog para editar comercial
- [ ] Asignar/reasignar tienda
- [ ] Cambiar estado (activo/inactivo)
- [ ] Validación de email y datos
- [ ] Toast notifications

---

#### AD-004: Componentes de Estadísticas Globales
**Prioridad:** Alta
**Tiempo:** 2-3 horas
**Descripción:**
- Dashboard con métricas globales del sistema
- Gráficos y visualizaciones
- Filtros por fecha y empresa

**Archivos a crear:**
- `features/admin-dashboard/components/GlobalStats.tsx`
- `features/admin-dashboard/components/StatsCard.tsx`
- `features/admin-dashboard/components/StatsChart.tsx`

**Criterio de aceptación:**
- [ ] Dashboard con 8-10 métricas principales
- [ ] Total de empresas activas
- [ ] Total de usuarios por rol
- [ ] Total de reservas (activas/completadas)
- [ ] Ingresos totales del sistema
- [ ] Métricas por empresa
- [ ] Filtros de fecha (última semana, mes, año)
- [ ] Cards responsivos
- [ ] Loading states

---

#### AD-005: Componentes de Configuración del Sistema
**Prioridad:** Media
**Tiempo:** 2-3 horas
**Descripción:**
- Panel de configuración global
- Editar tarifas y tiempos
- Configuración de emails
- Configuración de features

**Archivos a crear:**
- `features/admin-dashboard/components/SystemConfig.tsx`
- `features/admin-dashboard/components/ConfigForm.tsx`

**Criterio de aceptación:**
- [ ] Formulario de configuración general
- [ ] Campo: tarifa de reserva (€)
- [ ] Campo: días de validez de reserva
- [ ] Campo: minutos de bloqueo temporal
- [ ] Campo: porcentaje tienda/plataforma
- [ ] Validación de valores
- [ ] Guardar cambios
- [ ] Restaurar valores por defecto
- [ ] Toast de confirmación

---

#### AD-006: Componentes de Log de Actividad
**Prioridad:** Baja
**Tiempo:** 2 horas
**Descripción:**
- Tabla de actividad reciente
- Filtros por tipo de acción
- Filtros por usuario

**Archivos a crear:**
- `features/admin-dashboard/components/ActivityLog.tsx`
- `features/admin-dashboard/components/ActivityItem.tsx`

**Criterio de aceptación:**
- [ ] Lista de actividades recientes
- [ ] Filtro por tipo (create, update, delete)
- [ ] Filtro por entidad (company, user, reservation)
- [ ] Mostrar usuario y timestamp
- [ ] Paginación
- [ ] Loading states

---

#### AD-007: Server Actions
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Actions para CRUD de empresas
- Actions para gestión de comerciales
- Actions para estadísticas
- Actions para configuración

**Archivos a crear:**
- `features/admin-dashboard/actions/admin.actions.ts`

**Acciones a implementar:**
- [ ] getCompanies() - Obtener empresas con filtros
- [ ] createCompany() - Crear nueva empresa
- [ ] updateCompany() - Actualizar empresa
- [ ] deleteCompany() - Eliminar empresa
- [ ] getComercials() - Obtener comerciales con filtros
- [ ] createComercial() - Crear nuevo comercial
- [ ] updateComercial() - Actualizar comercial
- [ ] toggleComercialStatus() - Activar/desactivar
- [ ] getGlobalStats() - Obtener estadísticas globales
- [ ] getSystemConfig() - Obtener configuración
- [ ] updateSystemConfig() - Actualizar configuración
- [ ] getActivityLog() - Obtener log de actividad

**Criterio de aceptación:**
- [ ] Validación de permisos (solo superadmin)
- [ ] Manejo de errores completo
- [ ] Revalidación de paths
- [ ] TypeScript estricto
- [ ] Validación de datos de entrada

---

#### AD-008: Hooks de Gestión
**Prioridad:** Alta
**Tiempo:** 2 horas
**Descripción:**
- Hook para gestión de empresas
- Hook para gestión de comerciales
- Hook para estadísticas globales

**Archivos a crear:**
- `features/admin-dashboard/hooks/use-companies.ts`
- `features/admin-dashboard/hooks/use-comercials.ts`
- `features/admin-dashboard/hooks/use-global-stats.ts`

**Criterio de aceptación:**
- [ ] useCompanies - CRUD de empresas
- [ ] useComercials - CRUD de comerciales
- [ ] useGlobalStats - Estadísticas con auto-refresh
- [ ] Estados de loading y error
- [ ] Toast notifications
- [ ] Optimistic updates
- [ ] Memoización con useMemo

---

#### AD-009: Páginas y Rutas
**Prioridad:** Crítica
**Tiempo:** 3 horas
**Descripción:**
- Página principal del admin dashboard
- Página de gestión de empresas
- Página de gestión de comerciales
- Página de configuración

**Archivos a crear:**
- `src/app/(dashboard)/admin/page.tsx`
- `src/app/(dashboard)/admin/companies/page.tsx`
- `src/app/(dashboard)/admin/comercials/page.tsx`
- `src/app/(dashboard)/admin/config/page.tsx`

**Criterio de aceptación:**
- [ ] /admin - Dashboard con resumen
- [ ] /admin/companies - Gestión de empresas
- [ ] /admin/comercials - Gestión de comerciales
- [ ] /admin/config - Configuración del sistema
- [ ] Navegación con tabs o sidebar
- [ ] Layout responsivo
- [ ] Protección por permisos (requireRole('superadmin'))
- [ ] Breadcrumbs

---

#### AD-010: README y Documentación
**Prioridad:** Media
**Tiempo:** 1 hora
**Descripción:**
- Documentación completa del módulo
- Ejemplos de uso
- API documentation

**Archivos a crear:**
- `features/admin-dashboard/README.md`

**Criterio de aceptación:**
- [ ] Descripción del módulo
- [ ] Estructura de archivos
- [ ] Guía de uso
- [ ] Documentación de componentes
- [ ] Documentación de server actions
- [ ] Documentación de hooks
- [ ] Tipos principales
- [ ] Permisos y restricciones
- [ ] Ejemplos de código

---

## DEPENDENCIAS

### Módulos requeridos (READ-ONLY):
- ✅ shared/database - Schema de companies, users, config
- ✅ shared/auth - Sistema de autenticación y permisos
- ✅ shared/common - UI components y layouts

### Tablas de Base de Datos:
- `reserrega.companies` - Empresas/tiendas
- `reserrega.users` - Usuarios del sistema
- `reserrega.config` - Configuración global
- `reserrega.stores` - Tiendas físicas
- `reserrega.reservations` - Para estadísticas
- `reserrega.gifts` - Para estadísticas

---

## ORDEN DE DESARROLLO RECOMENDADO

1. **AD-001** - Types y Utilidades (base para todo)
2. **AD-007** - Server Actions (lógica de backend)
3. **AD-008** - Hooks (capa de abstracción)
4. **AD-002** - Gestión de Empresas (funcionalidad principal)
5. **AD-003** - Gestión de Comerciales
6. **AD-004** - Estadísticas Globales
7. **AD-005** - Configuración del Sistema
8. **AD-006** - Log de Actividad (opcional)
9. **AD-009** - Páginas y Rutas (integración)
10. **AD-010** - Documentación

---

## NOTAS IMPORTANTES

### Permisos
- **Solo superadmin** puede acceder a este módulo
- Validar permisos en Server Actions
- Proteger rutas con middleware

### Multi-tenancy
- Superadmin ve TODAS las empresas
- Estadísticas globales incluyen todas las empresas
- Filtrar por empresa en las vistas

### Configuración
- Valores en `reserrega.config` (JSONB)
- Keys: reservation_fee, reservation_days, gift_lock_minutes, etc.
- Cambios afectan a todo el sistema

### Estadísticas
- Cálculos en tiempo real desde BD
- Agregar por empresa/tienda
- Cachear con SWR o similar

---

## RESTRICCIONES

- NO modificar tablas de base de datos
- NO modificar módulos completados (READ-ONLY)
- Solo lectura de shared/* y features/* completados
- Seguir patrones establecidos en módulos anteriores
- TypeScript estricto
- Validación completa de datos

---

_Creado: 2025-11-20_
_Módulo: Admin Dashboard_
_Estado: Planificación_
