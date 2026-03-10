import Link from "next/link";
import { LandingCta } from "@/components/landing/LandingCta";
import { InviteCampusForm } from "@/components/landing/InviteCampusForm";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero – clean, 100xdevs-style: typography-first, no neon */}
      <section className="relative bg-white px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 sm:text-base">
            PGs, tiffin & ride-sharing for students
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Find your nest
            <br />
            <span className="text-zinc-700">near campus</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-600 sm:text-xl">
            One place for PGs, tiffin centers, and ride-sharing. College email only — simple and safe.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/pg"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]"
            >
              <span aria-hidden className="text-lg">🏠</span>
              Find a PG
            </Link>
            <Link
              href="/tiffin"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-900 bg-transparent px-6 py-3.5 text-base font-semibold text-zinc-900 transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98]"
            >
              <span aria-hidden className="text-lg">🍱</span>
              Tiffin centers
            </Link>
            <Link
              href="/rides"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-900 bg-transparent px-6 py-3.5 text-base font-semibold text-zinc-900 transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98]"
            >
              <span aria-hidden className="text-lg">🚗</span>
              Find a ride
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            Log in with your college email to browse and book.
          </p>
        </div>
      </section>

      {/* Two paths – cards */}
      <section className="bg-zinc-50/50 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            What do you need?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Link
              href="/pg"
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md"
            >
              <span className="text-4xl" aria-hidden>🏠</span>
              <h3 className="mt-5 text-xl font-bold text-zinc-900">PGs near campus</h3>
              <p className="mt-3 text-zinc-600">
                Browse paying guest stays. Filter by rent, distance & ratings.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-zinc-900 group-hover:underline">
                Browse PGs
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/tiffin"
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md"
            >
              <span className="text-4xl" aria-hidden>🍱</span>
              <h3 className="mt-5 text-xl font-bold text-zinc-900">Tiffin centers</h3>
              <p className="mt-3 text-zinc-600">
                Monthly tiffin near campus. Filter by price, distance & ratings.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-zinc-900 group-hover:underline">
                Browse tiffin
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/rides"
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md"
            >
              <span className="text-4xl" aria-hidden>🚗</span>
              <h3 className="mt-5 text-xl font-bold text-zinc-900">Ride sharing</h3>
              <p className="mt-3 text-zinc-600">
                Find or offer rides. Book a seat with students from your college.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-zinc-900 group-hover:underline">
                Find rides
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-200 bg-zinc-50/80 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-center text-zinc-600">
            Three steps: sign up, browse, then book or contact. No hassle.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">Sign up with college email</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Create a free account using your college email. Quick and verified.
              </p>
              <Link href="/signup" className="mt-3 inline-block text-sm font-medium text-zinc-900 hover:underline">
                Create account →
              </Link>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">Browse & search</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Find PGs, tiffin centers, or rides. Use filters and search by location or keyword.
              </p>
              <Link href="/pg" className="mt-3 inline-block text-sm font-medium text-zinc-900 hover:underline">
                Browse PGs →
              </Link>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mt-4 font-semibold text-zinc-900">Book or contact</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Book a seat on a ride, or contact listing owners for PGs and tiffin. All within your campus.
              </p>
              <Link href="/rides" className="mt-3 inline-block text-sm font-medium text-zinc-900 hover:underline">
                Find rides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Invite your campus */}
      <section className="border-t border-zinc-200 bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
            Invite your campus
          </h2>
          <p className="mt-3 text-zinc-600">
            Is your college not listed? Tell us — we&apos;ll get in touch when we add it.
          </p>
          <div className="mt-10">
            <InviteCampusForm />
          </div>
        </div>
      </section>

      {/* Trust + CTA – session-aware */}
      <section className="border-t border-zinc-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-zinc-600">
            <span className="font-medium text-zinc-800">College email only</span>
            {" "}· Verified students · Simple and safe
          </p>
          <div className="mt-10">
            <LandingCta />
          </div>
        </div>
      </section>
    </div>
  );
}
