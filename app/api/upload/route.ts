import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth } from "@/lib/auth";
import { getRestaurantBySlug } from "@/lib/db/storage";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const file = formData.get("file") as File | null;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing restaurant slug" },
        { status: 400 }
      );
    }

    // Tenant authorization check
    const auth = await requireTenantAuth(req, slug);
    if (!auth.authorized) {
      return auth.response;
    }

    const restaurant = getRestaurantBySlug(slug);
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant not found" },
        { status: 404 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // MIME type validation
    const fileType = file.type.toLowerCase();
    const ext = ALLOWED_MIME_TYPES.get(fileType);
    if (!ext) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    // Read buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Basic magic bytes check for extra security
    // JPEG starts with FF D8 FF
    // PNG starts with 89 50 4E 47
    // WebP starts with RIFF....WEBP
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;
    const isWebp =
      buffer.length > 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { success: false, error: "Corrupted image file or invalid format." },
        { status: 400 }
      );
    }

    // Generate safe, unique filename
    const safeId = crypto.randomUUID().slice(0, 10);
    const filename = `${Date.now()}-${safeId}.${ext}`;

    // Target directory: public/uploads/menu/${restaurant.id}
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "menu",
      restaurant.id
    );

    await fs.mkdir(uploadDir, { recursive: true });
    const targetFilePath = path.join(uploadDir, filename);

    await fs.writeFile(targetFilePath, buffer);

    const relativeUrl = `/uploads/menu/${restaurant.id}/${filename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during photo upload" },
      { status: 500 }
    );
  }
}
