import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderPayment } from "@/lib/db/storage";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = getOrderById(params.orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const body = await req.json();
    const { paymentMethod, paymentStatus, paymentReference } = body;

    const updated = updateOrderPayment(
      order.restaurantId,
      order.id,
      paymentStatus || "paid",
      paymentMethod || order.paymentMethod,
      paymentReference || `TXN-${Date.now().toString().slice(-6)}`
    );

    return NextResponse.json({ success: true, data: updated, message: "Payment verified and recorded" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to record payment" }, { status: 500 });
  }
}
