import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import { TemperatureProvider } from 'contexts/TemperatureContext';

export default function App() {
  return (
    <AuthProvider>
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Slot /> {/* This renders the matched route from app/ */}
    </View>
    </AuthProvider>
  );
}