import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantBySlug,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/db/storage";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();

    if (body.type === "category") {
      const newCat = createCategory(
        restaurant.id,
        body.name,
        body.nameHi,
        body.nameTe,
        body.nameUr,
        body.icon
      );
      return NextResponse.json({ success: true, data: newCat });
    } else {
      // Menu item
      const result = createMenuItem(restaurant.id, {
        categoryId: body.categoryId,
        name: body.name,
        nameHi: body.nameHi,
        nameTe: body.nameTe,
        nameUr: body.nameUr,
        description: body.description || "",
        descriptionHi: body.descriptionHi,
        descriptionTe: body.descriptionTe,
        descriptionUr: body.descriptionUr,
        basePrice: Number(body.basePrice),
        image: body.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
        isVeg: Boolean(body.isVeg),
        isBestseller: Boolean(body.isBestseller),
        isAvailable: body.isAvailable !== false,
        variants: body.variants || [],
        addons: body.addons || [],
        preparationTimeMinutes: Number(body.preparationTimeMinutes || 15),
      });

      if (result.error) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, data: result.item });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();
    if (body.type === "category") {
      const updated = updateCategory(restaurant.id, body.id, body.updates);
      return NextResponse.json({ success: true, data: updated });
    } else {
      const updated = updateMenuItem(restaurant.id, body.id, body.updates);
      return NextResponse.json({ success: true, data: updated });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    if (type === "category") {
      const ok = deleteCategory(restaurant.id, id);
      return NextResponse.json({ success: ok });
    } else {
      const ok = deleteMenuItem(restaurant.id, id);
      return NextResponse.json({ success: ok });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
