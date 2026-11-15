import { NextRequest, NextResponse } from "next/server";
import { getRestaurants, createRestaurant } from "@/lib/db/storage";

export async function GET() {
  try {
    const restaurants = getRestaurants();
    return NextResponse.json({ success: true, data: restaurants });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.ownerName || !body.email || !body.phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newRest = createRestaurant({
      slug: slug || `rest-${Date.now().toString().slice(-4)}`,
      name: body.name,
      tagline: body.tagline || "Delicious Food, Fast QR Ordering",
      ownerName: body.ownerName,
      phone: body.phone,
      email: body.email,
      address: body.address || "Main Street",
      city: body.city || "Mumbai",
      state: body.state || "Maharashtra",
      pincode: body.pincode || "400001",
      category: body.category || "Casual Dining",
      logo: body.logo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=160&auto=format&fit=crop&q=80",
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
      openingTime: body.openingTime || "11:00",
      closingTime: body.closingTime || "23:00",
      isVerified: false,
      isActive: true,
      settings: {
        currency: "INR",
        taxRatePercent: 5,
        taxGstin: body.gstin || "",
        serviceChargePercent: 0,
        upiVpa: body.upiVpa || `${slug}@okaxis`,
        upiName: body.name,
        autoAcceptOrders: false,
        enableTakeaway: true,
        enableDineIn: true,
        enableLoyaltyStamp: true,
        enableSpinToWin: true,
        primaryColor: "#059669",
        secondaryColor: "#d97706",
      },
      planId: body.planId || "free_trial",
    });

    return NextResponse.json({ success: true, data: newRest });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create restaurant" }, { status: 500 });
  }
}
