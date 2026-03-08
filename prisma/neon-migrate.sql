-- Run this in Neon SQL Editor (or psql) to add support for:
-- 1. Multiple PG images (images array)
-- 2. Ride contact information (contactInfo)

-- Step 1: Add contactInfo to Ride (safe, no data loss)
ALTER TABLE "Ride" ADD COLUMN IF NOT EXISTS "contactInfo" TEXT;

-- Step 2: Add images array to PGListing
ALTER TABLE "PGListing" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT '{}';

-- Step 3: If old "image" column exists, copy it into images then drop it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'PGListing' AND column_name = 'image') THEN
    UPDATE "PGListing" SET "images" = ARRAY["image"] WHERE "image" IS NOT NULL AND "image" != '';
    ALTER TABLE "PGListing" DROP COLUMN "image";
  END IF;
END $$;
