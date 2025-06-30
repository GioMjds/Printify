/*
  Warnings:

  - The values [printing] on the enum `UploadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UploadStatus_new" AS ENUM ('pending', 'cancelled', 'rejected', 'ready_to_pickup', 'completed');
ALTER TABLE "Upload" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Upload" ALTER COLUMN "status" TYPE "UploadStatus_new" USING ("status"::text::"UploadStatus_new");
ALTER TYPE "UploadStatus" RENAME TO "UploadStatus_old";
ALTER TYPE "UploadStatus_new" RENAME TO "UploadStatus";
DROP TYPE "UploadStatus_old";
ALTER TABLE "Upload" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
