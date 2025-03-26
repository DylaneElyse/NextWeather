import React from "react";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import Header from "../../components/header";
import { router } from "expo-router";
// import { TextInput } from "react-native-gesture-handler";

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
      <View style={styles.searchBox}>
      <TextInput 
        style={styles.input}
        placeholder="Search for a city" />
      <Button title="Search" onPress={() => {}} />
      </View>
      <Text style={styles.text}>Search Screen</Text>
      <Button title="Go to Home" onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c2e8ff",
    alignItems: "center",
    paddingTop: 150, // Push content down
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
  },
  searchBox: {
    position: "absolute",
    top: 50, // Place near the top
    width: "90%", // Full width
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  input: {
    flex: 1, // Takes full space
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
  },
});
