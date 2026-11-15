import { NextRequest, NextResponse } from "next/server";
import { getInventory, updateInventoryStock, getRestaurantBySlug } from "@/lib/db/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    let restaurantId = searchParams.get("restaurantId");

    if (!restaurantId && slug) {
      const r = getRestaurantBySlug(slug);
      restaurantId = r?.id;
    }

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Missing restaurant" }, { status: 400 });
    }

    const inventory = getInventory(restaurantId);
    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    let restaurantId = body.restaurantId;

    if (!restaurantId && body.slug) {
      const r = getRestaurantBySlug(body.slug);
      restaurantId = r?.id;
    }

    if (!restaurantId || !body.id) {
      return NextResponse.json({ success: false, error: "Missing required inventory fields" }, { status: 400 });
    }

    const updated = updateInventoryStock(restaurantId, body.id, Number(body.newStock));
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update inventory stock" }, { status: 500 });
  }
}
