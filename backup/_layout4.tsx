import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { TemperatureProvider } from "../../contexts/TemperatureContext";

export default function TabLayout() {
  return (
    // <TemperatureProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
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
            return <Image source={iconName} style={{ width: 24, height: 24 }} />;
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
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
    // </TemperatureProvider>
  );
}