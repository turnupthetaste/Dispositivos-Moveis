import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useViaCep } from '../hooks/useViaCep';

export default function Consultas() {
  const { historico } = useViaCep();

  return (
    <View style={{ flex: 1, backgroundColor: '#333' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {historico.length === 0 ? (
          <Text style={styles.empty}>Nenhuma consulta ainda.</Text>
        ) : (
          historico.map((item, idx) => (
            <View key={`${item.cep}-${idx}`} style={styles.card}>
              <Text style={styles.line}>Logradouro: {item.logradouro}</Text>
              <Text style={styles.line}>Localidade: {item.localidade}</Text>
              <Text style={styles.line}>UF: {item.uf}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  card: { backgroundColor: '#444', padding: 12, borderRadius: 6, marginBottom: 8 },
  line: { color: '#fff', marginBottom: 4 },
  empty: { color: '#bbb', marginTop: 20, textAlign: 'center' },
});
