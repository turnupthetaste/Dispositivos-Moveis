// services/viacep.ts
import axios from 'axios';

export interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export async function getCep(cep: string): Promise<ViaCepResponse> {
  const onlyDigits = cep.replace(/\D/g, '');
  const url = `https://viacep.com.br/ws/${onlyDigits}/json/`;
  const { data } = await axios.get<ViaCepResponse>(url);
  return data;
}
