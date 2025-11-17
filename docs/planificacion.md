# Planificación - Reserrega

## TIMELINE TOTAL: 1 MES (4 semanas)

**Meta:** MVP funcional con flujo completo de reserva y regalo

---

## FASE 1: SHARED MODULES (Semana 1 - Orden obligatorio)

### 1. Database Module
**Duración:** 2-3 días  
**Objetivo:** Schema multi-tenant, tablas core, RLS policies  
**Entregables:**
- Schema `reserrega` en Supabase Cloud
- 8 tablas core creadas con relaciones
- RLS policies por rol (Superadmin, Admin, Usuario, Comercial)
- Tipos TypeScript generados

**Dependencias:** Ninguna (primer módulo)

---

### 2. Auth Module
**Duración:** 2-3 días  
**Objetivo:** Sistema de autenticación y autorización  
**Entregables:**
- Login/Register funcional
- Middleware con verificación de roles
- Server-side user helpers
- Protección de rutas

**Dependencias:** Database (READ-ONLY)

---

### 3. Common Module
**Duración:** 2 días  
**Objetivo:** UI base y componentes compartidos  
**Entregables:**
- shadcn/ui configurado
- Layout (Header, Sidebar, Footer)
- Componentes reutilizables
- Hooks compartidos (useUser, usePermissions)

**Dependencias:** Database, Auth (ambos READ-ONLY)

---

## FASE 2: FEATURE MODULES (Semanas 2-3 - Uno por vez)

### 4. Product-Reservation
**Duración:** 3-4 días  
**Objetivo:** Core del MVP - reservar productos en tienda  
**Entregables:**
- Generar QR temporal para usuario
- Escanear QR + código barras (dependienta)
- Crear reserva con expiración 15 días
- Pago 1€ simulado (división configurable)
- Job automático: caducar reservas vencidas

**Dependencias:** Database, Auth, Common (todos READ-ONLY)

---

### 5. Wishlist
**Duración:** 2 días  
**Objetivo:** Vista de productos reservados del usuario  
**Entregables:**
- Dashboard wishlist con estados
- Filtros (disponible/caducado/regalado)
- Configurar visibilidad por producto
- Productos caducados sin botón comprar

**Dependencias:** Product-Reservation (READ-ONLY)

---

### 6. Friends-Network
**Duración:** 3 días  
**Objetivo:** Red social de regaladores  
**Entregables:**
- Invitar por email (token de registro)
- Generar/escanear QR para añadir amigo presencial
- Búsqueda por username/email
- Aprobar/rechazar solicitudes
- Ver lista de amigos

**Dependencias:** Wishlist (READ-ONLY)

---

### 7. Gift-Flow
**Duración:** 3-4 días  
**Objetivo:** Flujo completo de compra de regalo  
**Entregables:**
- Ver wishlist de amigos (según permisos)
- Seleccionar producto → bloqueo temporal 15 min
- Pago simulado (placeholder Stripe)
- Sistema de confirmación entrega
- Notificaciones in-app

**Dependencias:** Friends-Network (READ-ONLY)

---

### 8. Store-Panel
**Duración:** 2-3 días  
**Objetivo:** Panel para dependientas/comerciales  
**Entregables:**
- Escanear QR usuario → abrir sesión
- Escanear productos → vincular a sesión
- Ver reservas activas de su tienda
- Marcar productos como enviados
- Dashboard simple con estadísticas

**Dependencias:** Product-Reservation, Gift-Flow (READ-ONLY)

---

## FASE 3: INTEGRACIÓN Y PULIDO (Semana 4)

### 9. Admin Dashboard
**Duración:** 2 días  
**Entregables:**
- Panel Admin empresa: gestionar comerciales, ver stats
- Panel Superadmin: gestionar empresas, métricas globales

---

### 10. Testing & Bug Fixes
**Duración:** 2 días  
**Entregables:**
- Tests de integración críticos
- Corrección de bugs descubiertos
- Validación de flujo end-to-end

---

### 11. Deploy & Onboarding
**Duración:** 2 días  
**Entregables:**
- Deploy a Vercel (producción)
- Onboarding 1-2 tiendas piloto
- Documentación básica para comerciales

---

## REGLAS DE DESARROLLO

### ⛔ PROHIBIDO:
- Saltar al siguiente módulo sin completar anterior
- Trabajar en múltiples módulos simultáneamente
- Modificar módulos READ-ONLY sin escalar
- Añadir features Fase 2 (marketplace) en MVP

### ✅ OBLIGATORIO:
- Completar módulos en orden listado
- Marcar estado READ-ONLY antes de avanzar
- Actualizar permisos en claude.md
- Mantener tareas.md actualizado
- Tests básicos antes de marcar completado

---

## MILESTONES CRÍTICOS

**Día 7:** SHARED completo → Auth funcionando  
**Día 14:** Product-Reservation + Wishlist → Usuaria puede reservar y ver lista  
**Día 21:** Gift-Flow → Flujo completo reserva → regalo funcional  
**Día 28:** MVP completo → Listo para piloto con tiendas

---

## ESCALAMIENTO POST-MVP (No tocar en Fase 1)

**Fase 2 - Marketplace (Mes 2):**
- Múltiples tiendas compitiendo por producto
- Sistema escrow real
- Tracking de envíos

**Fase 3 - Gamificación (Mes 3):**
- Descuentos tras 20€ gastados
- Extensión manual reservas
- Sistema de puntos

**Fase 4 - Influencers (Mes 4):**
- Listas públicas
- Sistema de recompensas
- Analytics avanzado
