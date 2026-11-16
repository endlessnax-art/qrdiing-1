import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null, restaurant: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        phone: session.user.phone,
        restaurantId: session.user.restaurantId,
        avatarUrl: session.user.avatarUrl,
      },
      restaurant: session.restaurant
        ? {
            id: session.restaurant.id,
            slug: session.restaurant.slug,
            name: session.restaurant.name,
            logo: session.restaurant.logo,
            plan: session.restaurant.subscription.planName,
            status: session.restaurant.subscription.status,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null, restaurant: null });
  }
}
