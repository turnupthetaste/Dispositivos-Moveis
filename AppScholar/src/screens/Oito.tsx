import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Oito() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [saida, setSaida] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.frame}>
        <Text style={styles.title}>CADASTRO</Text>
        <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input}
          autoCapitalize="none" autoComplete="email" autoCorrect={false} keyboardType="email-address"/>
        <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry maxLength={8}/>
        <TextInput placeholder="Confirmação da senha" value={conf} onChangeText={setConf} style={styles.input} secureTextEntry maxLength={8}/>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#0275d8' }]} onPress={() => setSaida(`${email} - ${senha} - ${conf}`)}>
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#f0ad4e' }]} onPress={() => {}}>
            <Text style={styles.btnText}>Logar</Text>
          </TouchableOpacity>
        </View>
        {!!saida && <Text style={{ color: '#fff', marginTop: 8 }}>{saida}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  // “moldura” centralizada, largura máxima 270 (p. 6)
  frame: { width: '90%', maxWidth: 270, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, gap: 10 },
  title: { color: '#9acd32', alignSelf: 'center', marginBottom: 4, fontWeight: '700' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 6 },
  btn: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
