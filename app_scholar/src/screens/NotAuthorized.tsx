import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotAuthorized() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acesso negado</Text>
      <Text style={styles.line}>Seu perfil não possui permissão para esta área.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111', justifyContent: 'center' },
  title: { color: '#ff6b6b', fontWeight: '700', marginBottom: 10, fontSize: 18, textAlign: 'center' },
  line: { color: '#fff', marginBottom: 6, textAlign: 'center' },
});
