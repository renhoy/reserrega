# Tareas - MÓDULO: Product-Reservation

## MÓDULO ACTIVO: Product-Reservation 🔴

**Tareas Activas:** 0/6
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

#### PR-001: Types y Utilidades Base
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- Definir types para Product, Reservation, QR
- Crear utilidades para generar QR
- Crear utilidades para validar códigos de barras
- Helpers para calcular expiración

**Archivos a crear:**
- `features/product-reservation/types/reservation.types.ts`
- `features/product-reservation/lib/qr-utils.ts`
- `features/product-reservation/lib/product-utils.ts`

**Criterio de aceptación:**
- [ ] Types completos con JSDoc
- [ ] Función generateQRCode()
- [ ] Función validateBarcode()
- [ ] Función calculateExpiration()
- [ ] Tests unitarios básicos

---

#### PR-002: QR Generator Component
**Prioridad:** Crítica
**Tiempo:** 2 horas
**Descripción:**
- Componente para generar QR temporal del usuario
- Mostrar QR en pantalla con cuenta regresiva
- Incluir información del usuario
- Auto-refresh cuando expire

**Archivos a crear:**
- `features/product-reservation/components/QRGenerator.tsx`
- `features/product-reservation/hooks/useQRCode.ts`
- `features/product-reservation/actions/generateQR.ts`

**Criterio de aceptación:**
- [ ] QR se genera con userId y timestamp
- [ ] Expira en 24 horas
- [ ] Muestra cuenta regresiva
- [ ] Auto-refresh al expirar
- [ ] Responsive design

---

#### PR-003: Product Scanner (Comercial)
**Prioridad:** Crítica
**Tiempo:** 3 horas
**Descripción:**
- Escanear QR del usuario
- Escanear código de barras del producto
- Vincular producto a usuario
- Validar permisos de comercial

**Archivos a crear:**
- `features/product-reservation/components/QRScanner.tsx`
- `features/product-reservation/components/ProductScanner.tsx`
- `features/product-reservation/actions/scanProduct.ts`

**Criterio de aceptación:**
- [ ] Escanea QR y extrae userId
- [ ] Valida QR no expirado
- [ ] Escanea código de barras
- [ ] Crea producto si no existe
- [ ] Vincula producto a usuario

---

#### PR-004: Crear Reserva con Pago
**Prioridad:** Crítica
**Tiempo:** 3-4 horas
**Descripción:**
- Formulario de reserva con detalles del producto
- Simulación de pago (1€)
- Crear reserva en BD con expiración 15 días
- Confirmación y redirección

**Archivos a crear:**
- `features/product-reservation/components/ReservationForm.tsx`
- `features/product-reservation/actions/createReservation.ts`
- `features/product-reservation/actions/simulatePayment.ts`

**Criterio de aceptación:**
- [ ] Form con validación (talla, color, etc.)
- [ ] Simulación de pago 1€
- [ ] Crea reserva en tabla `reservations`
- [ ] Expiration_date = created_at + 15 días
- [ ] Status = 'active'
- [ ] Notificación de éxito

---

#### PR-005: Páginas y Rutas
**Prioridad:** Crítica
**Tiempo:** 2-3 horas
**Descripción:**
- Página de QR para usuarios
- Página de scan para comerciales
- Página de lista de reservas
- Página de detalle de reserva

**Archivos a crear:**
- `src/app/(user)/qr/page.tsx`
- `src/app/(user)/reservations/page.tsx`
- `src/app/(user)/reservations/[id]/page.tsx`
- `src/app/(comercial)/scan/page.tsx`

**Criterio de aceptación:**
- [ ] /qr muestra QR generator
- [ ] /reservations lista reservas del usuario
- [ ] /reservations/[id] muestra detalle
- [ ] /scan (comercial) permite escanear
- [ ] Protección con requireRole()

---

#### PR-006: README y Documentación
**Prioridad:** Crítica
**Tiempo:** 1 hora
**Descripción:**
- README del módulo
- Documentar componentes
- Documentar flujo completo
- Ejemplos de uso

