export type Perfil = 'admin' | 'manager' | 'user';

export type User = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
};

export type Credentials = {
  email: string;
  senha: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
