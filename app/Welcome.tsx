import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Button,
} from "react-native";
import Header from "../components/header";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { red } from "react-native-reanimated/lib/typescript/Colors";

export default function WelcomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  // const [username, setUsername] = React.useState("");
  const [username, setUsername] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/LoginScreen"); // 🔥 Redirect to login after signing out
  };

  const handleContinueToHomepage = async () => {
    router.replace("/(tabs)/");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_details") // Ensure this is the correct table name
        .select("Username")
        .eq("uuid", user.id) // Match the user ID
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        setUsername(data?.Username);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <View style={styles.pageContainer}>
      <Header />
      <View style={styles.container}>
        <Button title="Continue" onPress={handleContinueToHomepage} />
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
