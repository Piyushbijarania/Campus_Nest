"use client";

import { useState } from "react";

export function InviteCampusForm() {
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/campus-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          college: college || undefined,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
        return;
      }
      setStatus("success");
      setEmail("");
      setCollege("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <span className="text-4xl" aria-hidden>✅</span>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Thanks for reaching out!</h3>
        <p className="mt-2 text-sm text-zinc-600">
          We&apos;ll get in touch when we add your college to Campus Nest.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="invite-email" className="mb-1.5 block text-left text-sm font-medium text-zinc-700">
          Your email
        </label>
        <input
          id="invite-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        />
      </div>
      <div>
        <label htmlFor="invite-college" className="mb-1.5 block text-left text-sm font-medium text-zinc-700">
          College name or domain <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="invite-college"
          type="text"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          placeholder="e.g. My College or mycollege.edu"
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        />
      </div>
      <div>
        <label htmlFor="invite-message" className="mb-1.5 block text-left text-sm font-medium text-zinc-700">
          Message <span className="text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="invite-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit about your campus..."
          rows={2}
          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98] disabled:opacity-70"
      >
        {status === "loading" ? "Sending…" : "Tell us"}
      </button>
    </form>
  );
}
