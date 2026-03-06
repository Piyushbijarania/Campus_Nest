import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minRent = searchParams.get('minRent') ? parseInt(searchParams.get('minRent')!) : undefined;
    const maxRent = searchParams.get('maxRent') ? parseInt(searchParams.get('maxRent')!) : undefined;
    const maxDistance = searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : undefined;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;

    // Get PG listings with average rating
    const pgListings = await prisma.pGListing.findMany({
      select: {
        id: true,
        title: true,
        rent: true,
        distance: true,
        image: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      where: {
        ...(minRent && { rent: { gte: minRent } }),
        ...(maxRent && { rent: { lte: maxRent } }),
        ...(maxDistance && { distance: { lte: maxDistance } })
      }
    });

    // Calculate average rating for each listing
    const listingsWithRating = pgListings.map(listing => {
      const ratings = listing.reviews.map(review => review.rating);
      const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

      // Filter by minRating if provided
      if (minRating !== undefined && averageRating < minRating) {
        return null;
      }

      return {
        id: listing.id,
        title: listing.title,
        rent: listing.rent,
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        distance: listing.distance,
        image: listing.image
      };
    }).filter(Boolean);

    return NextResponse.json(listingsWithRating);
  } catch (error) {
    console.error('Error fetching PG listings:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
// Member 3: GET all, POST create – implement per API contract
import { prisma } from "@/lib/prisma";

// GET /api/pg - Get all PGs with optional filters
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // Filters: rentMin, rentMax, distanceMax, ratingMin
  const rentMin = searchParams.get("rentMin") ? Number(searchParams.get("rentMin")) : undefined;
  const rentMax = searchParams.get("rentMax") ? Number(searchParams.get("rentMax")) : undefined;
  const distanceMax = searchParams.get("distanceMax") ? Number(searchParams.get("distanceMax")) : undefined;
  const ratingMin = searchParams.get("ratingMin") ? Number(searchParams.get("ratingMin")) : undefined;

  // Build Prisma where clause
  const where = {
    ...(rentMin !== undefined && { rent: { gte: rentMin } }),
    ...(rentMax !== undefined && { rent: { lte: rentMax } }),
    ...(distanceMax !== undefined && { distance: { lte: distanceMax } }),
  };

  // Get PGs and their reviews
  const listings = await prisma.pGListing.findMany({
    where,
    include: { reviews: true },
    orderBy: { createdAt: "desc" },
  });

  // Map to API response shape with average rating
  let result = listings.map((pg) => {
    const avgRating =
      pg.reviews.length > 0
        ? pg.reviews.reduce((sum, r) => sum + r.rating, 0) / pg.reviews.length
        : 0;
    return {
      id: pg.id,
      title: pg.title,
      rent: pg.rent,
      rating: Number(avgRating.toFixed(2)),
      distance: pg.distance,
      image: pg.image,
    };
  });

  // Filter by ratingMin if provided
  if (ratingMin !== undefined) {
    result = result.filter((pg) => pg.rating >= ratingMin);
  }

  return Response.json(result);
}

// POST /api/pg - Create PG
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, rent, location, distance, description, image } = body;
    if (!title || !rent || !location || !distance || !description || !image) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const pg = await prisma.pGListing.create({
      data: { title, rent, location, distance, description, image },
    });
    return Response.json({ success: true, data: { id: pg.id, title: pg.title } });
  } catch (e) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
