-- CreateTable
CREATE TABLE "V0" (
    "id" SERIAL NOT NULL,
    "give" TEXT NOT NULL,
    "want" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "V0_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "V0_createdById_key" ON "V0"("createdById");

-- CreateIndex
CREATE INDEX "V0_createdById_idx" ON "V0"("createdById");

-- AddForeignKey
ALTER TABLE "V0" ADD CONSTRAINT "V0_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
