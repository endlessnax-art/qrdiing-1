import { NextRequest, NextResponse } from "next/server";
import {
  getWaiterCalls,
  createWaiterCall,
  resolveWaiterCall,
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
      return NextResponse.json({ success: false, error: "Missing restaurant identifier" }, { status: 400 });
    }

    const calls = getWaiterCalls(restaurantId);
    return NextResponse.json({ success: true, data: calls });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch waiter calls" }, { status: 500 });
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

    if (!restaurantId || !body.tableNumber) {
      return NextResponse.json({ success: false, error: "Missing tableNumber or restaurant" }, { status: 400 });
    }

    const call = createWaiterCall(restaurantId, body.tableNumber, body.type || "call_waiter");
    return NextResponse.json({ success: true, data: call, message: "Staff alerted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send waiter call" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { restaurantId, callId } = body;

    if (!restaurantId || !callId) {
      return NextResponse.json({ success: false, error: "Missing callId or restaurantId" }, { status: 400 });
    }

    const ok = resolveWaiterCall(restaurantId, callId);
    return NextResponse.json({ success: ok });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to resolve call" }, { status: 500 });
  }
}
