"use client";

import { useEffect, useState } from "react";
import RideCard from "@/components/rides/RideCard";

type Ride = {
  id: string;
  source: string;
  destination: string;
  date: string;
  seats: number;
  contactInfo?: string | null;
};

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const loadRides = async () => {
    setAuthError(false);
    const res = await fetch("/api/rides", { credentials: "include" });
    if (res.status === 401) {
      setAuthError(true);
      setRides([]);
      return;
    }
    const data = res.ok ? await res.json() : [];
    setRides(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    setLoading(true);
    loadRides().finally(() => setLoading(false));
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setIsAdmin(data?.isAdmin ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleDeleteRide = async (id: string) => {
    const res = await fetch(`/api/rides/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) loadRides();
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rides</h1>
          <p className="mt-2 text-slate-600">
            Upcoming rides from your college. Rides with seats available appear first.
          </p>
          <a
            href="/dashboard/add-ride"
            className="mt-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            + Offer a ride
          </a>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6">
                <div className="h-6 w-2/3 rounded bg-slate-200" />
                <div className="mt-4 flex gap-3">
                  <div className="h-8 w-24 rounded-full bg-slate-100" />
                  <div className="h-8 w-20 rounded-full bg-slate-100" />
                </div>
                <div className="mt-4 h-10 w-28 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : authError ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
            <span className="text-5xl text-slate-300" aria-hidden>🔐</span>
            <p className="mt-4 text-slate-600">Please log in to view rides from your college.</p>
            <a href="/login" className="mt-6 inline-block rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98]">
              Log in
            </a>
          </div>
        ) : rides.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-24 text-center shadow-sm">
            <span className="text-5xl text-slate-300" aria-hidden>🚗</span>
            <p className="mt-4 text-slate-600">No upcoming rides yet.</p>
            <p className="mt-1 text-sm text-slate-500">Be the first to offer a ride from your college.</p>
            <a
              href="/dashboard/add-ride"
              className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
            >
              Offer a ride
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} refresh={loadRides} isAdmin={isAdmin} onDelete={handleDeleteRide} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
