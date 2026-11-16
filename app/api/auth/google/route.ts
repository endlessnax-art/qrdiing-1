import { NextRequest, NextResponse } from "next/server";
import { authenticateGoogleUser, getRestaurantById, getRestaurants, updateUser } from "@/lib/db/storage";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let email = body.email;
    let name = body.name;
    let googleId = body.googleId;
    let avatarUrl = body.avatarUrl;

    // If client sent Google One Tap / Sign In credential JWT:
    if (body.credential && typeof body.credential === "string") {
      try {
        const parts = body.credential.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
          email = payload.email || email;
          name = payload.name || payload.given_name || name;
          googleId = payload.sub || googleId;
          avatarUrl = payload.picture || avatarUrl;
        }
      } catch (err) {
        console.warn("Could not decode Google credential JWT payload:", err);
      }
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid Google account data. Email is required." },
        { status: 400 }
      );
    }

    const user = authenticateGoogleUser({
      email: email.trim().toLowerCase(),
      name: name?.trim() || email.split("@")[0],
      googleId: googleId || `g_${Date.now()}`,
      avatarUrl,
    });

    // Check if user has an associated restaurant
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

    const token = createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Google authentication successful.",
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
      maxAge: 60 * 60 * 24 * 14, // 14 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Google Auth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Google sign in failed." },
      { status: 500 }
    );
  }
}
