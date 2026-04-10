-- AlterTable
ALTER TABLE "public"."Review" ALTER COLUMN "sentiment" DROP NOT NULL,
ALTER COLUMN "confidence" DROP NOT NULL;
