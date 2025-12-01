// src/components/AvisosNotificationModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAvisos } from '../contexts/AvisosContext';
import { useAuth } from '../hooks/useAuth';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';

const { width } = Dimensions.get('window');

export function AvisosNotificationModal() {
  const navigation = useNavigation();
  const { naoLidos } = useAvisos();
  const { token } = useAuth();
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Mostrar notificação apenas uma vez após login e se houver avisos não lidos
    if (token && naoLidos > 0 && !hasShown) {
      setTimeout(() => {
        setVisible(true);
        setHasShown(true);
        
        // Animação de entrada
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();

        // Animação de pulso
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 1000); // Delay de 1s após login
    }
  }, [token, naoLidos, hasShown]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  const handleVerAvisos = () => {
    handleClose();
    setTimeout(() => {
      (navigation as any).navigate('Avisos');
    }, 300);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Ícone animado */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="notifications" size={48} color={colors.white} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{naoLidos > 99 ? '99+' : naoLidos}</Text>
            </View>
          </Animated.View>

          {/* Título */}
          <Text style={styles.title}>
            {naoLidos === 1 ? 'Novo Aviso!' : 'Novos Avisos!'}
          </Text>

          {/* Mensagem */}
          <Text style={styles.message}>
            Você tem <Text style={styles.highlight}>{naoLidos}</Text>{' '}
            {naoLidos === 1 ? 'aviso não lido' : 'avisos não lidos'}
          </Text>

          {/* Cards informativos */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📢</Text>
              <Text style={styles.infoText}>Comunicados importantes</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>Lembretes acadêmicos</Text>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>Depois</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleVerAvisos}
              activeOpacity={0.8}
            >
              <Ionicons name="eye-outline" size={18} color={colors.white} />
              <Text style={styles.btnPrimaryText}>Ver Avisos</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 360,
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
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.large,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 3,
    borderColor: colors.card,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 18,
  },
  infoCards: {
    width: '100%',
    gap: spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    marginTop: spacing.sm,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  btnPrimary: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});