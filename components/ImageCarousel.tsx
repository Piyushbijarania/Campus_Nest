"use client";

import { useState, useCallback } from "react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  const hasMultiple = n > 1;

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? n - 1 : i - 1));
  }, [n]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= n - 1 ? 0 : i + 1));
  }, [n]);

  if (!n) {
    return (
      <div className={`aspect-[16/10] w-full bg-slate-200 flex items-center justify-center ${className}`}>
        <span className="text-slate-500">No images</span>
      </div>
    );
  }

  return (
    <div className={`relative aspect-[16/10] w-full overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={images[index]}
        alt={`${alt} — image ${index + 1} of ${n}`}
        className="h-full w-full object-cover"
      />
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-800 shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Previous image"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-800 shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Next image"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition ${i === index ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
