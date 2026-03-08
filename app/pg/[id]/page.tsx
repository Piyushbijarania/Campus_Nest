import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ReviewList from "@/components/ReviewList";
import AddReview from "@/components/AddReview";
import { ImageCarousel } from "@/components/ImageCarousel";

export default async function SinglePGPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.pGListing.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { reported: false },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  if (!listing) {
    return (
      <main className="min-h-screen bg-slate-50/50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">PG not found</h1>
          <Link href="/pg" className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-medium">
            ← Back to listings
          </Link>
        </div>
      </main>
    );
  }

  const rating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/pg"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600"
        >
          ← Back to PGs
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <ImageCarousel
            images={Array.isArray(listing.images) ? listing.images : []}
            alt={listing.title}
          />
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {listing.title}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
                ★ {rating.toFixed(1)}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-slate-600">
              <span className="font-semibold text-slate-900">₹{listing.rent.toLocaleString()}</span>
              <span>·</span>
              <span>{listing.location}</span>
              <span>·</span>
              <span>{listing.distance} km from campus</span>
            </div>
            <p className="mt-6 text-slate-700 leading-relaxed">{listing.description}</p>
            <AddReview listingId={id} />
            <ReviewList reviews={listing.reviews} pgId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
