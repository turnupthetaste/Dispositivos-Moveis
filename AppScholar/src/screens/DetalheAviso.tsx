// src/screens/DetalheAviso.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buscarAviso, marcarComoLido, deletarAviso, type Aviso } from '../services/avisosService';
import { useAuth } from '../hooks/useAuth';
import { useAvisos } from '../contexts/AvisosContext';
import { useToast } from '../components/Toast';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = NativeStackScreenProps<any, 'DetalheAviso'>;

export default function DetalheAviso({ route, navigation }: Props) {
  const { id } = route.params;
  const { user } = useAuth();
  const { decrementarNaoLidos } = useAvisos();
  const toast = useToast();
  
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarAviso();
  }, [id]);

  async function carregarAviso() {
    try {
      const dados = await buscarAviso(id);
      setAviso(dados);
      
      // Marcar como lido automaticamente ao abrir
      if (!dados.lido) {
        await marcarComoLido(id);
        setAviso(prev => prev ? { ...prev, lido: true, lidoEm: new Date().toISOString() } : null);
        decrementarNaoLidos(); // ✅ Atualizar contador
      }
    } catch (error: any) {
      toast.error('Erro ao carregar aviso');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar() {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja deletar este aviso? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarAviso(id);
              toast.success('Aviso deletado com sucesso');
              navigation.goBack();
            } catch (error: any) {
              toast.error('Erro ao deletar aviso: ' + (error?.message ?? 'Erro desconhecido'));
            }
          },
        },
      ]
    );
  }

  const podeEditar = aviso && (user?.perfil === 'admin' || aviso.autor.id === user?.id);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando aviso...</Text>
      </View>
    );
  }

  if (!aviso) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorTitle}>Aviso não encontrado</Text>
      </View>
    );
  }

  const prioridadeConfig = {
    urgente: { color: colors.danger, icon: '🔴', label: 'Urgente' },
    alta: { color: colors.warning, icon: '🟠', label: 'Alta' },
    normal: { color: colors.info, icon: '🔵', label: 'Normal' },
    baixa: { color: colors.textMuted, icon: '⚪', label: 'Baixa' },
  };

  const tipoConfig = {
    institucional: { emoji: '🏛️', label: 'Institucional', color: colors.primary },
    lembrete: { emoji: '⏰', label: 'Lembrete', color: colors.warning },
    comunicado: { emoji: '📢', label: 'Comunicado', color: colors.info },
  };

  const prioridade = prioridadeConfig[aviso.prioridade];
  const tipo = tipoConfig[aviso.tipo];

  const dataPublicacao = new Date(aviso.publicadoEm).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      {/* Header com ações */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        {podeEditar && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.btnAction}
              onPress={() => navigation.navigate('EditarAviso', { id: aviso.id })}
            >
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAction} onPress={handleDeletar}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Badge de tipo */}
        <View style={[styles.tipoBadge, { backgroundColor: tipo.color + '20' }]}>
          <Text style={styles.tipoEmoji}>{tipo.emoji}</Text>
          <Text style={[styles.tipoLabel, { color: tipo.color }]}>{tipo.label}</Text>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>{aviso.titulo}</Text>

        {/* Info cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.infoText}>{dataPublicacao}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.prioridadeIcon}>{prioridade.icon}</Text>
            <Text style={[styles.infoText, { color: prioridade.color }]}>
              {prioridade.label}
            </Text>
          </View>

          {aviso.lido && (
            <View style={styles.infoCard}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.infoText, { color: colors.success }]}>Lido</Text>
            </View>
          )}
        </View>

        {/* Autor */}
        <View style={styles.autorCard}>
          <View style={styles.autorAvatar}>
            <Text style={styles.autorAvatarText}>
              {aviso.autor.nome.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.autorInfo}>
            <Text style={styles.autorLabel}>Publicado por</Text>
            <Text style={styles.autorNome}>{aviso.autor.nome}</Text>
            <Text style={styles.autorEmail}>{aviso.autor.email}</Text>
          </View>
          <View style={styles.autorBadge}>
            <Text style={styles.autorBadgeText}>
              {aviso.autor.perfil === 'admin' ? '👑' : '⭐'}
            </Text>
          </View>
        </View>

        {/* Conteúdo */}
        <View style={styles.conteudoCard}>
          <View style={styles.conteudoHeader}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.conteudoTitle}>Conteúdo</Text>
          </View>
          <Text style={styles.conteudo}>{aviso.conteudo}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  errorIcon: {
    fontSize: 64,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  btnBack: {
    padding: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btnAction: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  tipoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  tipoEmoji: {
    fontSize: 16,
  },
  tipoLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 32,
  },
  infoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  prioridadeIcon: {
    fontSize: 12,
  },
  autorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  autorAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autorAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  autorInfo: {
    flex: 1,
    gap: 2,
  },
  autorLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  autorNome: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  autorEmail: {
    fontSize: 12,
    color: colors.textMuted,
  },
  autorBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autorBadgeText: {
    fontSize: 16,
  },
  conteudoCard: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  conteudoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  conteudoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  conteudo: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});