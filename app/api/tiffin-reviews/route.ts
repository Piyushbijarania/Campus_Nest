import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tiffinCenterId, rating, comment } = body;

    if (!tiffinCenterId || typeof rating !== "number" || !comment) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const center = await prisma.tiffinCenter.findUnique({
      where: { id: tiffinCenterId },
    });
    if (!center) {
      return NextResponse.json({ success: false, message: "Tiffin center not found" }, { status: 404 });
    }

    await prisma.tiffinReview.create({
      data: {
        userId: user.id,
        tiffinCenterId,
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating tiffin review:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
