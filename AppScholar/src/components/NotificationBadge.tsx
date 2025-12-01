// src/components/NotificationBadge.tsx
// Badge de notificação para indicar avisos não lidos

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react';
import { contarNaoLidos } from '../services/avisosService';
import { colors, borderRadius } from '../theme/colors';

export function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    carregarCount();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarCount, 30000);
    return () => clearInterval(interval);
  }, []);

  async function carregarCount() {
    try {
      const total = await contarNaoLidos();
      setCount(total);
    } catch (error) {
      // Silenciar erros
    }
  }

  if (count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  text: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});