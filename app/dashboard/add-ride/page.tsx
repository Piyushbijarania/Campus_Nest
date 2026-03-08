"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddRidePage() {
  const [form, setForm] = useState({
    source: "",
    destination: "",
    date: "",
    seats: 1,
    contactInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "seats" ? Number(value) || 0 : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: form.source.trim(),
          destination: form.destination.trim(),
          date: form.date,
          seats: form.seats,
          contactInfo: form.contactInfo.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({ source: "", destination: "", date: "", seats: 1, contactInfo: "" });
      } else {
        setError(data.message || "Could not create ride. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600"
        >
          ← Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900">Offer a ride</h1>
          <p className="mt-2 text-slate-600">
            Share your journey with other students. Your ride will be visible to everyone from your college.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="source" className={labelClass}>
                From (source)
              </label>
              <input
                id="source"
                type="text"
                name="source"
                placeholder="e.g. Campus gate, Ranchi"
                value={form.source}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="destination" className={labelClass}>
                To (destination)
              </label>
              <input
                id="destination"
                type="text"
                name="destination"
                placeholder="e.g. Airport, Patna"
                value={form.destination}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="contactInfo" className={labelClass}>
                Contact information
              </label>
              <input
                id="contactInfo"
                type="text"
                name="contactInfo"
                placeholder="e.g. 9876543210 or email@example.com — so riders can reach you"
                value={form.contactInfo}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Phone or email. Shown to logged-in users who view this ride.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className={labelClass}>
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="seats" className={labelClass}>
                  Seats available
                </label>
                <input
                  id="seats"
                  type="number"
                  name="seats"
                  min={1}
                  max={10}
                  value={form.seats}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {success && (
              <div className="rounded-xl bg-teal-50 p-4 text-sm font-medium text-teal-800">
                Ride created! It’s now visible on the Rides page.
              </div>
            )}
            {success && (
              <div className="flex gap-3">
                <Link
                  href="/rides"
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
                >
                  View rides
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
                >
                  Add another
                </button>
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create ride"}
              </button>
              <Link
                href="/rides"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
              >
                View all rides
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
