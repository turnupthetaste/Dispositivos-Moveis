import type { AxiosInstance } from 'axios';

export function attachAuthToken(client: AxiosInstance, getToken: () => string | null) {
  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
