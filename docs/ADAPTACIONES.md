# Adaptaciones Manuales Requeridas

Este proyecto ha sido copiado desde la base común de Redpresu.
Los módulos de **budgets** y **tariffs** NO fueron copiados ya que son específicos de Redpresu.

Sin embargo, algunos archivos tienen referencias a estos módulos que deberás adaptar según tu proyecto.

## Archivos a Adaptar

### 1. Header de Navegación
**Archivo:** `src/components/layout/Header.tsx`

**Referencias:**
- **Líneas 112-113:** Enlaces de navegación a `/tariffs` y `/budgets`
- **Líneas 168-198:** Botones especiales para tarifas y presupuestos

**Acciones recomendadas:**
- Elimina los enlaces de navegación que no necesites
- O adáptalos para que apunten a tus propios módulos
- Ejemplo: Cambiar `/budgets` por `/mis-productos`

---

### 2. Dashboard - Accesos Rápidos
**Archivo:** `src/components/dashboard/DashboardClient.tsx`

**Referencias:**
- **Líneas 246-286:** Enlaces de acceso rápido a tarifas y presupuestos
- **Línea 347-348:** Enlace a crear presupuesto

**Acciones recomendadas:**
- Elimina las tarjetas de acceso rápido a budgets/tariffs
- O adáptalas para que apunten a tus propias funcionalidades
- Considera crear nuevas tarjetas para tu lógica de negocio

---

### 3. Dashboard - Página Principal
**Archivo:** `src/app/(dashboard)/dashboard/page.tsx`

**Referencias:**
- **Línea 4:** Import de `userHasBudgets` (ya tiene stub en `src/app/actions/budgets.ts`)
- **Línea 29:** Llamada a `userHasBudgets()`

**Acciones recomendadas:**
- Opción A: Implementa tu propia lógica en `src/app/actions/budgets.ts`
- Opción B: Elimina la llamada y pasa `hasBudgets={false}` al componente
- Opción C: Elimina completamente el parámetro si eliminas las referencias del DashboardClient

---

### 4. Sistema de Ayuda - Índice
**Archivo:** `src/app/(dashboard)/help/page.tsx`

**Referencias:**
- **Línea 51:** Tour button para `/tariffs`
- **Línea 57:** Tour button para `/tariffs/create`
- **Línea 62:** Tour button para `/budgets`

**Acciones recomendadas:**
- Elimina los botones de tours que no apliquen
- Crea nuevos tours para tus propias páginas
- Actualiza los archivos markdown en `public/help/` con tu documentación

---

### 5. Sistema de Ayuda - Artículos
**Archivo:** `src/app/(dashboard)/help/[slug]/page.tsx`

**Referencias:**
- Mapeo de URLs para artículos de ayuda que incluye rutas de tarifas/presupuestos

**Acciones recomendadas:**
- Actualiza el objeto de mapeo de URLs según tus rutas
- Elimina las referencias a "crear-tarifa" y "generar-presupuesto"
- Añade tus propias rutas

---

### 6. Login - Redirecciones
**Archivo:** `src/app/(auth)/login/page.tsx`

**Referencias:**
- **Línea 26:** Redirección a `/budgets` para usuarios con rol "comercial"
- **Línea 28:** Redirección a `/dashboard` para otros roles

**Acciones recomendadas:**
- Cambia la redirección de comerciales a `/dashboard` o a tu ruta preferida
- O adapta según tu lógica de roles

```typescript
// Cambiar de:
redirect("/budgets")

// A:
redirect("/dashboard")
// O tu propia ruta
```

---

### 7. Registro - Redirecciones
**Archivo:** `src/app/(auth)/register/page.tsx`

**Referencias:**
- **Línea 25:** Redirección a `/budgets` para rol "comercial"
- **Línea 27:** Redirección a `/dashboard` para otros roles

**Acciones recomendadas:**
- Mismo caso que Login, actualiza la redirección

---

### 8. Suscripciones - Características
**Archivo:** `src/components/subscriptions/SubscriptionsClient.tsx`

**Referencias:**
- **Líneas 115-116:** Muestra límites de `tariffs_limit` y `budgets_limit`

**Acciones recomendadas:**
- Elimina estos límites de la visualización
- O adáptalos para mostrar los límites de tus propias features
- Actualiza tus planes en la BD para incluir tus límites personalizados

---

### 9. Editor de Reglas de Negocio
**Archivo:** `src/components/settings/rules-editor.tsx`

**Referencias:**
- **Línea 74:** Ejemplo de regla que usa `tariffs_count`

**Acciones recomendadas:**
- Actualiza el ejemplo con tus propias variables
- Ejemplo: Cambiar `tariffs_count` por `productos_count` o similar

---

### 10. Stub de Actions
**Archivo:** `src/app/actions/budgets.ts`

**Referencias:**
- Archivo creado automáticamente como STUB para evitar errores de compilación

**Acciones recomendadas:**
- Opción A: Implementa la función `userHasBudgets()` con tu lógica
- Opción B: Elimina el archivo si eliminas todas las referencias en Dashboard
- La función actualmente retorna `false` por defecto

---

## Archivos de Ayuda Markdown

Los archivos en `public/help/` son específicos de Redpresu:
- `crear-tarifa.md`
- `generar-presupuesto.md`
- `gestionar-usuarios.md` (✅ este sí aplica)

**Acciones recomendadas:**
- Elimina `crear-tarifa.md` y `generar-presupuesto.md`
- O adáptalos para tu proyecto
- Crea nuevos archivos .md para tus propias funcionalidades
- Actualiza `tours.json` según tus necesidades

---

## Checklist de Adaptación

- [ ] Actualizar Header.tsx (eliminar/adaptar enlaces de navegación)
- [ ] Actualizar DashboardClient.tsx (eliminar/adaptar accesos rápidos)
- [ ] Decidir qué hacer con userHasBudgets() en dashboard/page.tsx
- [ ] Actualizar tours en help/page.tsx
- [ ] Actualizar mapeo de URLs en help/[slug]/page.tsx
- [ ] Cambiar redirecciones en login/page.tsx
- [ ] Cambiar redirecciones en register/page.tsx
- [ ] Adaptar características en SubscriptionsClient.tsx
- [ ] Actualizar ejemplo en rules-editor.tsx
- [ ] Implementar o eliminar budgets.ts stub
- [ ] Actualizar/eliminar archivos .md en public/help/
- [ ] Actualizar tours.json

---

## Próximos Pasos Generales

1. ✅ Configurar `.env.local` con tus credenciales
2. ✅ Crear tu esquema de base de datos
3. ✅ Realizar las adaptaciones manuales listadas arriba
4. ✅ Añadir tus módulos específicos
5. ✅ Ejecutar `npm run dev` y probar

---

**Nota:** Este archivo de documentación se genera automáticamente al ejecutar el script `copy-from-redpresu.sh`
