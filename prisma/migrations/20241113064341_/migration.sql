/*
  Warnings:

  - You are about to drop the `V0` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "V0" DROP CONSTRAINT "V0_createdById_fkey";

-- DropTable
DROP TABLE "V0";

-- CreateTable
CREATE TABLE "RaffleV0" (
    "id" SERIAL NOT NULL,
    "give" TEXT[],
    "want" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "RaffleV0_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RaffleV0_createdById_key" ON "RaffleV0"("createdById");

-- CreateIndex
CREATE INDEX "RaffleV0_createdById_idx" ON "RaffleV0"("createdById");

-- AddForeignKey
ALTER TABLE "RaffleV0" ADD CONSTRAINT "RaffleV0_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
