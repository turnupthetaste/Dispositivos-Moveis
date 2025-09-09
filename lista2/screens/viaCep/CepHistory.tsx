// screens/viaCep/CepHistory.tsx
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useCep } from '../../hooks/useCep';

const CepHistory: React.FC = () => {
  const { history } = useCep();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2e2e2e', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
        Consultas válidas
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
        {history.length === 0 && (
          <Text style={{ color: '#aaa' }}>Nenhuma consulta válida ainda.</Text>
        )}

        {history.map((item, idx) => (
          <View key={`${item.cep}-${idx}`} style={{ borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 12 }}>
            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: '700' }}>CEP: </Text>{item.cep}</Text>
            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: '700' }}>Logradouro: </Text>{item.logradouro}</Text>
            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: '700' }}>Localidade: </Text>{item.localidade}</Text>
            <Text style={{ color: '#fff' }}><Text style={{ fontWeight: '700' }}>UF: </Text>{item.uf}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CepHistory;
