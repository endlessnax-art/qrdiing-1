import { NextRequest, NextResponse } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET || "qrdening-platform-auth-secret-key-2026";
const SESSION_COOKIE_NAME = "qrdening_session";

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || "admin@qrdening.com,owner@qrdening.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  restaurantId?: string;
  restaurantSlug?: string;
  is2FAVerified?: boolean;
  exp: number;
}

// Edge-compatible HMAC-SHA256 verification using Web Crypto API
async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadStr, signature] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr));
    const expectedSig = Buffer.from(sigBuf).toString("base64url");

    if (signature !== expectedSig) return null;

    const payload: TokenPayload = JSON.parse(
      Buffer.from(payloadStr, "base64url").toString("utf-8")
    );

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const isSuperAdminRoute = pathname.startsWith("/super-admin");
  const isAdminRoute = pathname.startsWith("/admin");
  const isKitchenRoute = pathname.startsWith("/kitchen");
  const isWaiterRoute = pathname.startsWith("/waiter");

  // Only protect restricted management routes
  if (!isSuperAdminRoute && !isAdminRoute && !isKitchenRoute && !isWaiterRoute) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname + req.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  const payload = await verifyTokenEdge(sessionCookie);
  if (!payload) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname + req.nextUrl.search);
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  }

  const normalizedEmail = (payload.email || "").trim().toLowerCase();
  const isSuper = payload.role === "super_admin" && SUPER_ADMIN_EMAILS.includes(normalizedEmail);

  // 1. Guard Super Admin route
  if (isSuperAdminRoute) {
    if (!isSuper) {
      // Non-super admin cannot access super admin
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (!payload.is2FAVerified) {
      // Must complete 2FA
      return NextResponse.redirect(new URL("/login?error=2fa_required", req.url));
    }
    return NextResponse.next();
  }

  // 2. Guard Tenant Routes (Admin Dashboard, Kitchen, Waiter)
  if (isAdminRoute || isKitchenRoute || isWaiterRoute) {
    // Super admins can inspect any restaurant
    if (isSuper) {
      return NextResponse.next();
    }

    const requestedSlug = searchParams.get("slug");
    const userSlug = payload.restaurantSlug;

    // Multi-tenant safety check:
    // If user tries to access a different restaurant's slug via URL manipulation (?slug=xyz),
    // redirect them strictly to their own restaurant!
    if (requestedSlug && userSlug && requestedSlug !== userSlug) {
      const safeUrl = new URL(pathname, req.url);
      safeUrl.searchParams.set("slug", userSlug);
      // Preserve other params except tampered slug
      searchParams.forEach((val, key) => {
        if (key !== "slug") safeUrl.searchParams.set(key, val);
      });
      return NextResponse.redirect(safeUrl);
    }

    // If no slug is specified in URL but user has an assigned restaurant, automatically route to it
    if (!requestedSlug && userSlug) {
      const safeUrl = new URL(pathname, req.url);
      safeUrl.searchParams.set("slug", userSlug);
      return NextResponse.redirect(safeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/super-admin/:path*",
    "/kitchen/:path*",
    "/waiter/:path*",
  ],
};
