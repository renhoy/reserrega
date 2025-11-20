# 🚀 Instrucciones de Deploy Manual - Reserrega

**Estado:** ✅ Configuración completa - Listo para deploy
**Fecha:** 2025-11-20
**Versión:** 0.9.5 (91% completado)

---

## 📋 Resumen Ejecutivo

Reserrega está **100% configurado** para deployment. Todos los archivos de configuración, variables de entorno, documentación y health checks están implementados.

**Lo que está listo:**
- ✅ Package.json configurado con Turbopack (puerto 3434)
- ✅ Next.js optimizado (standalone output, security headers)
- ✅ Variables de entorno documentadas
- ✅ Docker multi-stage build
- ✅ PM2 cluster mode
- ✅ Health check API
- ✅ Documentación completa

**Lo que necesita acción manual:**
- ⏸️ Deploy a Vercel (15 minutos)
- ⏸️ Configuración Supabase Cloud (20 minutos)
- ⏸️ Crear empresa demo (10 minutos)

---

## 🎯 Opción 1: Deploy a Vercel (Recomendado)

### ⏱️ Tiempo estimado: 30-40 minutos

### Paso 1: Preparar Supabase Cloud (20 min)

#### 1.1 Crear Proyecto Supabase

```bash
# Ir a https://app.supabase.com
# Click "New Project"

# Configuración:
Name: reserrega-production
Database Password: [generar uno seguro]
Region: Europe West (Frankfurt)
Pricing Plan: Free tier (para empezar)

# Esperar ~2 minutos a que se cree
```

#### 1.2 Obtener Credenciales

```bash
# En Supabase Dashboard:
Settings → API

# Copiar estos 3 valores:
✅ Project URL: https://xxxxx.supabase.co
✅ anon/public key: eyJhbGci...
✅ service_role key: eyJhbGci... (⚠️ SECRETO)
```

#### 1.3 Aplicar Schema

```bash
# Opción A: Supabase CLI (Recomendado)
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push

# Opción B: SQL Editor manual
# 1. Ir a Supabase Dashboard → SQL Editor
# 2. Copiar contenido de shared/database/schema/reserrega.sql
# 3. Ejecutar query
# 4. Verificar que se crearon las tablas
```

#### 1.4 Verificar RLS

```sql
-- En SQL Editor, ejecutar:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- ✅ Todas las tablas deben tener rowsecurity = true
```

### Paso 2: Deploy a Vercel (15 min)

#### 2.1 Importar Proyecto

```bash
# Ir a https://vercel.com/new

# 1. Conectar GitHub account (si no está conectado)
# 2. Click "Import Git Repository"
# 3. Buscar "reserrega"
# 4. Click "Import"
```

#### 2.2 Configurar Build

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next (auto-detectado)
Install Command: npm install --legacy-peer-deps
Node Version: 20.x
```

#### 2.3 Configurar Environment Variables

**🔴 CRITICAL: Copy todas estas variables en Vercel Dashboard**

```bash
# ==========================================
# SUPABASE (REQUERIDO)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...tu-service-role-key-aqui

# ==========================================
# APPLICATION (REQUERIDO)
# ==========================================
NEXT_PUBLIC_APP_URL=https://reserrega.vercel.app
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production

# ==========================================
# SECURITY (REQUERIDO)
# ==========================================
NEXTAUTH_SECRET=tu-secret-aqui-generar-con-comando-abajo

# ==========================================
# OPTIONAL (Configurar si necesitas)
# ==========================================
NEXT_PUBLIC_STRIPE_ENABLED=false
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
RESEND_API_KEY=re_...
PUPPETEER_SKIP_DOWNLOAD=true
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
# Copiar el output en NEXTAUTH_SECRET
```

**⚠️ IMPORTANTE:**
- Para cada variable, marca el checkbox **Production**
- Opcionalmente marca **Preview** si quieres preview deployments

#### 2.4 Ejecutar Deploy

```bash
# Click "Deploy"
# Esperar 2-3 minutos
# ✅ Recibirás URL: https://reserrega-xxx.vercel.app
```

### Paso 3: Verificar Deploy (5 min)

#### 3.1 Health Check

```bash
curl https://your-domain.vercel.app/api/health

