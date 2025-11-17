import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import logo from '../../assets/adaptive-icon.png';

function IconButton() {
  return (
    <TouchableOpacity onPress={() => Alert.alert('Boa noite!')}>
      <Image source={logo} style={{ width: 64, height: 64 }} resizeMode="contain" />
    </TouchableOpacity>
  );
}

export default function Cinco() {
  return (
    <View style={styles.container}>
      <View style={[styles.row, { backgroundColor: 'crimson' }]}>
        <View style={[styles.box, { backgroundColor: 'lime' }]}><IconButton/></View>
        <View style={[styles.box, { backgroundColor: 'aquamarine' }]}><IconButton/></View>
      </View>
      <View style={[styles.row, { backgroundColor: 'salmon' }]}>
        <View style={[styles.box, { backgroundColor: 'teal' }]}><IconButton/></View>
        <View style={[styles.box, { backgroundColor: 'skyblue' }]}><IconButton/></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Constants.statusBarHeight },
  row: { flex: 0.5, flexDirection: 'row' },
  box: { flex: 0.5, alignItems: 'center', justifyContent: 'center' },
});
