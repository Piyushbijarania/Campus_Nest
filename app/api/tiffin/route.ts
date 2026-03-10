import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Please log in to view tiffin centers" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const minRent = searchParams.get("minRent") ? parseInt(searchParams.get("minRent")!, 10) : undefined;
    const maxRent = searchParams.get("maxRent") ? parseInt(searchParams.get("maxRent")!, 10) : undefined;
    const maxDistance = searchParams.get("maxDistance") ? parseFloat(searchParams.get("maxDistance")!) : undefined;
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
    const search = searchParams.get("search")?.trim() || undefined;

    const list = await prisma.tiffinCenter.findMany({
      select: {
        id: true,
        title: true,
        rent: true,
        distance: true,
        images: true,
        tiffinReviews: { select: { rating: true } },
      },
      where: {
        ...(minRent != null && { rent: { gte: minRent } }),
        ...(maxRent != null && { rent: { lte: maxRent } }),
        ...(maxDistance != null && { distance: { lte: maxDistance } }),
        ...(search && search.length > 0 && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    const result = list.map((item) => {
      const ratings = item.tiffinReviews.map((r) => r.rating);
      const averageRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r, 0) / ratings.length : 0;
      const rating = Math.round(averageRating * 10) / 10;
      if (minRating != null && rating < minRating) return null;
      return {
        id: item.id,
        title: item.title,
        rent: item.rent,
        rating,
        distance: item.distance,
        image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "",
      };
    }).filter(Boolean);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching tiffin centers:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ message: "Please log in to add a tiffin center" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, rent, location, distance, description, images } = body;
    const imageList = Array.isArray(images) ? images.filter((u): u is string => typeof u === "string") : [];
    if (!title || rent == null || !location || distance == null || !description || imageList.length === 0) {
      return NextResponse.json({ success: false, message: "Missing required fields (include at least one image)" }, { status: 400 });
    }
    const center = await prisma.tiffinCenter.create({
      data: {
        title,
        rent: Number(rent),
        location,
        distance: Number(distance),
        description,
        images: imageList,
        userId: user.id,
      },
    });
    return NextResponse.json({ success: true, data: { id: center.id, title: center.title } });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
