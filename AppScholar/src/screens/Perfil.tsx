// src/screens/Perfil.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';

export default function Perfil() {
  const { user, token } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.warn}>Nenhum usuário logado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.line}>Nome: {user.nome}</Text>
      <Text style={styles.line}>E-mail: {user.email}</Text>
      <Text style={styles.line}>Perfil: {user.perfil}</Text>
      <Text style={styles.token}>
        Token: {token?.slice(0, 14)}...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.accent,
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 18,
  },
  line: {
    color: colors.text,
    marginBottom: 6,
  },
  token: {
    color: colors.textMuted,
    marginTop: 4,
  },
  warn: {
    color: colors.danger,
  },
});
