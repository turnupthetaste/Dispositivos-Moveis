import React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function Dois() {
  return (
    <View style={styles.container}>
      <View style={[styles.top, { backgroundColor: 'crimson', flexDirection: 'row' }]}>
        <View style={[styles.half, { backgroundColor: 'lime' }]} />
        <View style={[styles.half, { backgroundColor: 'aquamarine' }]} />
      </View>
      <View style={[styles.bottom, { backgroundColor: 'salmon' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Constants.statusBarHeight },
  top: { flex: 0.5 },
  bottom: { flex: 0.5 },
  half: { flex: 0.5 },
});
