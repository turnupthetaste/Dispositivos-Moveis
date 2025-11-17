import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Tres() {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { backgroundColor: 'crimson' }]}>
        <View style={[styles.colLeft, { backgroundColor: 'lime' }]} />
        <View style={styles.colRight}>
          <View style={[styles.quad, { backgroundColor: 'teal' }]} />
          <View style={[styles.quad, { backgroundColor: 'skyblue' }]} />
        </View>
      </View>
      <View style={[styles.bottom, { backgroundColor: 'salmon' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Constants.statusBarHeight },
  row: { flex: 0.5, flexDirection: 'row' },
  colLeft: { flex: 0.5 },
  colRight: { flex: 0.5, flexDirection: 'column' },
  quad: { flex: 0.5 },
  bottom: { flex: 0.5 },
});
