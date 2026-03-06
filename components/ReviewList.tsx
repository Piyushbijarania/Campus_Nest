'use client';

import { useState } from 'react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name?: string;
    email: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  pgId: string;
}

export default function ReviewList({ reviews: initialReviews, pgId }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleReport = async (reviewId: string) => {
    if (!confirm('Report this review?')) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Remove the reported review from the list
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
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-zinc-600">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user.name || 'Anonymous'}</span>
                    <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                    <span className="text-zinc-500">({review.rating}/5)</span>
                  </div>
                  <p className="text-zinc-700 mt-1">{review.comment}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
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