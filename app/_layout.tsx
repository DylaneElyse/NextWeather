// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import { TemperatureProvider } from '../contexts/TemperatureContext'; // Adjust path if needed
import { ActivityIndicator, View } from 'react-native'; // For loading indicator

// This component uses the context and handles routing logic
function InitialLayout() {
  // Get user and loading state from your AuthContext
  const { user, loading } = useAuth();
  const segments = useSegments(); // Current route segments
  const router = useRouter();

  useEffect(() => {
    // 1. If still loading auth state, do nothing yet.
    if (loading) {
      console.log('Auth state loading...');
      return;
    }
    console.log('Auth state loaded. User:', user ? user.id : 'null', 'Segments:', segments);


    // 2. Determine if the current route is inside the protected '(tabs)' group
    const inTabsGroup = segments[0] === '(tabs)';

    // 3. Perform redirects based on auth state and current route
    if (user && !inTabsGroup) {
      // User is logged in but currently outside the main app (e.g., on LoginScreen)
      // Redirect to the main app area (root of tabs)
      console.log('Redirecting logged-in user to /');
      router.replace('/'); // Navigate to the default screen within (tabs)
    } else if (!user && inTabsGroup) {
      // User is NOT logged in but trying to access a protected screen within (tabs)
      // Redirect to the login screen
      console.log('Redirecting logged-out user to /LoginScreen');
      router.replace('/LoginScreen'); // Or '/LandingScreen'
    }
    // Otherwise:
    // - User is logged in AND in the tabs group (Correct state, do nothing)
    // - User is logged out AND NOT in the tabs group (Correct state, do nothing)

  }, [user, segments, loading, router]); // Re-run when these values change

  // 4. Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 5. Render the navigator once loading is complete
  // The useEffect above ensures the correct screen group (auth vs tabs) is shown
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Screens always available or managed by the redirect logic */}
      <Stack.Screen name="LandingScreen" />
      <Stack.Screen name="LoginScreen" options={{ title: 'Sign In' }} />
      <Stack.Screen name="RegisterScreen" options={{ title: 'Create Account' }} />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// RootLayout provides the context wrappers
export default function RootLayout() {
  return (
    <AuthProvider>
      <TemperatureProvider>
        {/* Render the component that handles layout logic */}
        <InitialLayout />
      </TemperatureProvider>
    </AuthProvider>
  );
}