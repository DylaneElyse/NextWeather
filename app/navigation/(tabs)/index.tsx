import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import Header from "../../../components/header";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Home Screen</Text>
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
