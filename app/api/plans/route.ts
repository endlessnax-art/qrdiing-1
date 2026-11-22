import { NextResponse } from "next/server";
import { getSubscriptionPlans } from "@/lib/db/storage";

export async function GET() {
  try {
    const plans = getSubscriptionPlans();
    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch pricing plans" },
      { status: 500 }
    );
  }
}
