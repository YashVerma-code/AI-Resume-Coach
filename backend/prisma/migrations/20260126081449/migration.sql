-- CreateEnum
CREATE TYPE "ResumeRole" AS ENUM ('SOFTWARE_ENGINEER', 'PRODUCT_MANAGER', 'DATA_SCIENTIST', 'UI_UX_DESIGNER', 'DEVOPS_ENGINEER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULL_STACK_DEVELOPER', 'MARKETING_MANAGER', 'SALES_EXECUTIVE', 'BUSINESS_ANALYST', 'PROJECT_MANAGER', 'OTHER');

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "role" "ResumeRole" NOT NULL DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