**Archivos a crear:**
- `features/product-reservation/README.md`
- `features/product-reservation/index.ts`

**Criterio de aceptación:**
- [ ] README completo
- [ ] Flujo documentado paso a paso
- [ ] Ejemplos de uso
- [ ] Exports organizados

---

### 🟡 ALTA PRIORIDAD (Mejoran calidad pero no bloquean)

#### PR-007: Validación Avanzada
**Prioridad:** Alta
**Tiempo:** 2 horas
**Descripción:**
- Validar límite de reservas por usuario
- Validar disponibilidad del producto
- Check de duplicados
- Manejo de errores robusto

---

#### PR-008: Notificaciones
**Prioridad:** Alta
**Tiempo:** 1 hora
**Descripción:**
- Notificación al crear reserva
- Notificación cuando expira
- Notificación al comercial

---

## ARCHIVOS DE ESTE MÓDULO

```
features/product-reservation/
├── components/
│   ├── QRGenerator.tsx          # PR-002
│   ├── QRScanner.tsx            # PR-003
│   ├── ProductScanner.tsx       # PR-003
│   └── ReservationForm.tsx      # PR-004
├── actions/
│   ├── generateQR.ts            # PR-002
│   ├── scanProduct.ts           # PR-003
│   ├── createReservation.ts     # PR-004
│   └── simulatePayment.ts       # PR-004
├── hooks/
│   ├── useQRCode.ts             # PR-002
│   └── useReservation.ts        # PR-004
├── lib/
│   ├── qr-utils.ts              # PR-001
│   └── product-utils.ts         # PR-001
├── types/
│   └── reservation.types.ts     # PR-001
├── README.md                     # PR-006
└── index.ts                      # PR-006

src/app/
├── (user)/
│   ├── qr/
│   │   └── page.tsx             # PR-005
│   └── reservations/
│       ├── page.tsx             # PR-005
│       └── [id]/
│           └── page.tsx         # PR-005
└── (comercial)/
    └── scan/
        └── page.tsx             # PR-005
```

---

## NOTAS IMPORTANTES

- **Orden sugerido:** PR-001 → PR-002 → PR-003 → PR-004 → PR-005 → PR-006
- **Bloqueos:** PR-003 necesita PR-001, PR-004 necesita PR-003, PR-005 necesita todos anteriores
- **QR:** Usar librería `qrcode` o similar
- **Barcode:** Usar `@zxing/library` o similar
- **Pago:** Solo simulación, no Stripe real todavía
- **Expiración:** Usar `date-fns` para calcular +15 días

---

## FLUJO COMPLETO

**Usuario (Reserva producto):**
1. Usuario genera QR temporal en /qr
2. Va a tienda física y muestra QR a comercial
3. Comercial escanea QR → obtiene userId
4. Comercial escanea código de barras del producto
5. Sistema vincula producto a usuario
6. Usuario completa form de reserva (talla, color)
7. Usuario paga 1€ (simulado)
8. Reserva creada con expiración 15 días
9. Producto aparece en su wishlist

**Comercial (Ayuda a reservar):**
1. Va a /scan
2. Escanea QR del usuario
3. Escanea producto
4. Confirma vinculación
5. Usuario completa en su móvil

---

## COMPLETAR MÓDULO

**Cuando todas las CRÍTICAS estén hechas:**

1. [ ] Flujo completo funcionando
2. [ ] QR genera y expira correctamente
3. [ ] Escaneo funciona en comercial
4. [ ] Reservas se crean con expiración
5. [ ] Pago simulado funciona
6. [ ] README.md escrito (PR-006)
7. [ ] Actualizar PRD.md → estado Product-Reservation = READ-ONLY
8. [ ] Mover a claude.md → features/product-reservation/* a PROHIBIDOS
9. [ ] Cambiar MÓDULO ACTUAL en claude.md → Wishlist
10. [ ] Crear nuevo backlog en este archivo para Wishlist

---

## MÓDULOS COMPLETADOS

✅ **Database** - Schema, types, RLS policies
✅ **Auth** - Login, register, middleware, permisos
✅ **Common** - UI components, layouts, hooks, utilidades
