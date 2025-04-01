// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from 'contexts/AuthContext';
import { TemperatureProvider } from 'contexts/TemperatureContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TemperatureProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" options={{ title: 'Sign In' }} />
      <Stack.Screen name="RegisterScreen" options={{ title: 'Create Account' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="Welcome" options={{ headerShown: false }} /> */}
    </Stack>
      </TemperatureProvider>
    </AuthProvider>
  );
}