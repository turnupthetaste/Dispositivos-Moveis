import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Sete() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [saida, setSaida] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <TextInput
          placeholder="E-mail"
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
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
          maxLength={8}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#f0ad4e' }]} onPress={() => setSaida(`${email} - ${senha}`)}>
            <Text style={styles.btnText}>Logar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#0275d8' }]} onPress={() => {}}>
            <Text style={styles.btnText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
        {!!saida && <Text style={{ color: '#fff', marginTop: 8 }}>{saida}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  card: { width: '90%', maxWidth: 320, gap: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 6 },
  btn: { padding: 12, borderRadius: 6, alignItems: 'center', flex: 1 },
  btnText: { color: '#fff', fontWeight: '700' },
});
