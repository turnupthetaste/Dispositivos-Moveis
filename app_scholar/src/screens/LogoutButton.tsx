import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../hooks/useAuth';

export default function LogoutButton() {
  const { logout, carregando } = useAuth();

  return (
    <TouchableOpacity
      onPress={logout}
      style={{ paddingHorizontal: 12, paddingVertical: 6 }}
      accessibilityLabel="Sair"
      accessibilityRole="button"
    >
      {carregando
        ? <ActivityIndicator />
        : <Ionicons name="log-out-outline" size={22} />}
    </TouchableOpacity>
  );
}
