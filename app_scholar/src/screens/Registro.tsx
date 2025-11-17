import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Registro'>;

export default function Registro({ navigation }: Props) {
  const { register, carregando } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function onRegister() {
    setErro(null);
    try {
      if (!email || senha.length < 4 || senha !== conf) {
        setErro('Verifique e-mail, senha (mín. 4) e confirmação.');
        return;
      }
      await register({ email, senha });
    } catch (e: any) {
      setErro(e?.message ?? 'Falha no registro');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>REGISTRO</Text>
        <Text style={styles.hint}>
          Para testar perfis, use domínios como <Text style={styles.bold}>@admin.com</Text> (admin) ou{" "}
          <Text style={styles.bold}>@gestor.com</Text> (manager).
        </Text>

        <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input}
          autoCapitalize="none" autoComplete="email" autoCorrect={false} keyboardType="email-address" />
        <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry maxLength={20} />
        <TextInput placeholder="Confirme a senha" value={conf} onChangeText={setConf} style={styles.input} secureTextEntry maxLength={20} />

        {!!erro && <Text style={styles.err}>{erro}</Text>}

        <TouchableOpacity style={[styles.btn, { backgroundColor: '#28a745' }]} onPress={onRegister} disabled={carregando}>
          {carregando ? <ActivityIndicator /> : <Text style={styles.btnText}>Criar conta</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: '#6c757d' }]} onPress={() => navigation.navigate('Login')} disabled={carregando}>
          <Text style={styles.btnText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  card: { width: '90%', maxWidth: 320, gap: 12, backgroundColor: '#222', padding: 16, borderRadius: 8 },
  title: { color: '#9acd32', alignSelf: 'center', marginBottom: 4, fontWeight: '700' },
  hint: { color: '#bbb', fontSize: 12, marginBottom: 4, textAlign: 'center' },
  bold: { fontWeight: '700', color: '#ddd' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 6 },
  btn: { padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  err: { color: '#ff6b6b', textAlign: 'center' },
});
