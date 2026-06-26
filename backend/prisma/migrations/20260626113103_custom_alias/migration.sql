/*
  Warnings:

  - A unique constraint covering the columns `[customAlias]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "customAlias" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Url_customAlias_key" ON "Url"("customAlias");
