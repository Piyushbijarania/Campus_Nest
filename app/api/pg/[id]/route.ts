import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        image: true,
        reviews: {
          select: {
            rating: true
          }
        }
      }
    });

    if (!listing) {
      return NextResponse.json({ message: 'PG listing not found' }, { status: 404 });
    }

    // Calculate average rating
    const ratings = listing.reviews.map(review => review.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

    return NextResponse.json({
      id: listing.id,
      title: listing.title,
      rent: listing.rent,
      location: listing.location,
      distance: listing.distance,
      description: listing.description,
      image: listing.image,
      rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Error fetching PG listing:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
