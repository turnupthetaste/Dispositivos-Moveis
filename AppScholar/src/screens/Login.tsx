// src/screens/Login.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const { login, carregando } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  async function onLogin() {
    setErro(null);
    try {
      if (!email || senha.length < 4) {
        setErro('Preencha e-mail e senha (mín. 4 caracteres).');
        return;
      }
      await login({ email, senha });
    } catch (e: any) {
      setErro(e?.message ?? 'Falha no login');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>LOGIN</Text>
        <Text style={styles.hint}>
          Dica de perfil: use email terminando com{' '}
          <Text style={styles.bold}>@admin.com</Text> (admin) ou{' '}
          <Text style={styles.bold}>@gestor.com</Text> (manager). Ex.: maria@admin.com
        </Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
          maxLength={20}
        />

        {!!erro && <Text style={styles.err}>{erro}</Text>}

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={onLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Registro')}
          disabled={carregando}
        >
          <Text style={styles.btnText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 320,
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.accent,
    alignSelf: 'center',
    marginBottom: 4,
    fontWeight: '700',
    fontSize: 20,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 6,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnPrimary: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  err: {
    color: colors.danger,
    textAlign: 'center',
  },
});
