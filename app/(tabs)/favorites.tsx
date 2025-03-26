import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";

export default function FavoritesScreen() {
  const { user } = useAuth(); // Get login state from context
  console.log(user);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to view favorites.</Text>
      </View>
    );
  }

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
