"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/pg", label: "PGs" },
  { href: "/tiffin", label: "Tiffin" },
  { href: "/rides", label: "Rides" },
  { href: "/dashboard", label: "Dashboard" },
];

type User = { id: string; email: string; name: string | null; college: string | null } | null;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const isLanding = pathname === "/";

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const linkClass = isLanding
    ? "rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.98]"
    : "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]";

  const logoClass = isLanding
    ? "text-xl font-bold text-white transition hover:text-white/90"
    : "text-xl font-bold text-slate-900 transition hover:text-teal-600";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isLanding
          ? "border-b border-white/10 bg-zinc-900 py-4"
          : "border-b border-slate-100 bg-white/95 py-3 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className={`shrink-0 ${logoClass}`}>
          Campus Nest
        </Link>

        {/* Desktop: main nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop: auth or user */}
        <div className="hidden items-center gap-2 md:flex">
          {authChecked &&
            (user ? (
              <>
                <Link
                  href="/profile"
                  className={isLanding ? "text-white/90 hover:text-white text-sm font-medium" : "text-slate-600 hover:text-slate-900 text-sm font-medium"}
                >
                  {user.name || user.email}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={
                    isLanding
                      ? "rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                      : "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 active:scale-[0.98]"
                  }
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={linkClass}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={
                    isLanding
                      ? "rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-white/90 hover:shadow-md active:scale-[0.98]"
                      : "rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
                  }
                >
                  Sign up
                </Link>
              </>
            ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`rounded-full p-2.5 md:hidden transition-all duration-200 active:scale-95 ${isLanding ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`px-4 py-4 md:hidden ${isLanding ? "border-t border-white/10 bg-slate-900/95 backdrop-blur-xl" : "border-t border-slate-200 bg-white"}`}>
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${isLanding ? "text-white/90 hover:bg-white/10" : "text-slate-700 hover:bg-slate-50"} active:scale-[0.99]`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className={`my-2 pt-2 ${isLanding ? "border-t border-white/10" : "border-t border-slate-100"}`}>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${isLanding ? "text-white/90 hover:bg-white/10" : "text-slate-700 hover:bg-slate-50"} active:scale-[0.99]`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                    }}
                    className={`w-full rounded-xl px-4 py-3 text-left text-base font-medium transition-all duration-200 ${isLanding ? "text-white/90 hover:bg-white/10" : "text-slate-700 hover:bg-slate-50"} active:scale-[0.99]`}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${isLanding ? "text-white/90 hover:bg-white/10" : "text-slate-700 hover:bg-slate-50"} active:scale-[0.99]`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className={`mt-1 block rounded-xl px-4 py-3 text-center text-base font-semibold transition-all duration-200 active:scale-[0.98] ${isLanding ? "bg-white text-slate-900 hover:bg-white/90 hover:shadow-md" : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
