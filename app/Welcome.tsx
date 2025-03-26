import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Dimensions, Button } from "react-native";
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
    router.replace('/LandingScreen'); // 🔥 Redirect to login after signing out
  };

  const handleContinueToHomepage = async () => {
    router.replace('/(tabs)/');
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
      <Text style={{fontSize: 30, fontWeight: "bold", marginBottom: 80}}>Welcome, {username}</Text>
      <Text>Email: {user?.email}</Text>
      <Text style={{marginBottom: 200}}>User ID: {user?.id}</Text>
      <Button title="Continue" onPress={handleContinueToHomepage} />
      <View style={{marginTop: 50}}></View>
      <Button title="Sign Out" onPress={handleSignOut} color={"red"}/>
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
