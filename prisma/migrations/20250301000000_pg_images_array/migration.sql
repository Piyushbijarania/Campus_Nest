-- AlterTable: replace PGListing.image (String) with images (String[])
-- Preserve existing image by copying into images array, then drop image.

ALTER TABLE "PGListing" ADD COLUMN IF NOT EXISTS "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "PGListing" SET "images" = ARRAY["image"] WHERE "image" IS NOT NULL AND "image" != '';

ALTER TABLE "PGListing" DROP COLUMN IF EXISTS "image";

-- Ensure new rows have at least one image (app-level validation). No NOT NULL on array.
