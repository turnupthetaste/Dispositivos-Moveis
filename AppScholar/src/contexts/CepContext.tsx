import React, { createContext, useCallback, useState } from 'react';
import { viaCep } from '../services/api';
import type { ViaCepResponse } from '../types';

export type CepContextType = {
  carregando: boolean;
  erro: string | null;
  resultado: ViaCepResponse | null;
  historico: ViaCepResponse[];
  consultar: (cep: string) => Promise<void>;
  limpar: () => void;
};

export const CepContext = createContext<CepContextType>({} as CepContextType);

// ... resto igual (Provider com historico/consultar/limpar)


export function CepProvider({ children }: { children: React.ReactNode }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ViaCepResponse | null>(null);
  const [historico, setHistorico] = useState<ViaCepResponse[]>([]);

  const consultar = useCallback(async (cep: string) => {
    const somenteDigitos = cep.replace(/\D/g, '');
    if (somenteDigitos.length !== 8) {
      setErro('Informe um CEP com 8 dígitos.');
      setResultado(null);
      return;
    }
    try {
      setCarregando(true);
      setErro(null);
      setResultado(null);
      const { data } = await viaCep.get<ViaCepResponse>(`${somenteDigitos}/json/`);

      if (data?.erro) {
        // requisito: exibir mensagem "CEP inválido"
        setErro('CEP inválido');
        setResultado(null);
        return;
      }

      setResultado(data);
      // requisito: manter apenas CEPs válidos no contexto
      setHistorico((prev) => [
        ...prev,
        {
          cep: data.cep,
          logradouro: data.logradouro,
          localidade: data.localidade,
          uf: data.uf,
        } as ViaCepResponse,
      ]);
    } catch (e) {
      setErro('Falha ao consultar o ViaCEP.');
      setResultado(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setErro(null);
    setResultado(null);
  }, []);

  return (
    <CepContext.Provider
      value={{ carregando, erro, resultado, historico, consultar, limpar }}
    >
      {children}
    </CepContext.Provider>
  );
}
