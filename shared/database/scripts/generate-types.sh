#!/bin/bash

# =====================================================
# GENERATE TYPESCRIPT TYPES FROM SUPABASE
# =====================================================
# Este script regenera los tipos TypeScript desde Supabase
# Requiere:
# 1. Tener el schema ejecutado en Supabase
# 2. Tener las variables de entorno configuradas en .env.local
# =====================================================

set -e

echo "🔍 Generando tipos TypeScript desde Supabase..."

# Verificar que existe .env.local
if [ ! -f .env.local ]; then
  echo "❌ Error: No existe .env.local"
  echo "   Copia .env.example a .env.local y completa los valores"
  exit 1
fi

# Cargar variables de entorno
source .env.local

# Extraer PROJECT_ID de la URL de Supabase
# Formato: https://xxxxxxxxxxxxx.supabase.co
PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed -E 's|https://([^.]+)\.supabase\.co|\1|')

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: No se pudo extraer PROJECT_ID de NEXT_PUBLIC_SUPABASE_URL"
  echo "   Verifica que la URL tenga el formato: https://xxxxx.supabase.co"
  exit 1
fi

echo "📦 Proyecto Supabase: $PROJECT_ID"

# Generar tipos
echo "⚙️  Ejecutando supabase gen types..."

npx supabase gen types typescript \
  --project-id "$PROJECT_ID" \
  --schema reserrega \
  > shared/database/types/database.types.ts

echo "✅ Tipos generados en: shared/database/types/database.types.ts"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Verifica que los tipos se generaron correctamente"
echo "   2. Commit los cambios si hay diferencias"
echo "   3. Los clientes de Supabase ya están configurados para usar estos tipos"
