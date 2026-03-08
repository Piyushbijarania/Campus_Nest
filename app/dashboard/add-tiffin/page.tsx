"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddTiffinPage() {
  const [form, setForm] = useState({
    title: "",
    rent: "",
    location: "",
    distance: "",
    description: "",
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/tiffin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rent: Number(form.rent),
          distance: Number(form.distance),
          images: form.images,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Tiffin center added! You can add another or go back to dashboard.");
        setForm({
          title: "",
          rent: "",
          location: "",
          distance: "",
          description: "",
          images: [],
        });
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Add Tiffin Center</h1>
          <p className="mt-2 text-slate-600">
            List a tiffin center near campus. Same as PG: title, monthly price, location, photos.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="title" className={labelClass}>Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Sharma Tiffin, Home-style meals"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="rent" className={labelClass}>Monthly price (₹)</label>
                <input
                  id="rent"
                  type="number"
                  name="rent"
                  placeholder="2500"
                  min={1}
                  value={form.rent}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="distance" className={labelClass}>Distance from campus (km)</label>
                <input
                  id="distance"
                  type="number"
                  name="distance"
                  placeholder="2.5"
                  min={0}
                  step={0.1}
                  value={form.distance}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>Location / Address</label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Sector 5, near main gate"
                value={form.location}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Meal timings, menu, veg/non-veg, rules..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-y min-h-[100px]`}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Photos</label>
              <p className="mb-3 text-sm text-slate-600">Add multiple images. First image is the main one.</p>
              <div className="space-y-3">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-6 transition hover:border-teal-300 hover:bg-teal-50/30">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files?.length) return;
                      setError("");
                      setUploading(true);
                      const urls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (file.size > 5 * 1024 * 1024) {
                          setError(`"${file.name}" is over 5MB, skipped.`);
                          continue;
                        }
                        const fd = new FormData();
                        fd.set("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (data.url) urls.push(data.url);
                        else setError(data.details || data.error || "Upload failed");
                      }
                      if (urls.length) setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
                      setUploading(false);
                      e.target.value = "";
                    }}
                  />
                  <span className="text-4xl">📷</span>
                  <span className="mt-2 text-sm font-medium text-slate-600">
                    {uploading ? "Uploading..." : "Click to upload one or more images"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">JPEG, PNG, WebP or GIF · max 5MB each</span>
                </label>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((url, i) => (
                      <div key={url} className="relative">
                        <img src={url} alt="" className="h-24 w-24 rounded-lg border border-slate-200 object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }))}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                        {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">Main</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {success && (
              <div className="rounded-xl bg-teal-50 p-4 text-sm font-medium text-teal-800">{success}</div>
            )}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">{error}</div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || form.images.length === 0}
                className="rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Tiffin Center"}
              </button>
              <Link
                href="/tiffin"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
              >
                View all tiffin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
