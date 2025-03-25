import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../../../components/header";

export default function SearchScreen() {
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
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
