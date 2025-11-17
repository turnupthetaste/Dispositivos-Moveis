-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "turno" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "titulacao" TEXT NOT NULL,
    "tempoDocencia" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargaHoraria" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cursoId" TEXT,
    "professorId" TEXT,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL,
    "n1" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "n2" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    "alunoId" TEXT,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Nota_disciplinaId_idx" ON "Nota"("disciplinaId");

-- CreateIndex
CREATE INDEX "Nota_alunoId_idx" ON "Nota"("alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "Nota_disciplinaId_alunoId_key" ON "Nota"("disciplinaId", "alunoId");

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE SET NULL ON UPDATE CASCADE;
