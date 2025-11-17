# Database Scripts

Scripts útiles para gestionar la base de datos de Reserrega.

---

## 📜 Scripts Disponibles

### 1. `generate-types.sh`

**Propósito:** Regenerar tipos TypeScript desde el schema de Supabase

**Cuándo usar:**
- Después de modificar el schema (añadir tablas, campos, etc.)
- Cuando los tipos TypeScript no coinciden con la BD

**Requisitos:**
- Archivo `.env.local` configurado
- Schema ejecutado en Supabase Cloud

**Uso:**
```bash
./shared/database/scripts/generate-types.sh
```

**Output:** `shared/database/types/database.types.ts` actualizado

---

### 2. `CREATE_SUPERADMIN_SIMPLE.sql`

**Propósito:** Crear el primer usuario superadmin del sistema

**Cuándo usar:**
- Primera instalación de Reserrega
- Necesitas dar acceso superadmin a un usuario

**Pasos:**
1. Regístrate en la aplicación (crea tu cuenta)
2. Ejecuta el script para obtener tu UUID:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'tu-email@example.com';
   ```
3. Edita el script `CREATE_SUPERADMIN_SIMPLE.sql`
4. Reemplaza:
   - `TU-UUID-AQUI` con tu UUID
   - `tu-email@example.com` con tu email (3 veces)
5. Ejecuta el script completo en Supabase SQL Editor

**Verificación:**
```sql
SELECT role FROM reserrega.users WHERE email = 'tu-email';
-- Debería devolver: 'superadmin'
```

---

### 3. `CREATE_SUPERADMIN.sql`

**Propósito:** Versión avanzada con variables de psql

**Cuándo usar:**
- Si estás usando psql CLI
- Prefieres usar variables en lugar de editar el script

**Uso:**
```bash
psql -h db.xxxxx.supabase.co -U postgres \
  -f shared/database/scripts/CREATE_SUPERADMIN.sql
```

---

## 🔄 Workflow Típico

### Primera Instalación

1. **Ejecutar schema:**
   ```sql
   -- En Supabase SQL Editor
   -- Copiar y ejecutar: shared/database/schema/RESERREGA_FINAL.sql
   ```

2. **Registrar primer usuario:**
   - Ve a tu app en local: `http://localhost:3000/auth/signup`
   - Regístrate con tu email

3. **Crear superadmin:**
   - Ejecuta `CREATE_SUPERADMIN_SIMPLE.sql` (editado)
   - Verifica que funcionó

4. **Generar tipos TypeScript:**
   ```bash
   ./shared/database/scripts/generate-types.sh
   ```

---

### Después de Modificar Schema

1. **Aplicar cambios al schema:**
   ```sql
   -- Ejecutar tus ALTER TABLE / CREATE TABLE en Supabase
   ```

2. **Regenerar tipos:**
   ```bash
   ./shared/database/scripts/generate-types.sh
   ```

3. **Commit:**
   ```bash
   git add shared/database/types/database.types.ts
   git commit -m "chore(db): Update types after schema changes"
   ```

---

## 📚 Más Información

- [Database README](../README.md)
- [Schema Production](../schema/RESERREGA_FINAL.sql)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
