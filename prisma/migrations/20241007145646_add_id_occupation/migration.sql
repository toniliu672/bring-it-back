/*
  Warnings:

  - You are about to drop the column `occupationCode` on the `occupation_competencies` table. All the data in the column will be lost.
  - The primary key for the `occupations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[code]` on the table `occupations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `occupationId` to the `occupation_competencies` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `occupations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "occupation_competencies" DROP CONSTRAINT "occupation_competencies_occupationCode_fkey";

-- DropIndex
DROP INDEX "occupations_name_key";

-- AlterTable
ALTER TABLE "occupation_competencies" DROP COLUMN "occupationCode",
ADD COLUMN     "occupationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "occupations" DROP CONSTRAINT "occupations_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "occupations_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "occupations_code_key" ON "occupations"("code");

-- AddForeignKey
ALTER TABLE "occupation_competencies" ADD CONSTRAINT "occupation_competencies_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "occupations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
