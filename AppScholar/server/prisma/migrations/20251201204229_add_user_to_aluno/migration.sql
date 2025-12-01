/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[matricula]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Nota" DROP CONSTRAINT "Nota_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Nota" DROP CONSTRAINT "Nota_disciplinaId_fkey";

-- DropIndex
DROP INDEX "public"."Nota_disciplinaId_idx";

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "public"."Role";

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_matricula_key" ON "Aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_userId_key" ON "Aluno"("userId");

-- CreateIndex
CREATE INDEX "Aluno_userId_idx" ON "Aluno"("userId");

-- CreateIndex
CREATE INDEX "Disciplina_cursoId_idx" ON "Disciplina"("cursoId");

-- CreateIndex
CREATE INDEX "Disciplina_professorId_idx" ON "Disciplina"("professorId");

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
