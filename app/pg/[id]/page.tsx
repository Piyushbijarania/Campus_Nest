import { prisma } from '@/lib/prisma';
import ReviewList from '@/components/ReviewList';

export default async function SinglePGPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch PG listing with reviews
  const listing = await prisma.pGListing.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        },
        where: {
          reported: false // Only show non-reported reviews
        }
      }
    }
  });

  if (!listing) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">PG Not Found</h1>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{listing.title}</h1>
      <p className="text-zinc-600 mt-2">Location: {listing.location}</p>
      <p className="text-zinc-600">Rent: ₹{listing.rent}</p>
      <p className="text-zinc-600">Distance: {listing.distance} km</p>
      <p className="text-zinc-600 mt-4">{listing.description}</p>

      <ReviewList reviews={listing.reviews} pgId={id} />
    </main>
  );
}
