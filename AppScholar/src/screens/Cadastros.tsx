// src/screens/Cadastros.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import type { Aluno, Curso, Disciplina, Professor, Turno } from '../types/school';
import { USE_API } from '../services/useApiFlag';
import { colors, shadows, spacing, borderRadius } from '../theme/colors';

import {
  listarAlunos as apiListarAlunos, criarAluno as apiCriarAluno,
  listarCursos as apiListarCursos, criarCurso as apiCriarCurso,
  listarProfessores as apiListarProfessores, criarProfessor as apiCriarProfessor,
  listarDisciplinas as apiListarDisciplinas, criarDisciplina as apiCriarDisciplina,
} from '../services/schoolService';
import axios from 'axios';
import { backend } from '../services/backend';

const KEY_ALUNOS = 'cad_alunos';
const KEY_CURSOS = 'cad_cursos';
const KEY_DISCIPLINAS = 'cad_disciplinas';
const KEY_PROFESSORES = 'cad_professores';

type Tab = 'aluno' | 'curso' | 'disciplina' | 'professor';

const TAB_CONFIG = {
  aluno: { icon: '👨‍🎓', label: 'Alunos' },
  curso: { icon: '📚', label: 'Cursos' },
  disciplina: { icon: '📝', label: 'Disciplinas' },
  professor: { icon: '👩‍🏫', label: 'Professores' },
};

