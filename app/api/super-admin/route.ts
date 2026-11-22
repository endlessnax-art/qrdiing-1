import { NextRequest, NextResponse } from "next/server";
import {
  getSuperAdminOverview,
  updateSubscriptionPlanPrice,
  toggleRestaurantVerification,
  toggleRestaurantActive,
  purchaseAddonPackage,
  recordAuditLog,
  approveRestaurant,
  rejectRestaurant,
  suspendRestaurant,
  activateRestaurant,
  extendRestaurantSubscription,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
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

    // 1. Approve restaurant
    if (body.action === "approve_restaurant") {
      const ok = approveRestaurant(body.restaurantId);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "RESTAURANT_APPROVED",
        details: `Super Admin approved restaurant ID: ${body.restaurantId}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok, message: "Restaurant approved successfully" });
    }

    // 2. Reject restaurant
    if (body.action === "reject_restaurant") {
      const ok = rejectRestaurant(body.restaurantId, body.reason || "Application rejected");
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "RESTAURANT_REJECTED",
        details: `Super Admin rejected restaurant ID: ${body.restaurantId}. Reason: ${body.reason}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok, message: "Restaurant rejected" });
    }

    // 3. Suspend restaurant
    if (body.action === "suspend_restaurant") {
      const ok = suspendRestaurant(body.restaurantId, body.reason);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "RESTAURANT_SUSPENDED",
        details: `Super Admin suspended restaurant ID: ${body.restaurantId}. Reason: ${body.reason || "Policy violation"}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok, message: "Restaurant suspended" });
    }

    // 4. Activate restaurant
    if (body.action === "activate_restaurant") {
      const ok = activateRestaurant(body.restaurantId);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "RESTAURANT_ACTIVATED",
        details: `Super Admin reactivated restaurant ID: ${body.restaurantId}`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok, message: "Restaurant reactivated" });
    }

    // 5. Extend subscription
    if (body.action === "extend_subscription") {
      const days = Number(body.days) || 30;
      const ok = extendRestaurantSubscription(body.restaurantId, days);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "SUBSCRIPTION_EXTENDED",
        details: `Super Admin extended subscription for restaurant ID: ${body.restaurantId} by ${days} days`,
        restaurantId: body.restaurantId,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok, message: `Subscription extended by ${days} days` });
    }

    // 6. Create Plan
    if (body.action === "create_plan") {
      const plan = createSubscriptionPlan(body.planData);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "PLAN_CREATED",
        details: `Super Admin created subscription plan: ${plan.name} (₹${plan.monthlyPrice}/mo)`,
        ipAddress: ip,
      });
      return NextResponse.json({ success: true, plan });
    }

    // 7. Update Plan
    if (body.action === "update_plan") {
      const ok = updateSubscriptionPlan(body.planId, body.updates);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "PLAN_UPDATED",
        details: `Super Admin updated subscription plan: ${body.planId}`,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok });
    }

    // 8. Delete Plan
    if (body.action === "delete_plan") {
      const ok = deleteSubscriptionPlan(body.planId);
      recordAuditLog({
        userName: auth.user.name,
        userRole: "super_admin",
        action: "PLAN_DELETED",
        details: `Super Admin deleted subscription plan: ${body.planId}`,
        ipAddress: ip,
      });
      return NextResponse.json({ success: ok });
    }

    // Legacy / specific actions
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to process super-admin update" }, { status: 500 });
  }
}
