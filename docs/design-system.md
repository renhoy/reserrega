# Design System - Reserrega

## Identidad Visual

### Concepto
App de regalos perfectos con estética femenina, moderna y confiable. Mix de diversión + seriedad comercial.

**Keywords:** Regalo, Deseo, Reserva, Conexión, Sorpresa

---

## Paleta de Colores

### Colores Principales

```css
:root {
  /* Primary - Rosa/Púrpura (regalo, femenino) */
  --primary-pink: #ec4899;      /* rgb(236, 72, 153) */
  --primary-purple: #a855f7;    /* rgb(168, 85, 247) */
  --primary-fuchsia: #d946ef;   /* rgb(217, 70, 239) */
  
  /* Accent - Naranja/Amarillo (energía, llamada a acción) */
  --accent-orange: #f97316;     /* rgb(249, 115, 22) */
  --accent-yellow: #fbbf24;     /* rgb(251, 191, 36) */
  
  /* Neutrales */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Fondos claros */
  --light-pink: #fce7f3;
  --light-purple: #f3e8ff;
  
  /* Estados */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Uso de Colores

**Acciones primarias:**
- Botones principales: Degradado `pink → purple`
- CTAs importantes: `accent-orange`

**Fondos:**
- Secciones hero: Degradado `light-pink → light-purple`
- Cards hover: `white` con borde `primary-pink`

**Texto:**
- Títulos: `gray-900`
- Texto principal: `gray-600`
- Links: `primary-pink`

---

## Tipografía

### Fuentes

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

**No custom fonts en MVP** - usar system fonts para velocidad.

### Escalas

```css
/* Headings */
--text-h1: clamp(36px, 5vw, 64px);  /* Hero titles */
--text-h2: clamp(32px, 4vw, 48px);  /* Section titles */
--text-h3: clamp(24px, 3vw, 32px);  /* Card titles */

/* Body */
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-sm: 14px;
--text-xs: 12px;
```

### Pesos

- Titles: `800` (extra-bold)
- Subtitles: `700` (bold)
- Body: `400` (regular)
- Light text: `300`

---

## Logo RR

### Especificaciones

**Forma:** Cuadrado con esquinas redondeadas (12px)
**Tamaño base:** 48x48px
**Contenido:** "RR" en tipografía serif bold

```css
.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border-radius: 12px;
  
  font-family: 'Georgia', serif;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -2px;
  color: white;
  
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}
```

**Variantes:**
- **Large (nav):** 48x48px
- **Medium (footer):** 40x40px
- **Small (favicon):** 32x32px

---

## Componentes UI

### Botones

**Primary:**
```css
.btn-primary {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(236, 72, 153, 0.3);
}
```

**Secondary:**
```css
.btn-secondary {
  background: white;
  color: #ec4899;
  border: 2px solid #ec4899;
  padding: 10px 24px;
  border-radius: 8px;
}

.btn-secondary:hover {
  background: #fce7f3;
}
```

**Large (CTAs):**
```css
.btn-large {
  padding: 16px 32px;
  font-size: 18px;
}
```

---

### Cards

```css
.card {
  background: var(--gray-50);
  border-radius: 16px;
  padding: 32px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(236, 72, 153, 0.15);
  border-color: var(--primary-pink);
  background: white;
}
```

**Featured card:**
```css
.card-featured {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  color: white;
  transform: scale(1.05);
}
```

---

### Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-pink);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.input-error {
  border-color: var(--error);
}
```

---

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid var(--primary-pink);
  color: var(--primary-pink);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
```

---

## Iconografía

**Librería:** Lucide React

**Íconos principales:**
- 🛍️ Shopping bag - Reservas
- 🎁 Gift - Regalos
- 👥 Users - Amigos
- ❤️ Heart - Wishlist
- 📱 Smartphone - QR/Escaneo
- 🏪 Store - Tiendas
- ✓ Check - Confirmación
- 📊 Bar chart - Analytics

**Tamaños:**
- Small: 16px
- Medium: 20px
- Large: 24px
- Hero: 48px

---

## Espaciado

```css
/* Sistema de 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

**Secciones:** 80px padding vertical (mobile: 48px)
**Cards:** 32px padding
**Botones:** 10px vertical, 24px horizontal

---

## Sombras

```css
/* Elevaciones */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(236, 72, 153, 0.2);
--shadow-lg: 0 8px 12px rgba(236, 72, 153, 0.3);
--shadow-xl: 0 12px 24px rgba(236, 72, 153, 0.15);

/* Cards */
--shadow-card: 0 10px 30px rgba(0, 0, 0, 0.08);
--shadow-card-hover: 0 12px 24px rgba(236, 72, 153, 0.15);
```

---

## Animaciones

```css
/* Transitions */
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;

/* Curves */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

**Hover effects:**
- Botones: `translateY(-2px)` + shadow
- Cards: `translateY(-8px)` + shadow
- Links: `underline`

---

## Breakpoints

```css
/* Mobile first */
--screen-sm: 640px;   /* Tablets */
--screen-md: 768px;   /* Desktop pequeño */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Desktop grande */
--screen-2xl: 1536px; /* Ultra wide */
```

**Container max-width:** 1200px

---

## Estados Visuales

### Productos en Wishlist

**Disponible:**
- Border: `green` (#10b981)
- Background: `white`
- Icon: ✓ verde

**En proceso (bloqueado):**
- Border: `yellow` (#f59e0b)
- Background: `yellow-50`
- Icon: 🔒 amarillo

**Regalado:**
- Border: `purple` (#a855f7)
- Background: `purple-50`
- Icon: 🎁 púrpura

**Caducado:**
- Border: `gray` (#9ca3af)
- Background: `gray-50`
- Icon: ⏱️ gris
- Opacity: 0.6

---

## Componentes Específicos Reserrega

### QR Display (usuario)

```css
.qr-container {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.qr-code {
  width: 250px;
  height: 250px;
  margin: 0 auto;
}

.qr-instructions {
  margin-top: 16px;
  color: var(--gray-600);
  font-size: 14px;
}
```

### Product Card (wishlist)

```css
.product-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 2px solid var(--gray-200);
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.product-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-status-badge {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
```

### Friend Avatar

```css
.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--primary-pink);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  color: white;
  font-weight: 700;
  font-size: 16px;
}
```

---

## Guías de Uso

### Degradados

**Uso permitido:**
- Botones primarios
- Fondos hero
- Logo
- Badges especiales

**NO usar en:**
- Texto (legibilidad)
- Bordes pequeños
- Fondos de formularios

### Accesibilidad

**Contraste mínimo:**
- Texto normal: 4.5:1
- Texto grande: 3:1
- UI components: 3:1

**Focus states:**
```css
:focus-visible {
  outline: 2px solid var(--primary-pink);
  outline-offset: 2px;
}
```

**Touch targets:**
- Mínimo: 44x44px (móvil)
- Recomendado: 48x48px

---

## Recursos

**Paleta completa:** Copiar variables CSS de arriba
**Iconos:** https://lucide.dev/icons
**Inspiración:** Pinterest - "gift wishlist app", "shopping app pink"

---

**Última actualización:** Noviembre 2025
