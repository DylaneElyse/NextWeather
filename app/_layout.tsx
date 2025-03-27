// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from 'contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" options={{ title: 'Sign In' }} />
      <Stack.Screen name="RegisterScreen" options={{ title: 'Create Account' }} />
      <Stack.Screen name="Welcome" options={{ headerShown: false }} />
    </Stack>
    </AuthProvider>
  );
}