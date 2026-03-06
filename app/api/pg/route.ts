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
}

export async function POST() {
  return Response.json({ success: false, message: "Implement in Member 3 PR" }, { status: 501 });
}
