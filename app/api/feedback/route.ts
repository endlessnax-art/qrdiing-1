import { NextRequest, NextResponse } from "next/server";
import { getFeedbacks, createFeedback, getRestaurantBySlug } from "@/lib/db/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const slug = searchParams.get("slug");

    let targetRestId = restaurantId;
    if (!targetRestId && slug) {
      const rest = getRestaurantBySlug(slug);
      targetRestId = rest?.id;
    }

    if (!targetRestId) {
      return NextResponse.json({ success: false, error: "Missing restaurantId or slug" }, { status: 400 });
    }

    const feedbacks = getFeedbacks(targetRestId);
    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let restaurantId = body.restaurantId;

    if (!restaurantId && body.slug) {
      const rest = getRestaurantBySlug(body.slug);
      restaurantId = rest?.id;
    }

    if (!restaurantId || !body.rating) {
      return NextResponse.json({ success: false, error: "Missing restaurantId or rating" }, { status: 400 });
    }

    const feedback = createFeedback(restaurantId, {
      orderId: body.orderId,
      tableNumber: body.tableNumber,
      customerName: body.customerName || "Valued Guest",
      customerPhone: body.customerPhone,
      rating: Number(body.rating) || 5,
      comment: body.comment || "",
      tags: body.tags || [],
    });

    return NextResponse.json({
      success: true,
      data: feedback,
      message: "Thank you for your feedback! Your review helps us improve.",
    });
  } catch (error) {
    console.error("Feedback creation error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 });
  }
}
