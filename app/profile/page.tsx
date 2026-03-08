"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; email: string; name: string | null; college: string | null };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data);
        setNameValue(data.name || "");
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const saveName = async () => {
    if (!user) return;
    setSaveLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue.trim() || null }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser((u) => (u ? { ...u, name: data.name } : null));
        setEditingName(false);
        setMessage({ type: "success", text: "Name updated." });
      } else {
        setMessage({ type: "error", text: data.error || "Could not update." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50/50">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50/50">
        <div className="mx-auto max-w-xl px-4 py-12">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">You are not signed in.</p>
            <Link href="/login" className="mt-4 inline-block font-medium text-teal-600 hover:text-teal-700">
              Log in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayName = user.name || "No name set";
  const initial = (user.name || user.email)[0].toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600"
        >
          ← Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-teal-500/10 to-slate-100 px-8 pt-8 pb-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-bold text-white shadow-md">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                {editingName ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      placeholder="Your name"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-lg font-semibold text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveName}
                      disabled={saveLoading}
                      className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
                    >
                      {saveLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingName(false); setNameValue(user.name || ""); }}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
                    <button
                      type="button"
                      onClick={() => setEditingName(true)}
                      className="mt-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors duration-200"
                    >
                      Edit name
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-8 py-6 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-slate-900">{user.email}</p>
            </div>
            {user.college && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">College</p>
                <p className="mt-1 text-slate-900">{user.college}</p>
              </div>
            )}
            {message && (
              <div
                className={`rounded-xl p-3 text-sm font-medium ${
                  message.type === "success" ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-8 py-4 bg-slate-50/50">
            <Link
              href="/api/auth/logout"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Log out
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
