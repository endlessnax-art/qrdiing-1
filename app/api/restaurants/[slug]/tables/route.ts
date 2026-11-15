import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantBySlug,
  getTables,
  addTable,
  deleteTable,
  regenerateTableQRToken,
  updateTableStatus,
  toggleTableActive,
} from "@/lib/db/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const tables = getTables(restaurant.id);
    return NextResponse.json({ success: true, data: tables });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = getRestaurantBySlug(params.slug);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const baseUrl = req.nextUrl.origin || "http://localhost:3000";
    const body = await req.json();

    if (body.action === "regenerate_qr") {
      if (!body.tableNumber) {
        return NextResponse.json({ success: false, error: "Missing tableNumber" }, { status: 400 });
      }
      const updatedTable = regenerateTableQRToken(restaurant.id, body.tableNumber, baseUrl);
      if (!updatedTable) {
        return NextResponse.json({ success: false, error: "Table not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: updatedTable,
        qrToken: updatedTable.qrToken,
        destinationUrl: updatedTable.destinationUrl,
      });
    }

    if (body.action === "toggle_active") {
      if (!body.tableNumber) {
        return NextResponse.json({ success: false, error: "Missing tableNumber" }, { status: 400 });
      }
      const updatedTable = toggleTableActive(restaurant.id, body.tableNumber, body.isActive);
      return NextResponse.json({ success: true, data: updatedTable });
    }

    if (body.action === "update_status") {
      const ok = updateTableStatus(restaurant.id, body.tableNumber, body.status);
      return NextResponse.json({ success: ok });
    }

    if (!body.tableNumber || !body.tableNumber.trim()) {
      return NextResponse.json({ success: false, error: "Table number is required" }, { status: 400 });
    }

    try {
      const table = addTable(
        restaurant.id,
        body.tableNumber,
        body.tableName,
        Number(body.capacity || 4),
        body.location,
        baseUrl
      );
      return NextResponse.json({ success: true, data: table }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err?.message || "Failed to create table" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to process table action" }, { status: 500 });
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
    const tableNumber = searchParams.get("tableNumber");

    if (!tableNumber) {
      return NextResponse.json({ success: false, error: "Missing tableNumber" }, { status: 400 });
    }

    const ok = deleteTable(restaurant.id, tableNumber);
    return NextResponse.json({ success: ok });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete table" }, { status: 500 });
  }
}
