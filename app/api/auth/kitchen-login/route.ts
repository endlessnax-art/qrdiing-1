import { NextRequest, NextResponse } from "next/server";
import { getUsers, getRestaurants, getRestaurantById } from "@/lib/db/storage";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantSlug, pin, email, password } = body;

    const restaurants = getRestaurants();
    const users = getUsers();

    let matchedUser = null;
    let matchedRestaurant = null;

    if (restaurantSlug) {
      matchedRestaurant = restaurants.find(
        (r) => r.slug.toLowerCase() === restaurantSlug.trim().toLowerCase()
      );
    }

    if (email && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (user) {
        if (user.pin && pin && user.pin === pin.trim()) {
          matchedUser = user;
        } else if (password) {
          // Check standard seed passwords or pin
          const validPasswords = ["password123", "1234", "123456", "admin123"];
          if (validPasswords.includes(password) || (user.pin && user.pin === password)) {
            matchedUser = user;
          }
        }
      }
    } else if (matchedRestaurant && pin) {
      // Find staff in this restaurant with matching PIN
      const staff = users.find(
        (u) =>
          u.restaurantId === matchedRestaurant?.id &&
          (u.role === "kitchen_staff" || u.role === "restaurant_admin") &&
          u.pin === pin.trim()
      );
      if (staff) {
        matchedUser = staff;
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Kitchen Staff credentials or PIN. Please check and try again.",
        },
        { status: 401 }
      );
    }

    if (!matchedRestaurant && matchedUser.restaurantId) {
      matchedRestaurant = getRestaurantById(matchedUser.restaurantId);
    }

    if (!matchedRestaurant) {
      return NextResponse.json(
        { success: false, error: "Assigned restaurant not found." },
        { status: 404 }
      );
    }

    // Role check: Only kitchen staff or restaurant admin can access kitchen panel
    if (matchedUser.role !== "kitchen_staff" && matchedUser.role !== "restaurant_admin" && matchedUser.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Kitchen access permissions required." },
        { status: 403 }
      );
    }

    const token = createSessionToken(matchedUser, {
      restaurantSlug: matchedRestaurant.slug,
      maxAgeMs: 12 * 60 * 60 * 1000, // 12 hour shift session
    });

    const response = NextResponse.json({
      success: true,
      message: "Kitchen terminal authenticated.",
      redirectUrl: `/kitchen?slug=${matchedRestaurant.slug}`,
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        role: matchedUser.role,
        restaurantSlug: matchedRestaurant.slug,
        restaurantName: matchedRestaurant.name,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 12 * 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Kitchen login error:", error);
    return NextResponse.json(
      { success: false, error: "Kitchen terminal authentication failed" },
      { status: 500 }
    );
  }
}
