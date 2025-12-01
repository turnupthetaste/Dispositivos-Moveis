import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT ?? 3333);
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET');

app.use(helmet());
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// ✨ NOVA FUNÇÃO: Resolve perfil baseado no domínio do email
function resolveRole(email: string): string {
  if (email.endsWith('@admin.com')) return 'ADMIN';
  if (email.endsWith('@gestor.com') || email.endsWith('@manager.com')) return 'MANAGER';
  return 'USER';
}

// ✅ NOVA FUNÇÃO: Valida email
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Helpers
function signToken(user: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

// Middleware de auth
function authMiddleware(req: any, res: any, next: any) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token ausente' });
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// ---- Rotas de Autenticação ----
app.post('/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body ?? {};

  // ✅ Validação de email
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'E-mail inválido' });
  }

  // ✅ Validação de senha
  if (!password || password.length < 4) {
    return res.status(400).json({ message: 'Senha deve ter no mínimo 4 caracteres' });
  }

  const finalName = name ?? String(email).split('@')[0];
  const finalRole = role ?? resolveRole(email);

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: finalName,
        password: await hashPassword(password),
        role: finalRole,
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        nome: user.name,
        email: user.email,
        perfil: user.role.toLowerCase(),
      },
    });
  } catch (e: any) {
    return res
      .status(500)
      .json({ message: 'Erro ao registrar', error: e?.message });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    
    return res.json({
      token,
      user: { 
        id: user.id, 
        nome: user.name, 
        email: user.email, 
        perfil: user.role.toLowerCase() 
      }
    });
  } catch (e: any) {
    return res.status(500).json({ message: 'Erro ao autenticar', error: e?.message });
  }
});

app.get('/auth/me', authMiddleware, async (req: any, res) => {
  const id = req.user?.sub as string;
  const user = await prisma.user.findUnique({ 
    where: { id },
    include: { aluno: true } // ✅ Incluir aluno vinculado
  });
  
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  
  return res.json({ 
    id: user.id, 
    nome: user.name, 
    email: user.email, 
    perfil: user.role.toLowerCase(),
    alunoId: user.aluno?.id ?? null // ✅ Retornar ID do aluno se existir
  });
});

// ✅ NOVO ENDPOINT: Vincular User a Aluno existente
app.post('/auth/vincular-aluno', authMiddleware, async (req: any, res) => {
  const userId = req.user?.sub as string;
  const { alunoId } = req.body ?? {};

  if (!alunoId) {
    return res.status(400).json({ message: 'alunoId é obrigatório' });
  }

  try {
    // Verificar se aluno existe
    const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Verificar se aluno já está vinculado
    if (aluno.userId) {
      return res.status(409).json({ message: 'Este aluno já está vinculado a outro usuário' });
    }

    // Vincular
    await prisma.aluno.update({
      where: { id: alunoId },
      data: { userId },
    });

    return res.json({ message: 'Aluno vinculado com sucesso' });
  } catch (e: any) {
    return res.status(500).json({ message: 'Erro ao vincular aluno', error: e?.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

// ===================== ENTREGAS 2 e 3 =====================

// -------- Alunos --------
app.get('/alunos', authMiddleware, async (req: any, res) => {
  const userId = req.user?.sub as string;
  const userRole = req.user?.role as string;

  // ✅ Se for USER, retorna apenas seu próprio aluno
  if (userRole === 'USER') {
    const alunos = await prisma.aluno.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return res.json(alunos);
  }

  // ADMIN e MANAGER veem todos
  const alunos = await prisma.aluno.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(alunos);
});

app.post('/alunos', authMiddleware, async (req, res) => {
  const { nome, email, matricula, curso } = req.body ?? {};
  
  // ✅ Validações aprimoradas
  if (!nome || nome.trim().length < 3) {
    return res.status(400).json({ message: 'Nome deve ter pelo menos 3 caracteres' });
  }
  
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: 'E-mail inválido' });
  }
  
  if (!matricula || matricula.trim().length < 3) {
    return res.status(400).json({ message: 'Matrícula inválida' });
  }
  
  if (!curso || curso.trim().length < 3) {
    return res.status(400).json({ message: 'Curso inválido' });
  }

  try {
    // Verificar se matrícula já existe
    const exists = await prisma.aluno.findUnique({ where: { matricula } });
    if (exists) {
      return res.status(409).json({ message: 'Matrícula já cadastrada' });
    }

    const novo = await prisma.aluno.create({ data: { nome, email, matricula, curso } });
    res.json(novo);
  } catch (e: any) {
    return res.status(500).json({ message: 'Erro ao criar aluno', error: e?.message });
  }
});

app.delete('/alunos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.aluno.delete({ where: { id } });
  res.status(204).send();
});

// -------- Cursos --------
app.get('/cursos', authMiddleware, async (_req, res) => {
  const cursos = await prisma.curso.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(cursos);
});

app.post('/cursos', authMiddleware, async (req, res) => {
  const { nome, turno } = req.body ?? {};
  
  if (!nome || nome.trim().length < 3) {
    return res.status(400).json({ message: 'Nome do curso inválido' });
  }
  
  if (!['matutino', 'vespertino', 'noturno'].includes(turno)) {
    return res.status(400).json({ message: 'Turno deve ser: matutino, vespertino ou noturno' });
  }

  const novo = await prisma.curso.create({ data: { nome, turno } });
  res.json(novo);
});

app.delete('/cursos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.curso.delete({ where: { id } });
  res.status(204).send();
});

// -------- Professores --------
app.get('/professores', authMiddleware, async (_req, res) => {
  const profs = await prisma.professor.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(profs);
});

