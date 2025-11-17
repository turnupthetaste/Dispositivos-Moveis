import { useContext } from 'react';
import { CepContext } from '../contexts/CepContext';

export function useViaCep() {
  return useContext(CepContext);
}
