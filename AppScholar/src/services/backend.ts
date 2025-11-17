import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

export const backend = axios.create({
  baseURL,
  timeout: 15_000,
});

// Interceptores opcionais (log simples de erro)
backend.interceptors.response.use(
  (res) => res,
  (err) => {
    // Você pode padronizar mensagens aqui
    return Promise.reject(err);
  }
);
