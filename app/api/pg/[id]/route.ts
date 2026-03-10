import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isAdminEmail } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Please log in to view this PG" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const listing = await prisma.pGListing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        rent: true,
        location: true,
        distance: true,
        description: true,
        images: true,
        reviews: { select: { rating: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ message: "PG listing not found" }, { status: 404 });
    }

    const ratings = listing.reviews.map((r) => r.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;

    return NextResponse.json({
      id: listing.id,
      title: listing.title,
      rent: listing.rent,
      location: listing.location,
      distance: listing.distance,
      description: listing.description,
      images: listing.images ?? [],
      rating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.error("Error fetching PG listing:", error);
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
    await prisma.review.deleteMany({ where: { listingId: id } });
    await prisma.pGListing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting PG listing:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
