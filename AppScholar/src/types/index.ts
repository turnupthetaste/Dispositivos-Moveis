// src/types/index.ts
import { ParamListBase } from '@react-navigation/native';

export interface AppDrawerParamList extends ParamListBase {
  Perfil: undefined;
  Cadastros: undefined;
  Boletim: undefined;
}

export interface AuthStackParamList extends ParamListBase {
  Login: undefined;
  Registro: undefined;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro?: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}



export type AppDrawerParamList = {
  Perfil: undefined;
  Cadastros: undefined;
  Boletim: undefined;
  Avisos: undefined; // ✅ NOVO
};

export type AvisosStackParamList = {
  ListaAvisos: undefined;
  DetalheAviso: { id: string };
  NovoAviso: undefined;
  EditarAviso: { id: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Registro: undefined;
};