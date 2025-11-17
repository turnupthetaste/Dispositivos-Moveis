// src/services/authService.ts
import { backend } from './backend';
import type { AuthResponse, Credentials, User } from '../types/auth';

export const authService = {
  async login(cred: Credentials): Promise<AuthResponse> {
    // MUITOS backends esperam "password" e não "senha"
    const payload = { email: cred.email, password: cred.senha };
    const { data } = await backend.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async register(cred: Credentials): Promise<AuthResponse> {
    const payload = { email: cred.email, password: cred.senha };
    const { data } = await backend.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async me(): Promise<User> {
    const { data } = await backend.get<User>('/auth/me');
    return data;
  },
};
