# Listado de Páginas - Reserrega

Listado completo de todas las páginas/rutas de la aplicación organizadas por sección.

## 📄 Rutas Públicas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `src/app/page.tsx` | Landing page - Redirige según rol |
| `/contact` | `src/app/contact/page.tsx` | Página de contacto |
| `/legal` | `src/app/legal/page.tsx` | Términos legales |
| `/pricing` | `src/app/pricing/page.tsx` | Planes de suscripción |

## 🔐 Rutas de Autenticación (auth)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/login` | `src/app/(auth)/login/page.tsx` | Inicio de sesión |
| `/register` | `src/app/(auth)/register/page.tsx` | Registro de usuarios |
| `/register/complete` | `src/app/(auth)/register/complete/page.tsx` | Completar registro |
| `/forgot-password` | `src/app/(auth)/forgot-password/page.tsx` | Recuperar contraseña |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | Restablecer contraseña |
| `/accept-invitation` | `src/app/(auth)/accept-invitation/page.tsx` | Aceptar invitación de amistad |

## 👤 Rutas de Usuario (user)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/wishlist` | `src/app/(user)/wishlist/page.tsx` | Wishlist personal del usuario |
| `/wishlist/[id]` | `src/app/(user)/wishlist/[id]/page.tsx` | Detalle de producto en wishlist |
| `/reservations` | `src/app/(user)/reservations/page.tsx` | Lista de reservas activas |
| `/reservations/[id]` | `src/app/(user)/reservations/[id]/page.tsx` | Detalle de reserva |
| `/qr` | `src/app/(user)/qr/page.tsx` | Generador de QR personal |

## 👥 Rutas de Amigos (app)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/friends` | `src/app/(app)/friends/page.tsx` | Lista de amigos |
| `/friends/requests` | `src/app/(app)/friends/requests/page.tsx` | Solicitudes de amistad pendientes |
| `/friends/invite` | `src/app/(app)/friends/invite/page.tsx` | Invitar amigos (búsqueda/email) |

## 🎁 Rutas de Regalos (app)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/gift/[friendId]` | `src/app/(app)/gift/[friendId]/page.tsx` | Ver wishlist de un amigo |
| `/gift/[friendId]/checkout` | `src/app/(app)/gift/[friendId]/checkout/page.tsx` | Checkout para regalar |
| `/gift/confirmation` | `src/app/(app)/gift/confirmation/page.tsx` | Confirmación de regalo |
| `/gift/history` | `src/app/(app)/gift/history/page.tsx` | Historial de regalos |

## 🏪 Rutas Comerciales (comercial)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/scan` | `src/app/(comercial)/scan/page.tsx` | Escanear QR de usuario + productos |

## 📊 Rutas de Panel de Tienda (dashboard)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/store` | `src/app/(dashboard)/store/page.tsx` | Dashboard de tienda (estadísticas) |
| `/store/reservations` | `src/app/(dashboard)/store/reservations/page.tsx` | Gestión de reservas de la tienda |
| `/store/scan` | `src/app/(dashboard)/store/scan/page.tsx` | Escanear QR (duplicado de /scan) |

## 👨‍💼 Rutas de Administración (dashboard)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin` | `src/app/(dashboard)/admin/page.tsx` | Dashboard administrativo |
| `/admin/users` | `src/app/(dashboard)/admin/users/page.tsx` | Gestión de usuarios |
| `/admin/stores` | `src/app/(dashboard)/admin/stores/page.tsx` | Gestión de tiendas |
| `/admin/stats` | `src/app/(dashboard)/admin/stats/page.tsx` | Estadísticas detalladas |

## 🏢 Rutas de Empresas (dashboard)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/companies` | `src/app/(dashboard)/companies/page.tsx` | Lista de empresas (superadmin) |
| `/companies/create` | `src/app/(dashboard)/companies/create/page.tsx` | Crear nueva empresa |
| `/companies/edit` | `src/app/(dashboard)/companies/edit/page.tsx` | Editar empresa propia (admin) |
| `/companies/[id]/edit` | `src/app/(dashboard)/companies/[id]/edit/page.tsx` | Editar empresa específica (superadmin) |

## 🧑‍🤝‍🧑 Rutas de Usuarios (dashboard)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/users` | `src/app/(dashboard)/users/page.tsx` | Lista de usuarios |
| `/users/create` | `src/app/(dashboard)/users/create/page.tsx` | Crear nuevo usuario |
| `/users/[id]/edit` | `src/app/(dashboard)/users/[id]/edit/page.tsx` | Editar usuario |

## ❓ Rutas de Ayuda (dashboard)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/help` | `src/app/(dashboard)/help/page.tsx` | Centro de ayuda |
| `/help/[slug]` | `src/app/(dashboard)/help/[slug]/page.tsx` | Artículo de ayuda específico |

## 💳 Rutas de Suscripciones (dashboard)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/subscriptions` | `src/app/(dashboard)/subscriptions/page.tsx` | Gestión de suscripciones |

## 📧 Rutas de Mensajes (dashboard - superadmin)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/contact-messages` | `src/app/(dashboard)/contact-messages/page.tsx` | Mensajes de contacto |

## ⚙️ Rutas de Configuración (dashboard - superadmin)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/settings` | `src/app/(dashboard)/settings/page.tsx` | Configuración general |
| `/settings/business-rules` | `src/app/(dashboard)/settings/business-rules/page.tsx` | Reglas de negocio |
| `/settings/mock-emails` | `src/app/(dashboard)/settings/mock-emails/page.tsx` | Emails de prueba |
| `/settings/subscriptions-testing` | `src/app/(dashboard)/settings/subscriptions-testing/page.tsx` | Testing de suscripciones |

## 📁 Otras Rutas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Dashboard genérico (redirige según rol) |

---

## 📊 Resumen por Categoría

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| **Públicas** | 4 | Landing, contact, legal, pricing |
| **Autenticación** | 6 | Login, registro, recuperación |
| **Usuario** | 5 | Wishlist, reservas, QR |
| **Amigos** | 3 | Lista, solicitudes, invitar |
| **Regalos** | 4 | Ver wishlist amigo, checkout, confirmación, historial |
| **Comercial** | 1 | Escaneo de QR |
| **Tienda** | 3 | Dashboard, reservas, scan |
| **Admin** | 4 | Dashboard, usuarios, tiendas, stats |
| **Empresas** | 4 | Lista, crear, editar |
| **Usuarios** | 3 | Lista, crear, editar |
| **Ayuda** | 2 | Centro de ayuda, artículos |
| **Suscripciones** | 1 | Gestión de planes |
| **Mensajes** | 1 | Contacto (superadmin) |
| **Configuración** | 4 | General, reglas, emails, testing |
| **Otros** | 1 | Dashboard genérico |

**Total:** 46 páginas

---

## 🔐 Permisos por Rol

### Superadmin
- Acceso a **todas las rutas**
- Incluye: empresas, usuarios globales, configuración, mensajes

### Admin
- `/admin/*` - Panel de administración
- `/companies/edit` - Su empresa
- `/users/*` - Usuarios de su empresa
- `/help` - Centro de ayuda

### Comercial
- `/scan` - Escanear QR y productos
- `/store/*` - Panel de tienda y reservas
- `/help` - Centro de ayuda

### Usuario
- `/wishlist/*` - Wishlist personal
- `/reservations/*` - Reservas
- `/friends/*` - Red de amigos
- `/gift/*` - Flujo de regalos
- `/qr` - QR personal
- `/help` - Centro de ayuda

---

Última actualización: 2025-01-18
