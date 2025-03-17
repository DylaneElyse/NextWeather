import { Tabs, Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home"}} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="favorites" options={{ title: "Favorites" }} />
    </Tabs>
  );
}