import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantBySlug,
  getCategories,
  getMenuItems,
  getTables,
  updateRestaurant,
} from "@/lib/db/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const categories = getCategories(restaurant.id);
    const menuItems = getMenuItems(restaurant.id);
    const tables = getTables(restaurant.id);

    return NextResponse.json({
      success: true,
      data: {
        restaurant,
        categories,
        menuItems,
        tables,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = updateRestaurant(restaurant.id, body);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update restaurant" }, { status: 500 });
  }
}
