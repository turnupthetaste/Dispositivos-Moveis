-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Migration: Criar tabelas de Avisos

-- CreateTable: Aviso
CREATE TABLE "Aviso" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL DEFAULT 'normal',
    "publicadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "autorId" TEXT NOT NULL,

    CONSTRAINT "Aviso_pkey" PRIMARY KEY ("id")
);

-- CreateTable: AvisoLeitura
CREATE TABLE "AvisoLeitura" (
    "id" TEXT NOT NULL,
    "avisoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvisoLeitura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Aviso_autorId_idx" ON "Aviso"("autorId");
CREATE INDEX "Aviso_publicadoEm_idx" ON "Aviso"("publicadoEm");
CREATE INDEX "Aviso_tipo_idx" ON "Aviso"("tipo");

-- CreateIndex
CREATE INDEX "AvisoLeitura_userId_idx" ON "AvisoLeitura"("userId");
CREATE INDEX "AvisoLeitura_avisoId_idx" ON "AvisoLeitura"("avisoId");
CREATE UNIQUE INDEX "AvisoLeitura_avisoId_userId_key" ON "AvisoLeitura"("avisoId", "userId");

-- AddForeignKey
ALTER TABLE "Aviso" ADD CONSTRAINT "Aviso_autorId_fkey" 
    FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvisoLeitura" ADD CONSTRAINT "AvisoLeitura_avisoId_fkey" 
    FOREIGN KEY ("avisoId") REFERENCES "Aviso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
