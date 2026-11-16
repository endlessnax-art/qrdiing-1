import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, getRestaurantById, getRestaurants, updateUser } from "@/lib/db/storage";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Auto-link restaurant if user email matches restaurant email but restaurantId was unset
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
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days vs 7 days

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
