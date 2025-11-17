// src/contexts/AuthContext.tsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi } from '../services/authApi';
import type { User, Credentials } from '../types/auth';
import { USE_API } from '../services/useApiFlag';
import { authService } from '../services/authService';
import { attachAuthToken } from '../services/withAuth';
import { backend } from '../services/backend';
import axios from 'axios';

type AuthContextType = {
  carregando: boolean;
  token: string | null;
  user: User | null;
  login: (cred: Credentials) => Promise<void>;
  register: (cred: Credentials) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // injeta Authorization em TODAS as chamadas
  useEffect(() => {
    attachAuthToken(backend, () => token);
  }, [token]);

  // Restaura sessão + valida token no backend quando USE_API = true
  useEffect(() => {
    (async () => {
      try {
        const [tk, userJson] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (tk && userJson) {
          setToken(tk);
          setUser(JSON.parse(userJson));

          if (USE_API) {
            try {
              await authService.me(); // valida token
            } catch {
              // token inválido/expirado -> limpa e volta para Login
              await SecureStore.deleteItemAsync(TOKEN_KEY);
              await AsyncStorage.removeItem(USER_KEY);
              setToken(null);
              setUser(null);
            }
          }
        }
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const persist = useCallback(async (tk: string, usr: User) => {
    setToken(tk);
    setUser(usr);
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, tk),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(usr)),
    ]);
  }, []);

  function fromAxiosError(e: any): string {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      const msg =
        (e.response?.data as any)?.message ||
        (e.response?.data as any)?.error ||
        e.message;
      return `Erro API${status ? ` (${status})` : ''}: ${msg}`;
    }
    return e?.message ?? 'Erro inesperado';
  }

  const login = useCallback(async (cred: Credentials) => {
    setCarregando(true);
    try {
      const apiLogin = USE_API ? authService.login : loginApi;
      const { token: tk, user: usr } = await apiLogin(cred);
      await persist(tk, usr);
    } catch (e: any) {
      throw new Error(fromAxiosError(e));
    } finally {
      setCarregando(false);
    }
  }, [persist]);

  const register = useCallback(async (cred: Credentials) => {
    setCarregando(true);
    try {
      const apiRegister = USE_API ? authService.register : registerApi;
      const { token: tk, user: usr } = await apiRegister(cred);
      await persist(tk, usr);
    } catch (e: any) {
      throw new Error(fromAxiosError(e));
    } finally {
      setCarregando(false);
    }
  }, [persist]);

  const logout = useCallback(async () => {
    setCarregando(true);
    try {
      setToken(null);
      setUser(null);
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } finally {
      setCarregando(false);
    }
  }, []);

  const value = useMemo(() => ({
    carregando, token, user, login, register, logout,
  }), [carregando, token, user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
