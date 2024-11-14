/*
  Warnings:

  - Added the required column `xid` to the `RaffleV0` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RaffleV0" ADD COLUMN     "xid" TEXT NOT NULL;
