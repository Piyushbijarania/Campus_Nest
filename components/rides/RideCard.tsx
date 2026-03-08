"use client";

export default function RideCard({
  ride,
  refresh,
}: {
  ride: { id: string; source: string; destination: string; date: string; seats: number; contactInfo?: string | null };
  refresh: () => void;
}) {
  const bookRide = async () => {
    await fetch("/api/rides/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rideId: ride.id }),
    });
    refresh();
  };

  const date = new Date(ride.date);
  const dateStr = date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const isFull = ride.seats === 0;
  const contact = ride.contactInfo?.trim();
  const isEmail = contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = contact && /^[\d\s+()-]{10,}$/.test(contact.replace(/\s/g, ""));

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
        isFull ? "border-slate-100 hover:border-slate-200" : "border-l-4 border-l-teal-500 border-slate-100 hover:border-slate-200"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-slate-900">
            {ride.source}
            <span className="mx-2 text-slate-300">→</span>
            {ride.destination}
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {dateStr}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                isFull ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-700"
              }`}
            >
              {isFull ? "Full" : `${ride.seats} seat${ride.seats !== 1 ? "s" : ""} left`}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            disabled={isFull}
            onClick={bookRide}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFull ? "Full" : "Book seat"}
          </button>
        </div>
      </div>
      {contact && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Contact ride creator</p>
          {isEmail ? (
            <a href={`mailto:${contact}`} className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
              ✉️ {contact}
            </a>
          ) : isPhone ? (
            <a href={`tel:${contact.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
              📞 {contact}
            </a>
          ) : (
            <span className="text-sm text-slate-700">{contact}</span>
          )}
        </div>
      )}
    </div>
  );
}
