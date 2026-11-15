import { NextRequest, NextResponse } from "next/server";
import { getDailySales, getRestaurantBySlug } from "@/lib/db/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    let restaurantId = searchParams.get("restaurantId");
    const date = searchParams.get("date") || undefined;

    if (!restaurantId && slug) {
      const r = getRestaurantBySlug(slug);
      restaurantId = r?.id;
    }

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Missing restaurant" }, { status: 400 });
    }

    const data = getDailySales(restaurantId, date);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate daily sales report" }, { status: 500 });
  }
}
