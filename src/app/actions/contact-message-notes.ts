"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/auth/server";

interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface ContactMessageNote {
  id: string;
  message_id: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

/**
 * Obtiene todas las notas de un mensaje de contacto
 * Solo accesible para superadmin
 */
export async function getContactMessageNotes(
  messageId: string
): Promise<ActionResult> {
  try {
    console.log("[getContactMessageNotes] Obteniendo notas para mensaje:", messageId);

    // Verificar autenticación y rol
    const user = await getServerUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    if (user.role !== "superadmin") {
      return { success: false, error: "Sin permisos para acceder a las notas" };
    }

    const { data, error } = await supabaseAdmin
      .from("contact_message_notes")
      .select(`
        *,
        author:users(id, name, email)
      `)
      .eq("message_id", messageId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getContactMessageNotes] Error obteniendo notas:", error);
      return {
        success: false,
        error: "Error al obtener notas",
      };
    }

    console.log("[getContactMessageNotes] Notas obtenidas:", data?.length);

    return {
      success: true,
      data: data as ContactMessageNote[],
    };
  } catch (error) {
    console.error("[getContactMessageNotes] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al obtener notas",
    };
  }
}

/**
 * Agrega una nueva nota a un mensaje de contacto
 * Solo accesible para superadmin
 */
export async function addContactMessageNote(
  messageId: string,
  content: string
): Promise<ActionResult> {
  try {
    console.log("[addContactMessageNote] Agregando nota para mensaje:", messageId);

    // Verificar autenticación y rol
    const user = await getServerUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    if (user.role !== "superadmin") {
      return { success: false, error: "Sin permisos para agregar notas" };
    }

    if (!content.trim()) {
      return { success: false, error: "El contenido de la nota no puede estar vacío" };
    }

    const { data, error } = await supabaseAdmin
      .from("contact_message_notes")
      .insert({
        message_id: messageId,
        content: content.trim(),
        created_by: user.id,
      })
      .select(`
        *,
        author:users(id, name, email)
      `)
      .single();

    if (error) {
      console.error("[addContactMessageNote] Error agregando nota:", error);
      return {
        success: false,
        error: "Error al agregar nota",
      };
    }

    console.log("[addContactMessageNote] Nota agregada:", data.id);

    return {
      success: true,
      data: data as ContactMessageNote,
    };
  } catch (error) {
    console.error("[addContactMessageNote] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al agregar nota",
    };
  }
}

/**
 * Actualiza una nota existente
 * Solo accesible para superadmin
 */
export async function updateContactMessageNote(
  noteId: string,
  content: string
): Promise<ActionResult> {
  try {
    console.log("[updateContactMessageNote] Actualizando nota:", noteId);

    // Verificar autenticación y rol
    const user = await getServerUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    if (user.role !== "superadmin") {
      return { success: false, error: "Sin permisos para actualizar notas" };
    }

    if (!content.trim()) {
      return { success: false, error: "El contenido de la nota no puede estar vacío" };
    }

    const { data, error } = await supabaseAdmin
      .from("contact_message_notes")
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .select(`
        *,
        author:users(id, name, email)
      `)
      .single();

    if (error) {
      console.error("[updateContactMessageNote] Error actualizando nota:", error);
      return {
        success: false,
        error: "Error al actualizar nota",
      };
    }

    console.log("[updateContactMessageNote] Nota actualizada:", noteId);

    return {
      success: true,
      data: data as ContactMessageNote,
    };
  } catch (error) {
    console.error("[updateContactMessageNote] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al actualizar nota",
    };
  }
}

/**
 * Elimina una nota
 * Solo accesible para superadmin
 */
export async function deleteContactMessageNote(
  noteId: string
): Promise<ActionResult> {
  try {
    console.log("[deleteContactMessageNote] Eliminando nota:", noteId);

    // Verificar autenticación y rol
    const user = await getServerUser();
    if (!user) {
      return { success: false, error: "No autenticado" };
    }

    if (user.role !== "superadmin") {
      return { success: false, error: "Sin permisos para eliminar notas" };
    }

    const { error } = await supabaseAdmin
      .from("contact_message_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error("[deleteContactMessageNote] Error eliminando nota:", error);
      return {
        success: false,
        error: "Error al eliminar nota",
      };
    }

    console.log("[deleteContactMessageNote] Nota eliminada:", noteId);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[deleteContactMessageNote] Error inesperado:", error);
    return {
      success: false,
      error: "Error inesperado al eliminar nota",
    };
  }
}
