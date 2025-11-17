import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Dez() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [perfil, setPerfil] = useState<'admin'|'manager'|'user'>('manager');
  const [logado, setLogado] = useState(false);
  const [saida, setSaida] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.frame}>
        <Text style={styles.title}>CADASTRO</Text>
        <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input}
          autoCapitalize="none" autoComplete="email" autoCorrect={false} keyboardType="email-address"/>
        <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry maxLength={8}/>
        <TextInput placeholder="Confirmação da senha" value={conf} onChangeText={setConf} style={styles.input} secureTextEntry maxLength={8}/>
        <Picker selectedValue={perfil} onValueChange={(v) => setPerfil(v)} style={styles.input}>
          <Picker.Item label="Administrador" value="admin" />
          <Picker.Item label="Gestor" value="manager" />
          <Picker.Item label="Usuário" value="user" />
        </Picker>

        <View style={styles.row}>
          <Text style={{ color: '#fff' }}>Manter-se conectado</Text>
          <Switch
            value={logado}
            onValueChange={setLogado}
            trackColor={{ false: '#e77878', true: '#94df83' }}               // (p. 8)
            thumbColor={logado ? '#47eb22' : '#ed1111'}                       // (p. 8)
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#0275d8' }]} onPress={() => setSaida(`${email} - ${senha} - ${conf} - ${perfil} - logado: ${logado ? 'sim' : 'não'}`)}>
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
  frame: { width: '90%', maxWidth: 270, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16, gap: 10 },
  title: { color: '#9acd32', alignSelf: 'center', marginBottom: 4, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderRadius: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btn: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
