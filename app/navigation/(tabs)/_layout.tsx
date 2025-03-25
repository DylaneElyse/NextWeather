import { Tabs, Stack } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "index") {
            iconName = focused
              ? require("../../../assets/home-dark.png")
              : require("../../../assets/home-grey.png");
          } else if (route.name === "search") {
            iconName = focused
              ? require("../../../assets/search-dark.png")
              : require("../../../assets/search-grey.png");
          } else if (route.name === "favorites") {
            iconName = focused
              ? require("../../../assets/star-dark.png")
              : require("../../../assets/star-grey.png");
          }
          return <Image source={iconName} style={{ width: 24, height: 24 }} />;
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
    </Tabs>
  );
}
