// types/index.ts
import { ParamListBase } from '@react-navigation/native';

export interface RootStackParamList extends ParamListBase {
  // Exercícios 1–3 (suas telas)
  Um: undefined;
  Dois: undefined;
  Tres: undefined;
  Quatro: undefined;
  Cinco: undefined;
  Seis: undefined;
  Sete: undefined;
  Oito: undefined;
  Nove: undefined;
  Dez: undefined;
  Onze: undefined;   // mesmo que não apareça no Drawer do Ex.2, pode ficar aqui

  // Exercícios 4–5 (ViaCEP)
  ViaCEP: undefined;     // tela de busca (CepSearch)
  CepHistory: undefined; // tela de histórico
}
