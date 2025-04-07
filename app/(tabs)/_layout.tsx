import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
  console.log('[TabLayout] Rendering Tabs Layout'); // Add log
  return (
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false, // Keep header shown/hidden as needed for tabs
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === "index") {
              iconName = focused
                ? require("../../assets/home-dark.png")
                : require("../../assets/home-grey.png");
            } else if (route.name === "search") {
              iconName = focused
                ? require("../../assets/search-dark.png")
                : require("../../assets/search-grey.png");
            } else if (route.name === "favorites") {
              iconName = focused
                ? require("../../assets/star-dark.png")
                : require("../../assets/star-grey.png");
            }
            else if (route.name === "settings") {
              iconName = focused
                ? require("../../assets/settings-gear-dark.png")
                : require("../../assets/settings-gear-grey.png");
            }
            return iconName ? <Image source={iconName} style={{ width: 24, height: 24 }} /> : null;
          },
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#808080",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
          },
        })}
      >
        <Tabs.Screen
          name="index" // Corresponds to app/(tabs)/index.tsx
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="search" // Corresponds to app/(tabs)/search.tsx
          options={{
            title: "Search",
          }}
        />
        <Tabs.Screen
          name="favorites" // Corresponds to app/(tabs)/favorites.tsx
          options={{
            title: "Favorites",
          }}
        />
        <Tabs.Screen
          name="settings" // Corresponds to app/(tabs)/settings.tsx
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
  );
}