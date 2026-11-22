/**
 * Supabase Environment Configuration & Diagnostics Helper
 * 
 * Validates whether Supabase credentials are provided and not default placeholders.
 * Strictly prevents crashing or pretending authentication works when credentials are missing.
 */

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasServiceRoleKey: boolean;
  missing: string[];
}

export function getSupabaseConfig(): {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
} {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return false;
  
  // Guard against template placeholders
  if (
    url.includes("placeholder") ||
    url.includes("your-project") ||
    url.includes("xyzcompany") ||
    anonKey.includes("placeholder") ||
    anonKey.includes("your-anon-key")
  ) {
    return false;
  }
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const { url, anonKey, serviceRoleKey } = getSupabaseConfig();
  const missing: string[] = [];

  const hasUrl = Boolean(url && !url.includes("your-project") && !url.includes("placeholder"));
  const hasAnonKey = Boolean(anonKey && !anonKey.includes("your-anon-key") && !anonKey.includes("placeholder"));
  const hasServiceRoleKey = Boolean(serviceRoleKey && !serviceRoleKey.includes("your-service-role") && !serviceRoleKey.includes("placeholder"));

  if (!hasUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!hasAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return {
    isConfigured: hasUrl && hasAnonKey,
    hasUrl,
    hasAnonKey,
    hasServiceRoleKey,
    missing,
  };
}
