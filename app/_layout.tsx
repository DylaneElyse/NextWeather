import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; 
import { TemperatureProvider } from '../contexts/TemperatureContext'; 
import { ActivityIndicator, View, StyleSheet } from 'react-native'; 

function RootStackLayout() {
  const { user, loading } = useAuth(); // Get user and loading state
  const segments: string[] = useSegments(); // Get current route segments
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      console.log('[RootLayout] Auth state loading...');
      return; // Wait until loading is false
    }
    console.log('[RootLayout] Auth loaded. User:', user ? user.id : 'null', 'Segments:', segments.join('/'));

    const isRoot = segments.length === 0;
    const currentSegment = segments[0]; // Can be undefined if isRoot is true

    const onAuthScreen =
         isRoot                   // Are we at '/'?
      || currentSegment === 'LandingScreen' // Are we at '/LandingScreen'?
      || currentSegment === 'LoginScreen'    // Are we at '/LoginScreen'?
      || currentSegment === 'RegisterScreen'; // Are we at '/RegisterScreen'?

    console.log(`[RootLayout] isRoot: ${isRoot}, currentSegment: ${currentSegment}, onAuthScreen: ${onAuthScreen}`);


    if (user && onAuthScreen) {
        // User IS logged in but currently on an auth screen. Redirect to tabs.
        console.log('[RootLayout] Redirecting logged-in user from auth screen to (tabs)');
        router.replace('/(tabs)');
    }

  }, [user, loading, segments, router]); // Depend on user, loading, and segments

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Render the main stack navigator
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandingScreen" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// Export RootLayout which provides the context wrappers
export default function RootLayout() {
  return (
    <AuthProvider>
      <TemperatureProvider>
        <RootStackLayout /> {/* Render the component that uses the auth context */}
      </TemperatureProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
});