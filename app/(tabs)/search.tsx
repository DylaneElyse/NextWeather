import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Search Screen</Text>
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
