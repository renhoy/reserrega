"use server"

/**
 * STUB: Este archivo es un placeholder para evitar errores de compilación.
 * La función userHasBudgets() es usada por el Dashboard.
 *
 * Implementa aquí tu lógica específica del proyecto o elimina las
 * referencias a esta función en src/app/(dashboard)/dashboard/page.tsx
 * y src/components/dashboard/DashboardClient.tsx
 */

import { getCurrentUser } from "@/lib/auth/server"

export async function userHasBudgets(): Promise<boolean> {
  // TODO: Implementar según tu lógica de negocio
  // Por ahora retorna false para que el dashboard no muestre enlaces a presupuestos
  return false
}