export default function Cadastros() {
  const [tab, setTab] = useState<Tab>('aluno');
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // ALUNO
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [nomeAluno, setNomeAluno] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cursoAluno, setCursoAluno] = useState('');
  const [erroAluno, setErroAluno] = useState<string | null>(null);

  // CURSO
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [nomeCurso, setNomeCurso] = useState('');
  const [turno, setTurno] = useState<Turno>('noturno');
  const [erroCurso, setErroCurso] = useState<string | null>(null);

  // PROFESSOR
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [nomeProf, setNomeProf] = useState('');
  const [titulacao, setTitulacao] = useState('Mestre');
  const [tempoDocencia, setTempoDocencia] = useState('5 anos');
  const [erroProf, setErroProf] = useState<string | null>(null);

  // DISCIPLINA
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nomeDisc, setNomeDisc] = useState('');
  const [carga, setCarga] = useState('60');
  const [cursoId, setCursoId] = useState<string | undefined>(undefined);
  const [professorId, setProfessorId] = useState<string | undefined>(undefined);
  const [erroDisc, setErroDisc] = useState<string | null>(null);

  const cursoMap = useMemo(() => Object.fromEntries(cursos.map(c => [c.id, c.nome])), [cursos]);
  const profMap = useMemo(() => Object.fromEntries(professores.map(p => [p.id, p.nome])), [professores]);

  function fromAxiosError(e: any): string {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      const msg =
        (e.response?.data as any)?.message ||
        (e.response?.data as any)?.error ||
        e.message;
      return `Erro API${status ? ` (${status})` : ''}: ${msg}`;
    }
    return e?.message ?? 'Erro inesperado';
  }

  async function pingApi() {
    try {
      await backend.get('/health').catch(async () => {
        await backend.get('/alunos');
      });
      setApiOnline(true);
      setErroGeral(null);
    } catch (e) {
      setApiOnline(false);
      setErroGeral(fromAxiosError(e));
    }
  }

  useEffect(() => {
    (async () => {
      if (USE_API) {
        await pingApi();
        try {
          const [a, c, d, p] = await Promise.all([
            apiListarAlunos(),
            apiListarCursos(),
            apiListarDisciplinas(),
            apiListarProfessores(),
          ]);
          setAlunos(a); setCursos(c); setDisciplinas(d); setProfessores(p);
        } catch (e) {
          setErroGeral(fromAxiosError(e));
        }
      } else {
        const [a, c, d, p] = await Promise.all([
          AsyncStorage.getItem(KEY_ALUNOS),
          AsyncStorage.getItem(KEY_CURSOS),
          AsyncStorage.getItem(KEY_DISCIPLINAS),
          AsyncStorage.getItem(KEY_PROFESSORES),
        ]);
        if (a) setAlunos(JSON.parse(a));
        if (c) setCursos(JSON.parse(c));
        if (d) setDisciplinas(JSON.parse(d));
        if (p) setProfessores(JSON.parse(p));
      }
    })();
  }, []);

  async function saveAlunos(next: Aluno[]) {
    setAlunos(next);
    await AsyncStorage.setItem(KEY_ALUNOS, JSON.stringify(next));
  }
  async function saveCursos(next: Curso[]) {
    setCursos(next);
    await AsyncStorage.setItem(KEY_CURSOS, JSON.stringify(next));
  }
  async function saveDisciplinas(next: Disciplina[]) {
    setDisciplinas(next);
    await AsyncStorage.setItem(KEY_DISCIPLINAS, JSON.stringify(next));
  }
  async function saveProfessores(next: Professor[]) {
    setProfessores(next);
    await AsyncStorage.setItem(KEY_PROFESSORES, JSON.stringify(next));
  }

  async function onAddAluno() {
    setErroAluno(null); setErroGeral(null);
    if (!nomeAluno.trim() || !emailAluno.includes('@') || !matricula.trim() || !cursoAluno.trim()) {
      setErroAluno('Informe nome, e-mail, matrícula e curso válidos.');
      return;
    }
    try {
      if (USE_API) {
        const novo = await apiCriarAluno({
          nome: nomeAluno.trim(),
          email: emailAluno.trim(),
          matricula: matricula.trim(),
          curso: cursoAluno.trim(),
        });
        setAlunos(prev => [...prev, novo]);
      } else {
        const novo: Aluno = {
          id: cryptoRandom(),
          nome: nomeAluno.trim(),
          email: emailAluno.trim(),
          matricula: matricula.trim(),
          curso: cursoAluno.trim(),
        };
        await saveAlunos([...alunos, novo]);
      }
      setNomeAluno(''); setEmailAluno(''); setMatricula(''); setCursoAluno('');
    } catch (e) {
      setErroGeral(fromAxiosError(e));
    }
  }

  async function onAddCurso() {
    setErroCurso(null); setErroGeral(null);
    if (!nomeCurso.trim()) {
      setErroCurso('Informe o nome do curso.');
      return;
    }
    try {
      if (USE_API) {
        const novo = await apiCriarCurso({ nome: nomeCurso.trim(), turno });
        setCursos(prev => [...prev, novo]);
      } else {
        const novo: Curso = { id: cryptoRandom(), nome: nomeCurso.trim(), turno };
        await saveCursos([...cursos, novo]);
      }
      setNomeCurso('');
    } catch (e) {
      setErroGeral(fromAxiosError(e));
    }
  }

  async function onAddProfessor() {
    setErroProf(null); setErroGeral(null);
    if (!nomeProf.trim() || !titulacao.trim() || !tempoDocencia.trim()) {
      setErroProf('Informe nome, titulação e tempo de docência.');
      return;
    }
    try {
      if (USE_API) {
        const novo = await apiCriarProfessor({
          nome: nomeProf.trim(),
          titulacao: titulacao.trim(),
          tempoDocencia: tempoDocencia.trim(),
        });
        setProfessores(prev => [...prev, novo]);
      } else {
        const novo: Professor = {
          id: cryptoRandom(),
          nome: nomeProf.trim(),
          titulacao: titulacao.trim(),
          tempoDocencia: tempoDocencia.trim(),
        };
        await saveProfessores([...professores, novo]);
      }
      setNomeProf(''); setTitulacao('Mestre'); setTempoDocencia('5 anos');
    } catch (e) {
      setErroGeral(fromAxiosError(e));
    }
  }

  async function onAddDisciplina() {
    setErroDisc(null); setErroGeral(null);
    const cargaNum = Number(carga);
    if (!nomeDisc.trim() || !isFinite(cargaNum) || cargaNum <= 0) {
      setErroDisc('Informe nome e carga horária (> 0).');
      return;
    }
    try {
      if (USE_API) {
        const novo = await apiCriarDisciplina({
          nome: nomeDisc.trim(),
          cargaHoraria: cargaNum,
          cursoId,
          professorId,
        });
        setDisciplinas(prev => [...prev, novo]);
      } else {
        const novo: Disciplina = {
          id: cryptoRandom(),
          nome: nomeDisc.trim(),
          cargaHoraria: cargaNum,
          cursoId,
          professorId,
        };
        await saveDisciplinas([...disciplinas, novo]);
      }
      setNomeDisc(''); setCarga('60'); setCursoId(undefined); setProfessorId(undefined);
    } catch (e) {
      setErroGeral(fromAxiosError(e));
    }
  }

  return (
    <View style={styles.container}>
      {/* Header com Status da API */}
      <View style={styles.header}>
        <Text style={styles.title}>Cadastros</Text>
        {USE_API && apiOnline !== null && (
          <View style={[styles.apiBadge, apiOnline ? styles.apiOnline : styles.apiOffline]}>
            <View style={[styles.apiDot, apiOnline ? styles.apiDotOnline : styles.apiDotOffline]} />
            <Text style={styles.apiText}>{apiOnline ? 'API Online' : 'API Offline'}</Text>
          </View>
        )}
      </View>

      {erroGeral && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{erroGeral}</Text>
        </View>
      )}

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabs}>
          {(Object.keys(TAB_CONFIG) as Tab[]).map((t) => (
            <TabButton
              key={t}
              icon={TAB_CONFIG[t].icon}
              label={TAB_CONFIG[t].label}
              active={tab === t}
              onPress={() => setTab(t)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Conteúdo da Tab */}
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'aluno' && (
          <View style={styles.section}>
            <FormCard title="Cadastrar Aluno" icon="👨‍🎓">
              <Input label="Nome" value={nomeAluno} onChangeText={setNomeAluno} placeholder="Nome completo" />
              <Input label="E-mail" value={emailAluno} onChangeText={setEmailAluno} placeholder="email@exemplo.com" keyboardType="email-address" />
              <Input label="Matrícula" value={matricula} onChangeText={setMatricula} placeholder="Ex: 2024001" />
              <Input label="Curso" value={cursoAluno} onChangeText={setCursoAluno} placeholder="Nome do curso" />
              {erroAluno && <ErrorMessage text={erroAluno} />}
              <Button label="Adicionar Aluno" onPress={onAddAluno} />
            </FormCard>

            <ListCard title="Alunos Cadastrados" count={alunos.length}>
              {alunos.map((a) => (
                <ListItem key={a.id} text={`${a.nome} • ${a.email} • ${a.matricula} • ${a.curso}`} />
              ))}
            </ListCard>
          </View>
        )}

        {tab === 'curso' && (
          <View style={styles.section}>
            <FormCard title="Cadastrar Curso" icon="📚">
              <Input label="Nome do Curso" value={nomeCurso} onChangeText={setNomeCurso} placeholder="Ex: Engenharia" />
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Turno</Text>
                <Picker
                  selectedValue={turno}
                  onValueChange={(v) => setTurno(v)}
                  dropdownIconColor={colors.text}
                  style={styles.picker}
                >
                  <Picker.Item label="Matutino" value="matutino" />
                  <Picker.Item label="Vespertino" value="vespertino" />
                  <Picker.Item label="Noturno" value="noturno" />
                </Picker>
              </View>
              {erroCurso && <ErrorMessage text={erroCurso} />}
              <Button label="Adicionar Curso" onPress={onAddCurso} />
            </FormCard>

            <ListCard title="Cursos Cadastrados" count={cursos.length}>
              {cursos.map((c) => (
                <ListItem key={c.id} text={`${c.nome} • ${c.turno}`} />
              ))}
            </ListCard>
          </View>
        )}

        {tab === 'disciplina' && (
          <View style={styles.section}>
            <FormCard title="Cadastrar Disciplina" icon="📝">
              <Input label="Nome da Disciplina" value={nomeDisc} onChangeText={setNomeDisc} placeholder="Ex: Cálculo I" />
              <Input label="Carga Horária" value={carga} onChangeText={setCarga} placeholder="60" keyboardType="numeric" />
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Curso (opcional)</Text>
                <Picker selectedValue={cursoId} onValueChange={(v) => setCursoId(v)} dropdownIconColor={colors.text} style={styles.picker}>
                  <Picker.Item label="— nenhum —" value={undefined} />
                  {cursos.map(c => <Picker.Item key={c.id} label={c.nome} value={c.id} />)}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Professor (opcional)</Text>
                <Picker selectedValue={professorId} onValueChange={(v) => setProfessorId(v)} dropdownIconColor={colors.text} style={styles.picker}>
                  <Picker.Item label="— nenhum —" value={undefined} />
                  {professores.map(p => <Picker.Item key={p.id} label={p.nome} value={p.id} />)}
                </Picker>
              </View>
              {erroDisc && <ErrorMessage text={erroDisc} />}
              <Button label="Adicionar Disciplina" onPress={onAddDisciplina} />
            </FormCard>

            <ListCard title="Disciplinas Cadastradas" count={disciplinas.length}>
              {disciplinas.map((d) => (
                <ListItem
                  key={d.id}
                  text={`${d.nome} • ${d.cargaHoraria}h${d.cursoId ? ` • Curso: ${cursoMap[d.cursoId] ?? d.cursoId}` : ''}${d.professorId ? ` • Prof.: ${profMap[d.professorId] ?? d.professorId}` : ''}`}
                />
              ))}
            </ListCard>
          </View>
        )}

        {tab === 'professor' && (
          <View style={styles.section}>
            <FormCard title="Cadastrar Professor" icon="👩‍🏫">
              <Input label="Nome" value={nomeProf} onChangeText={setNomeProf} placeholder="Nome completo" />
              <Input label="Titulação" value={titulacao} onChangeText={setTitulacao} placeholder="Ex: Mestre, Doutor" />
              <Input label="Tempo de Docência" value={tempoDocencia} onChangeText={setTempoDocencia} placeholder="Ex: 5 anos" />
              {erroProf && <ErrorMessage text={erroProf} />}
              <Button label="Adicionar Professor" onPress={onAddProfessor} />
            </FormCard>

            <ListCard title="Professores Cadastrados" count={professores.length}>
              {professores.map((p) => (
                <ListItem key={p.id} text={`${p.nome} • ${p.titulacao} • ${p.tempoDocencia}`} />
              ))}
            </ListCard>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// Componentes auxiliares
function TabButton({ icon, label, active, onPress }: { icon: string; label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[tabStyles.button, active && tabStyles.buttonActive]}
      activeOpacity={0.7}
    >
      <Text style={tabStyles.icon}>{icon}</Text>
      <Text style={[tabStyles.label, active && tabStyles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const tabStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.medium,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.white,
  },
});

function FormCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={formStyles.card}>
      <View style={formStyles.header}>
        <Text style={formStyles.icon}>{icon}</Text>
        <Text style={formStyles.title}>{title}</Text>
      </View>
      <View style={formStyles.content}>{children}</View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    gap: spacing.md,
  },
});

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function ErrorMessage({ text }: { text: string }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTextInline}>{text}</Text>
    </View>
  );
}

