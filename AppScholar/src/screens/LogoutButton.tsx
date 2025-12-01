// src/screens/LogoutButton.tsx
// 🚪 Botão de logout melhorado com confirmação

import React, { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Modal, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../hooks/useAuth';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';

export default function LogoutButton() {
  const { logout, carregando } = useAuth();
  const [showModal, setShowModal] = useState(false);

  async function handleLogout() {
    setShowModal(false);
    await logout();
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.button}
        accessibilityLabel="Sair"
        accessibilityRole="button"
      >
        {carregando ? (
          <ActivityIndicator color={colors.danger} size="small" />
        ) : (
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
        )}
      </TouchableOpacity>

      {/* Modal de Confirmação */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👋</Text>
            </View>

            <Text style={styles.modalTitle}>Sair da Conta?</Text>
            <Text style={styles.modalMessage}>
              Você tem certeza que deseja encerrar sua sessão?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={18} color={colors.white} />
                <Text style={styles.confirmButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.large,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.danger,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    ...shadows.medium,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});