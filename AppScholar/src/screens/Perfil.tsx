// src/screens/Perfil.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';

export default function Perfil() {
  const { user, token } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyTitle}>Nenhum usuário logado</Text>
          <Text style={styles.emptyText}>
            Faça login para acessar seu perfil
          </Text>
        </View>
      </View>
    );
  }

  // Badge de perfil baseado no tipo
  const getPerfilBadge = (perfil: string) => {
    const badges = {
      admin: { emoji: '👑', label: 'Administrador', color: colors.primary },
      manager: { emoji: '⭐', label: 'Gestor', color: colors.warning },
      user: { emoji: '👤', label: 'Usuário', color: colors.info },
    };
    return badges[perfil as keyof typeof badges] || badges.user;
  };

  const perfilBadge = getPerfilBadge(user.perfil);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header com Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.nome.charAt(0).toUpperCase()}
          </Text>
          <View style={[styles.badge, { backgroundColor: perfilBadge.color }]}>
            <Text style={styles.badgeEmoji}>{perfilBadge.emoji}</Text>
          </View>
        </View>
        <Text style={styles.welcomeText}>Olá,</Text>
        <Text style={styles.userName}>{user.nome}</Text>
        <View style={styles.perfilTag}>
          <Text style={styles.perfilTagText}>{perfilBadge.label}</Text>
        </View>
      </View>

      {/* Cards de Informação */}
      <View style={styles.cardsContainer}>
        {/* Card de Informações Pessoais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardTitle}>Informações Pessoais</Text>
          </View>
          <View style={styles.cardContent}>
            <InfoRow icon="👤" label="Nome Completo" value={user.nome} />
            <InfoRow icon="✉️" label="E-mail" value={user.email} />
            <InfoRow icon="🔑" label="Tipo de Conta" value={user.perfil} />
          </View>
        </View>

        {/* Card de Token/Sessão */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔒</Text>
            <Text style={styles.cardTitle}>Sessão Ativa</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Token de Autenticação</Text>
              <View style={styles.tokenBox}>
                <Text style={styles.tokenText} numberOfLines={1}>
                  {token?.slice(0, 24)}...
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Conectado</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card de Estatísticas/Permissões */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>Permissões</Text>
          </View>
          <View style={styles.cardContent}>
            <PermissionRow
              label="Acessar Cadastros"
              granted={user.perfil === 'admin' || user.perfil === 'manager'}
            />
            <PermissionRow
              label="Visualizar Boletim"
              granted={user.perfil === 'admin' || user.perfil === 'manager'}
            />
            <PermissionRow
              label="Gerenciar Usuários"
              granted={user.perfil === 'admin'}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Componente auxiliar para linhas de informação
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.icon}>{icon}</Text>
      <View style={infoStyles.textContainer}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
});

// Componente auxiliar para permissões
function PermissionRow({ label, granted }: { label: string; granted: boolean }) {
  return (
    <View style={permStyles.row}>
      <View style={[permStyles.indicator, granted && permStyles.indicatorGranted]} />
      <Text style={permStyles.label}>{label}</Text>
      <Text style={permStyles.status}>{granted ? '✓' : '✗'}</Text>
    </View>
  );
}

const permStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.danger,
  },
  indicatorGranted: {
    backgroundColor: colors.success,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  status: {
    fontSize: 16,
    fontWeight: '700',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
    ...shadows.large,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.white,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    ...shadows.medium,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  perfilTag: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  perfilTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  cardsContainer: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardContent: {
    gap: spacing.xs,
  },
  tokenContainer: {
    gap: spacing.sm,
  },
  tokenLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tokenBox: {
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  tokenText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});