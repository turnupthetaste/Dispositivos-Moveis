import { backend } from './backend';
import type { Aluno, Curso, Disciplina, Nota, BoletimItem, Professor } from '../types/school';

// -------- Aluno --------
export async function listarAlunos(): Promise<Aluno[]> {
  const { data } = await backend.get<Aluno[]>('/alunos');
  return data;
}
export async function criarAluno(payload: Pick<Aluno, 'nome'|'email'|'matricula'|'curso'>): Promise<Aluno> {
  const { data } = await backend.post<Aluno>('/alunos', payload);
  return data;
}
export async function removerAluno(id: string): Promise<void> {
  await backend.delete(`/alunos/${id}`);
}

// -------- Curso --------
export async function listarCursos(): Promise<Curso[]> {
  const { data } = await backend.get<Curso[]>('/cursos');
  return data;
}
export async function criarCurso(payload: Pick<Curso, 'nome'|'turno'>): Promise<Curso> {
  const { data } = await backend.post<Curso>('/cursos', payload);
  return data;
}
export async function removerCurso(id: string): Promise<void> {
  await backend.delete(`/cursos/${id}`);
}

// -------- Professor --------
export async function listarProfessores(): Promise<Professor[]> {
  const { data } = await backend.get<Professor[]>('/professores');
  return data;
}
export async function criarProfessor(payload: Pick<Professor, 'nome'|'titulacao'|'tempoDocencia'>): Promise<Professor> {
  const { data } = await backend.post<Professor>('/professores', payload);
  return data;
}
export async function removerProfessor(id: string): Promise<void> {
  await backend.delete(`/professores/${id}`);
}

// -------- Disciplina --------
export async function listarDisciplinas(): Promise<Disciplina[]> {
  const { data } = await backend.get<Disciplina[]>('/disciplinas');
  return data;
}
export async function criarDisciplina(payload: Pick<Disciplina, 'nome'|'cargaHoraria'|'cursoId'|'professorId'>): Promise<Disciplina> {
  const { data } = await backend.post<Disciplina>('/disciplinas', payload);
  return data;
}
export async function removerDisciplina(id: string): Promise<void> {
  await backend.delete(`/disciplinas/${id}`);
}

// -------- Notas --------
export async function listarNotas(alunoId?: string): Promise<Nota[]> {
  const url = alunoId ? `/notas?alunoId=${alunoId}` : '/notas';
  const { data } = await backend.get<Nota[]>(url);
  return data;
}
export async function salvarNotas(notas: Nota[], alunoId?: string): Promise<void> {
  await backend.post('/notas/batch', { alunoId, notas });
}

// -------- Boletim --------
export async function obterBoletim(alunoId?: string): Promise<BoletimItem[]> {
  const url = alunoId ? `/boletim?alunoId=${alunoId}` : '/boletim';
  const { data } = await backend.get<BoletimItem[]>(url);
  return data;
}
