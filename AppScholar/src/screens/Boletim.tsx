import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Disciplina, Nota, BoletimItem } from '../types/school';
import { calcularMedia, statusPorMedia } from '../utils/grades';
import { USE_API } from '../services/useApiFlag';
import { listarDisciplinas, listarNotas, salvarNotas as salvarNotasApi } from '../services/schoolService';
import { colors } from '../theme/colors';


const KEY_DISCIPLINAS = 'cad_disciplinas';
const KEY_NOTAS = 'boletim_notas';

export default function Boletim() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);

  useEffect(() => {
    (async () => {
      if (USE_API) {
        const [d, n] = await Promise.all([listarDisciplinas(), listarNotas()]);
        setDisciplinas(d);
        setNotas(n);
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
    if (USE_API) {
      await salvarNotasApi(notas);
    } else {
      await AsyncStorage.setItem(KEY_NOTAS, JSON.stringify(notas));
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boletim</Text>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        {boletim.length === 0 ? (
          <Text style={styles.muted}>Nenhuma disciplina cadastrada (cadastre em “Cadastros”).</Text>
        ) : (
          boletim.map(item => (
            <View key={item.disciplinaId} style={styles.card}>
              <Text style={styles.sub}>{item.disciplina}</Text>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>N1</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(item.n1 || '')}
                    onChangeText={(v) => atualizarNota(item.disciplinaId, 'n1', v)}
                    placeholder="0 a 10"
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>N2</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(item.n2 || '')}
                    onChangeText={(v) => atualizarNota(item.disciplinaId, 'n2', v)}
                    placeholder="0 a 10"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.media}>Média: {item.media.toFixed(1)}</Text>
                <StatusPill status={item.status} />
              </View>
            </View>
          ))
        )}

        {boletim.length > 0 && (
  <TouchableOpacity style={styles.btn} onPress={salvarNotas}>
    <Text style={styles.btnText}>Salvar notas</Text>
  </TouchableOpacity>
)}

      </ScrollView>
    </View>
  );
}

function StatusPill({ status }: { status: 'aprovado' | 'exame' | 'reprovado' }) {
  const map = { aprovado: '#28a745', exame: '#ffc107', reprovado: '#dc3545' } as const;
  return (
    <View style={[{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: map[status] }]}>
      <Text style={{ color: '#000', fontWeight: '700' }}>{status.toUpperCase()}</Text>
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
    marginBottom: 12,
    fontSize: 18,
  },

  muted: { color: colors.textMuted },

  card: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sub: { color: colors.text, fontWeight: '700' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  input: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 6,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: { color: colors.textMuted, marginBottom: 4 },

  media: { color: colors.text, fontWeight: '700' },

  btn: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: colors.primary,
  },

  btnText: { color: '#fff', fontWeight: '700' },
});
