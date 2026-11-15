import { NextRequest, NextResponse } from "next/server";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getRestaurantBySlug,
} from "@/lib/db/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const slug = searchParams.get("slug");
    const status = searchParams.get("status") as any;

    let targetRestId = restaurantId;
    if (!targetRestId && slug) {
      const rest = getRestaurantBySlug(slug);
      targetRestId = rest?.id;
    }

    if (!targetRestId) {
      return NextResponse.json({ success: false, error: "Missing restaurantId or slug" }, { status: 400 });
    }

    const orders = getOrders(targetRestId, status);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
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

    if (!restaurantId || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid order parameters" }, { status: 400 });
    }

    const result = createOrder(restaurantId, {
      orderType: body.orderType || "dine_in",
      tableNumber: body.tableNumber,
      token: body.token,
      customerName: body.customerName || "Guest Customer",
      customerPhone: body.customerPhone,
      items: body.items,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod || "cash",
    });

    return NextResponse.json({ success: true, data: result.order, message: result.message });
  } catch (error) {
    console.error("Failed to place order:", error);
    return NextResponse.json({ success: false, error: (error as any)?.message || String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId, orderId, newStatus, reason } = body;

    if (!restaurantId || !orderId || !newStatus) {
      return NextResponse.json({ success: false, error: "Missing required status update fields" }, { status: 400 });
    }

    const updated = updateOrderStatus(restaurantId, orderId, newStatus, { reason });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
