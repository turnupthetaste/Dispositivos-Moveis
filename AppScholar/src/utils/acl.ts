import type { Perfil } from '../types/auth';

type RouteName = 'ViaCEP' | 'Consultas' | 'Perfil' | 'Cadastros' | 'Boletim';

const rules: Record<RouteName, Perfil[]> = {
  ViaCEP: ['admin', 'manager', 'user'],
  Consultas: ['admin', 'manager', 'user'],
  Perfil: ['admin', 'manager', 'user'],
  Cadastros: ['admin', 'manager'], // <— Ex.: só admin/manager
  Boletim: ['admin', 'manager', 'user'], // <— todos visualizam
};

export function canAccess(route: RouteName, perfil?: Perfil | null) {
  if (!perfil) return false;
  return rules[route]?.includes(perfil) ?? false;
}
