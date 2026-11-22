import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from "../types/database";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

/**
 * Refreshes auth tokens and updates response cookies in Next.js middleware.
 * Fully error-guarded to prevent 500 MIDDLEWARE_INVOCATION_FAILED on Vercel.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    if (!isSupabaseConfigured()) {
      return { response, user: null };
    }

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return { response, user: null };
    }

    const supabase = createServerClient<Database>(url, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          } catch {
            // Ignore cookie setting errors in edge runtime
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: "", ...options });
          } catch {
            // Ignore cookie removal errors in edge runtime
          }
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { response, user };
  } catch (err) {
    // Graceful fallback on edge runtime exceptions
    return { response, user: null };
  }
}
