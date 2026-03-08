import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 4 * 1024 * 1024; // 4MB (Vercel serverless body limit is ~4.5MB)

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
    const ext = path.extname(file.name) || ".jpg";
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (file.type && !allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid type. Use JPEG, PNG, WebP or GIF" }, { status: 400 });
    }

    const name = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

    // Production (Vercel): use Blob storage – free tier, persists
    const blobToken =
      process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.PYXIS_READ_WRITE_TOKEN ||
      process.env["pyxis_READ_WRITE_TOKEN"];

    if (process.env.VERCEL === "1") {
      // On Vercel, filesystem is read-only – Blob token is required
      if (!blobToken) {
        return NextResponse.json(
          {
            error: "Upload not configured",
            details:
              "Add BLOB_READ_WRITE_TOKEN (or your Blob store token) in Vercel → Project → Settings → Environment Variables, then create a Blob store in the Storage tab and redeploy.",
          },
          { status: 503 }
        );
      }
    }

    if (blobToken) {
      const contentType = file.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg");
      // Use Buffer in serverless – File/Blob from formData can be unreliable on Vercel
      const bytes = await file.arrayBuffer();
      const body = Buffer.from(bytes);
      const blob = await put(name, body, {
        access: "public",
        addRandomSuffix: true,
        contentType,
        token: blobToken,
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
    const err = e instanceof Error ? e : new Error(String(e));
    console.error("Upload error:", err.message, err);
    const details = err instanceof Error ? err.message : String(e);
    return NextResponse.json(
      { error: "Upload failed", details },
      { status: 500 }
    );
  }
}
