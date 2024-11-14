/*
  Warnings:

  - The `give` column on the `V0` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `want` column on the `V0` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "V0" DROP COLUMN "give",
ADD COLUMN     "give" TEXT[],
DROP COLUMN "want",
ADD COLUMN     "want" TEXT[];
