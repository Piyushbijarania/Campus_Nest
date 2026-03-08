-- Run this in Neon SQL Editor to add Tiffin Centers (same structure as PG listings).

-- TiffinCenter table
CREATE TABLE IF NOT EXISTS "TiffinCenter" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "rent" INTEGER NOT NULL,
  "location" TEXT NOT NULL,
  "distance" DOUBLE PRECISION NOT NULL,
  "description" TEXT NOT NULL,
  "images" TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT,
  CONSTRAINT "TiffinCenter_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TiffinCenter" ADD CONSTRAINT "TiffinCenter_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- TiffinReview table
CREATE TABLE IF NOT EXISTS "TiffinReview" (
  "id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "reported" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  "tiffinCenterId" TEXT NOT NULL,
  CONSTRAINT "TiffinReview_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TiffinReview" ADD CONSTRAINT "TiffinReview_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TiffinReview" ADD CONSTRAINT "TiffinReview_tiffinCenterId_fkey"
  FOREIGN KEY ("tiffinCenterId") REFERENCES "TiffinCenter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "TiffinReview_tiffinCenterId_idx" ON "TiffinReview"("tiffinCenterId");