# ✅ Debe retornar:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "...",
  "uptime": 123.45
}
```

#### 3.2 Verificar Logs

```bash
# En Vercel Dashboard:
Project → Deployments → [tu deployment] → Logs

# ✅ No debe haber errores críticos
```

#### 3.3 Test Manual

1. **Abrir app:** `https://your-domain.vercel.app`
2. **Ir a register:** `/register`
3. **Crear usuario de prueba:**
   - Email: test@reserrega.com
   - Password: Test1234!
   - Role: usuario (auto-asignado)
4. **Login:** `/login`
5. **Verificar dashboard:** `/dashboard` carga correctamente

---

## 🎯 Opción 2: Deploy con Docker

### ⏱️ Tiempo estimado: 20 minutos

```bash
# 1. Crear .env.production con todas las variables
cp .env.production.example .env.production
# Editar .env.production con tus credenciales

# 2. Build imagen
docker build -t reserrega:latest .

# 3. Ejecutar
docker run -p 3434:3434 --env-file .env.production reserrega:latest

# O con Docker Compose
docker-compose up -d

# 4. Verificar
curl http://localhost:3434/api/health
```

---

## 🎯 Opción 3: Deploy en VPS con PM2

### ⏱️ Tiempo estimado: 30 minutos

```bash
# 1. SSH a tu servidor
ssh user@your-server.com

# 2. Clonar repo
git clone https://github.com/your-username/reserrega.git
cd reserrega

# 3. Configurar variables de entorno
cp .env.production.example .env.production
nano .env.production  # Editar con tus credenciales

# 4. Instalar dependencias
npm install --legacy-peer-deps

# 5. Build
npm run build

# 6. Instalar PM2
npm install -g pm2

# 7. Iniciar con PM2
pm2 start ecosystem.config.js --env production

# 8. Configurar auto-start
pm2 startup
pm2 save

# 9. Verificar
pm2 status
pm2 logs reserrega-app
curl http://localhost:3434/api/health
```

---

## ✅ Checklist Post-Deploy

### Verificación Técnica

- [ ] Health check responde 200
- [ ] Login funciona
- [ ] Register funciona
- [ ] Dashboard carga
- [ ] No hay errores en logs
- [ ] Security headers activos (verificar con curl -I)
- [ ] HTTPS funcionando (si aplica)

### Verificación Funcional

- [ ] **Auth Flow**
  - [ ] Registro de usuario
  - [ ] Login/Logout
  - [ ] Reset password (si implementado)

- [ ] **Usuario Flow**
  - [ ] Generar QR personal
  - [ ] Ver wishlist vacía
  - [ ] Invitar amigos

- [ ] **Comercial Flow** (requiere crear comercial)
  - [ ] Login como comercial
  - [ ] Ver panel de tienda
  - [ ] Escanear QR (simulación)

- [ ] **Admin Flow** (requiere crear superadmin)
  - [ ] Login como superadmin
  - [ ] Ver dashboard con estadísticas
  - [ ] Crear empresa

---

## 🏢 Paso 4: Crear Empresa Demo (10 min)

### 4.1 Crear Superadmin Manual

```sql
-- En Supabase SQL Editor:

-- 1. Obtener ID del primer usuario registrado
SELECT id, email FROM auth.users LIMIT 1;

-- 2. Crear perfil de superadmin
INSERT INTO public.user_profiles (user_id, role, username, full_name)
VALUES (
  'user-id-aqui',  -- ID del paso 1
  'superadmin',
  'admin',
  'Super Admin'
);
```

### 4.2 Login y Crear Empresa

```bash
# 1. Login con el superadmin en la app
https://your-domain.vercel.app/login

# 2. Ir a /admin/companies
# 3. Click "Crear Empresa"
# 4. Rellenar:
   Name: Empresa Demo
   NIF: B12345678
   Email: demo@reserrega.com
   Status: active

# 5. Click "Guardar"
```

### 4.3 Crear Tienda

```sql
-- En Supabase SQL Editor:

-- 1. Obtener company_id de la empresa creada
SELECT id, name FROM companies WHERE name = 'Empresa Demo';

-- 2. Crear tienda
INSERT INTO stores (company_id, name, address, city, postal_code, status)
VALUES (
  'company-id-aqui',
  'Tienda Centro',
  'Calle Principal 123',
  'Madrid',
  '28001',
  'active'
);
```