function ListCard({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <View style={listStyles.card}>
      <View style={listStyles.header}>
        <Text style={listStyles.title}>{title}</Text>
        <View style={listStyles.badge}>
          <Text style={listStyles.badgeText}>{count}</Text>
        </View>
      </View>
      <View style={listStyles.content}>
        {count === 0 ? (
          <Text style={listStyles.empty}>Nenhum item cadastrado</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const listStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  badge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    gap: spacing.xs,
  },
  empty: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

function ListItem({ text }: { text: string }) {
  return (
    <View style={itemStyles.container}>
      <Text style={itemStyles.bullet}>•</Text>
      <Text style={itemStyles.text}>{text}</Text>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bullet: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
});

function cryptoRandom() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  apiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  apiOnline: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  apiOffline: {
    backgroundColor: colors.danger + '20',
    borderColor: colors.danger,
  },
  apiDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
  },
  apiDotOnline: {
    backgroundColor: colors.success,
  },
  apiDotOffline: {
    backgroundColor: colors.danger,
  },
  apiText: {
    fontSize: 11,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerLight + '15',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.dangerLight,
  },
  tabsScroll: {
    maxHeight: 60,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingVertical: spacing.md,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
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
  picker: {
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerLight + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorTextInline: {
    flex: 1,
    fontSize: 13,
    color: colors.dangerLight,
  },
});