import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../../../components/header";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Favorites Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
