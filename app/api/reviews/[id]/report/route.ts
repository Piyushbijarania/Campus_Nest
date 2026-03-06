import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id: reviewId } = await params;

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    // Update review to mark as reported
    await prisma.review.update({
      where: { id: reviewId },
      data: { reported: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reporting review:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}