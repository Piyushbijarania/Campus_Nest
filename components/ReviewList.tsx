'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name?: string | null;
    email: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  pgId: string;
}

export default function ReviewList({ reviews: initialReviews, pgId }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);

  // Sync with server after new review is added (router.refresh() passes new props)
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const handleReport = async (reviewId: string) => {
    if (!confirm('Report this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
        alert('Review reported successfully');
      } else {
        alert('Failed to report review');
      }
    } catch (error) {
      alert('Error reporting review');
    }
  };

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">All comments from users</h2>
      {reviews.length === 0 ? (
        <p className="text-slate-600">No reviews yet. Be the first to write one above.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{review.user.name || 'Anonymous'}</span>
                    <span className="text-amber-500" aria-hidden>{'★'.repeat(review.rating)}</span>
                    <span className="text-slate-500 text-sm">({review.rating}/5)</span>
                  </div>
                  <p className="text-slate-700 mt-3 leading-relaxed">{review.comment}</p>
                </div>
                <button
                  className="shrink-0 text-sm text-slate-500 transition-colors duration-200 hover:text-red-600 active:opacity-80"
                  onClick={() => handleReport(review.id)}
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}