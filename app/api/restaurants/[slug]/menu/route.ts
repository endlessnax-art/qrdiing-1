import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantBySlug,
  getMenuItems,
  getArchivedMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  restoreMenuItem,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/db/storage";
import { requireTenantAuth } from "@/lib/auth";

// Sanitizer to strip dangerous tags like <script>
function sanitizeInput(str?: string): string {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, "").trim();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const archivedOnly = searchParams.get("archived") === "true";

    if (archivedOnly) {
      // Must be authorized to inspect archived items
      const auth = await requireTenantAuth(req, params.slug);
      if (!auth.authorized) {
        return auth.response;
      }
      const archivedItems = getArchivedMenuItems(restaurant.id);
      return NextResponse.json({ success: true, data: archivedItems });
    }

    const categoryId = searchParams.get("categoryId") || undefined;
    const items = getMenuItems(restaurant.id, categoryId, false);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await requireTenantAuth(req, params.slug);
    if (!auth.authorized) {
      return auth.response;
    }

    if (
      auth.user.role !== "restaurant_admin" &&
      auth.user.role !== "super_admin" &&
      (auth.user.role as string) !== "manager"
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Staff accounts cannot create or modify menu items." },
        { status: 403 }
      );
    }

    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();

    // Restore archived item action
    if (body.action === "restore") {
      if (!body.itemId) {
        return NextResponse.json({ success: false, error: "Missing itemId to restore" }, { status: 400 });
      }
      const restoreResult = restoreMenuItem(restaurant.id, body.itemId);
      if (!restoreResult.success) {
        return NextResponse.json({ success: false, error: restoreResult.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "Item successfully restored to menu." });
    }

    if (body.type === "category") {
      const catName = sanitizeInput(body.name);
      if (!catName || catName.length < 2) {
        return NextResponse.json({ success: false, error: "Category name must be at least 2 characters." }, { status: 400 });
      }
      const newCat = createCategory(
        restaurant.id,
        catName,
        sanitizeInput(body.nameHi),
        sanitizeInput(body.nameTe),
        sanitizeInput(body.nameUr),
        body.icon
      );
      return NextResponse.json({ success: true, data: newCat });
    } else {
      // Menu item validation & sanitization
      const name = sanitizeInput(body.name);
      if (!name || name.length < 2) {
        return NextResponse.json({ success: false, error: "Item name is required (at least 2 characters)." }, { status: 400 });
      }
      if (name.length > 100) {
        return NextResponse.json({ success: false, error: "Item name cannot exceed 100 characters." }, { status: 400 });
      }

      const basePrice = Number(body.basePrice);
      if (isNaN(basePrice) || basePrice <= 0) {
        return NextResponse.json({ success: false, error: "Item price must be a positive number greater than 0." }, { status: 400 });
      }

      const result = createMenuItem(restaurant.id, {
        categoryId: body.categoryId,
        name,
        nameHi: sanitizeInput(body.nameHi),
        nameTe: sanitizeInput(body.nameTe),
        nameUr: sanitizeInput(body.nameUr),
        description: sanitizeInput(body.description || ""),
        descriptionHi: sanitizeInput(body.descriptionHi),
        descriptionTe: sanitizeInput(body.descriptionTe),
        descriptionUr: sanitizeInput(body.descriptionUr),
        basePrice,
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
    const auth = await requireTenantAuth(req, params.slug);
    if (!auth.authorized) {
      return auth.response;
    }

    if (
      auth.user.role !== "restaurant_admin" &&
      auth.user.role !== "super_admin" &&
      (auth.user.role as string) !== "manager"
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Staff accounts cannot modify menu items." },
        { status: 403 }
      );
    }

    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();
    if (body.type === "category") {
      const updated = updateCategory(restaurant.id, body.id, body.updates);
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Validate updates
      const sanitizedUpdates = { ...body.updates };
      if (sanitizedUpdates.name !== undefined) {
        sanitizedUpdates.name = sanitizeInput(sanitizedUpdates.name);
        if (!sanitizedUpdates.name || sanitizedUpdates.name.length < 2) {
          return NextResponse.json({ success: false, error: "Item name cannot be empty." }, { status: 400 });
        }
      }
      if (sanitizedUpdates.basePrice !== undefined) {
        const p = Number(sanitizedUpdates.basePrice);
        if (isNaN(p) || p <= 0) {
          return NextResponse.json({ success: false, error: "Price must be greater than 0." }, { status: 400 });
        }
        sanitizedUpdates.basePrice = p;
      }
      if (sanitizedUpdates.description !== undefined) {
        sanitizedUpdates.description = sanitizeInput(sanitizedUpdates.description);
      }

      const updated = updateMenuItem(restaurant.id, body.id, sanitizedUpdates);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Item not found or already deleted." }, { status: 404 });
      }
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
    const auth = await requireTenantAuth(req, params.slug);
    if (!auth.authorized) {
      return auth.response;
    }

    if (
      auth.user.role !== "restaurant_admin" &&
      auth.user.role !== "super_admin" &&
      (auth.user.role as string) !== "manager"
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Staff accounts cannot delete menu items." },
        { status: 403 }
      );
    }

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
      if (!ok) {
        return NextResponse.json({ success: false, error: "Item not found or already deleted" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Item archived successfully" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
