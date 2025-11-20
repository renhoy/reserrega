# 🚀 Reserrega - Quick Start Guide

Esta guía te ayudará a poner en marcha Reserrega en **menos de 10 minutos**.

---

## 📋 Requisitos

- **Node.js** 18+
- **npm** 9+
- **Cuenta Supabase** (gratuita)
- **Git**

---

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/your-username/reserrega.git
cd reserrega

# Instalar dependencias
npm install --legacy-peer-deps

# Copiar variables de entorno
cp .env.example .env.local
```

### 2️⃣ Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Copiar credenciales desde **Settings → API**
3. Pegar en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

4. Ejecutar migraciones:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login y link
supabase login
supabase link --project-ref your-project-ref

# Aplicar schema
supabase db push
```

### 3️⃣ Ejecutar

```bash
# Iniciar desarrollo
npm run dev

# Abrir en navegador
# → http://localhost:3434
```

✅ **¡Listo!** La aplicación está corriendo.

---

## 🌐 Deploy a Producción

### Opción A: Vercel (Recomendado - 5 minutos)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**O desde GitHub:**
1. Importar repo en [vercel.com/new](https://vercel.com/new)
2. Configurar variables de entorno
3. Deploy automático ✅

📖 **Guía completa:** [docs/VERCEL_DEPLOY.md](./docs/VERCEL_DEPLOY.md)

### Opción B: Docker

```bash
# Build imagen
docker build -t reserrega .

# Ejecutar
docker run -p 3434:3434 --env-file .env.production reserrega

# O con Docker Compose
docker-compose up -d
```

### Opción C: VPS con PM2

```bash
# Build producción
npm run build

# Instalar PM2
npm install -g pm2

# Ejecutar
pm2 start ecosystem.config.js --env production

# Auto-start on reboot
pm2 startup
pm2 save
```

---

## 🔐 Variables de Entorno Críticas

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | ✅ |
| `NEXT_PUBLIC_APP_URL` | URL de la app | ✅ |
| `NEXTAUTH_SECRET` | Secret para auth | ✅ |

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 🧪 Verificación Post-Deploy

### 1. Health Check

```bash
curl http://localhost:3434/api/health
# → {"status":"healthy","database":"connected"}
```

### 2. Login Test

1. Ir a `/register`
2. Crear usuario de prueba
3. Login en `/login`
4. Verificar acceso a `/dashboard`

### 3. Flujo Crítico

- [ ] Login/Logout funciona
- [ ] Registro funciona
- [ ] Dashboard carga
- [ ] Wishlist accesible

---

## 📁 Estructura del Proyecto

```
reserrega/
├── src/
│   ├── app/              # App Router (Next.js 15)
│   │   ├── (auth)/       # Rutas de autenticación
│   │   ├── (dashboard)/  # Rutas del dashboard
│   │   └── api/          # API routes
│   └── lib/              # Librerías y utilidades
├── features/             # Módulos de funcionalidad
│   ├── product-reservation/
│   ├── wishlist/
│   ├── gift-flow/
│   └── admin-dashboard/
├── shared/               # Código compartido
│   ├── auth/             # Autenticación
│   ├── database/         # Base de datos
│   └── common/           # Componentes UI
├── docs/                 # Documentación
├── .env.example          # Template variables de entorno
└── next.config.ts        # Configuración Next.js
```

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo (Turbopack)
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 🔥 Troubleshooting Común

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Error: "Supabase connection failed"

1. Verificar `.env.local` tiene las credenciales correctas
2. Verificar proyecto Supabase está activo
3. Verificar RLS policies están configuradas

### Build falla

```bash
# Limpiar cache
rm -rf .next
npm run build
```

### Puerto 3434 ya en uso

```bash
# Cambiar puerto (editar package.json)
"dev": "next dev -p 3001 --turbopack"
```

---

## 📖 Documentación Adicional

- **[README.md](./README.md)** - Documentación completa del proyecto
- **[docs/VERCEL_DEPLOY.md](./docs/VERCEL_DEPLOY.md)** - Guía de deploy a Vercel
- **[docs/PRD.md](./docs/PRD.md)** - Product Requirements Document
- **[docs/tareas.md](./docs/tareas.md)** - Estado de tareas y progreso

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa [README.md](./README.md) para información detallada
2. Revisa [docs/VERCEL_DEPLOY.md](./docs/VERCEL_DEPLOY.md) para troubleshooting
3. Abre un issue en GitHub
4. Contacta al equipo de desarrollo

---

## ✅ Checklist de Producción

Antes de ir a producción:

- [ ] Build exitoso (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Supabase RLS policies activas
- [ ] Health check responde 200
- [ ] Testing manual completo
- [ ] Performance score > 80 (Lighthouse)
- [ ] Security headers activos
- [ ] Monitoring configurado
- [ ] Backups configurados
- [ ] Equipo capacitado

---

## 🎯 Próximos Pasos

Después de la instalación:

1. **Configurar empresa demo** - Crear empresa y tienda de prueba
2. **Crear usuarios** - Superadmin, admin, comercial, usuarios
3. **Agregar productos** - Productos de ejemplo para testing
4. **Testing completo** - Validar todos los flujos
5. **Capacitación** - Entrenar al equipo comercial
6. **Go live** - Lanzar a producción 🚀

---

**¿Todo listo?** 👉 Continúa con la [Documentación Completa](./README.md)

**¿Problemas?** 👉 Revisa [Troubleshooting](./docs/VERCEL_DEPLOY.md#troubleshooting)

**¡Bienvenido a Reserrega!** 🎁
