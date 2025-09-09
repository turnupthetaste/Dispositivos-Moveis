// app/(tabs)/links.tsx
import React from 'react';
import { View, Button, Alert, Linking, StyleSheet } from 'react-native';

export default function Links() {
  const openYoutube = async () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // troque pelo vídeo do exercício
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) await Linking.openURL(url);
      else Alert.alert('Erro', 'Não foi possível abrir o YouTube.');
    } catch (e) {
      Alert.alert('Erro', String(e));
    }
  };

  const openDialer = () => {
    const url = 'tel:+5511999999999'; // troque para o número desejado
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o discador.'));
  };

  const openInstagram = async () => {
    const url = 'https://www.instagram.com/fatec_jacarei'; // pedido do exercício 3
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) await Linking.openURL(url);
      else Alert.alert('Erro', 'Não foi possível abrir o Instagram.');
    } catch (e) {
      Alert.alert('Erro', String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Button title="1) Abrir YouTube (vídeo)" onPress={openYoutube} />
      <View style={{ height: 12 }} />
      <Button title="2) Abrir discador" onPress={openDialer} />
      <View style={{ height: 12 }} />
      <Button title="3) Abrir Instagram da FATEC Jacareí" onPress={openInstagram} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', gap: 12 },
});
