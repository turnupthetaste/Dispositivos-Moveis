// src/screens/Cadastros.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import type { Aluno, Curso, Disciplina, Professor, Turno } from '../types/school';
import { USE_API } from '../services/useApiFlag';
import { colors } from '../theme/colors';

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

  // PING da API (tenta /health, senão cai para /alunos)
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

  // carregar dados
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

  // helpers persistência local
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

  // SUBMITS
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

  const cursoMap = useMemo(() => Object.fromEntries(cursos.map(c => [c.id, c.nome])), [cursos]);
  const profMap  = useMemo(() => Object.fromEntries(professores.map(p => [p.id, p.nome])), [professores]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastros</Text>

      {USE_API && (
        <Text style={[styles.badge, apiOnline ? styles.ok : styles.fail]}>
          API: {apiOnline === null ? 'verificando...' : apiOnline ? 'ONLINE' : 'OFFLINE'}
        </Text>
      )}
      {!!erroGeral && <Text style={styles.errCenter}>{erroGeral}</Text>}

      <View style={styles.tabs}>
        <TabBtn label="Aluno" active={tab === 'aluno'} onPress={() => setTab('aluno')} />
        <TabBtn label="Curso" active={tab === 'curso'} onPress={() => setTab('curso')} />
        <TabBtn label="Disciplina" active={tab === 'disciplina'} onPress={() => setTab('disciplina')} />
        <TabBtn label="Professor" active={tab === 'professor'} onPress={() => setTab('professor')} />
      </View>

      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 40 }}>
        {tab === 'aluno' && (
          <View style={styles.card}>
            <Text style={styles.sub}>Cadastrar Aluno</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={colors.textMuted}
              value={nomeAluno}
              onChangeText={setNomeAluno}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAluno}
              onChangeText={setEmailAluno}
            />
            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              placeholderTextColor={colors.textMuted}
              value={matricula}
              onChangeText={setMatricula}
            />
            <TextInput
              style={styles.input}
              placeholder="Curso"
              placeholderTextColor={colors.textMuted}
              value={cursoAluno}
              onChangeText={setCursoAluno}
            />
            {!!erroAluno && <Text style={styles.err}>{erroAluno}</Text>}
            <TouchableOpacity style={styles.btn} onPress={onAddAluno}>
              <Text style={styles.btnText}>Adicionar aluno</Text>
            </TouchableOpacity>

            <Text style={styles.listTitle}>Alunos cadastrados</Text>
            {alunos.length === 0 ? (
              <Text style={styles.muted}>Nenhum aluno.</Text>
            ) : alunos.map(a => (
              <Text key={a.id} style={styles.item}>
                • {a.nome} — {a.email} — {a.matricula} — {a.curso}
              </Text>
            ))}
          </View>
        )}

        {tab === 'curso' && (
          <View style={styles.card}>
            <Text style={styles.sub}>Cadastrar Curso</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do curso"
              placeholderTextColor={colors.textMuted}
              value={nomeCurso}
              onChangeText={setNomeCurso}
            />
            <Text style={{ color: colors.textMuted }}>Turno</Text>
            <Picker
              selectedValue={turno}
              onValueChange={(v) => setTurno(v)}
              dropdownIconColor={colors.text}
              style={{ backgroundColor: colors.inputBg, borderRadius: 6 }}
            >
              <Picker.Item label="Matutino" value="matutino" />
              <Picker.Item label="Vespertino" value="vespertino" />
              <Picker.Item label="Noturno" value="noturno" />
            </Picker>
            {!!erroCurso && <Text style={styles.err}>{erroCurso}</Text>}
            <TouchableOpacity style={styles.btn} onPress={onAddCurso}>
              <Text style={styles.btnText}>Adicionar curso</Text>
            </TouchableOpacity>

            <Text style={styles.listTitle}>Cursos cadastrados</Text>
            {cursos.length === 0 ? (
              <Text style={styles.muted}>Nenhum curso.</Text>
            ) : cursos.map(c => (
              <Text key={c.id} style={styles.item}>
                • {c.nome} — {c.turno}
              </Text>
            ))}
          </View>
        )}

        {tab === 'disciplina' && (
          <View style={styles.card}>
            <Text style={styles.sub}>Cadastrar Disciplina</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da disciplina"
              placeholderTextColor={colors.textMuted}
              value={nomeDisc}
              onChangeText={setNomeDisc}
            />
            <TextInput
              style={styles.input}
              placeholder="Carga horária"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={carga}
              onChangeText={setCarga}
            />

            <Text style={{ color: colors.textMuted }}>Curso (opcional)</Text>
            <Picker
              selectedValue={cursoId}
              onValueChange={(v) => setCursoId(v)}
              dropdownIconColor={colors.text}
              style={{ backgroundColor: colors.inputBg, borderRadius: 6 }}
            >
              <Picker.Item label="— nenhum —" value={undefined} />
              {cursos.map(c => <Picker.Item key={c.id} label={c.nome} value={c.id} />)}
            </Picker>

            <Text style={{ color: colors.textMuted }}>Professor (opcional)</Text>
            <Picker
              selectedValue={professorId}
              onValueChange={(v) => setProfessorId(v)}
              dropdownIconColor={colors.text}
              style={{ backgroundColor: colors.inputBg, borderRadius: 6 }}
            >
              <Picker.Item label="— nenhum —" value={undefined} />
              {professores.map(p => <Picker.Item key={p.id} label={p.nome} value={p.id} />)}
            </Picker>

            {!!erroDisc && <Text style={styles.err}>{erroDisc}</Text>}
            <TouchableOpacity style={styles.btn} onPress={onAddDisciplina}>
              <Text style={styles.btnText}>Adicionar disciplina</Text>
            </TouchableOpacity>

            <Text style={styles.listTitle}>Disciplinas cadastradas</Text>
            {disciplinas.length === 0 ? (
              <Text style={styles.muted}>Nenhuma disciplina.</Text>
            ) : disciplinas.map(d => (
              <Text key={d.id} style={styles.item}>
                • {d.nome} — {d.cargaHoraria}h
                {d.cursoId ? ` — Curso: ${cursoMap[d.cursoId] ?? d.cursoId}` : ''}
                {d.professorId ? ` — Prof.: ${profMap[d.professorId] ?? d.professorId}` : ''}
              </Text>
            ))}
          </View>
        )}

        {tab === 'professor' && (
          <View style={styles.card}>
            <Text style={styles.sub}>Cadastrar Professor</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={colors.textMuted}
              value={nomeProf}
              onChangeText={setNomeProf}
            />
            <TextInput
              style={styles.input}
              placeholder="Titulação (ex.: Mestre)"
              placeholderTextColor={colors.textMuted}
              value={titulacao}
              onChangeText={setTitulacao}
            />
            <TextInput
              style={styles.input}
              placeholder="Tempo de docência (ex.: 5 anos)"
              placeholderTextColor={colors.textMuted}
              value={tempoDocencia}
              onChangeText={setTempoDocencia}
            />
            {!!erroProf && <Text style={styles.err}>{erroProf}</Text>}
            <TouchableOpacity style={styles.btn} onPress={onAddProfessor}>
              <Text style={styles.btnText}>Adicionar professor</Text>
            </TouchableOpacity>

            <Text style={styles.listTitle}>Professores cadastrados</Text>
            {professores.length === 0 ? (
              <Text style={styles.muted}>Nenhum professor.</Text>
            ) : professores.map(p => (
              <Text key={p.id} style={styles.item}>
                • {p.nome} — {p.titulacao} — {p.tempoDocencia}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { color: colors.accent, fontWeight: '700', marginBottom: 8, fontSize: 18 },

  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
    color: '#000',
    fontWeight: '700',
  },
  ok: { backgroundColor: colors.accent },
  fail: { backgroundColor: '#ffc107' },

  tabs: { flexDirection: 'row', gap: 8, marginBottom: 10 },

  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.card,
  },
  tabBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  tabBtnText: { color: colors.textMuted },
  tabBtnTextActive: { color: colors.text, fontWeight: '700' },

  card: {
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sub: { color: colors.text, fontWeight: '700' },

  input: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 6,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  btn: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  btnText: { color: '#fff', fontWeight: '700' },

  listTitle: {
    color: colors.accent,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '700',
  },

  item: { color: colors.text },
  muted: { color: colors.textMuted },

  err: { color: colors.danger },
  errCenter: { color: colors.danger, textAlign: 'center', marginBottom: 8 },
});
