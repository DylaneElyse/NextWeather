import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../../components/header";

export default function AboutScreen() {
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
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
