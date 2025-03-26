import React, { useContext } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user, signOut } = useAuth(); // Get login state from context
  const router = useRouter();

  console.log(user);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/LandingScreen"); // 🔥 Redirect to login after signing out
  };

  if (!user) {
    return (
      <View style={styles.pageContainer}>
        <Header />
        <View style={styles.container}>
          <Text style={styles.text}>Please log in to view settings.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <Header />
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 80 }}>
          {/* Welcome, {username} */}
        </Text>
        <Text>Email: {user?.email}</Text>
        <Text style={{ marginBottom: 200 }}>User ID: {user?.id}</Text>
        <View style={{ marginTop: 50 }}></View>
        <Button title="Sign Out" onPress={handleSignOut} color={"red"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#c2e8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
