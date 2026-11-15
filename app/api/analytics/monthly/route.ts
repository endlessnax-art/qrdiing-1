import { NextRequest, NextResponse } from "next/server";
import { getMonthlySales, getRestaurantBySlug } from "@/lib/db/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    let restaurantId = searchParams.get("restaurantId");
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;
    const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) - 1 : undefined;

    if (!restaurantId && slug) {
      const r = getRestaurantBySlug(slug);
      restaurantId = r?.id;
    }

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Missing restaurant" }, { status: 400 });
    }

    const data = getMonthlySales(restaurantId, year, month);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate monthly sales report" }, { status: 500 });
  }
}
