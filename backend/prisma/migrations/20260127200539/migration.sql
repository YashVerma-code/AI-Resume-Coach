/*
  Warnings:

  - A unique constraint covering the columns `[resumeId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_resumeId_key" ON "Chat"("resumeId");
