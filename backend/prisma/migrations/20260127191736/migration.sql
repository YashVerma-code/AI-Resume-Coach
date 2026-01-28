-- CreateEnum
CREATE TYPE "ReumeStatus" AS ENUM ('UPLOADED', 'PROCESSING');

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "status" "ReumeStatus" NOT NULL DEFAULT 'UPLOADED';
