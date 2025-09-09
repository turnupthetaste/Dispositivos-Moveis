// app/(tabs)/midia.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';

export default function Midia() {
  const [images, setImages] = useState<string[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
      if (!result.canceled) setImages(prev => [result.assets[0].uri, ...prev]); // Ex. 7
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const takePhoto = async () => {
    if (hasCameraPermission === false) {
      Alert.alert('Permissão', 'Sem permissão para usar a câmera.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({ quality: 1, allowsEditing: true, aspect: [4,3] });
      if (!result.canceled) setImages(prev => [result.assets[0].uri, ...prev]); // Ex. 6 + 7
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const removeImage = (uri: string) => {
    setImages(prev => prev.filter(u => u !== uri)); // Ex. 8
  };

  return (
    <View style={styles.container}>
      {/* dois botões no topo direito (Ex. 6) */}
      <View style={styles.topButtons}>
        <Pressable onPress={pickFromGallery} style={styles.iconBtn} accessibilityLabel="Abrir galeria">
          <MaterialIcons name="photo" size={28} />
        </Pressable>
        <Pressable onPress={takePhoto} style={styles.iconBtn} accessibilityLabel="Abrir câmera">
          <MaterialIcons name="photo-camera" size={28} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {images.map((uri) => (
          <View key={uri} style={styles.imageWrap}>
            <Pressable style={styles.closeBtn} onPress={() => removeImage(uri)}>
              <MaterialIcons name="close" size={20} color="#fff" />
            </Pressable>
            <Image source={{ uri }} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222' },
  topButtons: {
    position: 'absolute',
    right: 12,
    top: (Constants.statusBarHeight || 0) + 8,
    zIndex: 10,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 6,
  },
  iconBtn: { padding: 6 },
  scrollContent: { paddingTop: (Constants.statusBarHeight || 0) + 56, padding: 12, gap: 12 },
  imageWrap: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  closeBtn: {
    position: 'absolute',
    left: 6,
    top: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 2,
    zIndex: 5,
  },
  image: { width: '100%', height: 260, backgroundColor: '#111' },
});
