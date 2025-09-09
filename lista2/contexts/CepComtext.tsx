// contexts/CepContext.tsx
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { getCep, ViaCepResponse } from '../services/viacep';

interface CepContextValue {
  current: ViaCepResponse | null;
  history: ViaCepResponse[];        // <- histórico apenas de CEPs válidos
  loading: boolean;
  fetchCep: (cep: string) => Promise<ViaCepResponse>;
}

export const CepContext = createContext<CepContextValue>({
  current: null,
  history: [],
  loading: false,
  fetchCep: async () => ({}) as ViaCepResponse,
});

export const CepProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [current, setCurrent] = useState<ViaCepResponse | null>(null);
  const [history, setHistory] = useState<ViaCepResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCep = useCallback(async (cep: string) => {
    setLoading(true);
    try {
      const data = await getCep(cep);
      setCurrent(data);

      // Só guardamos no histórico se NÃO for inválido
      if (!data.erro) {
        setHistory(prev => {
          const already = prev.some(item => item.cep === data.cep);
          return already ? prev : [...prev, data];
        });
      }
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ current, history, loading, fetchCep }),
    [current, history, loading, fetchCep]
  );

  return <CepContext.Provider value={value}>{children}</CepContext.Provider>;
};
