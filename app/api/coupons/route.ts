import { NextRequest, NextResponse } from "next/server";
import {
  getCoupons,
  createCoupon,
  validateCoupon,
  getRestaurantBySlug,
} from "@/lib/db/storage";

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

    const coupons = getCoupons(restaurantId);
    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let restaurantId = body.restaurantId;

    if (!restaurantId && body.slug) {
      const r = getRestaurantBySlug(body.slug);
      restaurantId = r?.id;
    }

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Missing restaurant" }, { status: 400 });
    }

    if (body.action === "validate") {
      const result = validateCoupon(restaurantId, body.code, Number(body.subtotal || 0));
      return NextResponse.json({ success: result.valid, ...result });
    }

    const newCoupon = createCoupon(restaurantId, {
      code: body.code,
      description: body.description || "",
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      minOrderValue: Number(body.minOrderValue || 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      startDate: body.startDate || new Date().toISOString().split("T")[0],
      endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      maxUsage: body.maxUsage ? Number(body.maxUsage) : undefined,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: newCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process coupon" }, { status: 500 });
  }
}