app.post('/professores', authMiddleware, async (req, res) => {
  const { nome, titulacao, tempoDocencia } = req.body ?? {};
  
  if (!nome || nome.trim().length < 3) {
    return res.status(400).json({ message: 'Nome inválido' });
  }
  
  if (!titulacao || titulacao.trim().length < 3) {
    return res.status(400).json({ message: 'Titulação inválida' });
  }
  
  if (!tempoDocencia || tempoDocencia.trim().length < 1) {
    return res.status(400).json({ message: 'Tempo de docência inválido' });
  }

  const novo = await prisma.professor.create({ data: { nome, titulacao, tempoDocencia } });
  res.json(novo);
});

app.delete('/professores/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.professor.delete({ where: { id } });
  res.status(204).send();
});

// -------- Disciplinas --------
app.get('/disciplinas', authMiddleware, async (_req, res) => {
  const disciplinas = await prisma.disciplina.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(disciplinas);
});

app.post('/disciplinas', authMiddleware, async (req, res) => {
  const { nome, cargaHoraria, cursoId, professorId } = req.body ?? {};
  
  if (!nome || nome.trim().length < 3) {
    return res.status(400).json({ message: 'Nome da disciplina inválido' });
  }
  
  if (!Number.isFinite(cargaHoraria) || Number(cargaHoraria) <= 0 || Number(cargaHoraria) > 999) {
    return res.status(400).json({ message: 'Carga horária deve estar entre 1 e 999' });
  }

  const novo = await prisma.disciplina.create({
    data: {
      nome,
      cargaHoraria: Number(cargaHoraria),
      cursoId: cursoId ?? null,
      professorId: professorId ?? null,
    },
  });
  res.json(novo);
});

app.delete('/disciplinas/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.disciplina.delete({ where: { id } });
  res.status(204).send();
});

// -------- Notas (Entrega 3) --------
app.get('/notas', authMiddleware, async (req: any, res) => {
  const userId = req.user?.sub as string;
  const userRole = req.user?.role as string;
  const alunoIdQuery = (req.query.alunoId as string) || null;

  // ✅ Se for USER, busca seu próprio aluno
  if (userRole === 'USER') {
    const aluno = await prisma.aluno.findFirst({ where: { userId } });
    if (!aluno) {
      return res.json([]); // Sem aluno vinculado
    }

    const notas = await prisma.nota.findMany({
      where: { alunoId: aluno.id },
      orderBy: { createdAt: 'asc' },
    });
    return res.json(notas);
  }

  // ADMIN e MANAGER
  const where = alunoIdQuery ? { alunoId: alunoIdQuery } : { alunoId: null };
  const notas = await prisma.nota.findMany({ where, orderBy: { createdAt: 'asc' } });
  res.json(notas);
});

app.post('/notas/batch', authMiddleware, async (req, res) => {
  const { alunoId, notas } = req.body ?? {};
  
  if (!Array.isArray(notas)) {
    return res.status(400).json({ message: 'notas deve ser array' });
  }

  // ✅ Validar notas (0-10)
  for (const nota of notas) {
    const n1 = Number(nota.n1) || 0;
    const n2 = Number(nota.n2) || 0;
    
    if (n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      return res.status(400).json({ message: 'Notas devem estar entre 0 e 10' });
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const raw of notas) {
      const disciplinaId = String(raw.disciplinaId);
      const n1 = Number(raw.n1) || 0;
      const n2 = Number(raw.n2) || 0;

      if (alunoId) {
        await tx.nota.upsert({
          where: {
            disciplinaId_alunoId: {
              disciplinaId,
              alunoId: String(alunoId),
            },
          },
          create: { disciplinaId, alunoId: String(alunoId), n1, n2 },
          update: { n1, n2 },
        });
      } else {
        const existing = await tx.nota.findFirst({
          where: { disciplinaId, alunoId: null },
          select: { id: true },
        });

        if (existing) {
          await tx.nota.update({
            where: { id: existing.id },
            data: { n1, n2 },
          });
        } else {
          await tx.nota.create({
            data: { disciplinaId, alunoId: null, n1, n2 },
          });
        }
      }
    }
  });

  res.status(204).send();
});

// -------- Boletim (Entrega 3) --------
app.get('/boletim', authMiddleware, async (req: any, res) => {
  const userId = req.user?.sub as string;
  const userRole = req.user?.role as string;
  const alunoIdQuery = (req.query.alunoId as string) || null;

  let alunoId = alunoIdQuery;

  // ✅ Se for USER, busca automaticamente seu aluno
  if (userRole === 'USER') {
    const aluno = await prisma.aluno.findFirst({ where: { userId } });
    if (!aluno) {
      return res.json([]); // Sem aluno vinculado
    }
    alunoId = aluno.id;
  }

  const disciplinas = await prisma.disciplina.findMany({ orderBy: { createdAt: 'asc' } });

  const notas = await prisma.nota.findMany({
    where: alunoId ? { alunoId } : { alunoId: null },
  });

  const byDisc = new Map(notas.map(n => [n.disciplinaId, n]));

  function media(n1: number, n2: number) {
    const m = Math.round((( (isFinite(n1) ? n1 : 0) + (isFinite(n2) ? n2 : 0) ) / 2) * 10) / 10;
    return m;
  }
  
  function status(m: number) {
    if (m >= 6) return 'aprovado';
    if (m >= 4) return 'exame';
    return 'reprovado';
  }

  const resp = disciplinas.map(d => {
    const n = byDisc.get(d.id);
    const n1 = n?.n1 ?? 0;
    const n2 = n?.n2 ?? 0;
    const m = media(n1, n2);
    return {
      disciplinaId: d.id,
      disciplina: d.nome,
      n1, n2,
      media: m,
      status: status(m),
    };
  });

  res.json(resp);
});