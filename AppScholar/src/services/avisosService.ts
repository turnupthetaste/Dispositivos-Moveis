// src/services/avisosService.ts
import { backend } from './backend';

export interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: 'institucional' | 'lembrete' | 'comunicado';
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
  publicadoEm: string;
  autor: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
  lido: boolean;
  lidoEm: string | null;
}

export interface CriarAvisoDTO {
  titulo: string;
  conteudo: string;
  tipo: 'institucional' | 'lembrete' | 'comunicado';
  prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente';
}

export interface AtualizarAvisoDTO {
  titulo?: string;
  conteudo?: string;
  tipo?: 'institucional' | 'lembrete' | 'comunicado';
  prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente';
}

// ✅ Listar todos os avisos
export async function listarAvisos(tipo?: string, naoLidos?: boolean): Promise<Aviso[]> {
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (naoLidos) params.append('naoLidos', 'true');
  
  const query = params.toString();
  const url = `/avisos${query ? `?${query}` : ''}`;
  
  const { data } = await backend.get<Aviso[]>(url);
  return data;
}

// ✅ Buscar aviso por ID
export async function buscarAviso(id: string): Promise<Aviso> {
  const { data } = await backend.get<Aviso>(`/avisos/${id}`);
  return data;
}

// ✅ Criar novo aviso (ADMIN/MANAGER)
export async function criarAviso(dto: CriarAvisoDTO): Promise<Aviso> {
  const { data } = await backend.post<Aviso>('/avisos', dto);
  return data;
}

// ✅ Atualizar aviso (autor ou ADMIN)
export async function atualizarAviso(id: string, dto: AtualizarAvisoDTO): Promise<Aviso> {
  const { data } = await backend.put<Aviso>(`/avisos/${id}`, dto);
  return data;
}

// ✅ Deletar aviso (autor ou ADMIN)
export async function deletarAviso(id: string): Promise<void> {
  await backend.delete(`/avisos/${id}`);
}

// ✅ Marcar aviso como lido
export async function marcarComoLido(id: string): Promise<void> {
  await backend.post(`/avisos/${id}/marcar-lido`);
}

// ✅ Contar avisos não lidos
export async function contarNaoLidos(): Promise<number> {
  const { data } = await backend.get<{ count: number }>('/avisos/nao-lidos/count');
  return data.count;
}