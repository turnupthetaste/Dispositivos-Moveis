// src/contexts/AvisosContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { contarNaoLidos } from '../services/avisosService';
import { useAuth } from '../hooks/useAuth';

interface AvisosContextType {
  naoLidos: number;
  carregarNaoLidos: () => Promise<void>;
  decrementarNaoLidos: () => void;
}

const AvisosContext = createContext<AvisosContextType>({} as AvisosContextType);

export function useAvisos() {
  return useContext(AvisosContext);
}

export function AvisosProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [naoLidos, setNaoLidos] = useState(0);

  const carregarNaoLidos = useCallback(async () => {
    if (!token) {
      setNaoLidos(0);
      return;
    }

    try {
      const count = await contarNaoLidos();
      setNaoLidos(count);
    } catch (error) {
      // Silenciar erros
    }
  }, [token]);

  const decrementarNaoLidos = useCallback(() => {
    setNaoLidos(prev => Math.max(0, prev - 1));
  }, []);

  // Carregar ao fazer login
  useEffect(() => {
    if (token) {
      carregarNaoLidos();
      
      // Atualizar a cada 60 segundos
      const interval = setInterval(carregarNaoLidos, 60000);
      return () => clearInterval(interval);
    }
  }, [token, carregarNaoLidos]);

  return (
    <AvisosContext.Provider value={{ naoLidos, carregarNaoLidos, decrementarNaoLidos }}>
      {children}
    </AvisosContext.Provider>
  );
}