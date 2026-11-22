import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/database";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or retrieves the singleton Supabase client for client-side components.
 * Returns null if Supabase environment variables are missing, allowing UI components
 * to show a helpful setup banner instead of crashing.
 */
export function createClient() {
  if (typeof window === "undefined") {
    // If accidentally called on the server, instantiate a temporary client
    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) return null;
    return createBrowserClient<Database>(url, anonKey);
  }

  if (clientInstance) {
    return clientInstance;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseConfig();
  clientInstance = createBrowserClient<Database>(url, anonKey);
  return clientInstance;
}
