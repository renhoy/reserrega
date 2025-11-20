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
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** Schema multi-tenant, tablas core, RLS policies
**Archivos:** `shared/database/`
**Completado:** Schema con 13 tablas, RLS policies, tipos TypeScript, scripts de setup

#### 2. Auth
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** Autenticación Supabase, roles (Superadmin, Admin, Usuario, Comercial)
**Archivos:** `shared/auth/`
**Completado:** Login/Register, middleware, hooks, server helpers, permisos

#### 3. Common
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** UI components (shadcn/ui), utilidades, tipos compartidos, layouts
**Archivos:** `shared/common/`
**Completado:** 25+ componentes UI, layouts, hooks compartidos, utilidades, constantes, types

---

### FEATURES (Desarrollar después - Orden secuencial)

#### 4. Product-Reservation
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** Escaneo QR temporal, vincular productos a usuarios, pago 1€, expiración 15 días
**Archivos:** `features/product-reservation/`
**Completado:** QR generator, scanners (QR/barcode), formulario reserva, simulación pago, páginas usuario/comercial

#### 5. Wishlist
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** Ver productos reservados, estados (disponible/proceso/regalado), visibilidad configurable
**Archivos:** `features/wishlist/`
**Completado:** Grid responsivo, filtros por estado, control visibilidad, badges de estado, warnings expiración, páginas usuario

#### 6. Friends-Network
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** Invitar amigos (email/QR/búsqueda), solicitudes amistad, red de regaladores
**Archivos:** `features/friends-network/`
**Completado:** Solicitudes de amistad, búsqueda de usuarios, invitaciones por email con tokens, gestión de amigos, páginas de amigos/solicitudes/invitar, hooks personalizados, validación de permisos

#### 7. Gift-Flow
**Estado:** ✅ READ-ONLY (Completado)
**Propósito:** Flujo completo de regalo: ver lista amigo, bloqueo temporal, pago simulado, confirmación entrega
**Archivos:** `features/gift-flow/`
**Completado:** Ver wishlist de amigos, selección de productos, bloqueo temporal (15 min), checkout con pago simulado, confirmación de entrega, historial de regalos, hooks personalizados (useGiftFlow, useGiftLock), páginas /gift/[friendId], /gift/[friendId]/checkout, /gift/history

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
- [x] Schema `reserrega` creado en Supabase
- [x] Tablas: users, companies, products, reservations, wishlists, gifts, stores, friend_requests
- [x] RLS policies configuradas por rol
- [x] Tipos TypeScript generados

**Auth:**
- [x] Login/Register funcional
- [x] Middleware con verificación de roles
- [x] getServerUser() helper funcionando
- [x] Protección de rutas según permisos

**Common:**
- [x] shadcn/ui instalado y configurado
- [x] Layout base (Header, Sidebar, Footer, MainLayout)
- [x] Componentes UI reutilizables (25+ componentes)
- [x] Hooks compartidos (usePermissions, useToast, useMediaQuery, etc.)
- [x] Utilidades (formatters, validators, helpers)
- [x] Constantes y types compartidos

**Product-Reservation:**
- [x] Generar QR temporal para usuario (24h expiration)
- [x] Escanear QR + código de barras (cámara device)
- [x] Crear reserva con expiración 15 días
- [x] Pago 1€ simulado funcional
- [x] Páginas usuario (/qr, /reservations)
- [x] Página comercial (/scan)

**Wishlist:**
- [x] Ver productos reservados del usuario
- [x] Estados: disponible/proceso/regalado/expirado
- [x] Configurar visibilidad por producto (privado/amigos/público)
- [x] Productos caducados visibles sin botón comprar
- [x] Filtros por estado y estadísticas
- [x] Optimistic UI updates

**Friends-Network:**
- [x] Invitar por email con token
- [x] Generar/escanear QR para añadir amigo
- [x] Búsqueda por username/email
- [x] Aprobar/rechazar solicitudes

**Gift-Flow:**
- [x] Ver wishlist de amigos
- [x] Bloqueo temporal producto (15 min)
- [x] Pago simulado (Stripe placeholder)
- [x] Notificación in-app al receptor

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
