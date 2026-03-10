"use client";

import { useEffect, useState } from "react";
import { TiffinCard } from "@/components/tiffin/TiffinCard";
import { TiffinFilter } from "@/components/tiffin/TiffinFilter";

export default function TiffinListPage() {
  const [list, setList] = useState<Array<{
    id: string;
    title: string;
    rent: number;
    rating: number;
    distance: number;
    image: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    rentMin: "",
    rentMax: "",
    distanceMax: "",
    ratingMin: "",
  });

  const loadList = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    fetch(`/api/tiffin?${params.toString()}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, [filters]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setIsAdmin(data?.isAdmin ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/tiffin/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) setList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tiffin Centers</h1>
          <p className="mt-2 text-slate-600">Find monthly tiffin near campus that fits your budget.</p>
        </div>

        <TiffinFilter filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-24 text-center shadow-sm">
            <span className="text-5xl text-slate-300" aria-hidden>🍱</span>
            <p className="mt-4 text-slate-600">No tiffin centers found.</p>
            <p className="mt-1 text-sm text-slate-500">Try different filters or add your own.</p>
            <a
              href="/dashboard/add-tiffin"
              className="mt-8 inline-block rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98]"
            >
              Add tiffin center
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <TiffinCard key={t.id} tiffin={t} isAdmin={isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
