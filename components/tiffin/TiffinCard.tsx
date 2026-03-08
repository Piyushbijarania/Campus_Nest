import Link from "next/link";

export function TiffinCard({
  tiffin,
}: {
  tiffin: { id: string; title: string; rent: number; rating: number; distance: number; image: string };
}) {
  const rating = tiffin.rating ?? 0;

  return (
    <Link
      href={`/tiffin/${tiffin.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={tiffin.image}
          alt={tiffin.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur">
          <span className="text-amber-500">★</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="border-t border-slate-50 p-5 transition-colors group-hover:border-slate-100">
        <h2 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-teal-700">
          {tiffin.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">₹{tiffin.rent.toLocaleString()}/mo</span>
          <span className="text-slate-300">·</span>
          <span>{tiffin.distance} km from campus</span>
        </div>
      </div>
    </Link>
  );
}
