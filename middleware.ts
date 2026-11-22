import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { isSupabaseConfigured } from "./lib/supabase/config";

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || "admin@qrdine.com,owner@qrdine.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Static assets and Next.js internals are always allowed
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Public customer routes: landing page, public menus, login, and registration
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/menu/");

  if (isPublicRoute) {
    // If Supabase is configured, refresh session cookie if present
    if (isSupabaseConfigured()) {
      const { response } = await updateSession(req);
      return response;
    }
    return NextResponse.next();
  }

  // 3. Protected routes: /dashboard and /admin
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isDashboardRoute || isAdminRoute) {
    // If Supabase is configured, enforce real authentication
    if (isSupabaseConfigured()) {
      const { response, user } = await updateSession(req);

      if (!user) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // If accessing /admin, enforce Super Admin authorization
      if (isAdminRoute) {
        const userEmail = (user.email || "").toLowerCase();
        const role = user.user_metadata?.role;
        const isAuthorized = role === "super_admin" || SUPER_ADMIN_EMAILS.includes(userEmail);

        if (!isAuthorized) {
          // Redirect unauthorized user to their restaurant dashboard
          const dashboardUrl = new URL("/dashboard", req.url);
          dashboardUrl.searchParams.set("error", "unauthorized_admin");
          return NextResponse.redirect(dashboardUrl);
        }
      }

      return response;
    }

    // If Supabase is NOT configured yet:
    // Allow developers to view the dashboard & admin UI in development/demo mode
    // with a persistent configuration banner so they can test the pages immediately.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
