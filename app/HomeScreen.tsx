import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Dimensions, Button } from "react-native";
import Header from "../components/header";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  // const [username, setUsername] = React.useState("");
  const [username, setUsername] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/LoginScreen'); // 🔥 Redirect to login after signing out
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
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Home Screen</Text>
      <Text>Welcome, {user?.email}</Text>
      <Text>Username: {username}</Text>
      <Text>User ID: {user?.id}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
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
