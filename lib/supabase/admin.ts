import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";
import { getSupabaseConfig } from "./config";

/**
 * Server-only Supabase Admin client with Service Role privileges.
 * NEVER import this file into Client Components ("use client").
 * Bypasses Row Level Security - use with extreme caution only for privileged administrative workflows.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: createAdminClient() cannot be called in client-side code.");
  }

  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
