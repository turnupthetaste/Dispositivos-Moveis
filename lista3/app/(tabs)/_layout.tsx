// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#222' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#bbb',
        tabBarStyle: { backgroundColor: '#222' },
      }}
    >
      <Tabs.Screen
        name="links"
        options={{
          title: 'Links',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="link" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="contatos"
        options={{
          title: 'Contatos',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="contacts" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="midia"
        options={{
          title: 'Mídia',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="photo-library" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
