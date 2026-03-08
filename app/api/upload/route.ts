import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel serverless body limit is ~4.5MB)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 4MB)" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Invalid type. Use JPEG, PNG, WebP or GIF" }, { status: 400 });
    }

    const ext = path.extname(file.name) || ".jpg";
    const name = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

    // Production (Vercel): use Blob storage – free tier, persists
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const bytes = await file.arrayBuffer();
      const blob = await put(name, bytes, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Local dev: save to public/uploads so images work without Blob
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, path.basename(name));
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
    const url = `/uploads/${path.basename(name)}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
