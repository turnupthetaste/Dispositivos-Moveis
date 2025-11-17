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

  // agora só obrigamos email e password
  if (!email || !password) {
    return res.status(400).json({ message: 'email e password são obrigatórios' });
  }

  // se não vier name, usa a parte antes do @ como nome
  const finalName = name ?? String(email).split('@')[0];

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
        role: role ?? 'USER', // tudo que vier do app vira USER
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
        perfil: user.role.toLowerCase(), // 'user'
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
  if (!email || !password) return res.status(400).json({ message: 'email e password são obrigatórios' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    return res.json({
      token,
      user: { id: user.id, nome: user.name, email: user.email, perfil: user.role.toLowerCase() }
    });
  } catch (e: any) {
    return res.status(500).json({ message: 'Erro ao autenticar', error: e?.message });
  }
});

app.get('/auth/me', authMiddleware, async (req: any, res) => {
  const id = req.user?.sub as string;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  return res.json({ id: user.id, nome: user.name, email: user.email, perfil: user.role.toLowerCase() });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});


// ===================== ENTREGAS 2 e 3 =====================

// -------- Alunos --------
app.get('/alunos', authMiddleware, async (_req, res) => {
  const alunos = await prisma.aluno.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(alunos);
});

app.post('/alunos', authMiddleware, async (req, res) => {
  const { nome, email, matricula, curso } = req.body ?? {};
  if (!nome || !email || !matricula || !curso) {
    return res.status(400).json({ message: 'nome, email, matricula, curso são obrigatórios' });
  }
  const novo = await prisma.aluno.create({ data: { nome, email, matricula, curso } });
  res.json(novo);
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
  if (!nome || !turno) return res.status(400).json({ message: 'nome e turno são obrigatórios' });
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
  if (!nome || !titulacao || !tempoDocencia)
    return res.status(400).json({ message: 'nome, titulacao, tempoDocencia são obrigatórios' });
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
  if (!nome || !Number.isFinite(cargaHoraria) || Number(cargaHoraria) <= 0)
    return res.status(400).json({ message: 'nome e cargaHoraria (>0) são obrigatórios' });
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
// GET /notas?alunoId=...
app.get('/notas', authMiddleware, async (req, res) => {
  const alunoId = (req.query.alunoId as string) || null;
  const where = alunoId ? { alunoId } : { alunoId: null };
  const notas = await prisma.nota.findMany({ where, orderBy: { createdAt: 'asc' } });
  res.json(notas);
});

// POST /notas/batch  { alunoId?: string, notas: {disciplinaId,n1,n2}[] }
app.post('/notas/batch', authMiddleware, async (req, res) => {
  const { alunoId, notas } = req.body ?? {};
  if (!Array.isArray(notas)) return res.status(400).json({ message: 'notas deve ser array' });

  await prisma.$transaction(async (tx) => {
    for (const raw of notas) {
      const disciplinaId = String(raw.disciplinaId);
      const n1 = Number(raw.n1) || 0;
      const n2 = Number(raw.n2) || 0;

      if (alunoId) {
        // caso COM alunoId → upsert normal funciona
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
        // caso SEM alunoId (global) → não dá pra usar upsert com null
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
// GET /boletim?alunoId=...
app.get('/boletim', authMiddleware, async (req, res) => {
  const alunoId = (req.query.alunoId as string) || null;

  const disciplinas = await prisma.disciplina.findMany({ orderBy: { createdAt: 'asc' } });

  // pega notas compatíveis (por aluno ou globais)
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
