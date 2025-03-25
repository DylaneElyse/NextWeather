import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Header from "../../components/header";
import { router } from "expo-router";

export default function SearchScreen() {

  const handleNavigate = () => {
    router.push({
      pathname: "/",
      params: { searchedCity: "Calgary" },
    });
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Search Screen</Text>
      <Button title="Go to Home" onPress={handleNavigate} />
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
