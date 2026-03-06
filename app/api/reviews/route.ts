import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, rating, comment } = body;

    // Validate required fields
    if (!listingId || typeof rating !== 'number' || !comment) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if listing exists
    const listing = await prisma.pGListing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    // Create review
    await prisma.review.create({
      data: {
        userId: user.id,
        listingId,
        rating,
        comment
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
