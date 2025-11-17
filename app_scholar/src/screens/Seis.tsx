import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Seis() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [saida, setSaida] = useState('');

  function salvar() {
    setSaida(`${nome} - ${idade}`);
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Idade" value={idade} onChangeText={setIdade}
        keyboardType="numeric" style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>SALVAR</Text>
      </TouchableOpacity>
      {!!saida && <Text style={styles.out}>{saida}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#111' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 6 },
  btn: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  out: { marginTop: 8, color: '#fff' },
});
