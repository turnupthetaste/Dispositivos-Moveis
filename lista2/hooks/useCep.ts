// hooks/useCep.ts
import { useContext } from 'react';
import { CepContext } from '../contexts/CepComtext';

export function useCep() {
  return useContext(CepContext);
}
