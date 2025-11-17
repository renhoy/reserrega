# Tareas - MÓDULO: Common

## MÓDULO ACTIVO: Common 🔴

**Tareas Activas:** 0/3
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

#### COM-001: Setup shadcn/ui y Tailwind
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Configurar Tailwind CSS
- Instalar shadcn/ui
- Configurar components.json
- Instalar componentes base (Button, Input, Card, etc.)
- Configurar theme (colors, fonts)

**Archivos a crear:**
- `shared/common/lib/utils.ts`
- `shared/common/components/ui/*` (shadcn components)
- `tailwind.config.ts` (actualizar)
- `components.json`

**Criterio de aceptación:**
- [ ] Tailwind configurado
- [ ] shadcn/ui instalado
- [ ] Componentes base funcionando
- [ ] Theme configurado

---

#### COM-002: Componentes UI Base
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- Instalar componentes shadcn/ui necesarios:
  - Button, Input, Label, Card
  - Select, Checkbox, Switch
  - Dialog, Sheet, Popover
  - Table, Avatar, Badge
  - Dropdown Menu
- Configurar variantes
- Documentar uso

**Archivos a crear:**
- `shared/common/components/ui/button.tsx`
- `shared/common/components/ui/input.tsx`
- `shared/common/components/ui/card.tsx`
- `shared/common/components/ui/*` (resto)

**Criterio de aceptación:**
- [ ] Todos los componentes instalados
- [ ] Variantes configuradas
- [ ] TypeScript types correctos

---

#### COM-003: Layout Components
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Header con navegación y user menu
- Sidebar con navegación por roles
- Footer simple
- MainLayout que combina todo
- Responsive design

**Archivos a crear:**
- `shared/common/components/layouts/Header.tsx`
- `shared/common/components/layouts/Sidebar.tsx`
- `shared/common/components/layouts/Footer.tsx`
- `shared/common/components/layouts/MainLayout.tsx`

**Criterio de aceptación:**
- [ ] Header con logo, nav, user menu
- [ ] Sidebar con navegación por rol
- [ ] Footer con info básica
- [ ] MainLayout integra todo
- [ ] Responsive (mobile, tablet, desktop)

---

#### COM-004: Root Layout y Providers
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Actualizar src/app/layout.tsx
- Incluir AuthProvider
- Incluir Toaster para notificaciones
- Metadata y fonts
- HTML base structure

**Archivos a modificar:**
- `src/app/layout.tsx`

**Criterio de aceptación:**
- [ ] AuthProvider incluido
- [ ] Toaster configurado
- [ ] Fonts cargadas
- [ ] Metadata correcta

---

#### COM-005: Shared Components
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- LoadingSpinner component
- ErrorBoundary component
- EmptyState component
- ConfirmDialog component
- PageHeader component

**Archivos a crear:**
- `shared/common/components/shared/LoadingSpinner.tsx`
- `shared/common/components/shared/ErrorBoundary.tsx`
- `shared/common/components/shared/EmptyState.tsx`
- `shared/common/components/shared/ConfirmDialog.tsx`
- `shared/common/components/shared/PageHeader.tsx`

**Criterio de aceptación:**
- [ ] Todos los componentes creados
- [ ] Reutilizables y configurables
- [ ] TypeScript types
- [ ] Documentados

---

#### COM-006: Hooks Compartidos
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- usePermissions (wrapper sobre auth)
- useToast (notificaciones)
- useMediaQuery (responsive)
- useDebounce
- useLocalStorage

**Archivos a crear:**
- `shared/common/hooks/usePermissions.ts`
- `shared/common/hooks/useToast.ts`
- `shared/common/hooks/useMediaQuery.ts`
- `shared/common/hooks/useDebounce.ts`
- `shared/common/hooks/useLocalStorage.ts`
- `shared/common/hooks/index.ts`

**Criterio de aceptación:**
- [ ] Todos los hooks funcionando
- [ ] TypeScript types
- [ ] Documentados con ejemplos

---

#### COM-007: Utilidades y Helpers
**Prioridad:** Crítica
**Tiempo:** 1-2 horas
**Descripción:**
- Funciones de formateo (dates, currency)
- Validadores comunes
- String helpers
- Array helpers
- Object helpers

**Archivos a crear:**
- `shared/common/lib/formatters.ts`
- `shared/common/lib/validators.ts`
- `shared/common/lib/helpers.ts`

**Criterio de aceptación:**
- [ ] Formatters funcionando
- [ ] Validators implementados
- [ ] Helpers útiles
- [ ] TypeScript types

---

#### COM-008: Constantes y Tipos
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- Definir rutas de la app
- Constantes UI (breakpoints, etc.)
- Tipos comunes compartidos
- Enums reutilizables

**Archivos a crear:**
- `shared/common/constants/routes.ts`
- `shared/common/constants/ui.ts`
- `shared/common/types/common.types.ts`

**Criterio de aceptación:**
- [ ] Rutas definidas
- [ ] Constantes UI
- [ ] Tipos comunes
- [ ] Todo exportado

---

#### COM-009: README y Documentación
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- README.md del módulo
- Documentar componentes
- Documentar hooks
- Ejemplos de uso

**Archivos a crear:**
- `shared/common/README.md`
- `shared/common/index.ts`

**Criterio de aceptación:**
- [ ] README completo
- [ ] Ejemplos de uso
- [ ] Exports organizados

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### COM-010: Dashboard Layout
**Prioridad:** Alta
**Tiempo:** 2 horas
**Descripción:**
- Layout específico para dashboard
- Incluir MainLayout
- Stats cards
- Charts placeholder

**Archivos a crear:**
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`

---

## ARCHIVOS DE ESTE MÓDULO

```
shared/common/
├── components/
│   ├── ui/                        # COM-002
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layouts/                   # COM-003
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── shared/                    # COM-005
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── EmptyState.tsx
│       ├── ConfirmDialog.tsx
│       └── PageHeader.tsx
├── hooks/                         # COM-006
│   ├── usePermissions.ts
│   ├── useToast.ts
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── lib/                           # COM-001, COM-007
│   ├── utils.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── constants/                     # COM-008
│   ├── routes.ts
│   └── ui.ts
├── types/                         # COM-008
│   └── common.types.ts
├── README.md                      # COM-009
└── index.ts                       # COM-009

src/app/
├── layout.tsx                     # COM-004
├── (dashboard)/                   # COM-010
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx
└── globals.css                    # COM-001
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** COM-001 → COM-002 → COM-003 → COM-004 → COM-005 → COM-006 → COM-007 → COM-008 → COM-009
- **Bloqueos:** COM-003 necesita COM-002, COM-004 necesita COM-003
- **shadcn/ui:** Usar CLI para instalar componentes
- **Responsive:** Mobile-first approach

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Todos los componentes funcionando
2. [ ] Layouts responsive
3. [ ] Hooks documentados
4. [ ] README.md escrito (COM-009)
5. [ ] Actualizar PRD.md → estado Common = READ-ONLY
6. [ ] Mover a claude.md → shared/common/* a PROHIBIDOS
7. [ ] Cambiar MÓDULO ACTUAL en claude.md → Product-Reservation
8. [ ] Crear nuevo backlog en este archivo para Product-Reservation
