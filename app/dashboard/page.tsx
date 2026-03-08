import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your listings and rides.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Link
            href="/dashboard/add-pg"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-teal-200 active:scale-[0.99]"
          >
            <span className="absolute right-4 top-4 text-slate-200 transition group-hover:translate-x-0.5 group-hover:text-teal-400" aria-hidden>
              →
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl text-teal-600" aria-hidden>🏠</span>
            <span className="mt-5 text-xl font-semibold text-slate-900 group-hover:text-teal-700">Add PG</span>
            <span className="mt-2 text-sm text-slate-600">List a paying guest accommodation near campus.</span>
          </Link>
          <Link
            href="/dashboard/add-tiffin"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-amber-200 active:scale-[0.99]"
          >
            <span className="absolute right-4 top-4 text-slate-200 transition group-hover:translate-x-0.5 group-hover:text-amber-400" aria-hidden>
              →
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl text-amber-600" aria-hidden>🍱</span>
            <span className="mt-5 text-xl font-semibold text-slate-900 group-hover:text-amber-700">Add Tiffin</span>
            <span className="mt-2 text-sm text-slate-600">List a tiffin center with monthly meals.</span>
          </Link>
          <Link
            href="/dashboard/add-ride"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-200 active:scale-[0.99]"
          >
            <span className="absolute right-4 top-4 text-slate-200 transition group-hover:translate-x-0.5 group-hover:text-slate-400" aria-hidden>
              →
            </span>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-600" aria-hidden>🚗</span>
            <span className="mt-5 text-xl font-semibold text-slate-900 group-hover:text-slate-700">Add Ride</span>
            <span className="mt-2 text-sm text-slate-600">Offer a ride and share the journey with other students.</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
