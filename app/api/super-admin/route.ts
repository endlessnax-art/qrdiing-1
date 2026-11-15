import { NextRequest, NextResponse } from "next/server";
import {
  getSuperAdminOverview,
  updateSubscriptionPlanPrice,
  toggleRestaurantVerification,
  toggleRestaurantActive,
  purchaseAddonPackage,
} from "@/lib/db/storage";

export async function GET() {
  try {
    const overview = getSuperAdminOverview();
    return NextResponse.json({ success: true, data: overview });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch platform metrics" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "update_plan_pricing") {
      const ok = updateSubscriptionPlanPrice(
        body.planId,
        Number(body.monthlyPrice),
        Number(body.yearlyPrice),
        Number(body.menuItemLimit)
      );
      return NextResponse.json({ success: ok });
    }

    if (body.action === "toggle_verification") {
      const ok = toggleRestaurantVerification(body.restaurantId);
      return NextResponse.json({ success: ok });
    }

    if (body.action === "toggle_active") {
      const ok = toggleRestaurantActive(body.restaurantId);
      return NextResponse.json({ success: ok });
    }

    if (body.action === "purchase_addon") {
      const result = purchaseAddonPackage(body.restaurantId, body.packageId);
      return NextResponse.json({ success: result.success, newLimit: result.newLimit });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process super-admin update" }, { status: 500 });
  }
}
