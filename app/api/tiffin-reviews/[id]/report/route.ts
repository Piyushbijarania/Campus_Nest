import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id: reviewId } = await params;

    const review = await prisma.tiffinReview.findUnique({
      where: { id: reviewId },
    });
    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    await prisma.tiffinReview.update({
      where: { id: reviewId },
      data: { reported: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reporting tiffin review:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
