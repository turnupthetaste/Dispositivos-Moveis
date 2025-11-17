import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onze'>;

export default function Onze({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../assets/fatec.png')} style={styles.logo} />
        <Text style={styles.title}>HOME</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Um')}>
            <Text style={styles.btnText}>Um</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Dois')}>
            <Text style={styles.btnText}>Dois</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Tres')}>
            <Text style={styles.btnText}>Três</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Quatro')}>
            <Text style={styles.btnText}>Quatro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Cinco')}>
            <Text style={styles.btnText}>Cinco</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Seis')}>
            <Text style={styles.btnText}>Seis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Sete')}>
            <Text style={styles.btnText}>Sete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Oito')}>
            <Text style={styles.btnText}>Oito</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Nove')}>
            <Text style={styles.btnText}>Nove</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Dez')}>
            <Text style={styles.btnText}>Dez</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', elevation: 3 },
  logo: { width: 140, height: 140, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  btn: {
    backgroundColor: '#ff9900',
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
