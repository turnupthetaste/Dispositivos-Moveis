import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useViaCep } from '../hooks/useViaCep';

export default function ViaCEP() {
  const { consultar, erro, resultado, carregando, limpar } = useViaCep();
  const [cep, setCep] = useState('');

  const onChange = (t: string) => {
    const digits = t.replace(/\D/g, '').slice(0, 8);
    setCep(digits);
    if (erro) limpar();
  };

  const handleObter = () => consultar(cep);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#333' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder="Digite o CEP (8 dígitos)"
          placeholderTextColor="#bbb"
        />

        <TouchableOpacity
          style={[styles.btn, cep.length !== 8 && styles.btnDisabled]}
          onPress={handleObter}
          disabled={cep.length !== 8 || carregando}
        >
          {carregando ? <ActivityIndicator /> : <Text style={styles.btnText}>Obter</Text>}
        </TouchableOpacity>

        {erro ? (
          <Text style={[styles.result, { color: '#ff6b6b' }]}>{erro}</Text>
        ) : resultado ? (
          <View style={styles.resultBox}>
            <Text style={styles.result}>Logradouro: {resultado.logradouro}</Text>
            <Text style={styles.result}>Localidade: {resultado.localidade}</Text>
            <Text style={styles.result}>UF: {resultado.uf}</Text>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  label: { color: '#fff', marginTop: 24, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10 },
  btn: { backgroundColor: '#ffe100', borderRadius: 6, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontWeight: '700' },
  resultBox: { marginTop: 16 },
  result: { color: '#fff', marginTop: 4 },
});
