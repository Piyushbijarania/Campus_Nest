import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ImageCarousel } from "@/components/ImageCarousel";
import AddTiffinReview from "@/components/tiffin/AddTiffinReview";
import TiffinReviewList from "@/components/tiffin/TiffinReviewList";

export default async function SingleTiffinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const center = await prisma.tiffinCenter.findUnique({
    where: { id },
    include: {
      tiffinReviews: {
        where: { reported: false },
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!center) {
    return (
      <main className="min-h-screen bg-slate-50/50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Tiffin center not found</h1>
          <Link href="/tiffin" className="mt-4 inline-block font-medium text-teal-600 hover:text-teal-700">
            ← Back to tiffin centers
          </Link>
        </div>
      </main>
    );
  }

  const rating =
    center.tiffinReviews.length > 0
      ? center.tiffinReviews.reduce((s, r) => s + r.rating, 0) / center.tiffinReviews.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/tiffin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600"
        >
          ← Back to Tiffin Centers
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <ImageCarousel
            images={Array.isArray(center.images) ? center.images : []}
            alt={center.title}
          />
          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{center.title}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
                ★ {rating.toFixed(1)}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-slate-600">
              <span className="font-semibold text-slate-900">₹{center.rent.toLocaleString()}/month</span>
              <span>·</span>
              <span>{center.location}</span>
              <span>·</span>
              <span>{center.distance} km from campus</span>
            </div>
            <p className="mt-6 text-slate-700 leading-relaxed">{center.description}</p>
            <AddTiffinReview tiffinCenterId={id} />
            <TiffinReviewList reviews={center.tiffinReviews} />
          </div>
        </div>
      </div>
    </main>
  );
}
