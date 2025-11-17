export type Turno = 'matutino' | 'vespertino' | 'noturno';

export type Aluno = {
  id: string;
  nome: string;
  email: string;
  matricula: string; // você usa como obrigatório na tela
  curso: string;     // idem
};

export type Curso = {
  id: string;
  nome: string;
  turno: Turno;
};

export type Professor = {
  id: string;
  nome: string;
  titulacao: string;     // ex.: Mestre, Doutor
  tempoDocencia: string; // ex.: "5 anos"
};

export type Disciplina = {
  id: string;
  nome: string;
  cargaHoraria: number;
  cursoId?: string;
  professorId?: string;
};

export type Nota = {
  disciplinaId: string;
  n1: number;
  n2: number;
};

export type BoletimItem = {
  disciplinaId: string;
  disciplina: string;
  n1: number;
  n2: number;
  media: number;
  status: 'aprovado' | 'exame' | 'reprovado';
};
