import type { AuthResponse, Credentials, Perfil } from '../types/auth';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Regra de exemplo: perfis por domínio (só para mock)
function resolvePerfil(email: string): Perfil {
  if (email.endsWith('@admin.com')) return 'admin';
  if (email.endsWith('@gestor.com')) return 'manager';
  return 'user';
}

export async function loginApi({ email, senha }: Credentials): Promise<AuthResponse> {
  await delay(700);

  // MOCK: qualquer senha com pelo menos 4 chars "valida"
  if (!email || !senha || senha.length < 4) {
    throw new Error('Credenciais inválidas');
  }

  const perfil = resolvePerfil(email);
  return {
    token: 'mock-token-' + Math.random().toString(36).slice(2),
    user: {
      id: String(Date.now()),
      nome: email.split('@')[0],
      email,
      perfil,
    },
  };
}

export async function registerApi({ email, senha }: Credentials): Promise<AuthResponse> {
  // Para o mock, registro = login
  return loginApi({ email, senha });
}
