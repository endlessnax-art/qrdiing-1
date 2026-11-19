import { NextRequest, NextResponse } from "next/server";
import {
  getSuperAdminOverview,
  updateSubscriptionPlanPrice,
  toggleRestaurantVerification,
  toggleRestaurantActive,
  purchaseAddonPackage,
  recordAuditLog,
} from "@/lib/db/storage";
import { requireTenantAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireTenantAuth(req, "");
    if (!auth.authorized || !auth.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Super Admin root privilege required." },
        { status: 403 }
      );
    }

    const overview = getSuperAdminOverview();
    return NextResponse.json({ success: true, data: overview });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch platform metrics" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireTenantAuth(req, "");
    if (!auth.authorized || !auth.isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Super Admin root privilege required." },
        { status: 403 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const body = await req.json();

    if (body.action === "update_plan_pricing") {
      const ok = updateSubscriptionPlanPrice(
        body.planId,
        Number(body.monthlyPrice),
        Number(body.yearlyPrice),
        Number(body.menuItemLimit)
      );
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "UPDATE_PLAN_PRICING",
        details: `Updated plan ${body.planId} pricing: ₹${body.monthlyPrice}/mo, ${body.menuItemLimit} items`,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok });
    }

    if (body.action === "toggle_verification") {
      const ok = toggleRestaurantVerification(body.restaurantId);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "TOGGLE_VERIFICATION",
        details: `Toggled verification status for restaurant ID ${body.restaurantId}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok });
    }

    if (body.action === "toggle_active") {
      const ok = toggleRestaurantActive(body.restaurantId);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "TOGGLE_RESTAURANT_ACTIVE",
        details: `Toggled active/suspended status for restaurant ID ${body.restaurantId}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok });
    }

    if (body.action === "purchase_addon") {
      const result = purchaseAddonPackage(body.restaurantId, body.packageId);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "PURCHASE_ADDON",
        details: `Purchased package ${body.packageId} for restaurant ID ${body.restaurantId}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: result.success, newLimit: result.newLimit });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process super-admin update" }, { status: 500 });
  }
}
