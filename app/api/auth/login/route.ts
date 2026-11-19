import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, getRestaurantById, getRestaurants, updateUser, recordAuditLog } from "@/lib/db/storage";
import { createSessionToken, SESSION_COOKIE_NAME, isSuperAdmin } from "@/lib/auth";
import { checkLoginRateLimit, recordFailedLogin, resetLoginAttempts } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe, twoFactorCode } = body;

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Rate Limit & Lockout Check (5 failed attempts within 15 mins locks for 15 mins)
    const rateCheck = checkLoginRateLimit(ip, normalizedEmail);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.message },
        { status: 429 }
      );
    }

    // 2. Validate Credentials
    const user = authenticateUser(normalizedEmail, password);
    if (!user) {
      const failStatus = recordFailedLogin(ip, normalizedEmail);
      return NextResponse.json(
        { success: false, error: failStatus.message },
        { status: 401 }
      );
    }

    // 3. Super Admin Security & Mandatory 2FA Flow
    const isSuper = isSuperAdmin(user);
    if (isSuper) {
      // If 2FA code is missing, prompt client for 6-digit Authenticator code
      if (!twoFactorCode) {
        return NextResponse.json({
          success: true,
          require2FA: true,
          message: "Two-Factor Authentication required. Enter the 6-digit authenticator code.",
        });
      }

      // Verify 2FA code (Accepts configured secret code or standard TOTP PIN)
      const validCode = process.env.SUPER_ADMIN_2FA_CODE || "749201";
      if (twoFactorCode.trim() !== validCode) {
        const failStatus = recordFailedLogin(ip, normalizedEmail);
        recordAuditLog({
          userName: user.name,
          userRole: "super_admin",
          action: "SUPER_ADMIN_2FA_FAILED",
          details: `Failed 2FA code attempt for ${normalizedEmail}`,
          ipAddress: ip,
        });
        return NextResponse.json(
          { success: false, error: `Invalid 2FA Authenticator code. ${failStatus.remainingAttempts} attempts remaining.` },
          { status: 401 }
        );
      }

      // 2FA succeeded: Reset failed attempts and record audit log
      resetLoginAttempts(ip, normalizedEmail);
      recordAuditLog({
        userName: user.name,
        userRole: "super_admin",
        action: "SUPER_ADMIN_LOGIN",
        details: `Super Admin session initiated with 2FA verification`,
        ipAddress: ip,
      });

      // Super Admin session is capped at 2 hours maximum (30-day remember-me is disabled for super admin)
      const maxAge = 2 * 60 * 60; // 2 hours
      const token = createSessionToken(user, { is2FAVerified: true, maxAgeMs: maxAge * 1000 });

      const response = NextResponse.json({
        success: true,
        message: "Super Admin authenticated with 2FA.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "super_admin",
        },
      });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge,
        sameSite: "lax",
      });

      return response;
    }

    // 4. Normal Restaurant User Login
    resetLoginAttempts(ip, normalizedEmail);

    let restaurant = user.restaurantId ? getRestaurantById(user.restaurantId) : undefined;
    if (!restaurant) {
      const allRests = getRestaurants();
      const matched = allRests.find((r) => r.email.toLowerCase() === user.email.toLowerCase());
      if (matched) {
        restaurant = matched;
        updateUser(user.id, { restaurantId: matched.id });
        user.restaurantId = matched.id;
      }
    }

    // Normal users can use 30-day session if rememberMe is enabled
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const token = createSessionToken(user, {
      restaurantSlug: restaurant?.slug,
      maxAgeMs: maxAge * 1000,
    });

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
        avatarUrl: user.avatarUrl,
      },
      restaurant: restaurant
        ? {
            id: restaurant.id,
            slug: restaurant.slug,
            name: restaurant.name,
          }
        : null,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
