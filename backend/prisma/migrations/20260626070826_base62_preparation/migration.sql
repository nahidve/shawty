-- DropIndex
DROP INDEX "Url_originalUrl_key";

-- AlterTable
ALTER TABLE "Url" ALTER COLUMN "shortCode" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Url_originalUrl_idx" ON "Url"("originalUrl");
