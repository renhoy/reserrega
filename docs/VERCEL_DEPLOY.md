# 🚀 Guía de Deploy a Vercel - Reserrega

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Supabase](#configuración-de-supabase)
3. [Configuración de Vercel](#configuración-de-vercel)
4. [Variables de Entorno](#variables-de-entorno)
5. [Workflow de Deployment](#workflow-de-deployment)
6. [Verificación Post-Deploy](#verificación-post-deploy)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos Previos

Antes de comenzar el deploy, asegúrate de tener:

- ✅ Cuenta de GitHub con el repositorio configurado
- ✅ Cuenta de Vercel ([vercel.com](https://vercel.com))
- ✅ Cuenta de Supabase Cloud ([supabase.com](https://supabase.com))
- ✅ Build exitoso en local (`npm run build`)
- ✅ Variables de entorno configuradas

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase Cloud

1. Accede a [app.supabase.com](https://app.supabase.com)
2. Click en **"New Project"**
3. Configura:
   - **Name:** reserrega-production
   - **Database Password:** (genera uno seguro)
   - **Region:** Europe West (Frankfurt) - más cercano a España
4. Espera ~2 minutos a que se cree el proyecto

### Paso 2: Ejecutar Migraciones

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar sesión
supabase login

# Conectar al proyecto remoto
supabase link --project-ref your-project-ref

# Aplicar migraciones
supabase db push

# Verificar
supabase db diff
```

### Paso 3: Obtener Credenciales

1. Ve a **Settings → API**
2. Copia estos valores (los necesitarás en Vercel):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGci...`
   - **service_role key:** `eyJhbGci...` (⚠️ Mantener secreto)

### Paso 4: Configurar RLS (Row Level Security)

Las políticas RLS ya están definidas en el schema. Verifica que estén activas:

```sql
-- Verificar que RLS esté habilitado en todas las tablas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

Todas las tablas deben tener `rowsecurity = true`.

---

## ☁️ Configuración de Vercel

### Método 1: Deploy desde GitHub (Recomendado)

#### Paso 1: Importar Repositorio

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Git Repository"**
3. Selecciona tu repositorio `reserrega`
4. Autoriza el acceso de Vercel a GitHub

#### Paso 2: Configurar Proyecto

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install --legacy-peer-deps
```

#### Paso 3: Configurar Variables de Entorno

En la sección **Environment Variables**, añade:

**Production:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=/api
NEXTAUTH_SECRET=your-production-secret-here
PUPPETEER_SKIP_DOWNLOAD=true
NODE_ENV=production
```

**Preview (opcional - mismo que Production o usa Supabase diferente):**
```bash
# Puedes usar las mismas que Production o un proyecto Supabase separado para staging
```

**Development (opcional - para `vercel dev`):**
```bash
# Usa tus credenciales de desarrollo local
```

⚠️ **IMPORTANTE:**
- Click en los checkboxes para seleccionar a qué ambientes aplica cada variable
- Usa **Production** para rama `main`
- Usa **Preview** para otras ramas (opcional)

#### Paso 4: Deploy Inicial

1. Click en **"Deploy"**
2. Espera ~2-3 minutos
3. Recibirás una URL: `https://reserrega-xxx.vercel.app`

### Método 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

---

## 🔐 Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ambiente |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Todos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public/Anon key de Supabase | Todos |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (⚠️ secreto) | Production/Preview |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | Todos |
| `NEXTAUTH_SECRET` | Secret para NextAuth | Production/Preview |

### Variables Opcionales

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL del API | `/api` |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `NEXT_PUBLIC_STRIPE_ENABLED` | Activar Stripe | `false` |
| `RESEND_API_KEY` | API key de Resend | - |
| `PUPPETEER_SKIP_DOWNLOAD` | Skip Chromium download | `true` |

### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🔄 Workflow de Deployment

### Automatic Deployment

Vercel configura automáticamente los siguientes workflows:

#### 1. **Production Deploy (main branch)**

```
git push origin main
  ↓
Vercel detecta push
  ↓
Ejecuta: npm install --legacy-peer-deps
  ↓
Ejecuta: npm run build --turbopack
  ↓
Deploy a: https://public.vercel.app (production)
  ↓
Ejecuta health checks
  ↓
✅ Deploy completo
```

#### 2. **Preview Deploy (otras ramas)**

```
git push origin feature/nueva-caracteristica
  ↓
Vercel detecta push
  ↓
Ejecuta build
  ↓
Deploy a: https://reserrega-git-feature-xxx.vercel.app (preview)
  ↓
Comenta URL en PR de GitHub
  ↓
✅ Preview listo para testing
```

### Manual Deployment

```bash
# Deploy manual desde CLI
vercel --prod

# Deploy preview
vercel

# Rollback a deployment anterior
vercel rollback [deployment-url]
```

---

## ✅ Verificación Post-Deploy

### Checklist de Validación

#### 1. **Verificar que la aplicación carga**

```bash
curl -I https://your-domain.vercel.app
# Debe retornar: HTTP/2 200
```

#### 2. **Verificar conexión a Supabase**

1. Accede a `/login`
2. Intenta hacer login con usuario de prueba
3. Verifica en Supabase Dashboard → Authentication que aparece

#### 3. **Verificar Variables de Entorno**

En Vercel Dashboard → Settings → Environment Variables:
- ✅ Todas las variables requeridas están configuradas
- ✅ Los valores son correctos (sin typos)
- ✅ Las variables sensibles no están expuestas en el código

#### 4. **Verificar Logs**

```bash
# Ver logs en tiempo real
vercel logs [deployment-url] --follow

# Ver logs de errores
vercel logs [deployment-url] --output=errors
```

#### 5. **Verificar Performance**

1. Abre Chrome DevTools
2. Ve a Lighthouse
3. Ejecuta audit en modo Production
4. Verifica scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 80

#### 6. **Verificar Security Headers**

```bash
curl -I https://your-domain.vercel.app | grep -E "(Content-Security-Policy|X-Frame-Options|Strict-Transport-Security)"
```

Debe mostrar:
- `Content-Security-Policy: ...`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000`

#### 7. **Verificar Funcionalidad Crítica**

- [ ] Login/Logout funciona
- [ ] Registro de usuarios funciona
- [ ] Reserva de productos funciona
- [ ] Wishlist carga correctamente
- [ ] Admin dashboard accesible (solo superadmin)
- [ ] Escaneo QR funciona
- [ ] Checkout de regalos funciona

---

## 🐛 Troubleshooting

### Error: "Module not found" durante build

**Causa:** Dependencias no instaladas correctamente

**Solución:**
```bash
# En Vercel Dashboard → Settings → General → Build & Development Settings
Install Command: npm install --legacy-peer-deps
```

### Error: "Supabase connection failed"

**Causa:** Variables de entorno incorrectas o RLS bloqueando queries

**Solución:**
1. Verifica variables en Vercel Dashboard
2. Verifica que RLS policies permitan las operaciones
3. Revisa logs: `vercel logs`

### Error: "Cannot find module '@/...' "

**Causa:** TypeScript path aliases no configurados

**Solución:**
Verifica `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Build timeout (>15 minutos)

**Causa:** Build demasiado lento o recursión infinita

**Solución:**
1. Optimizar imports
2. Usar `next.config.ts` → `experimental: { turbotrace: { ... } }`
3. Verificar que no haya import loops

### Error: "NEXTAUTH_SECRET is not defined"

**Causa:** Variable no configurada en Vercel

**Solución:**
1. Genera secret: `openssl rand -base64 32`
2. Añade en Vercel Dashboard → Environment Variables
3. Redeploy

### Preview deployments no funcionan

**Causa:** Environment variables solo en Production

**Solución:**
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Para cada variable, marca checkbox **Preview**
3. Redeploy preview

### Error 500 en producción pero funciona en local

**Causa:** Diferencias entre Node.js versions o environment

**Solución:**
1. Revisa logs: `vercel logs --output=errors`
2. Verifica Node version en `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```
3. Verifica que no uses APIs de Node.js en client components

---

## 🔗 Configurar Dominio Personalizado (Opcional)

### Paso 1: Añadir Dominio en Vercel

1. Ve a Vercel Dashboard → Settings → Domains
2. Click **"Add"**
3. Escribe tu dominio: `public.com`

### Paso 2: Configurar DNS

En tu proveedor de DNS (GoDaddy, Cloudflare, etc):

**Opción A: CNAME (Recomendado)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Opción B: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

### Paso 3: Verificar

Espera 24-48 horas (propagación DNS) y verifica:
```bash
dig public.com
# Debe apuntar a Vercel
```

### Paso 4: Actualizar Variables de Entorno

En Vercel Dashboard, actualiza:
```bash
NEXT_PUBLIC_APP_URL=https://public.com
```

Redeploy para aplicar cambios.

---

## 📊 Monitoring y Analytics

### Vercel Analytics

1. Ve a Vercel Dashboard → Analytics
2. Click **"Enable Analytics"**
3. Verás métricas de:
   - Page views
   - Top pages
   - Top referrers
   - Devices
   - Locations

### Error Tracking (Opcional)

Integrar Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🔄 Workflow Recomendado

### Development → Staging → Production

```
1. Desarrollo local
   ↓ git push origin develop
2. Preview deployment (testing)
   ↓ PR aprobado → merge to main
3. Production deployment
   ✅ Monitorear logs y analytics
```

### Hotfix Workflow

```
1. Detectar bug en producción
   ↓
2. Crear rama: hotfix/fix-critical-bug
   ↓
3. Fix + test en preview deployment
   ↓
4. Merge a main → auto-deploy
   ↓
5. Verificar fix en producción
```

---

## 📚 Recursos Adicionales

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

## ✅ Checklist Final

Antes de considerar el deploy completo:

- [ ] Build exitoso en producción
- [ ] Todas las variables de entorno configuradas
- [ ] RLS policies activas en Supabase
- [ ] Health checks pasando
- [ ] Security headers configurados
- [ ] Logs sin errores críticos
- [ ] Performance score > 80
- [ ] Funcionalidad crítica validada
- [ ] Dominio personalizado configurado (opcional)
- [ ] Monitoring/Analytics activado
- [ ] Documentación actualizada
- [ ] Equipo notificado de la URL de producción

---

**Última actualización:** 2025-11-20
**Autor:** Equipo Reserrega
**Versión:** 1.0
