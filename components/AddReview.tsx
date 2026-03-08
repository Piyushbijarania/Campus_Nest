"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddReviewProps = {
  listingId: string;
};

export default function AddReview({ listingId }: AddReviewProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating (1–5).");
      return;
    }
    if (!comment.trim()) {
      setError("Please add a comment.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, rating, comment: comment.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setRating(0);
        setComment("");
        router.refresh();
      } else {
        setError(data.message || "Could not submit review.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98]"
        >
          Write a review
        </button>
      ) : (
        <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <h3 className="text-lg font-semibold text-slate-900">Your review</h3>
          <p className="mt-1 text-sm text-slate-600">Rating (1–5 stars)</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-2xl transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
              >
                <span className={star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <label htmlFor="review-comment" className="mt-4 block text-sm font-medium text-slate-700">
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            required
          />
          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-teal-700 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setRating(0);
                setComment("");
                setError("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
