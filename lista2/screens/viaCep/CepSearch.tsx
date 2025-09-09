// screens/viaCep/CepSearch.tsx
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useCep } from '../../hooks/useCep';

const CepSearch: React.FC = () => {
  const { current, loading, fetchCep } = useCep();
  const [cep, setCep] = useState('');

  const handleSearch = async () => {
    if (!cep) return;
    await fetchCep(cep);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2e2e2e', padding: 16 }}>
      <Text style={{ color: '#fff', marginBottom: 6 }}>CEP</Text>

      <TextInput
        style={{ backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 12, height: 40 }}
        placeholder="Digite o CEP"
        keyboardType="numeric"
        value={cep}
        onChangeText={setCep}
      />

      <TouchableOpacity
        onPress={handleSearch}
        disabled={loading || !cep}
        style={{
          marginTop: 12,
          backgroundColor: '#ffd400',
          height: 44,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: loading || !cep ? 0.6 : 1,
        }}
      >
        <Text style={{ fontWeight: '700' }}>{loading ? 'Buscando...' : 'Obter'}</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 16 }}>
        {loading && <ActivityIndicator color="#fff" />}

        {current?.erro && (
          <Text style={{ color: '#ff6b6b', fontWeight: '700' }}>CEP inválido</Text>
        )}

        {current && !current.erro && (
          <>
            <Text style={{ color: '#fff' }}>Logradouro: {current.logradouro || '-'}</Text>
            <Text style={{ color: '#fff' }}>Localidade: {current.localidade || '-'}</Text>
            <Text style={{ color: '#fff' }}>UF: {current.uf || '-'}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CepSearch;
