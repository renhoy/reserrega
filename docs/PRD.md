# PRD - Reserrega

## Resumen Ejecutivo

**Problema:** Las mujeres aman ir de compras y probarse ropa, pero no siempre pueden/quieren gastar. Los regalos suelen fallar (talla incorrecta, color equivocado).

**Solución:** App que permite reservar productos probados en tienda física por 1€, crear listas de deseos precisas (talla/color/modelo exactos), y que amigos/familia regalen sin riesgo de error.

**Usuario:** Mujeres 18-45 años que disfrutan compras + familiares/amigos que regalan + tiendas retail.

**MVP Timeline:** 1 mes máximo

**Métrica Principal:** Tasa conversión reserva → regalo >20% en 4 semanas

---

## Módulos del Sistema

### SHARED (Desarrollar primero - Orden obligatorio)

#### 1. Database
**Estado:** ACTIVO 🔴  
**Propósito:** Schema multi-tenant, tablas core, RLS policies  
**Archivos:** `shared/database/`

#### 2. Auth
**Estado:** No iniciado  
**Propósito:** Autenticación Supabase, roles (Superadmin, Admin, Usuario, Comercial)  
**Archivos:** `shared/auth/`

#### 3. Common
**Estado:** No iniciado  
**Propósito:** UI components (shadcn/ui), utilidades, tipos compartidos, layouts  
**Archivos:** `shared/common/`

---

### FEATURES (Desarrollar después - Orden secuencial)

#### 4. Product-Reservation
**Estado:** Pendiente  
**Propósito:** Escaneo QR temporal, vincular productos a usuarios, pago 1€, expiración 15 días  
**Archivos:** `features/product-reservation/`  
**Depende de:** Database, Auth

#### 5. Wishlist
**Estado:** Pendiente  
**Propósito:** Ver productos reservados, estados (disponible/proceso/regalado), visibilidad configurable  
**Archivos:** `features/wishlist/`  
**Depende de:** Database, Auth, Product-Reservation

#### 6. Friends-Network
**Estado:** Pendiente  
**Propósito:** Invitar amigos (email/QR/búsqueda), solicitudes amistad, red de regaladores  
**Archivos:** `features/friends-network/`  
**Depende de:** Database, Auth, Wishlist

#### 7. Gift-Flow
**Estado:** Pendiente  
**Propósito:** Flujo completo de regalo: ver lista amigo, bloqueo temporal, pago simulado, confirmación entrega  
**Archivos:** `features/gift-flow/`  
**Depende de:** Database, Auth, Wishlist, Friends-Network

#### 8. Store-Panel
**Estado:** Pendiente  
**Propósito:** Panel comercial: escanear QR usuario, escanear productos, gestionar reservas, marcar envíos  
**Archivos:** `features/store-panel/`  
**Depende de:** Database, Auth, Product-Reservation

---

## Criterio de Completado por Módulo

### Para marcar módulo como READ-ONLY:
- [ ] Todas las tareas CRÍTICAS completadas
- [ ] Tests básicos pasando (al menos happy path)
- [ ] Documentación mínima (README.md del módulo)
- [ ] Sin errores de compilación TypeScript
- [ ] Estado cambiado a READ-ONLY en este archivo
- [ ] Archivos movidos a lista PROHIBIDOS en claude.md

### Criterios Específicos por Módulo:

**Database:**
- [ ] Schema `reserrega` creado en Supabase
- [ ] Tablas: users, companies, products, reservations, wishlists, gifts, stores, friend_requests
- [ ] RLS policies configuradas por rol
- [ ] Tipos TypeScript generados

**Auth:**
- [ ] Login/Register funcional
- [ ] Middleware con verificación de roles
- [ ] getServerUser() helper funcionando
- [ ] Protección de rutas según permisos

**Common:**
- [ ] shadcn/ui instalado y configurado
- [ ] Layout base (Header, Sidebar)
- [ ] Componentes UI reutilizables
- [ ] Hooks compartidos (useUser, usePermissions)

**Product-Reservation:**
- [ ] Generar QR temporal para usuario
- [ ] Escanear QR + código de barras
- [ ] Crear reserva con expiración 15 días
- [ ] Pago 1€ simulado funcional

**Wishlist:**
- [ ] Ver productos reservados del usuario
- [ ] Estados: disponible/proceso/regalado
- [ ] Configurar visibilidad por producto
- [ ] Productos caducados visibles sin botón comprar

**Friends-Network:**
- [ ] Invitar por email con token
- [ ] Generar/escanear QR para añadir amigo
- [ ] Búsqueda por username/email
- [ ] Aprobar/rechazar solicitudes

**Gift-Flow:**
- [ ] Ver wishlist de amigos
- [ ] Bloqueo temporal producto (15 min)
- [ ] Pago simulado (Stripe placeholder)
- [ ] Notificación in-app al receptor

**Store-Panel:**
- [ ] Escanear QR usuario → abrir sesión
- [ ] Escanear productos → vincular
- [ ] Ver reservas activas de tienda
- [ ] Marcar como enviado

---

## Notas Importantes

- **Primer módulo activo:** Database
- **No saltar orden:** SHARED → FEATURES secuencialmente
- **MVP = primeros 8 módulos completos**
- **Fase 2 (marketplace competitivo) NO está en este PRD**
