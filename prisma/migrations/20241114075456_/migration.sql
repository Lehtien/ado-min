-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('OPEN', 'CLOSED', 'ADJUSTING');

-- AlterTable
ALTER TABLE "RaffleV0" ADD COLUMN     "status" "RaffleStatus" NOT NULL DEFAULT 'OPEN';
