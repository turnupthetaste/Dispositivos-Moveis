import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import logo from '../../assets/adaptive-icon.png'; // conforme a dica (p. 3)

export default function Quatro() {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { backgroundColor: 'crimson' }]}>
        <View style={[styles.colLeft, { backgroundColor: 'lime', alignItems: 'center', justifyContent: 'center' }]}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.colRight}>
          <View style={[styles.quad, { backgroundColor: 'teal', alignItems: 'center', justifyContent: 'center' }]}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={[styles.quad, { backgroundColor: 'skyblue', alignItems: 'center', justifyContent: 'center' }]}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
        </View>
      </View>
      <View style={[styles.bottom, { backgroundColor: 'salmon', alignItems: 'center', justifyContent: 'center' }]}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
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
  logo: { flex: 1, alignSelf: 'center' },
});
