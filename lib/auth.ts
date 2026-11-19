import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserById, getRestaurantById } from "./db/storage";
import { User, Restaurant } from "./db/types";

export const SESSION_SECRET = process.env.SESSION_SECRET || "qrdening-platform-auth-secret-key-2026";
export const SESSION_COOKIE_NAME = "qrdening_session";

export const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || "admin@qrdening.com,owner@qrdening.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  restaurantId?: string;
  restaurantSlug?: string;
  is2FAVerified?: boolean;
}

/**
 * Checks whether user has valid Super Admin privileges:
 * Must have role 'super_admin' AND email must be in SUPER_ADMIN_EMAILS whitelist.
 */
export function isSuperAdmin(userOrEmail: { role?: string; email: string } | string): boolean {
  if (typeof userOrEmail === "string") {
    return SUPER_ADMIN_EMAILS.includes(userOrEmail.trim().toLowerCase());
  }
  return (
    userOrEmail.role === "super_admin" &&
    SUPER_ADMIN_EMAILS.includes(userOrEmail.email.trim().toLowerCase())
  );
}

/**
 * Creates a cryptographically signed session token:
 * payload.b64 + "." + hmac_signature
 * Super Admin sessions are strictly capped to 2 hours.
 */
export function createSessionToken(
  user: User,
  options?: { is2FAVerified?: boolean; restaurantSlug?: string; maxAgeMs?: number }
): string {
  const isSuper = isSuperAdmin(user);
  
  // Super Admin session is capped at 2 hours max. Normal users get up to 30 days if rememberMe.
  const defaultDuration = isSuper ? 2 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  const duration = options?.maxAgeMs ? Math.min(options.maxAgeMs, isSuper ? 2 * 60 * 60 * 1000 : options.maxAgeMs) : defaultDuration;

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
    restaurantSlug: options?.restaurantSlug,
    is2FAVerified: isSuper ? Boolean(options?.is2FAVerified) : true,
    exp: Date.now() + duration,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadStr)
    .digest("base64url");

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies session token and returns decoded session payload or null
 */
export function verifySessionToken(token: string): SessionData | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadStr, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadStr)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      restaurantId: payload.restaurantId,
      restaurantSlug: payload.restaurantSlug,
      is2FAVerified: payload.is2FAVerified,
    };
  } catch {
    return null;
  }
}

/**
 * Helper to get currently logged in user from Next.js server context
 */
export async function getCurrentUser(): Promise<{ user: User; restaurant?: Restaurant; session: SessionData } | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    const session = verifySessionToken(sessionCookie.value);
    if (!session) return null;

    const user = getUserById(session.userId);
    if (!user) return null;

    const restaurant = user.restaurantId ? getRestaurantById(user.restaurantId) : undefined;
    return { user, restaurant, session };
  } catch {
    return null;
  }
}

/**
 * Server-side route guard for API handlers:
 * Ensures logged-in user has permission for the specified restaurant slug.
 * Super admins can access any restaurant.
 */
export type TenantAuthResult =
  | { authorized: true; user: User; restaurant?: Restaurant; isSuperAdmin: boolean; response?: undefined }
  | { authorized: false; response: NextResponse; user?: undefined; restaurant?: undefined; isSuperAdmin?: undefined };

export async function requireTenantAuth(
  req: NextRequest,
  targetSlug: string
): Promise<TenantAuthResult> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Authentication required. Please sign in." },
        { status: 401 }
      ),
    };
  }

  const session = verifySessionToken(token);
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Session expired or invalid. Please sign in again." },
        { status: 401 }
      ),
    };
  }

  const user = getUserById(session.userId);
  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json({ success: false, error: "User not found." }, { status: 401 }),
    };
  }

  const isSuper = isSuperAdmin(user);
  if (isSuper) {
    if (!session.is2FAVerified) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: "2FA verification required for super admin actions." },
          { status: 403 }
        ),
      };
    }
    const restaurant = user.restaurantId ? getRestaurantById(user.restaurantId) : undefined;
    return { authorized: true, user, restaurant, isSuperAdmin: true };
  }

  // Tenant validation
  const userRest = user.restaurantId ? getRestaurantById(user.restaurantId) : undefined;
  if (!userRest || userRest.slug !== targetSlug) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access denied. You do not have permission to view or manage another restaurant's data.",
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user, restaurant: userRest, isSuperAdmin: false };
}
