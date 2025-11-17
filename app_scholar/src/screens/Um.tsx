import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Um() {
  return (
    <View style={styles.container}>
      <View style={[styles.box, { backgroundColor: 'crimson' }]} />
      <View style={[styles.box, { backgroundColor: 'salmon' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // exclui a área da StatusBar do conteúdo do app (p. 1)
    paddingTop: Constants.statusBarHeight,
    flexDirection: 'column',
  },
  box: { flex: 0.5 },
});
