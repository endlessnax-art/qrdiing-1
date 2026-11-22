import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, createRestaurant, recordAuditLog } from "@/lib/db/storage";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      ownerName,
      restaurantName,
      email,
      phone,
      password,
      confirmPassword,
      address,
      city,
      state,
      pincode,
      restaurantType,
      logo,
      coverImage,
      gstNumber,
      whatsappNumber,
      agreedToTerms,
    } = body;

    const finalOwnerName = (ownerName || name || "").trim();
    if (!finalOwnerName || finalOwnerName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid owner name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match. Please re-enter." },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Full Restaurant Registration Flow
    if (restaurantName && restaurantName.trim()) {
      const cleanSlug = restaurantName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const createdRest = createRestaurant({
        name: restaurantName.trim(),
        slug: cleanSlug || `restaurant-${Date.now().toString(36)}`,
        tagline: "Smart QR Menu & Restaurant Management",
        ownerName: finalOwnerName,
        phone: phone?.trim() || "",
        email: email.trim().toLowerCase(),
        address: address?.trim() || "Main Street",
        city: city?.trim() || "Hyderabad",
        state: state?.trim() || "Telangana",
        pincode: pincode?.trim() || "500001",
        category: (restaurantType as any) || "Restaurant",
        restaurantType: restaurantType || "Restaurant",
        logo: logo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80",
        coverImage: coverImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
        openingTime: "09:00",
        closingTime: "23:00",
        isVerified: false,
        isActive: false,
        approvalStatus: "pending",
        gstNumber: gstNumber?.trim() || undefined,
        whatsappNumber: whatsappNumber?.trim() || undefined,
        settings: {
          currency: "INR",
          taxRatePercent: 5.0,
          taxGstin: gstNumber?.trim() || undefined,
          serviceChargePercent: 0,
          autoAcceptOrders: false,
          enableTakeaway: true,
          enableDineIn: true,
          enableLoyaltyStamp: true,
          enableSpinToWin: false,
          primaryColor: "#10b981",
          secondaryColor: "#064e3b",
        },
      });

      const newUser = createUser({
        name: finalOwnerName,
        email: email.trim().toLowerCase(),
        phone: phone?.trim(),
        password,
        role: "restaurant_admin",
        restaurantId: createdRest.id,
      });

      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      recordAuditLog({
        userName: finalOwnerName,
        userRole: "restaurant_admin",
        action: "NEW_RESTAURANT_REGISTRATION",
        details: `Restaurant "${restaurantName}" registered by ${finalOwnerName} (${email}). Marked Pending Approval.`,
        restaurantId: createdRest.id,
        ipAddress: ip,
      });

      return NextResponse.json({
        success: true,
        pendingApproval: true,
        message: "Your restaurant registration is under review. You will be able to access your dashboard after approval.",
        restaurant: {
          id: createdRest.id,
          name: createdRest.name,
          slug: createdRest.slug,
          approvalStatus: "pending",
        },
      });
    }

    // Fallback: Standard User Registration
    const newUser = createUser({
      name: finalOwnerName,
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      password,
      role: "restaurant_admin",
    });

    const token = createSessionToken(newUser);
    const response = NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        restaurantId: newUser.restaurantId,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
