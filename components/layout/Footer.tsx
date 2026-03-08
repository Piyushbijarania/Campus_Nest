"use client";

import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/pg", label: "PGs" },
  { href: "/tiffin", label: "Tiffin" },
  { href: "/rides", label: "Rides" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Top row: logo + nav links + auth – same layout as 100xdevs */}
        <div className="flex flex-col items-center gap-6 border-b border-zinc-700/80 pb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-white transition-colors hover:text-zinc-200"
          >
            Campus Nest
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-500 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-zinc-400 hover:bg-zinc-800"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98]"
            >
              Sign up
            </Link>
          </div>
        </div>
        {/* Bottom: tagline + copyright – 100xdevs style */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-zinc-400">
            College-only marketplace for PGs, tiffin & rides.
          </p>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Campus Nest
          </p>
        </div>
      </div>
    </footer>
  );
}
