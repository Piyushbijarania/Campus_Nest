"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; email: string; name: string | null } | null;

export function LandingCta() {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="rounded-lg bg-zinc-900 px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]"
      >
        Go to Dashboard
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Link
        href="/signup"
        className="rounded-lg bg-zinc-900 px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]"
      >
        Get started
      </Link>
      <Link
        href="/login"
        className="rounded-lg border-2 border-zinc-900 bg-transparent px-8 py-3.5 text-base font-semibold text-zinc-900 transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98]"
      >
        Log in
      </Link>
    </div>
  );
}
