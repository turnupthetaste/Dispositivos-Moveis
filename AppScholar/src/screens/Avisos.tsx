// src/screens/Avisos.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { listarAvisos, marcarComoLido, type Aviso } from '../services/avisosService';
import { useAuth } from '../hooks/useAuth';
import { useAvisos } from '../contexts/AvisosContext';
import { useToast } from '../components/Toast';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

type FiltroTipo = 'todos' | 'institucional' | 'lembrete' | 'comunicado';

export default function Avisos() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { decrementarNaoLidos, carregarNaoLidos } = useAvisos();
  const toast = useToast();
  
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [filtro, setFiltro] = useState<FiltroTipo>('todos');
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const podeGerenciar = user?.perfil === 'admin' || user?.perfil === 'manager';

  const carregarAvisos = useCallback(async () => {
    try {
      const tipo = filtro === 'todos' ? undefined : filtro;
      const dados = await listarAvisos(tipo);
      setAvisos(dados);
    } catch (error: any) {
      toast.error('Erro ao carregar avisos: ' + (error?.message ?? 'Erro desconhecido'));
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregarAvisos();
  }, [carregarAvisos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarAvisos();
    carregarNaoLidos(); // ✅ Atualizar contador também
  }, [carregarAvisos]);

  const handleMarcarLido = async (avisoId: string) => {
    try {
      await marcarComoLido(avisoId);
      setAvisos(prev =>
        prev.map(a => (a.id === avisoId ? { ...a, lido: true, lidoEm: new Date().toISOString() } : a))
      );
      decrementarNaoLidos(); // ✅ Atualizar contador
      toast.success('Marcado como lido');
    } catch (error: any) {
      toast.error('Erro ao marcar como lido');
    }
  };

  const avisosNaoLidos = avisos.filter(a => !a.lido).length;

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando avisos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>Avisos</Text>
            {avisosNaoLidos > 0 && (
              <Text style={styles.subtitle}>{avisosNaoLidos} não lidos</Text>
            )}
          </View>
        </View>
        
        {podeGerenciar && (
          <TouchableOpacity
            style={styles.btnNovo}
            onPress={() => (navigation as any).navigate('NovoAviso')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.btnNovoText}>Novo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosScroll}>
        <View style={styles.filtros}>
          <FiltroButton
            label="Todos"
            active={filtro === 'todos'}
            count={avisos.length}
            onPress={() => setFiltro('todos')}
          />
          <FiltroButton
            label="Institucional"
            active={filtro === 'institucional'}
            count={avisos.filter(a => a.tipo === 'institucional').length}
            onPress={() => setFiltro('institucional')}
          />
          <FiltroButton
            label="Lembrete"
            active={filtro === 'lembrete'}
            count={avisos.filter(a => a.tipo === 'lembrete').length}
            onPress={() => setFiltro('lembrete')}
          />
          <FiltroButton
            label="Comunicado"
            active={filtro === 'comunicado'}
            count={avisos.filter(a => a.tipo === 'comunicado').length}
            onPress={() => setFiltro('comunicado')}
          />
        </View>
      </ScrollView>

      {/* Lista de Avisos */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {avisos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>Nenhum aviso</Text>
            <Text style={styles.emptyText}>
              {filtro === 'todos'
                ? 'Não há avisos publicados no momento'
                : `Não há avisos do tipo "${filtro}"`}
            </Text>
          </View>
        ) : (
          <View style={styles.avisosList}>
            {avisos.map(aviso => (
              <AvisoCard
                key={aviso.id}
                aviso={aviso}
                onPress={() => (navigation as any).navigate('DetalheAviso', { id: aviso.id })}
                onMarcarLido={handleMarcarLido}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Componente de Filtro
function FiltroButton({
  label,
  active,
  count,
  onPress,
}: {
  label: string;
  active: boolean;
  count: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filtroBtn, active && styles.filtroBtnActive]}
      activeOpacity={0.7}
    >
      <Text style={[styles.filtroLabel, active && styles.filtroLabelActive]}>{label}</Text>
      <View style={[styles.filtroBadge, active && styles.filtroBadgeActive]}>
        <Text style={[styles.filtroBadgeText, active && styles.filtroBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Componente de Card de Aviso
function AvisoCard({
  aviso,
  onPress,
  onMarcarLido,
}: {
  aviso: Aviso;
  onPress: () => void;
  onMarcarLido: (id: string) => void;
}) {
  const prioridadeConfig = {
    urgente: { color: colors.danger, icon: '🔴', label: 'Urgente' },
    alta: { color: colors.warning, icon: '🟠', label: 'Alta' },
    normal: { color: colors.info, icon: '🔵', label: 'Normal' },
    baixa: { color: colors.textMuted, icon: '⚪', label: 'Baixa' },
  };

  const tipoConfig = {
    institucional: { emoji: '🏛️', label: 'Institucional' },
    lembrete: { emoji: '⏰', label: 'Lembrete' },
    comunicado: { emoji: '📢', label: 'Comunicado' },
  };

  const prioridade = prioridadeConfig[aviso.prioridade];
  const tipo = tipoConfig[aviso.tipo];

  const dataPublicacao = new Date(aviso.publicadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={[styles.avisoCard, !aviso.lido && styles.avisoCardNaoLido]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Badge de não lido */}
      {!aviso.lido && <View style={styles.badgeNaoLido} />}

      {/* Header do Card */}
      <View style={styles.avisoHeader}>
        <View style={styles.avisoTags}>
          <View style={styles.tipoTag}>
            <Text style={styles.tipoEmoji}>{tipo.emoji}</Text>
            <Text style={styles.tipoLabel}>{tipo.label}</Text>
          </View>
          <View style={[styles.prioridadeTag, { borderColor: prioridade.color }]}>
            <Text style={styles.prioridadeIcon}>{prioridade.icon}</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <Text style={styles.avisoTitulo} numberOfLines={2}>
        {aviso.titulo}
      </Text>
      <Text style={styles.avisoConteudo} numberOfLines={3}>
        {aviso.conteudo}
      </Text>

      {/* Footer */}
      <View style={styles.avisoFooter}>
        <View style={styles.autorInfo}>
          <Ionicons name="person-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.autorNome}>{aviso.autor.nome}</Text>
        </View>
        <Text style={styles.avisoData}>{dataPublicacao}</Text>
      </View>

      {/* Botão de marcar como lido */}
      {!aviso.lido && (
        <TouchableOpacity
          style={styles.btnMarcarLido}
          onPress={(e) => {
            e.stopPropagation();
            onMarcarLido(aviso.id);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
          <Text style={styles.btnMarcarLidoText}>Marcar como lido</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  btnNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  btnNovoText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  filtrosScroll: {
    maxHeight: 60,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtros: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtroBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filtroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filtroLabelActive: {
    color: colors.white,
  },
  filtroBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  filtroBadgeActive: {
    backgroundColor: colors.white + '30',
  },
  filtroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  filtroBadgeTextActive: {
    color: colors.white,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avisosList: {
    gap: spacing.md,
  },
  avisoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
    position: 'relative',
  },
  avisoCardNaoLido: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  badgeNaoLido: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  avisoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avisoTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundAlt,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  tipoEmoji: {
    fontSize: 12,
  },
  tipoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  prioridadeTag: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  prioridadeIcon: {
    fontSize: 10,
  },
  avisoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  avisoConteudo: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  avisoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  autorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  autorNome: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  avisoData: {
    fontSize: 11,
    color: colors.textMuted,
  },
  btnMarcarLido: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.success + '15',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  btnMarcarLidoText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});