// src/screens/NovoAviso.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import {
  criarAviso,
  atualizarAviso,
  buscarAviso,
  type CriarAvisoDTO,
} from '../services/avisosService';
import { useToast } from '../components/Toast';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = NativeStackScreenProps<any, 'NovoAviso' | 'EditarAviso'>;

export default function NovoAviso({ route, navigation }: Props) {
  const isEdicao = route.name === 'EditarAviso';
  const avisoId = route.params?.id;
  const toast = useToast();

  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tipo, setTipo] = useState<'institucional' | 'lembrete' | 'comunicado'>('comunicado');
  const [prioridade, setPrioridade] = useState<'baixa' | 'normal' | 'alta' | 'urgente'>('normal');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(isEdicao);

  useEffect(() => {
    if (isEdicao && avisoId) {
      carregarAviso();
    }
  }, [isEdicao, avisoId]);

  async function carregarAviso() {
    try {
      const aviso = await buscarAviso(avisoId);
      setTitulo(aviso.titulo);
      setConteudo(aviso.conteudo);
      setTipo(aviso.tipo);
      setPrioridade(aviso.prioridade);
    } catch (error: any) {
      toast.error('Erro ao carregar aviso');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar() {
    // Validações
    if (!titulo.trim() || titulo.trim().length < 5) {
      toast.warning('Título deve ter no mínimo 5 caracteres');
      return;
    }

    if (!conteudo.trim() || conteudo.trim().length < 10) {
      toast.warning('Conteúdo deve ter no mínimo 10 caracteres');
      return;
    }

    setSalvando(true);
    try {
      const dto: CriarAvisoDTO = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        tipo,
        prioridade,
      };

      if (isEdicao) {
        await atualizarAviso(avisoId, dto);
        toast.success('Aviso atualizado com sucesso!');
      } else {
        await criarAviso(dto);
        toast.success('Aviso publicado com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      toast.error(
        `Erro ao ${isEdicao ? 'atualizar' : 'criar'} aviso: ` +
          (error?.message ?? 'Erro desconhecido')
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando aviso...</Text>
      </View>
    );
  }

  const caracteresTitulo = titulo.length;
  const caracteresConteudo = conteudo.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnBack}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdicao ? 'Editar Aviso' : 'Novo Aviso'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de Informações */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Preencha todos os campos para {isEdicao ? 'atualizar' : 'publicar'} o aviso
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Título */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Título *</Text>
              <Text style={[styles.counter, caracteresTitulo < 5 && styles.counterError]}>
                {caracteresTitulo} / 100
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título do aviso"
              placeholderTextColor={colors.textMuted}
              maxLength={100}
            />
          </View>

          {/* Tipo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                onValueChange={(v) => setTipo(v)}
                style={styles.picker}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="📢 Comunicado" value="comunicado" />
                <Picker.Item label="🏛️ Institucional" value="institucional" />
                <Picker.Item label="⏰ Lembrete" value="lembrete" />
              </Picker>
            </View>
          </View>

          {/* Prioridade */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prioridade *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={prioridade}
                onValueChange={(v) => setPrioridade(v)}
                style={styles.picker}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="⚪ Baixa" value="baixa" />
                <Picker.Item label="🔵 Normal" value="normal" />
                <Picker.Item label="🟠 Alta" value="alta" />
                <Picker.Item label="🔴 Urgente" value="urgente" />
              </Picker>
            </View>
          </View>

          {/* Conteúdo */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Conteúdo *</Text>
              <Text style={[styles.counter, caracteresConteudo < 10 && styles.counterError]}>
                {caracteresConteudo} / 1000
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={conteudo}
              onChangeText={setConteudo}
              placeholder="Digite o conteúdo do aviso..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={8}
              maxLength={1000}
              textAlignVertical="top"
            />
          </View>

          {/* Preview */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Ionicons name="eye-outline" size={18} color={colors.primary} />
              <Text style={styles.previewTitle}>Preview</Text>
            </View>
            <View style={styles.previewContent}>
              <Text style={styles.previewTitulo} numberOfLines={2}>
                {titulo || 'Título do aviso'}
              </Text>
              <Text style={styles.previewConteudo} numberOfLines={3}>
                {conteudo || 'Conteúdo do aviso aparecerá aqui...'}
              </Text>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => navigation.goBack()}
              disabled={salvando}
              activeOpacity={0.8}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSalvar, salvando && styles.btnSalvarDisabled]}
              onPress={handleSalvar}
              disabled={salvando}
              activeOpacity={0.8}
            >
              {salvando ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons
                    name={isEdicao ? 'checkmark-circle' : 'send'}
                    size={18}
                    color={colors.white}
                  />
                  <Text style={styles.btnSalvarText}>
                    {isEdicao ? 'Atualizar' : 'Publicar'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.info + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  counter: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  counterError: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.inputBg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  textArea: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  pickerContainer: {
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
  },
  previewCard: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  previewContent: {
    gap: spacing.sm,
  },
  previewTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  previewConteudo: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnCancelarText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  btnSalvar: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  btnSalvarDisabled: {
    opacity: 0.6,
  },
  btnSalvarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});