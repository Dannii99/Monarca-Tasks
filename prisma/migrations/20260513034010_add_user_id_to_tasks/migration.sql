-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'admin';

-- CreateTable
CREATE TABLE "DemoSeed" (
    "id" TEXT NOT NULL DEFAULT 'demo',
    "seededAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoSeed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_userId_status_idx" ON "Task"("userId", "status");
