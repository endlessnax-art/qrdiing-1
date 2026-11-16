import crypto from "crypto";
import { cookies } from "next/headers";
import { getUserById, getRestaurantById } from "./db/storage";
import { User, Restaurant } from "./db/types";

const SESSION_SECRET = process.env.SESSION_SECRET || "qrdening-platform-auth-secret-key-2026";
export const SESSION_COOKIE_NAME = "qrdening_session";

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  restaurantId?: string;
}

/**
 * Creates a cryptographically signed session token:
 * payload.b64 + "." + hmac_signature
 */
export function createSessionToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
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
    };
  } catch {
    return null;
  }
}

/**
 * Helper to get currently logged in user from Next.js server context
 */
export async function getCurrentUser(): Promise<{ user: User; restaurant?: Restaurant } | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) return null;

    const session = verifySessionToken(sessionCookie.value);
    if (!session) return null;

    const user = getUserById(session.userId);
    if (!user) return null;

    const restaurant = user.restaurantId ? getRestaurantById(user.restaurantId) : undefined;
    return { user, restaurant };
  } catch {
    return null;
  }
}
