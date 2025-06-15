/*
  Warnings:

  - Added the required column `format` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "format" TEXT NOT NULL;
