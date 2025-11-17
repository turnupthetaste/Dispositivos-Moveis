import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ route, navigation }) => {
  const { userProfile } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo ao App Scholar</Text>
      <Text style={styles.profile}>Perfil: {userProfile}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  profile: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  button: {
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;