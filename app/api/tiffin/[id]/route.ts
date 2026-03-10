import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isAdminEmail } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Please log in to view this tiffin center" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const center = await prisma.tiffinCenter.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        rent: true,
        location: true,
        distance: true,
        description: true,
        images: true,
        tiffinReviews: { select: { rating: true } },
      },
    });

    if (!center) {
      return NextResponse.json({ message: "Tiffin center not found" }, { status: 404 });
    }

    const ratings = center.tiffinReviews.map((r) => r.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;

    return NextResponse.json({
      id: center.id,
      title: center.title,
      rent: center.rent,
      location: center.location,
      distance: center.distance,
      description: center.description,
      images: center.images ?? [],
      rating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.error("Error fetching tiffin center:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Please log in" }, { status: 401 });
  }
  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    await prisma.tiffinReview.deleteMany({ where: { tiffinCenterId: id } });
    await prisma.tiffinCenter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tiffin center:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