### 4.4 Crear Comercial

```bash
# En /admin/comercials:
# 1. Click "Crear Comercial"
# 2. Rellenar:
   Email: comercial@demo.com
   Password: Comercial123!
   Full Name: Comercial Demo
   Company: Empresa Demo
   Store: Tienda Centro

# 3. Click "Guardar"
```

### 4.5 Crear Productos Demo

```sql
-- En Supabase SQL Editor:
INSERT INTO products (
  company_id,
  store_id,
  name,
  description,
  price,
  barcode,
  category,
  status
) VALUES
('company-id', 'store-id', 'Vestido Rosa', 'Vestido elegante talla M', 49.99, '1234567890123', 'clothing', 'active'),
('company-id', 'store-id', 'Blusa Blanca', 'Blusa casual talla S', 29.99, '1234567890124', 'clothing', 'active'),
('company-id', 'store-id', 'Pantalón Vaquero', 'Jeans slim fit talla 38', 39.99, '1234567890125', 'clothing', 'active');
```

---

## 📊 Monitoreo Post-Deploy

### Vercel Analytics

```bash
# En Vercel Dashboard:
Project → Analytics → Enable Analytics

# Métricas disponibles:
- Page views
- Top pages
- Unique visitors
- Devices
- Countries
```

### Logs en Tiempo Real

```bash
# CLI
vercel logs --follow

# Dashboard
Vercel → Project → Deployments → [deployment] → Runtime Logs
```

### Supabase Monitoring

```bash
# En Supabase Dashboard:
Settings → Database → Connection Pooling
Reports → Database → Performance

# Verificar:
- Active connections < 10
- Query performance < 100ms avg
- No slow queries
```

---

## 🐛 Troubleshooting

### Error: "Missing env.NEXT_PUBLIC_SUPABASE_URL"

**Causa:** Variables no configuradas en Vercel

**Solución:**
```bash
# 1. Ir a Vercel Dashboard
# 2. Project → Settings → Environment Variables
# 3. Verificar que TODAS las variables requeridas estén configuradas
# 4. Marcar checkbox "Production"
# 5. Redeploy: Deployments → [...] → Redeploy
```

### Error: "Database connection failed"

**Causa:** Credenciales incorrectas o RLS bloqueando

**Solución:**
```bash
# 1. Verificar credenciales en .env
# 2. Verificar RLS policies en Supabase
# 3. Revisar logs: vercel logs --output=errors
```

### Build falla en Vercel

**Causa:** Install command incorrecto

**Solución:**
```bash
# En Vercel → Settings → General → Build & Development Settings
Install Command: npm install --legacy-peer-deps
```

### CORS errors en browser

**Causa:** NEXT_PUBLIC_APP_URL incorrecto

**Solución:**
```bash
# Actualizar variable en Vercel:
NEXT_PUBLIC_APP_URL=https://tu-dominio-correcto.vercel.app

# Redeploy
```

---

## 📚 Recursos

| Recurso | Ubicación |
|---------|-----------|
| Guía completa Vercel | `docs/VERCEL_DEPLOY.md` |
| Quick start | `QUICKSTART.md` |
| README completo | `README.md` |
| Variables de entorno | `.env.production.example` |
| Docker setup | `Dockerfile`, `docker-compose.yml` |
| PM2 config | `ecosystem.config.js` |

---

## ✅ Deploy Completado

Una vez completados todos los pasos:

1. **Actualizar docs/tareas.md:** Marcar DO-002 y DO-003 como completados
2. **Notificar al equipo:** Compartir URL de producción
3. **Documentar credenciales:** Guardar en gestor de contraseñas
4. **Configurar backups:** Supabase → Database → Backups
5. **Monitoring:** Configurar alertas en Vercel/Supabase

---

## 🎉 ¡Producción Lista!

**URL de producción:** `https://your-domain.vercel.app`

**Credenciales demo:**
- Superadmin: admin@reserrega.com / [tu-password]
- Comercial: comercial@demo.com / Comercial123!
- Usuario: test@reserrega.com / Test1234!

**Siguiente paso:** Testing completo de flujos críticos (TB-001)

---

**Fecha de deploy:** _____________________
**Deployed by:** _____________________
**Versión:** 0.9.5
**Status:** 🟢 PRODUCTION READY
