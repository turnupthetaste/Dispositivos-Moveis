// src/screens/Boletim.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Disciplina, Nota, BoletimItem } from '../types/school';
import { calcularMedia, statusPorMedia } from '../utils/grades';
import { USE_API } from '../services/useApiFlag';
import { listarDisciplinas, listarNotas, salvarNotas as salvarNotasApi } from '../services/schoolService';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

const KEY_DISCIPLINAS = 'cad_disciplinas';
const KEY_NOTAS = 'boletim_notas';

export default function Boletim() {
  const { user } = useAuth();
  const toast = useToast();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      if (USE_API) {
        try {
          const [d, n] = await Promise.all([listarDisciplinas(), listarNotas()]);
          setDisciplinas(d);
          setNotas(n);
        } catch (error: any) {
          toast.error('Erro ao carregar dados: ' + (error?.message ?? 'Erro desconhecido'));
        }
      } else {
        const [d, n] = await Promise.all([
          AsyncStorage.getItem(KEY_DISCIPLINAS),
          AsyncStorage.getItem(KEY_NOTAS),
        ]);
        if (d) setDisciplinas(JSON.parse(d));
        if (n) setNotas(JSON.parse(n));
      }
    })();
  }, []);

  function atualizarNota(disciplinaId: string, campo: 'n1' | 'n2', valorStr: string) {
    const valor = Number(valorStr.replace(',', '.'));
    
    // ✅ Validação: notas entre 0 e 10
    if (isFinite(valor) && (valor < 0 || valor > 10)) {
      toast.warning('Nota deve estar entre 0 e 10');
      return;
    }

    const current = notas.find(x => x.disciplinaId === disciplinaId);
    let next: Nota[];
    if (!current) {
      next = [...notas, { disciplinaId, n1: campo === 'n1' ? valor : 0, n2: campo === 'n2' ? valor : 0 }];
    } else {
      next = notas.map(x =>
        x.disciplinaId === disciplinaId ? { ...x, [campo]: isFinite(valor) ? valor : 0 } : x
      );
    }
    setNotas(next);
  }

  async function salvarNotas() {
    setSalvando(true);
    try {
      // ✅ Validar todas as notas antes de salvar
      for (const nota of notas) {
        if (nota.n1 < 0 || nota.n1 > 10 || nota.n2 < 0 || nota.n2 > 10) {
          toast.error('Todas as notas devem estar entre 0 e 10');
          setSalvando(false);
          return;
        }
      }

      if (USE_API) {
        await salvarNotasApi(notas);
      } else {
        await AsyncStorage.setItem(KEY_NOTAS, JSON.stringify(notas));
      }
      
      // ✅ Feedback de sucesso
      toast.success('Notas salvas com sucesso!');
    } catch (error: any) {
      // ✅ Feedback de erro
      toast.error('Erro ao salvar notas: ' + (error?.message ?? 'Erro desconhecido'));
    } finally {
      setSalvando(false);
    }
  }

  const boletim: BoletimItem[] = useMemo(() => {
    return disciplinas.map(d => {
      const n = notas.find(x => x.disciplinaId === d.id) || { n1: 0, n2: 0 };
      const media = calcularMedia(n.n1, n.n2);
      const status = statusPorMedia(media);
      return {
        disciplinaId: d.id,
        disciplina: d.nome,
        n1: n.n1,
        n2: n.n2,
        media,
        status,
      };
    });
  }, [disciplinas, notas]);

  const mediaGeral = useMemo(() => {
    if (boletim.length === 0) return 0;
    const soma = boletim.reduce((acc, item) => acc + item.media, 0);
    return soma / boletim.length;
  }, [boletim]);

  const aprovados = boletim.filter(i => i.status === 'aprovado').length;
  const emExame = boletim.filter(i => i.status === 'exame').length;
  const reprovados = boletim.filter(i => i.status === 'reprovado').length;

  // ✅ Mostrar mensagem específica para usuários do tipo 'user'
  const isUser = user?.perfil === 'user';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header com estatísticas */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.iconText}>📊</Text>
          </View>
          <Text style={styles.title}>
            {isUser ? 'Meu Boletim' : 'Boletim Escolar'}
          </Text>
          {isUser && (
            <Text style={styles.subtitle}>
              Visualizando suas notas
            </Text>
          )}
          {boletim.length > 0 && (
            <View style={styles.statsContainer}>
              <StatCard label="Média Geral" value={mediaGeral.toFixed(1)} color={colors.primary} />
              <StatCard label="Aprovado" value={aprovados.toString()} color={colors.gradeExcellent} small />
              <StatCard label="Exame" value={emExame.toString()} color={colors.gradeWarning} small />
              <StatCard label="Reprovado" value={reprovados.toString()} color={colors.gradeFail} small />
            </View>
          )}
        </View>

        {/* Lista de disciplinas */}
        {boletim.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>Nenhuma disciplina cadastrada</Text>
            <Text style={styles.emptyText}>
              {isUser 
                ? 'Entre em contato com a administração para cadastrar disciplinas'
                : 'Cadastre disciplinas em "Cadastros" para começar a lançar notas'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.disciplinasList}>
            {boletim.map((item, index) => (
              <DisciplinaCard
                key={item.disciplinaId}
                item={item}
                index={index}
                onUpdateNota={atualizarNota}
                readOnly={isUser} // ✅ User só visualiza, não edita
              />
            ))}
          </View>
        )}

        {boletim.length > 0 && !isUser && (
          <TouchableOpacity 
            style={[styles.btnSave, salvando && styles.btnSaveDisabled]} 
            onPress={salvarNotas}
            disabled={salvando}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSaveIcon}>💾</Text>
            <Text style={styles.btnSaveText}>
              {salvando ? 'Salvando...' : 'Salvar Notas'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// Componente de Card de Estatística
function StatCard({
  label,
  value,
  color,
  small = false,
}: {
  label: string;
  value: string;
  color: string;
  small?: boolean;
}) {
  return (
    <View style={[statStyles.card, small && statStyles.cardSmall]}>
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  cardSmall: {
    padding: spacing.md,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Componente de Card de Disciplina
function DisciplinaCard({
  item,
  index,
  onUpdateNota,
  readOnly = false,
}: {
  item: BoletimItem;
  index: number;
  onUpdateNota: (id: string, campo: 'n1' | 'n2', valor: string) => void;
  readOnly?: boolean;
}) {
  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.header}>
        <View style={cardStyles.headerLeft}>
          <Text style={cardStyles.number}>{String(index + 1).padStart(2, '0')}</Text>
          <Text style={cardStyles.disciplina}>{item.disciplina}</Text>
        </View>
        <StatusPill status={item.status} />
      </View>

      <View style={cardStyles.notasContainer}>
        <View style={cardStyles.notaGroup}>
          <Text style={cardStyles.notaLabel}>N1</Text>
          <TextInput
            style={[cardStyles.notaInput, readOnly && cardStyles.notaInputReadOnly]}
            keyboardType="numeric"
            value={String(item.n1 || '')}
            onChangeText={(v) => onUpdateNota(item.disciplinaId, 'n1', v)}
            placeholder="0.0"
            placeholderTextColor={colors.textDim}
            maxLength={4}
            editable={!readOnly}
          />
        </View>

        <Text style={cardStyles.plus}>+</Text>

        <View style={cardStyles.notaGroup}>
          <Text style={cardStyles.notaLabel}>N2</Text>
          <TextInput
            style={[cardStyles.notaInput, readOnly && cardStyles.notaInputReadOnly]}
            keyboardType="numeric"
            value={String(item.n2 || '')}
            onChangeText={(v) => onUpdateNota(item.disciplinaId, 'n2', v)}
            placeholder="0.0"
            placeholderTextColor={colors.textDim}
            maxLength={4}
            editable={!readOnly}
          />
        </View>

        <Text style={cardStyles.equals}>=</Text>

        <View style={cardStyles.mediaContainer}>
          <Text style={cardStyles.mediaLabel}>Média</Text>
          <View style={cardStyles.mediaBox}>
            <Text style={cardStyles.mediaValue}>{item.media.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  number: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  disciplina: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  notasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notaGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  notaLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    textAlign: 'center',
  },
  notaInput: {
    backgroundColor: colors.inputBg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  notaInputReadOnly: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    opacity: 0.7,
  },
  plus: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 16,
  },
  equals: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 16,
  },
  mediaContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  mediaLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    textAlign: 'center',
  },
  mediaBox: {
    backgroundColor: colors.primary + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  mediaValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});

// Componente de Status Pill
function StatusPill({ status }: { status: 'aprovado' | 'exame' | 'reprovado' }) {
  const config = {
    aprovado: {
      bg: colors.gradeExcellent,
      text: 'Aprovado',
      icon: '✓',
    },
    exame: {
      bg: colors.gradeWarning,
      text: 'Exame',
      icon: '⚠',
    },
    reprovado: {
      bg: colors.gradeFail,
      text: 'Reprovado',
      icon: '✗',
    },
  };

  const { bg, text, icon } = config[status];

  return (
    <View style={[pillStyles.container, { backgroundColor: bg + '20', borderColor: bg }]}>
      <Text style={pillStyles.icon}>{icon}</Text>
      <Text style={[pillStyles.text, { color: bg }]}>{text}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  icon: {
    fontSize: 12,
  },
  text: {
    fontSize: 12,
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
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  disciplinasList: {
    gap: spacing.md,
  },
  btnSave: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.medium,
  },
  btnSaveDisabled: {
    opacity: 0.6,
  },
  btnSaveIcon: {
    fontSize: 20,
  },
  btnSaveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
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