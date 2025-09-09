// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* grupo de abas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* rota 404 padrão do template */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
