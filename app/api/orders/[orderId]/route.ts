import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderPayment } from "@/lib/db/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = getOrderById(params.orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}
