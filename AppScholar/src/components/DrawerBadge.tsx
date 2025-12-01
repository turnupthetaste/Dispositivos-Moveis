// src/components/DrawerBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAvisos } from '../contexts/AvisosContext';
import { colors, borderRadius, spacing } from '../theme/colors';

export function DrawerBadge() {
  const { naoLidos } = useAvisos();

  if (naoLidos === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{naoLidos > 99 ? '99+' : naoLidos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    marginLeft: spacing.sm,
  },
  text: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});